import initShaders from "@/pages/3d/utils/initShader";
import {resizeCanvasToDisplaySize} from "@/pages/3d/utils/webgl-utils.js";
// import m4 from "./m4";
import TEXTURE_FSHADER_SOURCE from "./texture.frag";
import TEXTURE_VSHADER_SOURCE from "./texture.vert";

import SOLID_FSHADER_SOURCE from "./solid.frag";
import SOLID_VSHADER_SOURCE from "./solid.vert";

import controller from "@/pages/3d/utils/controller.js";
// import {createHtmlMatrix} from "@/pages/3d/utils/matrix.js";
import {createHtmlMatrix} from "@/pages/3d/utils/matrix.js";
import m4 from "@/pages/3d/utils/comments/m4";
import * as glMatrix from "gl-matrix";
import {Matrix4, Vector3 ,Vector4} from "@/pages/3d/utils/lib/cuon-matrix";
import sky from "@/assets/image/sky.jpg";
import {addCss} from "utils";

import  orange from "static/resources/orange.jpg";
 


import "./index.less";
// import "@/pages/index.less";
window.onload = function () {

  // 创建canvas
  const canvas = document.createElement("canvas");
  canvas.width = 500;
  canvas.height = 500;
  canvas.classList.add('canvas_webgl'); 
  document.body.appendChild(canvas);
 
  if (!canvas.getContext) return;
  // alpha: false
  // 获取到 webgl 对象
  let gl = canvas.getContext("webgl", {});


  function main() {
   
    // Initialize shaders
    
    // 一套 shader
    var solidProgram = initShaders(gl, SOLID_VSHADER_SOURCE, SOLID_FSHADER_SOURCE);
   // 另外一套shader
    var texProgram = initShaders(gl, TEXTURE_VSHADER_SOURCE, TEXTURE_FSHADER_SOURCE);
   
    if (!solidProgram || !texProgram) {
      console.log('Failed to intialize shaders.');
      return;
    }
  
    // Get storage locations of attribute and uniform variables in program object for single color drawing
   //获取单色绘图程序对象中属性和统一变量的存储位置
    solidProgram.a_Position = gl.getAttribLocation(solidProgram, 'a_Position');
    solidProgram.a_Normal = gl.getAttribLocation(solidProgram, 'a_Normal');
    // mvp 矩阵
    solidProgram.u_MvpMatrix = gl.getUniformLocation(solidProgram, 'u_MvpMatrix');
    // 法线矩阵
    solidProgram.u_NormalMatrix = gl.getUniformLocation(solidProgram, 'u_NormalMatrix');
  
    // Get storage locations of attribute and uniform variables in program object for texture drawing
    //获取纹理绘制程序对象中属性和统一变量的存储位置
    // 顶点位置
    texProgram.a_Position = gl.getAttribLocation(texProgram, 'a_Position');
    // 光法线
    texProgram.a_Normal = gl.getAttribLocation(texProgram, 'a_Normal');
    // 贴图对象
    texProgram.a_TexCoord = gl.getAttribLocation(texProgram, 'a_TexCoord');

    // mvp矩阵
    texProgram.u_MvpMatrix = gl.getUniformLocation(texProgram, 'u_MvpMatrix');
    // 法线矩阵
    texProgram.u_NormalMatrix = gl.getUniformLocation(texProgram, 'u_NormalMatrix');

    // uv 贴图
    texProgram.u_Sampler = gl.getUniformLocation(texProgram, 'u_Sampler');
  
    if (solidProgram.a_Position < 0 || solidProgram.a_Normal < 0 || 
        !solidProgram.u_MvpMatrix || !solidProgram.u_NormalMatrix ||
        texProgram.a_Position < 0 || texProgram.a_Normal < 0 || texProgram.a_TexCoord < 0 ||
        !texProgram.u_MvpMatrix || !texProgram.u_NormalMatrix || !texProgram.u_Sampler) { 
      console.log('Failed to get the storage location of attribute or uniform variable'); 
      return;
    }
  
    // Set the vertex information
    //设置顶点信息
    var cube = initVertexBuffers(gl);
    if (!cube) {
      console.log('Failed to set the vertex information');
      return;
    }
  
    // Set texture
    //设置纹理
    var texture = initTextures(gl, texProgram);
    if (!texture) {
      console.log('Failed to intialize the texture.');
      return;
    }
  
    // Set the clear color and enable the depth test
    //设置清颜色，开启深度测试
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
  
    // Calculate the view projection matrix
    //计算视图投影矩阵
    var viewProjMatrix = new Matrix4();
    // 投影矩阵
    viewProjMatrix.setPerspective(30.0, canvas.width/canvas.height, 1.0, 100.0);
    // 视图矩阵 眼睛 或者相机
    viewProjMatrix.lookAt(0.0, 0.0, 15.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);
  
    // Start drawing
    var currentAngle = 0.0; // Current rotation angle (degrees)
    var tick = function() {
      // 角度
      currentAngle = animate(currentAngle);  // Update current rotation angle
  
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear color and depth buffers

      // Draw a cube in single color
      // 用一种颜色画一个立方体
      drawSolidCube(gl, solidProgram, cube, -2.0, currentAngle, viewProjMatrix);

      // Draw a cube with texture
      //绘制带有纹理的立方体
      drawTexCube(gl, texProgram, cube, texture, 2.0, currentAngle, viewProjMatrix);
  
      window.requestAnimationFrame(tick, canvas);
    };
    tick();
  }
  
  // 初始化buffer
  function initVertexBuffers(gl) {
    // Create a cube
    //    v6----- v5
    //   /|      /|
    //  v1------v0|
    //  | |     | |
    //  | |v7---|-|v4
    //  |/      |/
    //  v2------v3
  
    var vertices = new Float32Array([   // Vertex coordinates
       1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0,    // v0-v1-v2-v3 front
       1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0,    // v0-v3-v4-v5 right
       1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0,    // v0-v5-v6-v1 up
      -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0,    // v1-v6-v7-v2 left
      -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0,    // v7-v4-v3-v2 down
       1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0     // v4-v7-v6-v5 back
    ]);
  
    var normals = new Float32Array([   // Normal
       0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,     // v0-v1-v2-v3 front
       1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,     // v0-v3-v4-v5 right
       0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,     // v0-v5-v6-v1 up
      -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,     // v1-v6-v7-v2 left
       0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,     // v7-v4-v3-v2 down
       0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0      // v4-v7-v6-v5 back
    ]);
  
    var texCoords = new Float32Array([   // Texture coordinates
       1.0, 1.0,   0.0, 1.0,   0.0, 0.0,   1.0, 0.0,    // v0-v1-v2-v3 front
       0.0, 1.0,   0.0, 0.0,   1.0, 0.0,   1.0, 1.0,    // v0-v3-v4-v5 right
       1.0, 0.0,   1.0, 1.0,   0.0, 1.0,   0.0, 0.0,    // v0-v5-v6-v1 up
       1.0, 1.0,   0.0, 1.0,   0.0, 0.0,   1.0, 0.0,    // v1-v6-v7-v2 left
       0.0, 0.0,   1.0, 0.0,   1.0, 1.0,   0.0, 1.0,    // v7-v4-v3-v2 down
       0.0, 0.0,   1.0, 0.0,   1.0, 1.0,   0.0, 1.0     // v4-v7-v6-v5 back
    ]);
  
    var indices = new Uint8Array([        // Indices of the vertices
       0, 1, 2,   0, 2, 3,    // front
       4, 5, 6,   4, 6, 7,    // right
       8, 9,10,   8,10,11,    // up
      12,13,14,  12,14,15,    // left
      16,17,18,  16,18,19,    // down
      20,21,22,  20,22,23     // back
    ]);
  
    var o = new Object(); // Utilize Object to to return multiple buffer objects together
  
    // Write vertex information to buffer object
    // 初始化 顶点 buffer
    o.vertexBuffer = initArrayBufferForLaterUse(gl, vertices, 3, gl.FLOAT);
    // 初始化 法线 buffer
    o.normalBuffer = initArrayBufferForLaterUse(gl, normals, 3, gl.FLOAT);
     // 初始化 贴图 buffer
    o.texCoordBuffer = initArrayBufferForLaterUse(gl, texCoords, 2, gl.FLOAT);
    // 初始化 顶点数据索引 buffer
    o.indexBuffer = initElementArrayBufferForLaterUse(gl, indices, gl.UNSIGNED_BYTE);
    if (!o.vertexBuffer || !o.normalBuffer || !o.texCoordBuffer || !o.indexBuffer) return null; 
  
    o.numIndices = indices.length;
  
    // 绑定buffer
    // Unbind the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  
    return o;
  }
  
  // 初始化贴图
  function initTextures(gl, program) {
    // 创建纹理
    var texture = gl.createTexture();   // Create a texture object
    if (!texture) {
      console.log('Failed to create the texture object');
      return null;
    }
  
    // 加载图片
    var image = new Image();  // Create a image object
    if (!image) {
      console.log('Failed to create the image object');
      return null;
    }
    // Register the event handler to be called when image loading is completed
    image.onload = function() {
      // 设置vu贴图
      // Write the image data to texture object
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);  // Flip the image Y coordinate
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  
      // Pass the texure unit 0 to u_Sampler
      //将纹理单位0传递给u Sampler
      gl.useProgram(program);
      gl.uniform1i(program.u_Sampler, 0);
  
      // 绑定贴图
      gl.bindTexture(gl.TEXTURE_2D, null); // Unbind texture
    };
  
    // Tell the browser to load an Image
    image.src = orange;
  
    return texture;
  }
  
  function drawSolidCube(gl, program, o, x, angle, viewProjMatrix) {
    // 告诉这个程序对象被使用了
    gl.useProgram(program);   // Tell that this program object is used
  
    // Assign the buffer objects and enable the assignment
    //分配缓冲区对象并启用分配
      //分配缓冲区对象并启用分配 告诉显卡数据配置
    initAttributeVariable(gl, program.a_Position, o.vertexBuffer); // Vertex coordinates

      //分配缓冲区对象并启用分配 告诉显卡数据配置
    initAttributeVariable(gl, program.a_Normal, o.normalBuffer);   // Normal

    // 绑定buffer
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, o.indexBuffer);  // Bind indices
  
    // 绘画
    drawCube(gl, program, o, x, angle, viewProjMatrix);   // Draw
  }
  
  function drawTexCube(gl, program, o, texture, x, angle, viewProjMatrix) {
    gl.useProgram(program);   // Tell that this program object is used
  
    // Assign the buffer objects and enable the assignment
    initAttributeVariable(gl, program.a_Position, o.vertexBuffer);  // Vertex coordinates
    initAttributeVariable(gl, program.a_Normal, o.normalBuffer);    // Normal
    initAttributeVariable(gl, program.a_TexCoord, o.texCoordBuffer);// Texture coordinates
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, o.indexBuffer); // Bind indices
  
    // Bind texture object to texture unit 0
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
  
    drawCube(gl, program, o, x, angle, viewProjMatrix); // Draw
  }
  
  // Assign the buffer objects and enable the assignment
  //分配缓冲区对象并启用分配 告诉显卡数据配置
  function initAttributeVariable(gl, a_attribute, buffer) {

      // 连接a_Position变量与分配给他的缓冲区对象
  /*
     
     告诉显卡从当前绑定的缓冲区（bindBuffer() 指定的缓冲区）中读取顶点数据。
     方法绑定当前缓冲区范围到gl.ARRAY_BUFFER,
     成为当前顶点缓冲区对象的通用顶点属性并指定它的布局 (缓冲区对象中的偏移量)。

      
  gl.vertexAttribPointer(
    a_Position, // 变量 指定要修改的顶点属性的索引。
    2, // size 三个数据为一组 告诉三个点位一组颜色  1, 2, 3, or 4. 指定每个顶点属性的组成数量，必须是 1，2，3 或 4。
    gl.FLOAT, //type gl.FLOAT: 32-bit IEEE floating point number 32 位 IEEE 标准的浮点数
    false, // normalized 当转换为浮点数时是否应该将整数数值归一化到特定的范围。
    0, // stride 以字节为单位指定连续顶点属性开始之间的偏移量 (即数组中一行长度)。不能大于 255。如果 stride 为 0，则假定该属性是紧密打包的，即不交错属性，每个属性在一个单独的块中，下一个顶点的属性紧跟当前顶点之后。
    0 //offset 指定顶点属性数组中第一部分的字节偏移量。必须是类型的字节长度的倍数。
  ); //  告诉gl如何解析数据

  // 确认 // 启用数据
  // 连接a_Position变量与分配给他的缓冲区对象
  gl.enableVertexAttribArray(a_Position);

  // 画图
  // gl.drawArrays(gl.TRIANGLES, 0, 3);
  gl.drawArrays(gl.POINTS, 0, 3);
  */


    // 绑定buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    // 
    gl.vertexAttribPointer(
          a_attribute,  // 变量 指定要修改的顶点属性的索引。
          buffer.num,  // size 三个数据为一组 告诉三个点位一组颜色  1, 2, 3, or 4. 指定每个顶点属性的组成数量，必须是 1，2，3 或 4。
          buffer.type,  //type gl.FLOAT: 32-bit IEEE floating point number 32 位 IEEE 标准的浮点数
          false,  // normalized 当转换为浮点数时是否应该将整数数值归一化到特定的范围。
          0,   // stride 以字节为单位指定连续顶点属性开始之间的偏移量 (即数组中一行长度)。不能大于 255。如果 stride 为 0，则假定该属性是紧密打包的，即不交错属性，每个属性在一个单独的块中，下一个顶点的属性紧跟当前顶点之后。
          0 //offset 指定顶点属性数组中第一部分的字节偏移量。必须是类型的字节长度的倍数。
        ); //  告诉gl如何解析数据
      // 确认 // 启用数据
      // 连接a_Position变量与分配给他的缓冲区对象   
    gl.enableVertexAttribArray(a_attribute);
  }
  
  // Coordinate transformation matrix
  var g_modelMatrix = new Matrix4();
  var g_mvpMatrix = new Matrix4();
  var g_normalMatrix = new Matrix4();
  
  function drawCube(gl, program, o, x, angle, viewProjMatrix) {
    // Calculate a model matrix
    //计算一个模型矩阵 模型矩阵
    g_modelMatrix.setTranslate(x, 0.0, 0.0);
    g_modelMatrix.rotate(20.0, 1.0, 0.0, 0.0);
    g_modelMatrix.rotate(angle, 0.0, 1.0, 0.0);
  
    // Calculate transformation matrix for normals and pass it to u_NormalMatrix
    // 模型的逆矩阵等于法线矩阵 
    // 法线矩阵 = 模型矩阵的逆矩阵的转置
    g_normalMatrix.setInverseOf(g_modelMatrix);
    // 转矩矩阵
    g_normalMatrix.transpose();

      /*
          模型 矩阵 逆矩阵
          转置矩阵  这样做法是为啦 让 模型变动的时候  法向量 得到纠正

          法线矩阵 = 转置矩阵 * (逆矩阵 * 模型矩阵)  这样做的目的为了矫正法向量 不正确问题
      */ 
     
    // 设置法线矩阵
    gl.uniformMatrix4fv(program.u_NormalMatrix, false, g_normalMatrix.elements);
  
    // Calculate model view projection matrix and pass it to u_MvpMatrix
    //计算模型视图投影矩阵并将其传递给u_MvpMatrix

    // 模型矩阵与视图矩阵相乘
    g_mvpMatrix.set(viewProjMatrix);
    g_mvpMatrix.multiply(g_modelMatrix);


    gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);
  
    // 绘画 
    gl.drawElements(gl.TRIANGLES, o.numIndices, o.indexBuffer.type, 0);   // Draw
  }
  
  function initArrayBufferForLaterUse(gl, data, num, type) {
    // 创建buffer
    var buffer = gl.createBuffer();   // Create a buffer object
    if (!buffer) {
      console.log('Failed to create the buffer object');
      return null;
    }
    // 绑定buffer
    // Write date into the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    // 往buffer 填充数据
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  
    // Keep the information necessary to assign to the attribute variable later
    buffer.num = num;
    buffer.type = type;
  
    return buffer;
  }
  
  function initElementArrayBufferForLaterUse(gl, data, type) {
    var buffer = gl.createBuffer();  // Create a buffer object
    if (!buffer) {
      console.log('Failed to create the buffer object');
      return null;
    }
    // Write date into the buffer object
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
  
    buffer.type = type;
  
    return buffer;
  }
  
  var ANGLE_STEP = 30;   // The increments of rotation angle (degrees)
  
  var last = Date.now(); // Last time that this function was called

  // 获取 角度
  function animate(angle) {
    var now = Date.now();   // Calculate the elapsed time
    var elapsed = now - last;
    last = now;
    // Update the current rotation angle (adjusted by the elapsed time)
    var newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
    return newAngle % 360;
  }
  
  
  main();
};
