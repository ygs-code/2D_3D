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
 
    // Set the vertex coordinates, the color and the normal
    var n = initVertexBuffers(gl);
    if (n < 0) {
      console.log('Failed to set the vertex information');
      return;
    }
  
    // Set the clear color and enable the depth test
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
  
    // Get the storage locations of uniform variables and so on
    var u_ModelMatrix = gl.getUniformLocation(program, 'u_ModelMatrix');
    var u_MvpMatrix = gl.getUniformLocation(program, 'u_MvpMatrix');
    var u_NormalMatrix = gl.getUniformLocation(program, 'u_NormalMatrix');
    var u_LightColor = gl.getUniformLocation(program, 'u_LightColor');
    var u_LightPosition = gl.getUniformLocation(program, 'u_LightPosition');
    var u_AmbientLight = gl.getUniformLocation(program, 'u_AmbientLight');
    if (!u_MvpMatrix || !u_NormalMatrix || !u_LightColor || !u_LightPosition || !u_AmbientLight) { 
      console.log('Failed to get the storage location');
      return;
    }
  
    // Set the light color (white)
    //设置灯光颜色(白色)
    gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);

    // Set the light direction (in the world coordinate)
    //设置光照方向(世界坐标) 光源位置
    gl.uniform3f(u_LightPosition, 2.3, 4.0, 3.5);
    // Set the ambient light
    //设置环境光
    gl.uniform3f(u_AmbientLight, 0.2, 0.2, 0.2);
  
    // 模型矩阵
    var modelMatrix = new Matrix4();  // Model matrix
    // mvp 矩阵
    var mvpMatrix = new Matrix4();    // Model view projection matrix

    // 法向量矩阵
    var normalMatrix = new Matrix4(); // Transformation matrix for normals
  
    // Calculate the model matrix
    // 设置模型y轴旋转
    modelMatrix.setRotate(90, 0, 1, 0); // Rotate around the y-axis
    //
    // Pass the model matrix to u_ModelMatrix
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  
    // Pass the model view projection matrix to u_MvpMatrix
    // 设置透视投影
    mvpMatrix.setPerspective(30, canvas.width/canvas.height, 1, 100);
    // 设置 视图矩阵 相机
    mvpMatrix.lookAt(6, 6, 14, 0, 0, 0, 0, 1, 0);
    // 矩阵相乘
    mvpMatrix.multiply(modelMatrix);
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
  
    // Pass the matrix to transform the normal based on the model matrix to u_NormalMatrix
    //传递矩阵，将基于模型矩阵的法线转换为u_NormalMatrix
    // 模型矩阵的逆矩阵
    normalMatrix.setInverseOf(modelMatrix);
    // 转置矩阵。 这样做的目的为了矫正法向量 不正确问题

    /*
        法线矩阵 = 转置矩阵 * (逆矩阵 * 模型矩阵)  这样做的目的为了矫正法向量 不正确问题
    */

    normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
  
    // Clear color and depth buffer
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
    // Draw the cube
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
      // v0-v1-v2-v3 front
      2.0, 2.0, 2.0,  -2.0, 2.0, 2.0,  
      -2.0,-2.0, 2.0,  
       2.0,-2.0, 2.0,
      // v0-v3-v4-v5 right
      2.0, 2.0, 2.0,   2.0,-2.0, 2.0,  
      2.0,-2.0,-2.0,   2.0, 2.0,-2.0, 

      // v0-v5-v6-v1 up
      2.0, 2.0, 2.0,   2.0, 2.0,-2.0,  
      -2.0, 2.0,-2.0,  -2.0, 2.0, 2.0, 

      // v1-v6-v7-v2 left
      -2.0, 2.0, 2.0,  -2.0, 2.0,-2.0,  
      -2.0,-2.0,-2.0,  -2.0,-2.0, 2.0, 

      // v7-v4-v3-v2 down
      -2.0,-2.0,-2.0,   2.0,-2.0,-2.0,  
      2.0,-2.0, 2.0,  -2.0,-2.0, 2.0,

      // v4-v7-v6-v5 back
      2.0,-2.0,-2.0,  -2.0,-2.0,-2.0,  
      -2.0, 2.0,-2.0,   2.0, 2.0,-2.0  
    ]);
  
    // Colors 物体颜色
    var colors = new Float32Array([
      1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v1-v2-v3 front
      1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v3-v4-v5 right
      1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v5-v6-v1 up
      1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v1-v6-v7-v2 left
      1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v7-v4-v3-v2 down
      1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0     // v4-v7-v6-v5 back
   ]);
  
    // Normal 法向量
    var normals = new Float32Array([
      0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,  // v0-v1-v2-v3 front
      1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,  // v0-v3-v4-v5 right
      0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,  // v0-v5-v6-v1 up
     -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  // v1-v6-v7-v2 left
      0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,  // v7-v4-v3-v2 down
      0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0   // v4-v7-v6-v5 back
    ]);
  
    // Indices of the vertices   顶点的指标
    var indices = new Uint8Array([
       0, 1, 2,   0, 2, 3,    // front
       4, 5, 6,   4, 6, 7,    // right
       8, 9,10,   8,10,11,    // up
      12,13,14,  12,14,15,    // left
      16,17,18,  16,18,19,    // down
      20,21,22,  20,22,23     // back
   ]);
  
    // Write the vertex property to buffers (coordinates, colors and normals)
    if (!initArrayBuffer(gl, 'a_Position', vertices, 3, gl.FLOAT)) return -1;
    if (!initArrayBuffer(gl, 'a_Color', colors, 3, gl.FLOAT)) return -1;
    if (!initArrayBuffer(gl, 'a_Normal', normals, 3, gl.FLOAT)) return -1;
  
    // Unbind the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  
    // Write the indices to the buffer object
    //将索引写入buffer对象
    var indexBuffer = gl.createBuffer();
    if (!indexBuffer) {
      console.log('Failed to create the buffer object');
      return false;
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
  
    return  24; // indices.length;
  }
  
  function initArrayBuffer(gl, attribute, data, num, type) {
    // Create a buffer object
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
  
    return true;
  }
  
  
  main(); 
};
