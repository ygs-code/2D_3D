import initShaders from "@/pages/3d/utils/initShader";
import {resizeCanvasToDisplaySize} from "@/pages/3d/utils/webgl-utils.js";
// import m4 from "./m4";
import FSHADER_SOURCE from "./index.frag";
import VSHADER_SOURCE from "./index.vert";
import controller from "@/pages/3d/utils/controller.js";
// import {createHtmlMatrix} from "@/pages/3d/utils/matrix.js";
import {createHtmlMatrix} from "@/pages/3d/utils/matrix.js";
import m4 from "@/pages/3d/utils/comments/m4";
import * as glMatrix from "gl-matrix";
import {Matrix4}  from "@/pages/3d/utils/lib/cuon-matrix";
import "./index.less";
// import "@/pages/index.less";
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

 
  const program = initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
  if (!program) {
    console.log("failed to initialize shaders");
    return;
  }
 
  function main() {
 
 
    // Set the vertex information
    var n = initVertexBuffers(gl);
    if (n < 0) {
      console.log('Failed to set the positions of the vertices');
      return;
    }
  
    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
  
    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
  
    // Draw three points
    gl.drawArrays(gl.POINTS, 0, n);
  }
  
  function initVertexBuffers(gl) {

    // 三个顶点
    var vertices = new Float32Array([
        0.0, 0.5,  
        -0.5, -0.5, 
        0.5, -0.5
    ]);
    var n = 3;
  
     // 顶点 大小
    var sizes = new Float32Array([
      10.0, 
      20.0,
       30.0  // Point sizes
    ]);
  
    // Create a buffer object
    var vertexBuffer = gl.createBuffer();  
    // 定点 大小的buffer
    var sizeBuffer = gl.createBuffer();

    if (!vertexBuffer || !sizeBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }
  
    // Write vertex coordinates to the buffer object and enable it
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(program, 'a_Position');
      if(a_Position < 0) {
      console.log('Failed to get the storage location of a_Position');
      return -1;
    }

    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);
  
    // Bind the point size buffer object to target
    // 绑定 size buffer 
    gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.STATIC_DRAW);

    var a_PointSize = gl.getAttribLocation(program, 'a_PointSize');
    if(a_PointSize < 0) {
      console.log('Failed to get the storage location of a_PointSize');
      return -1;
    }
    gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_PointSize);
  
    // Unbind the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  
    return n;
  }
  
  

main(); 
};
