import initShaders from "@/pages/3d/utils/initShader";
import {resizeCanvasToDisplaySize} from "@/pages/3d/utils/webgl-utils.js";
// import m4 from "./m4";
import FSHADER_SOURCE from "./index.frag";
import VSHADER_SOURCE from "./index.vert";
import controller from "@/pages/3d/utils/controller.js";
import {fData} from "./data";
 
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
   
  
    // Set the vertex coordinates and color (the blue triangle is in the front)
    var n = initVertexBuffers(gl);
    if (n < 0) {
      console.log('Failed to set the vertex information');
      return;
    }
  
    // Specify the color for clearing <canvas>
    gl.clearColor(0, 0, 0, 1);
  
    // Get the storage location of u_MvpMatrix
    var u_MvpMatrix = gl.getUniformLocation(program, 'u_MvpMatrix');
    if (!u_MvpMatrix) { 
      console.log('Failed to get the storage location of u_MvpMatrix');
      return;
    }
  
    var modelMatrix = new Matrix4(); // Model matrix
    var viewMatrix = new Matrix4();  // View matrix
    var projMatrix = new Matrix4();  // Projection matrix
    var mvpMatrix = new Matrix4();   // Model view projection matrix
  
    // Calculate the model, view and projection matrices
    modelMatrix.setTranslate(0.75, 0, 0);
    viewMatrix.setLookAt(0, 0, 5, 0, 0, -100, 0, 1, 0);
    projMatrix.setPerspective(30, canvas.width/canvas.height, 1, 100);
    // Calculate the model view projection matrix
    mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);
    // Pass the model view projection matrix to u_MvpMatrix
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
  
    gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>
  
    gl.drawArrays(gl.TRIANGLES, 0, n);   // Draw the triangles
  
   // Prepare the model matrix for another pair of triangles
    modelMatrix.setTranslate(-0.75, 0, 0);
    // Calculate the model view projection matrix
    mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);
    // Pass the model view projection matrix to u_MvpMatrix
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
  
    gl.drawArrays(gl.TRIANGLES, 0, n);   // Draw the triangles
  }
  
  function initVertexBuffers(gl) {
    var verticesColors = new Float32Array([
      // Vertex coordinates and color
       0.0,  1.0,  -4.0,  0.4,  1.0,  0.4, // The back green one
      -0.5, -1.0,  -4.0,  0.4,  1.0,  0.4,
       0.5, -1.0,  -4.0,  1.0,  0.4,  0.4, 
  
       0.0,  1.0,  -2.0,  1.0,  1.0,  0.4, // The middle yellow one
      -0.5, -1.0,  -2.0,  1.0,  1.0,  0.4,
       0.5, -1.0,  -2.0,  1.0,  0.4,  0.4, 
  
       0.0,  1.0,   0.0,  0.4,  0.4,  1.0,  // The front blue one 
      -0.5, -1.0,   0.0,  0.4,  0.4,  1.0,
       0.5, -1.0,   0.0,  1.0,  0.4,  0.4, 
    ]);
    var n = 9;
  
    // Create a buffer object
    var vertexColorBuffer = gl.createBuffer();  
    if (!vertexColorBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }
  
    // Write the vertex information and enable it
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);
  
    var FSIZE = verticesColors.BYTES_PER_ELEMENT;
  
    var a_Position = gl.getAttribLocation(program, 'a_Position');
    if(a_Position < 0) {
      console.log('Failed to get the storage location of a_Position');
      return -1;
    }
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
    gl.enableVertexAttribArray(a_Position);
  
    var a_Color = gl.getAttribLocation(program, 'a_Color');
    if(a_Color < 0) {
      console.log('Failed to get the storage location of a_Color');
      return -1;
    }
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    gl.enableVertexAttribArray(a_Color);
  
    return n;
  }
  
  

main(); 
};
