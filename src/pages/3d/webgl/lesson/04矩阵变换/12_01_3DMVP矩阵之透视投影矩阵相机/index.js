import {getWebGLContext, initShaders} from "@/pages/3d/utils/lib/cuon-utils";
import {Matrix4} from "@/pages/3d/utils/lib/cuon-matrix.js";
import VSHADER_SOURCE from "./index.vert";
import FSHADER_SOURCE from "./index.frag";
import * as glMatrix from "gl-matrix";
import controller from "@/pages/3d/utils/controller.js";
import {createHtmlMatrix} from "@/pages/3d/utils/matrix.js";
import {positions, colors} from "./data";
import "./index.less";
import "@/pages/index.less";

//初始化顶点坐标和顶点颜色
const initVertexBuffers = (gl) => {
  var vertices = positions;
  //  new Float32Array(
  //   new Function(` return    [
  //     //  //最后面的三角形
  //     //   0.0, 0.5, -0.4,  1.0, 0.0, 0.0,
  //     //  -0.5, -0.5, -0.4, 1.0, 0.0, 0.0,
  //     //   0.5, -0.5, -0.4, 1.0, 0.0, 0.0,

  //     // // 中间的三角形  绿色
  //     0.5,  0.5, -0.5, 0.0, 1.0, 0.0,
  //     -0.5, 0.5, -0.5, 0.0, 1.0, 0.0,
  //     0.0, -0.5, -0.5, 0.0, 1.0, 0.0,

  //     //最前面的三角形 蓝色
  //     0.0,  0.5,   0.5,  0.0, 0.0, 1.0,
  //     -0.5, -0.5,  0.5,  0.0, 0.0, 1.0,
  //     0.5,  -0.5,  0.5,  0.0, 0.0, 1.0,

  //     ]
  //   `)()
  // );

  //创建缓冲区对象
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log("创建缓冲区对象失败！");
    return -1;
  }

  //将顶点坐标和顶点颜色信息写入缓冲区对象
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  //获取类型化数组中每个元素的大小
  var FSIZE = vertices.BYTES_PER_ELEMENT;

  //获取顶点着色器attribute变量a_Position的存储地址, 分配缓存并开启
  var a_Position = gl.getAttribLocation(gl.program, "a_Position");
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 3, 0);
  gl.enableVertexAttribArray(a_Position);

  //获取顶点着色器attribute变量a_Color(顶点颜色信息)的存储地址, 分配缓存并开启
  var colorsBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorsBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
  var a_Color = gl.getAttribLocation(gl.program, "a_Color");
  gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, FSIZE * 4, 0);
  gl.enableVertexAttribArray(a_Color);

  // 解绑缓冲区对象
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return vertices.length / 4;
};

