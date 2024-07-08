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
   // 导入 shader
  const program = initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
  if (!program) {
    console.log("failed to initialize shaders");
    return;
  }

  function main() {
  
    // Set the vertex information
    // 初始化顶点
    var n = initVertexBuffers(gl);
    if (n < 0) {
      console.log('Failed to set the vertex information');
      return;
    }
  
    // Specify the color for clearing <canvas>
    // 指定用于清除<canvas>的颜色
    gl.clearColor(0, 0, 0, 1);
  
    // Clear <canvas>
    // 清除canvas
    gl.clear(gl.COLOR_BUFFER_BIT);
  
    // Draw three points  绘画成点
    gl.drawArrays(gl.POINTS, 0, n);
  }
  
  function initVertexBuffers(gl) {
    var vertices = new Float32Array([
      0, 0.5,   
      -0.5, -0.5,  
      0.5, -0.5
    ]);
    var n = 3; // The number of vertices 顶点的数量
  
    // Create a buffer object //创建一个buffer对象
    var vertexBuffer = gl.createBuffer();  
    if (!vertexBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }
  
    // Bind the vertex buffer //绑定顶点缓冲区
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // Write date into the buffer object //写入日期到缓冲区对象
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  
    // Assign the buffer object to the attribute variable
    //将缓冲区对象赋值给属性变量
    var a_Position = gl.getAttribLocation(program, 'a_Position');
    if (a_Position < 0) {
      console.log('Failed to get the storage location of a_Position');
      return -1;
    }
    // buffer 数据写入显卡
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  
    // Unbind the buffer object
    //取消绑定buffer对象
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
   
    // Enable the assignment to a_Position variable
    //启用a_Position变量赋值
    gl.enableVertexAttribArray(a_Position);
  
    return n;
  }
  
  

  main();
};
