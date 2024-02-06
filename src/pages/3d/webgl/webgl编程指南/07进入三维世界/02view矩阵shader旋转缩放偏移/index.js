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
 
 
    if (!gl) {
      console.log('Failed to get the rendering context for WebGL');
      return;
    }
  
    // Initialize shaders
    // if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    //   console.log('Failed to intialize shaders.');
    //   return;
    // }
  
    // Set the vertex coordinates and color (the blue triangle is in the front)
    var n = initVertexBuffers(gl);
    if (n < 0) {
      console.log('Failed to set the vertex information');
      return;
    }
  
    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
  
    // Get the storage location of u_ViewMatrix and u_ModelMatrix
    var u_ViewMatrix = gl.getUniformLocation(program, 'u_ViewMatrix');
    var u_ModelMatrix = gl.getUniformLocation(program, 'u_ModelMatrix');
    if(!u_ViewMatrix || !u_ModelMatrix) { 
      console.log('Failed to get the storage location of u_viewMatrix or u_ModelMatrix');
      return;
    }
  
    // Set the matrix to be used for to set the camera view
    // var viewMatrix = new Matrix4();
     //初始化视图矩阵
   var viewMatrix = glMatrix.mat4.create();
   glMatrix.mat4.lookAt(
    viewMatrix,
    [0.20, 0.25, 0.25],
    [0, 0, 0,],
    [ 0, 1, 0]
  );
    // viewMatrix.setLookAt(0.20, 0.25, 0.25, 0, 0, 0, 0, 1, 0);
  
    // Calculate matrix for rotate
    var modelMatrix =  glMatrix.mat4.create();
    console.log('modelMatrix=====',modelMatrix);
 
 

    modelMatrix = glMatrix.mat4.rotateZ(modelMatrix, modelMatrix,  -10*Math.PI/180);
    // modelMatrix.setRotate(-10, 0, 0, 1); // Rotate around z-axis
  
    // Pass the view projection matrix and model matrix
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix);
    
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix);
  
    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
  
    // Draw the rectangle
    gl.drawArrays(gl.TRIANGLES, 0, n);
  }
  
  function initVertexBuffers(gl) {
    var verticesColors = new Float32Array([
      // Vertex coordinates and color
       0.0,  0.5,  -0.4,  0.4,  1.0,  0.4, // The back green one
      -0.5, -0.5,  -0.4,  0.4,  1.0,  0.4,
       0.5, -0.5,  -0.4,  1.0,  0.4,  0.4, 
     
       0.5,  0.4,  -0.2,  1.0,  0.4,  0.4, // The middle yellow one
      -0.5,  0.4,  -0.2,  1.0,  1.0,  0.4,
       0.0, -0.6,  -0.2,  1.0,  1.0,  0.4, 
  
       0.0,  0.5,   0.0,  0.4,  0.4,  1.0,  // The front blue one 
      -0.5, -0.5,   0.0,  0.4,  0.4,  1.0,
       0.5, -0.5,   0.0,  1.0,  0.4,  0.4, 
    ]);
    var n = 9;
  
    // Create a buffer object
    var vertexColorBuffer = gl.createBuffer();  
    if (!vertexColorBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }
  
    // Write vertex information to buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);
  
    var FSIZE = verticesColors.BYTES_PER_ELEMENT;
    // Assign the buffer object to a_Color and enable the assignment
    var a_Position = gl.getAttribLocation(program, 'a_Position');
    if(a_Position < 0) {
      console.log('Failed to get the storage location of a_Position');
      return -1;
    }
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
    gl.enableVertexAttribArray(a_Position);
    // Assign the buffer object to a_Color and enable the assignment
    var a_Color = gl.getAttribLocation(program, 'a_Color');
    if(a_Color < 0) {
      console.log('Failed to get the storage location of a_Color');
      return -1;
    }
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    gl.enableVertexAttribArray(a_Color);
  
    // Unbind the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  
    return n;
  }

 
  
  main();
};
