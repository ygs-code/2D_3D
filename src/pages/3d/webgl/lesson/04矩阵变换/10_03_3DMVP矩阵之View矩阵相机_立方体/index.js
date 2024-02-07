import {getWebGLContext, initShaders} from "@/pages/3d/utils/lib/cuon-utils";
import * as glMatrix from "gl-matrix";
import cat_512 from "@/assets/image/cat_512x512.jpg";
import mask_512x512 from "@/assets/image/mask_512x512.jpg";
import controller from "@/pages/3d/utils/controller.js";
import VSHADER_SOURCE from "./index.vert";
import FSHADER_SOURCE from "./index.frag";
import {colors, positions} from "./data";
import {createHtmlMatrix} from "@/pages/3d/utils/matrix.js";
import "./index.less";
import "@/pages/index.less";
console.log("cat_512===", cat_512);
window.onload = function () {
  let canvas_w = 400,
    canvas_h = 400;
  const canvas = document.createElement("canvas");
  canvas.width = 500;
  canvas.height = 500;
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

  new Uint8Array();

  function initVertexBuffers(gl) {
    let FSIZE = positions.BYTES_PER_ELEMENT; // Float32 Size = 4

    let positionsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    let a_Position = gl.getAttribLocation(gl.program, "a_Position");
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 3, 0);
    gl.enableVertexAttribArray(a_Position);

    let colorsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
    let a_Colors = gl.getAttribLocation(gl.program, "a_Colors");
    gl.vertexAttribPointer(
      a_Colors,
      4,
      gl.FLOAT,
      false,
      colorsBuffer.BYTES_PER_ELEMENT * 4,
      0
    );
    gl.enableVertexAttribArray(a_Colors);
  }

  let deg = 0;
  let startTime = new Date().getTime();
  let nowTime = new Date().getTime();
  // 参数设置
  const settings = {
    // 眼睛视角
    eye: {
      x: 0,
      y: 0,
      z: 0 // 眼睛在屏幕的前面 默认是这个
    },
    // 目标视角
    at: {
      x: 0,
      y: 0,
      z: -1
    },
    // 眼睛头部
    up: {
      x: 0,
      y: 1, // 对齐原点
      z: 0
    }
  };
  function draw(gl, settings) {
    nowTime = new Date().getTime();
    if (nowTime - startTime >= 10) {
      deg++;
      startTime = nowTime;
    }

    // console.log("deg==", deg);
    let rotationMatrix = glMatrix.mat4.create();
    let u_RotationMatrix = gl.getUniformLocation(
      gl.program,
      "u_RotationMatrix"
    );
    // console.log("rotationMatrix=", rotationMatrix);

    // 不需要返回值
    // 旋转
    /*
      右手系坐标，
        z 轴是2d垂直看到的旋转  因为z轴是垂直我们视角
        x 轴是上下翻转
        y 轴是左右翻转
    
    */
    glMatrix.mat4.fromRotation(rotationMatrix, (deg * Math.PI) / 180, [
      1, // x
      1, // y
      1 // z
    ]);

    createHtmlMatrix({
      matrix: rotationMatrix,
      title: "旋转矩阵",
      row: 4,
      list: 4,
      elId: "rotationMatrix"
    });

    gl.uniformMatrix4fv(u_RotationMatrix, false, rotationMatrix);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const {eye, at, up} = settings;
    var u_ViewMatrix = gl.getUniformLocation(gl.program, "u_ViewMatrix");
    var viewMatrix = glMatrix.mat4.create();
    // let eye=[0.0, 0.0, 0];  //   观察者的默认状态是：视点为系统原点(0,0,1) eyeX, eyeY, eyeZ
    // let center=[0.0, 0.0, -1];  // 视线为Z轴负方向，观察点为(0,0,0)   atX, atY, atZ
    // let up=[0.0, 1.0, 0.0]; //  上方向为Y轴负方向(0,1,0) upX, upY, upZ
    glMatrix.mat4.lookAt(
      viewMatrix,
      [eye.x, eye.y, eye.z],
      [at.x, at.y, at.z],
      [up.x, up.y, up.z]
    );

    createHtmlMatrix({
      matrix: viewMatrix,
      title: "视图矩阵",
      row: 4,
      list: 4,
      elId: "viewMatrix"
    });

    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix);

    // gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    // gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
    // gl.drawArrays(gl.POINTS, 0, 24);
    /*
      后面的面挡住拉前面的面。
      添加  gl.enable(gl.DEPTH_TEST); 就这样解决这个问题
    */
    gl.enable(gl.DEPTH_TEST);
    for (let i = 0; i < positions.length; i += 4) {
      gl.drawArrays(gl.TRIANGLE_FAN, i, 4);
      gl.drawArrays(gl.POINTS, i, 4);
    }

    requestAnimationFrame(() => {
      draw(gl, settings);
    });
  }

  initVertexBuffers(gl);

  draw(gl, settings);

  // 控制 参数改变
  controller({
    onChange: () => {
      draw(gl, settings);
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
