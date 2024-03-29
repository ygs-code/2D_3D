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
  
   
  
    // Set the vertex coordinates and color (the blue triangle is in the front)、
    // 设置顶点坐标和颜色(蓝色三角形在前面)
    var n = initVertexBuffers(gl);
    if (n < 0) {
      console.log('Failed to set the vertex information');
      return;
    }
  
    // Specify the color for clearing <canvas>
    // 设置画布颜色
    gl.clearColor(0, 0, 0, 1);
    // Enable alpha blending
    //启用alpha混合
    gl.enable (gl.BLEND);
    // Set blending function
    // 设置混合功能
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  
    // get the storage locations of u_ViewMatrix and u_ProjMatrix
    //获取u_ViewMatrix和u_ProjMatrix的存储位置
    var u_ViewMatrix = gl.getUniformLocation(program, 'u_ViewMatrix');
    var u_ProjMatrix = gl.getUniformLocation(program, 'u_ProjMatrix');
    if (!u_ViewMatrix || !u_ProjMatrix) { 
      console.log('Failed to get the storage location of u_ViewMatrix and/or u_ProjMatrix');
      return;
    }
  
    // Create the view projection matrix
    //创建视图投影矩阵
    var viewMatrix = new Matrix4();
    // Register the event handler to be called on key press
    window.onkeydown = function(ev){
       keydown(ev, gl, n, u_ViewMatrix, viewMatrix);
    };
  
    // Create Projection matrix and set to u_ProjMatrix
    // 创建投影
    var projMatrix = new Matrix4();
    projMatrix.setOrtho(-1, 1, -1, 1, 0, 2);
    gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);
  
    // Draw
    draw(gl, n, u_ViewMatrix, viewMatrix);
  }
  
  function initVertexBuffers(gl) {
    var verticesColors = new Float32Array([
      // 定点坐标
      // Vertex coordinates and color(RGBA)
      0.0,  0.5,  -0.4,  0.4,  1.0,  0.4,  0.4, // The back green one
     -0.5, -0.5,  -0.4,  0.4,  1.0,  0.4,  0.4,
      0.5, -0.5,  -0.4,  1.0,  0.4,  0.4,  0.4, 
     
      0.5,  0.4,  -0.2,  1.0,  0.4,  0.4,  0.6, // The middle yerrow one
     -0.5,  0.4,  -0.2,  1.0,  1.0,  0.4,  0.6,
      0.0, -0.6,  -0.2,  1.0,  1.0,  0.4,  0.6, 
  
      0.0,  0.5,   0.0,  0.4,  0.4,  1.0,  0.8,  // The front blue one 
     -0.5, -0.5,   0.0,  0.4,  0.4,  1.0,  0.8,
      0.5, -0.5,   0.0,  1.0,  0.4,  0.4,  0.8, 
    ]);
    var n = 9;
  
    // Create a buffer object
    // 创建buffer
    var vertexColorbuffer = gl.createBuffer();  
    if (!vertexColorbuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }
  
    // Write the vertex information and enable it
    // 绑定buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorbuffer);
    // 往buffer添加数据
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);
  
    var FSIZE = verticesColors.BYTES_PER_ELEMENT;
    // 获取 shander地址
    var a_Position = gl.getAttribLocation(program, 'a_Position');
    if(a_Position < 0) {
      console.log('Failed to get the storage location of a_Position');
      return -1;
    }

    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 7, 0);
    gl.enableVertexAttribArray(a_Position);
  
    var a_Color = gl.getAttribLocation(program, 'a_Color');
    if(a_Color < 0) {
      console.log('Failed to get the storage location of a_Color');
      return -1;
    }
    gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, FSIZE * 7, FSIZE * 3);
    gl.enableVertexAttribArray(a_Color);
  
    // Unbind the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  
    return n;
  }
  
  function keydown(ev, gl, n, u_ViewMatrix, viewMatrix) {
      if(ev.keyCode == 39) { // The right arrow key was pressed
        g_EyeX += 0.01;
      } else 
      if (ev.keyCode == 37) { // The left arrow key was pressed
        g_EyeX -= 0.01;
      } else return;
      draw(gl, n, u_ViewMatrix, viewMatrix);    
  }
  
  // Eye position
  var g_EyeX = 0.20, g_EyeY = 0.25, g_EyeZ = 0.25;
  function draw(gl, n, u_ViewMatrix, viewMatrix) {
    // Set the matrix to be used for to set the camera view
    // 设置相机
    viewMatrix.setLookAt(g_EyeX, g_EyeY, g_EyeZ, 0, 0, 0, 0, 1, 0);
  
    // Pass the view projection matrix
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
  
    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
    // Draw the rectangle
    gl.drawArrays(gl.TRIANGLES, 0, n);
  }
  

  main();
};
