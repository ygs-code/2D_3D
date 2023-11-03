// import WebGLDebugUtils from "@/pages/3d/utils/lib/webgl-debug.js";
// import WebGLUtils from "@/pages/3d/utils/lib/webgl-utils";
import {getWebGLContext, initShaders} from "@/pages/3d/utils/lib/cuon-utils";
import VSHADER_SOURCE from "./index.vert";
import FSHADER_SOURCE from "./index.frag";

import "./index.less";

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

  let u_w = gl.getUniformLocation(gl.program, "u_w");
  let u_h = gl.getUniformLocation(gl.program, "u_h");
  gl.uniform1f(u_w, canvas_w);
  gl.uniform1f(u_h, canvas_h);

  initVertexBuffers(gl);
  function initVertexBuffers(gl) {
    // 4个点的坐标信息和颜色信息
    // vertex = position + color
    // let vertices = new Float32Array([
    //   -0.5, 0.5, 0.0,
    //   -0.5, -0.5, 0.0,
    //    0.5, -0.5, 0.0,
    //     0.5, 0.5, 0.0,
    // ]);

    // 4个点的坐标信息
    let positions = new Float32Array([
      -0.5, 0.5, 0.0, -0.5, -0.5, 0.0, 0.5, -0.5, 0.0, 0.5, 0.5, 0.0
    ]);

    // 4个点的颜色信息
    let colors = new Float32Array([
      1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0
    ]);
    let FSIZE = positions.BYTES_PER_ELEMENT; // Float32 Size = 4

    let buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    let a_position = gl.getAttribLocation(gl.program, "a_position");
    gl.vertexAttribPointer(a_position, 3, gl.FLOAT, false, FSIZE * 3, 0);
    gl.enableVertexAttribArray(a_position);

    let colorsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
    let a_color = gl.getAttribLocation(gl.program, "a_color");
    gl.vertexAttribPointer(
      a_color, // 变了名称
      3, // 三个数据为一组颜色 rgb
      gl.FLOAT,
      false,
      FSIZE * 3, // 3个一组数据
      FSIZE * 0 // 从索引0开始
    );
    gl.enableVertexAttribArray(a_color);
  }

  draw(gl);

  function draw(gl) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.drawArrays(gl.POINTS, 0, 4);
  }
};
