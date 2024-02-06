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

  addCss(
    `
  .canvas_webgl{  
    position: absolute;
    top:0px;
    left:0px;
    z-index:2;
  }
  `);


 

 
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
  
  
    // 创建顶点
    var n = initVertexBuffers(gl);
    if (n < 1) {
      console.log('Failed to set the vertex information');
      return;
    }
  
    // Color of Fog
    // 颜色
    var fogColor = new Float32Array([0.137, 0.231, 0.423]);
    // Distance of fog [where fog starts, where fog completely covers object]
    // 雾的距离[雾开始的地方，雾完全覆盖物体的地方]
    var fogDist = new Float32Array([55, 80]);
    // Position of eye point (world coordinates)
    // 视点位置(世界坐标); 相机
    var eye = new Float32Array([25, 65, 35, 1.0]);
  
    // Get the storage locations of uniform variables
    // mvp 矩阵
    var u_MvpMatrix = gl.getUniformLocation(program, 'u_MvpMatrix');
    // 模型 矩阵
    var u_ModelMatrix = gl.getUniformLocation(program, 'u_ModelMatrix');
    // 眼睛
    var u_Eye = gl.getUniformLocation(program, 'u_Eye');
    // 颜色
    var u_FogColor = gl.getUniformLocation(program, 'u_FogColor');
    // 
    var u_FogDist = gl.getUniformLocation(program, 'u_FogDist');
    if (!u_MvpMatrix || !u_ModelMatrix || !u_Eye || !u_FogColor || !u_FogDist) {
      console.log('Failed to get the storage location');
      return;
    }
    
    // Pass fog color, distances, and eye point to uniform variable
    //将雾色、距离和眼点传递给统一变量
    gl.uniform3fv(u_FogColor, fogColor); // Colors
    gl.uniform2fv(u_FogDist, fogDist);   // Starting point and end point
    gl.uniform4fv(u_Eye, eye);           // Eye point
  
    // Set clear color and enable hidden surface removal
    // 设置透明颜色并启用隐藏表面移除
    gl.clearColor(fogColor[0], fogColor[1], fogColor[2], 1.0); // Color of Fog
    gl.enable(gl.DEPTH_TEST);
  
    // Pass the model matrix to 
    //将模型矩阵传递给u ModelMatrix
    var modelMatrix = new Matrix4();
    // 缩放
    modelMatrix.setScale(10, 10, 10);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  
    // Pass the model view projection matrix to u_MvpMatrix
    //将模型矩阵传递给u ModelMatrix
    var mvpMatrix = new Matrix4();
    // 透视 矩阵
    mvpMatrix.setPerspective(30, canvas.width/canvas.height, 1, 1000);
    // 眼睛
    mvpMatrix.lookAt(eye[0], eye[1], eye[2], 0, 2, 0, 0, 1, 0);

    mvpMatrix.multiply(modelMatrix);

    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
    document.onkeydown = function(ev){
      // 键盘事件
      keydown(ev, gl, n, u_FogDist, fogDist);
     };
  
    // Clear color and depth buffer
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // Draw
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
  
    // 模型矩阵
    var modelViewMatrix = new Matrix4();
    // 设置相机
    modelViewMatrix.setLookAt(eye[0], eye[1], eye[2], 0, 2, 0, 0, 1, 0);
    // 
    modelViewMatrix.multiply(modelMatrix);
    // 
    modelViewMatrix.multiplyVector4(new Vector4([1, 1, 1, 1]));

    mvpMatrix.multiplyVector4(new Vector4([1, 1, 1, 1]));

    modelViewMatrix.multiplyVector4(new Vector4([-1, 1, 1, 1]));
    
    mvpMatrix.multiplyVector4(new Vector4([-1, 1, 1, 1]));
  }
  
  function keydown(ev, gl, n, u_FogDist, fogDist) {

    switch (ev.keyCode) {
      case 38: // Up arrow key -> Increase the maximum distance of fog
        fogDist[1]  += 1;
        break;
      case 40: // Down arrow key -> Decrease the maximum distance of fog
        if (fogDist[1] > fogDist[0]){
          fogDist[1] -= 1;
        } 
        break;
      default: return;
    }
    // 通过雾的距离
    gl.uniform2fv(u_FogDist, fogDist);   // Pass the distance of fog
    // Clear color and depth buffer
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // Draw
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
  }
  
  function initVertexBuffers(gl) {
    // Create a cube
    //    v6----- v5
    //   /|      /|
    //  v1------v0|
    //  | |     | |
    //  | |v7---|-|v4
    //  |/      |/
    //  v2------v3
  
    // 顶点
    var vertices = new Float32Array([   // Vertex coordinates
       1, 1, 1,  -1, 1, 1,  -1,-1, 1,   1,-1, 1,    // v0-v1-v2-v3 front
       1, 1, 1,   1,-1, 1,   1,-1,-1,   1, 1,-1,    // v0-v3-v4-v5 right
       1, 1, 1,   1, 1,-1,  -1, 1,-1,  -1, 1, 1,    // v0-v5-v6-v1 up
      -1, 1, 1,  -1, 1,-1,  -1,-1,-1,  -1,-1, 1,    // v1-v6-v7-v2 left
      -1,-1,-1,   1,-1,-1,   1,-1, 1,  -1,-1, 1,    // v7-v4-v3-v2 down
       1,-1,-1,  -1,-1,-1,  -1, 1,-1,   1, 1,-1     // v4-v7-v6-v5 back
    ]);
  
    // 颜色
    var colors = new Float32Array([     // Colors
      0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  // v0-v1-v2-v3 front
      0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  // v0-v3-v4-v5 right
      1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  // v0-v5-v6-v1 up
      1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  // v1-v6-v7-v2 left
      1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  // v7-v4-v3-v2 down
      0.4, 1.0, 1.0,  0.4, 1.0, 1.0,  0.4, 1.0, 1.0,  0.4, 1.0, 1.0   // v4-v7-v6-v5 back
    ]);
  
    // 顶点的指标
    var indices = new Uint8Array([       // Indices of the vertices
       0, 1, 2,   0, 2, 3,    // front
       4, 5, 6,   4, 6, 7,    // right
       8, 9,10,   8,10,11,    // up
      12,13,14,  12,14,15,    // left
      16,17,18,  16,18,19,    // down
      20,21,22,  20,22,23     // back
    ]);
  
    // Create a buffer object
    // 创建一个buffer对象
    var indexBuffer = gl.createBuffer();
    if (!indexBuffer) 
      return -1;
  
    // Write the vertex property to buffers (coordinates and normals)
    // 写入顶点属性到缓冲区(坐标和法线)
    if (!initArrayBuffer(gl, vertices, 3, gl.FLOAT, 'a_Position')) return -1;
    if (!initArrayBuffer(gl, colors, 3, gl.FLOAT, 'a_Color')) return -1;
  
    // Write the indices to the buffer object
    // 将索引写入buffer对象
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
  
    return indices.length;
  }
  
  function initArrayBuffer (gl, data, num, type, attribute) {
    // Create a buffer object
    //写入日期到缓冲区对象
    var buffer = gl.createBuffer();
    if (!buffer) {
      console.log('Failed to create the buffer object');
      return false;
    }
    // Write date into the buffer object
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
    // Unbind the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  
    return true;
  }
  

  main();
};