window.onload = function () {
  let canvas_w = 400,
    canvas_h = 400;
  const canvas = document.createElement("canvas");
  canvas.width = 400;
  canvas.height = 400;
  // getWebGLContext(canvas);
  document.body.appendChild(canvas);

  if (!canvas.getContext) return;
  let gl = canvas.getContext("webgl");
  // vertexShader, fragmentShader

  console.log("VSHADER_SOURCE=====", VSHADER_SOURCE);
  console.log("FSHADER_SOURCE=====", FSHADER_SOURCE);
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log("failed to initialize shaders");
    return;
  }

  /*
      后面的面挡住拉前面的面。
      添加  gl.enable(gl.DEPTH_TEST); 就这样解决这个问题
    */
  gl.enable(gl.DEPTH_TEST);

  //初始化顶点坐标和顶点颜色
  var n = initVertexBuffers(gl);

  let rotationMatrix = glMatrix.mat4.create();
  let u_RotationMatrix = gl.getUniformLocation(gl.program, "u_RotationMatrix");

  //获取顶点着色器uniform变量u_ViewMatrix的存储地址
  var u_ViewMatrix = gl.getUniformLocation(gl.program, "u_ViewMatrix");
  if (!u_ViewMatrix) {
    console.log("获取u_ViewMatrix的存储地址失败！");
    return;
  }
  let x = 10;
  let y = 20;

  let z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  // 参数设置
  const settings = {
    // 眼睛视角 相机 和 目标节点刚好是相反的
    eye: {
      x,
      y,
      z: 60 // z 眼睛的位置 必须要在 投影里面  z越大视角越远
    },
    // 目标视角
    at: {
      x: 0,
      y: 0,
      z: 0 // 目标视角默认并不是1
    },
    // 眼睛头部
    up: {
      x: 0,
      y: 1,
      z: 0
    }
  };
  let deg = 40;
  let startTime = new Date().getTime();
  let nowTime = new Date().getTime();

  const render = (settings) => {
    nowTime = new Date().getTime();
    if (nowTime - startTime >= 10) {
      deg++;
      startTime = nowTime;
    }

    settings.eye.y = Math.cos((deg * Math.PI) / 180) * 10;
    settings.eye.z = Math.sin((deg * Math.PI) / 180) * 10;

    const {eye, at, up} = settings;

    // glMatrix.mat4.fromRotation(rotationMatrix, (deg * Math.PI) / 180, [
    //   1, // x
    //   1, // y
    //   1 // z
    // ]);

    createHtmlMatrix({
      matrix: rotationMatrix,
      title: "旋转矩阵",
      row: 4,
      list: 4,
      elId: "rotationMatrix"
    });

    gl.uniformMatrix4fv(u_RotationMatrix, false, rotationMatrix);

    //初始化视图矩阵
    var viewMatrix = glMatrix.mat4.create();

    // let eye = [0.0, 0.0, 1]; //  eyeX, eyeY, eyeZ  观察者的默认状态是：视点为系统原点(0,0,0) eyeX, eyeY, eyeZ
    // let center = [0.0, 0.0, 0]; // atX, atY, atZ  视线为Z轴负方向，观察点为(0,0,0)   atX, atY, atZ
    // let up = [0.0, 1.0, 0.0]; // upX, upY, upZ 上方向为Y轴负方向(0,1,0) upX, upY, upZ
    glMatrix.mat4.lookAt(
      viewMatrix,
      [eye.x, eye.y, eye.z],
      [at.x, at.y, at.z],
      [up.x, up.y, up.z]
    );
    createHtmlMatrix(viewMatrix, 4, 4, "viewMatrix");

    /*
   观察者的默认状态是：视点为系统原点(0,0,1) eyeX, eyeY, eyeZ
  ；视线为Z轴负方向，观察点为(0,0,0)   atX, atY, atZ
    设置视点、视线和上方向  上方向为Y轴负方向(0,1,0) upX, upY, upZ
  */
    //将视图矩阵传给顶点着色器uniform变量u_ViewMatrix
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix);

    // // // 创建一个正交投影矩阵
    // let u_ProjMatrix = gl.getUniformLocation(gl.program, "u_ProjMatrix");
    // let projMatrix = glMatrix.mat4.create();

    // // //  Matrix, left, right, bottom, top, near, far
    // glMatrix.mat4.ortho(projMatrix, -1, 1, -1, 1, 1, 100);
    // gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix);

    //     // 创建一个透视投影矩阵
    let u_ProjMatrix = gl.getUniformLocation(gl.program, "u_ProjMatrix");
    let perspectiveMatrix = glMatrix.mat4.create();

    /**
   out       输入矩阵
   fovy      焦距 制定垂直角，即可视空间顶面和底面的夹角，可以理解是焦距。
   aspect    指定近裁剪面的宽高比(宽度/高度)
   near,far  指定近裁面和远裁面的位置，即可视角空间的近边界和远边界，(near和far必须都大于0)
 */
    glMatrix.mat4.perspective(
      perspectiveMatrix,
      // 角度转弧度
      (10 * (2 * Math.PI)) / 360, // 角度越大,视角越远
      canvas.width / canvas.height,
      1,
      100 + 2
    );

    gl.uniformMatrix4fv(u_ProjMatrix, false, perspectiveMatrix);
    // createHtmlMatrix(perspectiveMatrix, 4, 4, "perspectiveMatrix");
    // gl.enable(gl.DEPTH_TEST);

    // createHtmlMatrix(perspectiveMatrix, 4, 4, "perspectiveMatrix");

    // createHtmlMatrix(glMatrix.mat4.multiply([], [...positions], [...viewMatrix]), 4, 4, "perspectiveMatrix-positions");

    // 使用完全不透明的黑色清除所有图像
    // 清空掉颜色
    gl.clearColor(0, 0, 0, 1.0); // RBGA
    // 用上面指定的颜色清除缓冲区
    gl.clear(gl.COLOR_BUFFER_BIT);

    //绘制三角形
    // gl.drawArrays(gl.TRIANGLES, 0, 24);
    for (let i = 0; i < positions.length; i += 4) {
      gl.drawArrays(gl.TRIANGLE_FAN, i, 4);
      // gl.drawArrays(gl.POINTS, i, 4);
    }
  };

  setInterval(() => {
    // deg+=deg;
    render(settings);
  }, 30);

  // requestAnimationFrame(()=>{
  //   // deg+=deg;
  //   render(settings);
  // });
  // u_ProjMatrix*u_ViewMatrix*a_Position

  render(settings);
  // let deg = 0;
  // setInterval(() => {
  //   deg += 1;
  //   let rad = (deg * Math.PI) / 180;
  //   settings.eye.x = Math.sin(rad);
  //   settings.eye.z = Math.cos(rad);
  //   render(settings);
  // }, 10);

  // 控制 参数改变
  controller({
    onChange: () => {
      render(settings);
      console.log("render========", settings);
    },
    parmas: settings,
    options: [
      {
        min: -1,
        max: 1,
        step: 0.001,
        key: "eye.x",
        name: "eyeX",
        // onChange: (value) => {},
        onFinishChange: (value) => {
          // 完全修改停下来的时候触发这个事件
          console.log("onFinishChange value==", value);
        }
      },
      {
        key: "eye.y",
        min: -1,
        max: 1,
        step: 0.01,
        name: "eyeY",
        onChange: (value) => {},
        onFinishChange: (value) => {
          // 完全修改停下来的时候触发这个事件
          console.log("onFinishChange value==", value);
        }
      },
      {
        key: "eye.z",
        min: -1,
        max: 1,
        step: 0.01,
        name: "eyeZ",
        onChange: (value) => {},
        onFinishChange: (value) => {
          // 完全修改停下来的时候触发这个事件
          console.log("onFinishChange value==", value);
        }
      },

      {
        min: -1,
        max: 1,
        step: 0.001,
        key: "at.x",
        name: "atX",
        // onChange: (value) => {},
        onFinishChange: (value) => {
          // 完全修改停下来的时候触发这个事件
          console.log("onFinishChange value==", value);
        }
      },
      {
        key: "at.y",
        min: -1,
        max: 1,
        step: 0.01,
        name: "atY",
        onChange: (value) => {},
        onFinishChange: (value) => {
          // 完全修改停下来的时候触发这个事件
          console.log("onFinishChange value==", value);
        }
      },
      {
        key: "at.z",
        min: -1,
        max: 1,
        step: 0.01,
        name: "atZ",
        onChange: (value) => {},
        onFinishChange: (value) => {
          // 完全修改停下来的时候触发这个事件
          console.log("onFinishChange value==", value);
        }
      },

      {
        min: -1,
        max: 1,
        step: 0.001,
        key: "up.x",
        name: "upX",
        // onChange: (value) => {},
        onFinishChange: (value) => {
          // 完全修改停下来的时候触发这个事件
          console.log("onFinishChange value==", value);
        }
      },
      {
        key: "up.y",
        min: -1,
        max: 1,
        step: 0.01,
        name: "upY",
        onChange: (value) => {},
        onFinishChange: (value) => {
          // 完全修改停下来的时候触发这个事件
          console.log("onFinishChange value==", value);
        }
      },
      {
        key: "up.z",
        min: -1,
        max: 1,
        step: 0.01,
        name: "upZ",
        onChange: (value) => {},
        onFinishChange: (value) => {
          // 完全修改停下来的时候触发这个事件
          console.log("onFinishChange value==", value);
        }
      }
    ]
  });
};
