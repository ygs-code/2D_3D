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
  
    // Set the clear color and enable the depth test
    //设置清颜色，
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // 开启深度测试 
    // gl.enable(gl.DEPTH_TEST);


    // Enable alpha blending
    // 启用alpha混合
    gl.enable (gl.BLEND);
    // Set blending function
   //设置混合功能
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  
    // Get the storage location of u_MvpMatrix
    //获取u MvpMatrix的存储位置
    var u_MvpMatrix = gl.getUniformLocation(program, 'u_MvpMatrix');
    if (!u_MvpMatrix) {
      console.log('Failed to get the storage location of u_MvpMatrix');
      return;
    }
  
    // Set the eye point and the viewing volume
    // 设置视点和观看音量 设置mvp矩阵
    var mvpMatrix = new Matrix4();
    // 设置投影
    mvpMatrix.setPerspective(30, 1, 1, 100);
    // 设置眼睛 或 相机
    mvpMatrix.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);
  
    // Pass the model view projection matrix to u_MvpMatrix
   //将模型视图投影矩阵传递给u_MvpMatrix
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
  
    // Clear color and depth buffer
    //清除颜色和深度缓冲
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
    // Draw the cube
    //绘制立方体
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
  }
  
  // 顶点  顶点缓冲区
  function initVertexBuffers(gl) {
    // Create a cube
    //    v6----- v5
    //   /|      /|
    //  v1------v0|
    //  | |     | |
    //  | |v7---|-|v4
    //  |/      |/
    //  v2------v3
  
    // 这里是 24个 数据
    var vertices = new Float32Array([   // Vertex coordinates
       1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0,    // v0-v1-v2-v3 front
       1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0,    // v0-v3-v4-v5 right
       1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0,    // v0-v5-v6-v1 up
      -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0,    // v1-v6-v7-v2 left
      -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0,    // v7-v4-v3-v2 down
       1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0     // v4-v7-v6-v5 back
    ]);
  
    var colors = new Float32Array([     // Colors
        0.5, 0.5, 1.0, 0.4,  0.5, 0.5, 1.0, 0.4,  0.5, 0.5, 1.0, 0.4,  0.5, 0.5, 1.0, 0.4,  // v0-v1-v2-v3 front(blue)
        0.5, 1.0, 0.5, 0.4,  0.5, 1.0, 0.5, 0.4,  0.5, 1.0, 0.5, 0.4,  0.5, 1.0, 0.5, 0.4,  // v0-v3-v4-v5 right(green)
        1.0, 0.5, 0.5, 0.4,  1.0, 0.5, 0.5, 0.4,  1.0, 0.5, 0.5, 0.4,  1.0, 0.5, 0.5, 0.4,  // v0-v5-v6-v1 up(red)
        1.0, 1.0, 0.5, 0.4,  1.0, 1.0, 0.5, 0.4,  1.0, 1.0, 0.5, 0.4,  1.0, 1.0, 0.5, 0.4,  // v1-v6-v7-v2 left
        1.0, 1.0, 1.0, 0.4,  1.0, 1.0, 1.0, 0.4,  1.0, 1.0, 1.0, 0.4,  1.0, 1.0, 1.0, 0.4,  // v7-v4-v3-v2 down
        0.5, 1.0, 1.0, 0.4,  0.5, 1.0, 1.0, 0.4,  0.5, 1.0, 1.0, 0.4,  0.5, 1.0, 1.0, 0.4   // v4-v7-v6-v5 back
    ]);
  
    // 顶点的指标
    // 顶点 索引 比如上面 24个数据 这里 六个面 取 哪组顶点 
    var indices = new Uint8Array([       // Indices of the vertices
       0, 1, 2,   0, 2, 3,    // front
       4, 5, 6,   4, 6, 7,    // right
       8, 9,10,   8,10,11,    // up
      12,13,14,  12,14,15,    // left
      16,17,18,  16,18,19,    // down
      20,21,22,  20,22,23     // back
    ]);
  
    // Create a buffer object
    var indexBuffer = gl.createBuffer();
    if (!indexBuffer) 
      return -1;
  
    // Write the vertex property to buffers (coordinates and normals)
    if (!initArrayBuffer(gl, vertices, 3, gl.FLOAT, 'a_Position'))
      return -1;
  
    if (!initArrayBuffer(gl, colors, 4, gl.FLOAT, 'a_Color'))
      return -1;
  
    // Unbind the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  
    // Write the indices to the buffer object
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
  
    return indices.length;
  }
  
  // 初始化buffer
  function initArrayBuffer(gl, data, num, type, attribute) {
    // Create a buffer object
    // 创建一个缓冲区对象
    var buffer = gl.createBuffer();
    if (!buffer) {
      console.log('Failed to create the buffer object');
      return false;
    }
    // Write data into the buffer object
    //写入数据到缓冲区对象
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    // Assign the buffer object to the attribute variable
    var a_attribute = gl.getAttribLocation(program, attribute);
    if (a_attribute < 0) {
      console.log('Failed to get the storage location of ' + attribute);
      return false;
    }
    gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
    // Enable the assignment of the buffer object to the attribute variable
    gl.enableVertexAttribArray(a_attribute);
  
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  
    return true;
  }
  
  main();
};
