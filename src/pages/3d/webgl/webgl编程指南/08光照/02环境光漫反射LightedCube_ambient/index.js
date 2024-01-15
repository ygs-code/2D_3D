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
import {Matrix4 ,  Vector3}  from "@/pages/3d/utils/lib/cuon-matrix";
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

  // 创建 program
  const program = initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
  if (!program) {
    console.log("failed to initialize shaders");
    return;
  }
  function main() {
 
  
    // 
    var n = initVertexBuffers(gl);
    if (n < 0) {
      console.log('Failed to set the vertex information');
      return;
    }
  
    // Set the clear color and enable the depth test
    //设置清颜色，开启深度测试
    gl.clearColor(0, 0, 0, 1);
    gl.enable(gl.DEPTH_TEST);
  
    // Get the storage locations of uniform variables and so on
    //获取统一变量的存储位置等等
    var u_MvpMatrix = gl.getUniformLocation(program, 'u_MvpMatrix');
    var u_DiffuseLight = gl.getUniformLocation(program, 'u_DiffuseLight');
    var u_LightDirection = gl.getUniformLocation(program, 'u_LightDirection');
    var u_AmbientLight = gl.getUniformLocation(program, 'u_AmbientLight');
    if (!u_MvpMatrix || !u_DiffuseLight || !u_LightDirection || !u_AmbientLight) { 
      console.log('Failed to get the storage location');
      return;
    }
  
    // Set the light color (white)
    //设置漫反射颜色(白色)
    gl.uniform3f(u_DiffuseLight, 1.0, 1.0, 1.0);
    // Set the light direction (in the world coordinate)
    //设置光照方向(世界坐标)
    var lightDirection = new Vector3([0.5, 3.0, 4.0]);
    // 归一化
    lightDirection.normalize();     // Normalize
    gl.uniform3fv(u_LightDirection, lightDirection.elements);

    //设置环境光颜色
    // Set the ambient light
    gl.uniform3f(u_AmbientLight, 0.2, 0.2, 0.2);
  
    // Calculate the view projection matrix
    //计算视图投影矩阵
    var mvpMatrix = new Matrix4();  // Model view projection matrix
    // 模型视图投影矩阵
    mvpMatrix.setPerspective(30, canvas.width/canvas.height, 1, 100);
    // 相机
    mvpMatrix.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);
    // Pass the model view projection matrix to the variable u_MvpMatrix
    //将模型视图投影矩阵传递给变量u_MvpMatrix
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
  
    // Clear color and depth buffer
    //清除颜色和深度缓冲
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
    // Draw the cube
    //绘制立方体
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
    // Coordinates
    // 物体顶点
    var vertices = new Float32Array([
       1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0, // v0-v1-v2-v3 front
       1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0, // v0-v3-v4-v5 right
       1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0, // v0-v5-v6-v1 up
      -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0, // v1-v6-v7-v2 left
      -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0, // v7-v4-v3-v2 down
       1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0  // v4-v7-v6-v5 back
    ]);
  
    // Colors
    // 物体颜色
    var colors = new Float32Array([
      1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v1-v2-v3 front
      1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v3-v4-v5 right
      1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v5-v6-v1 up
      1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v1-v6-v7-v2 left
      1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v7-v4-v3-v2 down
      1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0    // v4-v7-v6-v5 back
   ]);
  
    // Normal  光线法线
    var normals = new Float32Array([
      0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,  // v0-v1-v2-v3 front
      1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,  // v0-v3-v4-v5 right
      0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,  // v0-v5-v6-v1 up
     -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  // v1-v6-v7-v2 left
      0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,  // v7-v4-v3-v2 down
      0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0   // v4-v7-v6-v5 back
    ]);
  
    // Indices of the vertices  顶点的指标
    var indices = new Uint8Array([
       0, 1, 2,   0, 2, 3,    // front
       4, 5, 6,   4, 6, 7,    // right
       8, 9,10,   8,10,11,    // up
      12,13,14,  12,14,15,    // left
      16,17,18,  16,18,19,    // down
      20,21,22,  20,22,23     // back
   ]);
  
    // Write the vertex property to buffers (coordinates, colors and normals)
    //写入顶点属性到缓冲区(坐标，颜色和法线)
    if (!initArrayBuffer(gl, 'a_Position', vertices, 3)) return -1;
    if (!initArrayBuffer(gl, 'a_Color', colors, 3)) return -1;
    if (!initArrayBuffer(gl, 'a_Normal', normals, 3)) return -1;
  
    // Unbind the buffer object
    //取消绑定buffer对象
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  
    // Write the indices to the buffer object
    //将索引写入buffer对象
    var indexBuffer = gl.createBuffer();

    if (!indexBuffer) {
      console.log('Failed to create the buffer object');
      return false;
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    // 将顶点写入到缓冲区中
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
  
    return indices.length;
  }
  
  function initArrayBuffer(gl, attribute, data, num) {
    // Create a buffer object
    // 创建buffer
    var buffer = gl.createBuffer();
    if (!buffer) {
      console.log('Failed to create the buffer object');
      return false;
    }
    // Write data into the buffer object
    //将数据写入缓冲区对象
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    // 写入数据到缓冲区中
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    // Assign the buffer object to the attribute variable
    //将缓冲区对象赋值给属性变量
    var a_attribute = gl.getAttribLocation(program, attribute);
    if (a_attribute < 0) {
      console.log('Failed to get the storage location of ' + attribute);
      return false;
    }
    gl.vertexAttribPointer(a_attribute, num, gl.FLOAT, false, 0, 0);
    // Enable the assignment of the buffer object to the attribute variable
    //启用缓冲区对象对属性变量的赋值
    gl.enableVertexAttribArray(a_attribute);
  
    return true;
  }
  

  main(); 
};
