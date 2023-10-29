import {getWebGLContext, initShaders} from "@/pages/3d/utils/lib/cuon-utils";
import * as glMatrix from "gl-matrix";
import cat_512 from "@/assets/image/cat_512x512.jpg";
import mask_512x512 from "@/assets/image/mask_512x512.jpg";
import VSHADER_SOURCE from "./index.vert";
import FSHADER_SOURCE from "./index.frag";
import {colors, positions} from "./data";
import * as dat from "dat.gui";
import "./index.less";
console.log("cat_512===", cat_512);
window.onload = function () {
  let canvas_w = 400,
    canvas_h = 400;
  const canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 800;
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

  let deg = 45;
  let startTime = new Date().getTime();
  let nowTime = new Date().getTime();

  // set
  //     uniform mat4 u_TranslatrMatrix;// 平移矩阵
  // uniform mat4 u_ScaleMatrix;// 缩放矩阵

  let translatrMatrix = new Float32Array([
    1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0,
    1.0
  ]); //  glMatrix.mat4.create();

  let scaleMatrix = new Float32Array([
    1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0,
    1.0
    // x    y    z    w
  ]); //  glMatrix.mat4.create();

  let rotationMatrix = new Float32Array([
    1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0,
    1.0
    // x    y    z    w
  ]);

  const gui = new dat.GUI();

  // 设置一个文件夹
  const folder = gui.addFolder("设置三角形");
  // 改变
  let parmas = {
    color: "rgb(0,0,0,0)",
    position: {
      x: 0,
      y: 0,
      z: 0
    },
    angle: 0,
    scale: {
      x: 1,
      y: 1,
      z: 1
    },
    rotation: {
      angleX: 0,
      angleY: 0,
      angleZ: 0
    },
    fn: () => {}
  };

  let options = [
    {
      props: parmas.position,
      key: "x",
      min: -1,
      max: 1,
      step: 0.01,
      name: "平移改变x轴",
      onChange: (value) => {
        // 回调函数
        // translatrMatrix[12] = value;
        glMatrix.mat4.fromTranslation(translatrMatrix, [value, 0, 0]);
        console.log("rotationMatrix====", translatrMatrix);
      },
      onFinishChange: (value) => {
        // 完全修改停下来的时候触发这个事件
        console.log("onFinishChange value==", value);
      }
    },
    {
      props: parmas.position,
      key: "y",
      min: -1,
      max: 1,
      step: 0.01,
      name: "平移改变y轴",
      onChange: (value) => {
        // 回调函数
        // translatrMatrix[13] = value;
        glMatrix.mat4.fromTranslation(translatrMatrix, [0, value, 0]);

        // translatrMatrix=glMatrix.mat4.translate([], translatrMatrix, [-value,0,0]);
        // draw(gl);

        console.log("rotationMatrix====", translatrMatrix);
      },
      onFinishChange: (value) => {
        // 完全修改停下来的时候触发这个事件
        console.log("onFinishChange value==", value);
      }
    },
    {
      props: parmas.position,
      key: "z",
      min: -1,
      max: 1,
      step: 0.01,
      name: "平移改变z轴",
      onChange: (value) => {
        // 回调函数
        // translatrMatrix[14] = value;
        glMatrix.mat4.fromTranslation(translatrMatrix, [0, 0, value]);

        // translatrMatrix=glMatrix.mat4.translate([], translatrMatrix, [-value,0,0]);
        // draw(gl);

        console.log("rotationMatrix====", translatrMatrix);
      },
      onFinishChange: (value) => {
        // 完全修改停下来的时候触发这个事件
        console.log("onFinishChange value==", value);
      }
    },

    {
      props: parmas.scale,
      key: "x",
      min: 1,
      max: 3,
      step: 0.01,
      name: "缩放改变x轴",
      onChange: (value) => {
        // 回调函数
        scaleMatrix = glMatrix.mat4.fromScaling(scaleMatrix, [
          value,
          scaleMatrix[5],
          scaleMatrix[10]
        ]);
        // scaleMatrix[0] = value;
        // translatrMatrix=glMatrix.mat4.translate([], translatrMatrix, [-value,0,0]);
        // draw(gl);
      },
      onFinishChange: (value) => {
        // 完全修改停下来的时候触发这个事件
        console.log("onFinishChange value==", value);
      }
    },
    {
      props: parmas.scale,
      key: "y",
      min: 1,
      max: 3,
      step: 0.01,
      name: "缩放改变y轴",
      onChange: (value) => {
        // 回调函数
        // scaleMatrix[5] = value;
        scaleMatrix = glMatrix.mat4.fromScaling(scaleMatrix, [
          scaleMatrix[0],
          value,
          scaleMatrix[10]
        ]);
        // draw(gl);
      },
      onFinishChange: (value) => {
        // 完全修改停下来的时候触发这个事件
        console.log("onFinishChange value==", value);
      }
    },
    {
      props: parmas.scale,
      key: "z",
      min: 1,
      max: 3,
      step: 0.01,
      name: "缩放改变z轴",
      onChange: (value) => {
        // 回调函数
        // scaleMatrix[10] = value;
        scaleMatrix = glMatrix.mat4.fromScaling(scaleMatrix, [
          scaleMatrix[0],
          scaleMatrix[5],
          value
        ]);
        // draw(gl);
      },
      onFinishChange: (value) => {
        // 完全修改停下来的时候触发这个事件
        console.log("onFinishChange value==", value);
      }
    },

    {
      props: parmas.rotation,
      key: "angleX",
      min: 0,
      max: 360,
      step: 0.01,
      name: "旋转改变x轴",
      onChange: (value) => {
        console.log("value=", value);
        rotationMatrix = glMatrix.mat4.fromXRotation(
          rotationMatrix,
          (new Number(value) * Math.PI) / 180
        );
      },
      onFinishChange: (value) => {
        // 完全修改停下来的时候触发这个事件
        console.log("onFinishChange value==", value);
      }
    },

    {
      props: parmas.rotation,
      key: "angleY",
      min: 0,
      max: 360,
      step: 0.01,
      name: "旋转改变y轴",
      onChange: (value) => {
        console.log("value=", value);
        rotationMatrix = glMatrix.mat4.fromYRotation(
          rotationMatrix,
          (new Number(value) * Math.PI) / 180
        );
      },
      onFinishChange: (value) => {
        // 完全修改停下来的时候触发这个事件
        console.log("onFinishChange value==", value);
      }
    },

    {
      props: parmas.rotation,
      key: "angleZ",
      min: 0,
      max: 360,
      step: 0.01,
      name: "旋转改变z轴",
      onChange: (value) => {
        console.log("value=", value);
        rotationMatrix = glMatrix.mat4.fromZRotation(
          rotationMatrix,
          (new Number(value) * Math.PI) / 180
        );
      },
      onFinishChange: (value) => {
        // 完全修改停下来的时候触发这个事件
        console.log("onFinishChange value==", value);
      }
    }
  ];

  for (let item of options) {
    const {
      props,
      key,
      min,
      max,
      step,
      name,
      onChange = () => {},
      onFinishChange = () => {}
    } = item;
    //控制器一个x选项
    folder
      .add(
        props, // 需要修改的对象
        key // 需要修改的属性
      )
      .min(min)
      .max(max)
      // 每次改变为0.1
      .step(step)
      .name(name)
      .onChange((value) => {
        // 回调函数
        onChange(value);
      })
      .onFinishChange((value) => {
        // 完全修改停下来的时候触发这个事件
        onFinishChange(value);
      });
  }

  function draw(gl) {
    // nowTime = new Date().getTime();
    // if (nowTime - startTime >= 10) {
    //   deg++;
    //   startTime = nowTime;
    // }

    // console.log("deg==", deg);

    let u_RotationMatrix = gl.getUniformLocation(
      gl.program,
      "u_RotationMatrix"
    );

    let u_TranslatrMatrix = gl.getUniformLocation(
      gl.program,
      "u_TranslatrMatrix"
    );

    let u_ScaleMatrix = gl.getUniformLocation(gl.program, "u_ScaleMatrix");

    // 不需要返回值
    // 旋转
    /*
      右手系坐标，
        z 轴是2d垂直看到的旋转  因为z轴是垂直我们视角
        x 轴是上下翻转
        y 轴是左右翻转
    
    */
    // glMatrix.mat4.fromRotation(rotationMatrix, (deg * Math.PI) / 180, [
    //   1, // x
    //   1, // y
    //   1 // z
    // ]);

    gl.uniformMatrix4fv(u_RotationMatrix, false, rotationMatrix);
    gl.uniformMatrix4fv(u_TranslatrMatrix, false, translatrMatrix);
    gl.uniformMatrix4fv(u_ScaleMatrix, false, scaleMatrix);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

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
      // gl.drawArrays(gl.POINTS, i, 4);
    }

    requestAnimationFrame(() => {
      draw(gl);
    });
  }

  initVertexBuffers(gl);

  draw(gl);
};
