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
  
    // get the storage locations of u_ViewMatrix and u_ProjMatrix
    var u_ViewMatrix = gl.getUniformLocation(program, 'u_ViewMatrix');
    var u_ProjMatrix = gl.getUniformLocation(program, 'u_ProjMatrix');
    if (!u_ViewMatrix || !u_ProjMatrix) { 
      console.log('Failed to get the storage location of u_ViewMatrix and/or u_ProjMatrix');
      return;
    }

    console.log('Matrix4===',Matrix4);

    // var viewMatrix = new Matrix4();  
    let viewMatrix = glMatrix.mat4.create();

    //  var projMatrix = new Matrix4();  // The projection matrix
    let projMatrix = glMatrix.mat4.create();  // The projection matrix
  


    let {
      eye,at,
      up
    }={
      eye:{
        x:0,
        y:0,
        z:5
      },
      at:{
        x:0,
        y:0,
        z:-100,
      },
      up:{
        x:0,
        y:1,
        z:0
      }
    };
  
    glMatrix.mat4.lookAt(
      viewMatrix,
      [eye.x, eye.y, eye.z],
      [at.x, at.y, at.z],
      [up.x, up.y, up.z]
    );

    // calculate the view matrix and projection matrix
    //  viewMatrix.setLookAt(0, 0, 5, 0, 0, -100, 0, 1, 0);


    let [
      fovy, aspect, near, far
    ]=[
      30 * Math.PI/180, canvas.width/canvas.height, 1, 100
    ];

    projMatrix = glMatrix.mat4. perspective(projMatrix, fovy, aspect, near, far);


    // projMatrix.setPerspective(Math.PI/180, canvas.width/canvas.height, 1, 100);



    // Pass the view and projection matrix to u_ViewMatrix, u_ProjMatrix
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix);
    gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix);
  
    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
  
    // Draw the triangles
    gl.drawArrays(gl.TRIANGLES, 0, n);
  }
  
  function initVertexBuffers(gl) {
    var verticesColors = new Float32Array([
      // Three triangles on the right side
      0.75,  1.0,  -4.0,  0.4,  1.0,  0.4, // The back green one
      0.25, -1.0,  -4.0,  0.4,  1.0,  0.4,
      1.25, -1.0,  -4.0,  1.0,  0.4,  0.4, 
  
      0.75,  1.0,  -2.0,  1.0,  1.0,  0.4, // The middle yellow one
      0.25, -1.0,  -2.0,  1.0,  1.0,  0.4,
      1.25, -1.0,  -2.0,  1.0,  0.4,  0.4, 
  
      0.75,  1.0,   0.0,  0.4,  0.4,  1.0,  // The front blue one 
      0.25, -1.0,   0.0,  0.4,  0.4,  1.0,
      1.25, -1.0,   0.0,  1.0,  0.4,  0.4, 
  
      // Three triangles on the left side
     -0.75,  1.0,  -4.0,  0.4,  1.0,  0.4, // The back green one
     -1.25, -1.0,  -4.0,  0.4,  1.0,  0.4,
     -0.25, -1.0,  -4.0,  1.0,  0.4,  0.4, 
  
     -0.75,  1.0,  -2.0,  1.0,  1.0,  0.4, // The middle yellow one
     -1.25, -1.0,  -2.0,  1.0,  1.0,  0.4,
     -0.25, -1.0,  -2.0,  1.0,  0.4,  0.4, 
  
     -0.75,  1.0,   0.0,  0.4,  0.4,  1.0,  // The front blue one 
     -1.25, -1.0,   0.0,  0.4,  0.4,  1.0,
     -0.25, -1.0,   0.0,  1.0,  0.4,  0.4, 
    ]);
    var n = 18; // Three vertices per triangle * 6
  
    // Create a buffer object
    var vertexColorbuffer = gl.createBuffer();  
    if (!vertexColorbuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }
  
    // Write the vertex coordinates and color to the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorbuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);
  
    var FSIZE = verticesColors.BYTES_PER_ELEMENT;
  
    // Assign the buffer object to a_Position and enable the assignment
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
  
    return n;
  }
  

main(); 
};
