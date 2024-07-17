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
import sky  from "@/assets/image/sky.jpg";
import numbers  from "static/resources/numbers.png";
 

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

 
  // 加载shader
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
  
    // Set the clear color
    gl.clearColor(0, 0, 0, 1);
  
    // Set texture
    if (!initTextures(gl, n)) {
      console.log('Failed to intialize the texture.');
      return;
    }
  }
  
  // 初始化顶点缓冲区
  function initVertexBuffers(gl) {
    // 顶点位置
    var verticesTexCoords = new Float32Array([
       // 顶点坐标          纹理
      -1,  0.05,   0.0, 1.0,
      -1, -0.05,   0.0, 0.0,
       1.0,  0.05,   1.0, 1.0,
       1.0, -0.05,   1.0, 0.0,
    ]);

    var n = 4; // The number of vertices
  
    // Create a buffer object
    // 创建buffer
    var vertexTexCoordBuffer = gl.createBuffer();
    if (!vertexTexCoordBuffer) {
      console.log('Failed to create a buffer object');
      return -1;
    }
  
    // Write vertex information to buffer object
    // 写入顶点信息到缓冲对象
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);
  
    var FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;
    // 获取顶点位置地址
    var a_Position = gl.getAttribLocation(program, 'a_Position');
    if (a_Position < 0) {
      console.log('Failed to get the storage location of a_Position');
      return -1;
    }
    // 4个顶点为一组的数据
      /*
     
     告诉显卡从当前绑定的缓冲区（bindBuffer() 指定的缓冲区）中读取顶点数据。
     方法绑定当前缓冲区范围到gl.ARRAY_BUFFER,
     成为当前顶点缓冲区对象的通用顶点属性并指定它的布局 (缓冲区对象中的偏移量)。

     */
    gl.vertexAttribPointer(
           // 顶点数据
            a_Position,
            2,  // 2 个数据为一组
            gl.FLOAT,
            false,
            FSIZE * 4,
            // 从0开始
            0
    );

  // 确认 // 启用数据
  // 连接a_Position变量与分配给他的缓冲区对象
    gl.enableVertexAttribArray(a_Position);
  
    // Set texture
    //  获取 纹理贴图 shader地址
    //获取a_TexCoord的存储位置 用来存放纹理的 和 texture2D 配合使用
    var a_TexCoord = gl.getAttribLocation(program, 'a_TexCoord');

    if (a_TexCoord < 0) {
      console.log('Failed to get the storage location of a_TexCoord');
      return -1;
    }
  
  /*
     
     告诉显卡从当前绑定的缓冲区（bindBuffer() 指定的缓冲区）中读取顶点数据。
     方法绑定当前缓冲区范围到gl.ARRAY_BUFFER,
     成为当前顶点缓冲区对象的通用顶点属性并指定它的布局 (缓冲区对象中的偏移量)。

     */
    gl.vertexAttribPointer(
        //  纹理
          a_TexCoord,
          2, // 2个一组数据
          gl.FLOAT,
          false, 
          FSIZE * 4, 
          FSIZE * 2  // 索引从2开始
      );

  // 确认 // 启用数据
  // 连接a_Position变量与分配给他的缓冲区对象
    gl.enableVertexAttribArray(a_TexCoord);
  
    return n;
  }
  
  function initTextures(gl, n) {
    // 创建纹理
    // Create a texture
    var texture = gl.createTexture();
    if (!texture) {
      console.log('Failed to create a texture');
      return false;
    }
  
    // Get the storage location of u_Sampler
    // 获取纹理变量的Uniform 地址
    var u_Sampler = gl.getUniformLocation(program, 'u_Sampler');
    if (!u_Sampler) {
      console.log('Failed to get the storage location of u_Sampler');
      return false;
    }
  
    // Create the image object
    // 创建图像对象
    var image = new Image();
    if (!image) {
      console.log('Failed to create the image object');
      return false;
    }
    // Register the event handler to be called when image loading is completed
    //注册事件处理程序，当图像加载完成时调用
    // 加载图片
    image.onload = function(){ 
      loadTexture(gl, n, texture, u_Sampler, image); 
    };
    // Tell the browser to load an Image
    image.src = numbers;
  
    return true;
  }
  
  // 加载纹理
  function loadTexture(gl, n, texture, u_Sampler, image) {
      // 翻转图片的Y轴,默认是不翻转
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);  // Flip the image Y coordinate
    // Activate texture unit0
    gl.activeTexture(gl.TEXTURE0);
    // Bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture);
  
    // Set texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // Set the image to texture
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    
    // Pass the texure unit 0 to u_Sampler
    // 将纹理单位0传递给u_Sampler
    // 设置纹理 地址 索引为0 如果是多个纹理合并这里要改变他的值
    gl.uniform1i(u_Sampler, 0);
    
    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
  
    // Draw a rectangle
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
  }
 
   
   main(); 
};
