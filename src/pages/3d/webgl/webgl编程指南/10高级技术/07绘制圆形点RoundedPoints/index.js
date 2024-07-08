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
import {Matrix4, Vector3 ,Vector4} from "@/pages/3d/utils/lib/cuon-matrix";
import sky from "@/assets/image/sky.jpg";
import {addCss} from "utils";

import "./index.less";
// import "@/pages/index.less";
window.onload = function () {

 

 

 
  const canvas = document.createElement("canvas");
  canvas.width = 500;
  canvas.height = 500;
  canvas.classList.add('canvas_webgl'); 
  document.body.appendChild(canvas);


 
  if (!canvas.getContext) return;
  // alpha: false
  let gl = canvas.getContext("webgl", {});
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
      console.log('Failed to set the vertex information');
      return;
    }
  
    // Specify the color for clearing <canvas>
    gl.clearColor(0, 0, 0, 1);
  
    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
  
    // Draw three points
    gl.drawArrays(gl.POINTS, 0, n);
  }
  
  function initVertexBuffers(gl) {
    var vertices = new Float32Array([
      0, 0.5,   -0.5, -0.5,   0.5, -0.5
    ]);
    var n = 3; // The number of vertices
  
    // Create a buffer object
    var vertexBuffer = gl.createBuffer();  
    if (!vertexBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }
  
    // Bind the vertex buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  
    // Assign the buffer object to the attribute variable
    var a_Position = gl.getAttribLocation(program, 'a_Position');
    if (a_Position < 0) {
      console.log('Failed to get the storage location of a_Position');
      return -1;
    }
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  
    // Unbind the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
   
    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);
  
    return n;
  }
  
  

  main();
};
