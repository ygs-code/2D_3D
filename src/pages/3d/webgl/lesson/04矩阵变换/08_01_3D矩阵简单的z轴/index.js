import {getWebGLContext, initShaders} from "@/pages/3d/utils/lib/cuon-utils";
import * as glMatrix from "gl-matrix";
import cat_512 from "@/assets/image/cat_512x512.jpg";
import mask_512x512 from "@/assets/image/mask_512x512.jpg";
import VSHADER_SOURCE from "./index.vert";
import FSHADER_SOURCE from "./index.frag";
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

  function initVertexBuffers(gl) {
    // 4个点的坐标信息-形状的4个顶点
    let positions = new Float32Array([
      -0.5, -0.5, 0.0, 0.5, -0.5, 0.0, 0.5, 0.5, 0.0, -0.5, 0.5, 0.0
    ]);

    let FSIZE = positions.BYTES_PER_ELEMENT; // Float32 Size = 4

    let positionsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    let a_Position = gl.getAttribLocation(gl.program, "a_Position");
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 3, 0);
    gl.enableVertexAttribArray(a_Position);
  }

  function draw(gl) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.drawArrays(gl.POINTS, 0, 4);
  }

  let rotationMatrix = glMatrix.mat4.create();
  let u_RotationMatrix = gl.getUniformLocation(gl.program, "u_RotationMatrix");
  // console.log("rotationMatrix=", rotationMatrix);

  // 不需要返回值
  // 旋转
  /*
    右手系坐标，
      z 轴是2d垂直看到的旋转  因为z轴是垂直我们视角
      x 轴是上下翻转
      y 轴是左右翻转
  
  */
  glMatrix.mat4.fromRotation(rotationMatrix, (45.0 * Math.PI) / 180, [
    0, // x
    0, // y
    1 // z
  ]);

  gl.uniformMatrix4fv(u_RotationMatrix, false, rotationMatrix);

  initVertexBuffers(gl);
  draw(gl);
};
