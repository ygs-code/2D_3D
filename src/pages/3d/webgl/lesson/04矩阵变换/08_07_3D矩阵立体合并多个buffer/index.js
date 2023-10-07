import {getWebGLContext, initShaders} from "@/pages/3d/utils/lib/cuon-utils";
import * as glMatrix from "gl-matrix";
import cat_512 from "@/assets/image/cat_512x512.jpg";
import mask_512x512 from "@/assets/image/mask_512x512.jpg";
import VSHADER_SOURCE from "./index.vert";
import FSHADER_SOURCE from "./index.frag";
import {colors, positions} from "./data";
import "./index.less";
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
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 7, 0);
    gl.enableVertexAttribArray(a_Position);

    // let colorsBuffer = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, colorsBuffer);
    // gl.bufferData(gl.ARRAY_BUFFER,  colors, gl.STATIC_DRAW);
    let a_Colors = gl.getAttribLocation(gl.program, "a_Colors");

    gl.vertexAttribPointer(
      a_Colors, // 变量名称
      4, // 多少数据为一组，以为是用到rgba 所以这里是 4个数据为一组
      gl.FLOAT,
      false,
      FSIZE * 7, // 数据总长度
      FSIZE * 3 // 第几个索引 数据开始 从 0 开始 因为前面三个 0 1 2 为 顶点坐标 x y z
    );
    gl.enableVertexAttribArray(a_Colors);
  }
  console.log("positions==", positions);
  let deg = 0;
  let startTime = new Date().getTime();
  let nowTime = new Date().getTime();
  function draw(gl) {
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

    gl.uniformMatrix4fv(u_RotationMatrix, false, rotationMatrix);

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

    for (let i = 0; i < 6; i++) {
      gl.drawArrays(gl.TRIANGLE_FAN, i * 4, 4);
      gl.drawArrays(gl.POINTS, i * 4, 4);
    }

    // gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    // gl.drawArrays(gl.POINTS, 0, 4);

    // gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
    // gl.drawArrays(gl.POINTS, 4, 4);

    // gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
    // gl.drawArrays(gl.POINTS, 8, 4);

    // gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
    // gl.drawArrays(gl.POINTS, 12, 4);

    // gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
    // gl.drawArrays(gl.POINTS, 16, 4);

    requestAnimationFrame(() => {
      draw(gl);
    });
  }

  initVertexBuffers(gl);

  draw(gl);
};
