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
import sky_cloud from "static/image/sky_cloud.jpeg";
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


// Size of off screen
var OFFSCREEN_WIDTH = 256;
var OFFSCREEN_HEIGHT = 256;

function main() {


  // Get the storage location of attribute variables and uniform variables
  // 获取属性变量和统一变量的存储位置
  program.a_Position = gl.getAttribLocation(program, 'a_Position');
  program.a_TexCoord = gl.getAttribLocation(program, 'a_TexCoord');
  program.u_MvpMatrix = gl.getUniformLocation(program, 'u_MvpMatrix');
  if (program.a_Position < 0 || program.a_TexCoord < 0 || !program.u_MvpMatrix) {
    console.log('Failed to get the storage location of a_Position, a_TexCoord, u_MvpMatrix');
    return;
  }

  // Set the vertex information
  //正方六面体 定点位置
  var cube = initVertexBuffersForCube(gl);

  //  正方形 矩形 定点位置
  var plane = initVertexBuffersForPlane(gl);

  if (!cube || !plane) {
    console.log('Failed to set the vertex information');
    return;
  }

  // Set texture //初始化图片纹理 
  var texture = initTextures(gl);

  if (!texture) {
    console.log('Failed to intialize the texture.');
    return;
  }

  // Initialize framebuffer object (FBO)
  //  初始化Framebuffer对象
  var fbo = initFramebufferObject(gl);
  
  if (!fbo) {
    console.log('Failed to intialize the framebuffer object (FBO)');
    return;
  }

  // Enable depth test
  // 开启深度测试
  gl.enable(gl.DEPTH_TEST);   //  gl.enable(gl.CULL_FACE);
  // 为颜色缓冲准备视图投影矩阵 透视投影
  var viewProjMatrix = new Matrix4();   // Prepare view projection matrix for color buffer
  // 投影参数设置
  viewProjMatrix.setPerspective(30, canvas.width/canvas.height, 1.0, 100.0);
  // 视图矩阵
  viewProjMatrix.lookAt(0.0, 0.0, 7.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);

   // Prepare view projection matrix for FBO
  //  准备FBO视图投影矩阵
  var viewProjMatrixFBO = new Matrix4();  
  // FBO 透视投影
  viewProjMatrixFBO.setPerspective(30.0, OFFSCREEN_WIDTH/OFFSCREEN_HEIGHT, 1.0, 100.0);
  // FBO 相机
  viewProjMatrixFBO.lookAt(0.0, 2.0, 7.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);

  // Start drawing
  var currentAngle = 0.0; // Current rotation angle (degrees)
  // /当前旋转角度(度)
  var tick = function() {
    // Update current rotation angle
    // 更新当前旋转角度
    currentAngle = animate(currentAngle);  

    draw(
        gl,  // gl对象
        canvas, // canvas 画布
        fbo,  // fob 缓存对象
        plane, // 正方形矩形定点位置信息
        cube, // 正方六面体体定点位置信息
        currentAngle, // 当前角度
        texture,  // 图像纹理对象 
        viewProjMatrix,  // 视图投影矩阵
        viewProjMatrixFBO // 视图投影 fbo矩阵
       );

    window.requestAnimationFrame(tick, canvas);
  };
  tick();
}

// 正方形定点位置
function initVertexBuffersForCube(gl) {
  // Create a cube
  //    v6----- v5
  //   /|      /|
  //  v1------v0|
  //  | |     | |
  //  | |v7---|-|v4
  //  |/      |/
  //  v2------v3

  // Vertex coordinates
    //正方体定点位置
  var vertices = new Float32Array([
     1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0,    // v0-v1-v2-v3 front
     1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0,    // v0-v3-v4-v5 right
     1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0,    // v0-v5-v6-v1 up
    -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0,    // v1-v6-v7-v2 left
    -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0,    // v7-v4-v3-v2 down
     1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0     // v4-v7-v6-v5 back
  ]);

  // Texture coordinates 纹理定点
  var texCoords = new Float32Array([
      1.0, 1.0,   0.0, 1.0,   0.0, 0.0,   1.0, 0.0,    // v0-v1-v2-v3 front
      0.0, 1.0,   0.0, 0.0,   1.0, 0.0,   1.0, 1.0,    // v0-v3-v4-v5 right
      1.0, 0.0,   1.0, 1.0,   0.0, 1.0,   0.0, 0.0,    // v0-v5-v6-v1 up
      1.0, 1.0,   0.0, 1.0,   0.0, 0.0,   1.0, 0.0,    // v1-v6-v7-v2 left
      0.0, 0.0,   1.0, 0.0,   1.0, 1.0,   0.0, 1.0,    // v7-v4-v3-v2 down
      0.0, 0.0,   1.0, 0.0,   1.0, 1.0,   0.0, 1.0     // v4-v7-v6-v5 back
  ]);

  // Indices of the vertices
  // 顶点的指标
  var indices = new Uint8Array([
     0, 1, 2,   0, 2, 3,    // front
     4, 5, 6,   4, 6, 7,    // right
     8, 9,10,   8,10,11,    // up
    12,13,14,  12,14,15,    // left
    16,17,18,  16,18,19,    // down
    20,21,22,  20,22,23     // back
  ]);

  // 创建“Object”对象以返回多个对象。
  var o = new Object();  // Create the "Object" object to return multiple objects.

  // Write vertex information to buffer object
  // 绑定buffer 向buffer填充数据
  o.vertexBuffer = initArrayBufferForLaterUse(gl, vertices, 3, gl.FLOAT);
  // 绑定buffer 向buffer填充数据
  o.texCoordBuffer = initArrayBufferForLaterUse(gl, texCoords, 2, gl.FLOAT);
  // 绑定buffer 向buffer填充数据
  o.indexBuffer = initElementArrayBufferForLaterUse(gl, indices, gl.UNSIGNED_BYTE);
  if (!o.vertexBuffer || !o.texCoordBuffer || !o.indexBuffer) return null; 

  o.numIndices = indices.length;

  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  return o;
}

// 正方形定点位置
function initVertexBuffersForPlane(gl) {
   // 创建一个平面
  // Create face
  //  v1------v0
  //  |        | 
  //  |        |
  //  |        |
  //  v2------v3

  // Vertex coordinates 纹理
  var vertices = new Float32Array([
     1.0, 1.0, 0.0, 
     -1.0, 1.0, 0.0,  

     -1.0,-1.0, 0.0,  
     1.0,-1.0, 0.0    // v0-v1-v2-v3
  ]);

  // Texture coordinates
  // 纹理定点
  var texCoords = new Float32Array([
          1.0, 1.0,
          0.0, 1.0, 

          0.0, 0.0,  
          1.0, 0.0
        ]);

  // Indices of the vertices
  var indices = new Uint8Array([0, 1, 2,   0, 2, 3]);

  var o = new Object(); // Create the "Object" object to return multiple objects.

  // Write vertex information to buffer object
  // 绑定buffer 向buffer填充数据
  o.vertexBuffer = initArrayBufferForLaterUse(gl, vertices, 3, gl.FLOAT);
  // 绑定buffer 向buffer填充数据
  o.texCoordBuffer = initArrayBufferForLaterUse(gl, texCoords, 2, gl.FLOAT);
  // 绑定buffer 向buffer填充数据
  o.indexBuffer = initElementArrayBufferForLaterUse(gl, indices, gl.UNSIGNED_BYTE);
  if (!o.vertexBuffer || !o.texCoordBuffer || !o.indexBuffer) return null; 

  o.numIndices = indices.length;

  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  return o;
}

// 绑定buffer 向buffer填充数据
function initArrayBufferForLaterUse(gl, data, num, type) {
  // Create a buffer object
  var buffer = gl.createBuffer();
  if (!buffer) {
    console.log('Failed to create the buffer object');
    return null;
  }
  // 绑定buffer
  // Write date into the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  //向buffer填充数据
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

  //存储必要的信息，以便稍后将对象分配给属性变量
  // Store the necessary information to assign the object to the attribute variable later
  buffer.num = num;
  buffer.type = type;

  return buffer;
}

// 初始化元素数组缓冲区供以后使用
function initElementArrayBufferForLaterUse(gl, data, type) {
  // Create a buffer object 创建一个缓冲区对象
  var buffer = gl.createBuffer();
  if (!buffer) {
    console.log('Failed to create the buffer object');
    return null;
  }
  // Write data into the buffer object
  // 将数据写入缓冲区对象
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
  // 绑定数据到buffer缓存中
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);

  buffer.type = type;

  return buffer;
}


//初始化纹理
function initTextures(gl) {
  // 创建纹理
  var texture = gl.createTexture();   // Create a texture object
  if (!texture) {
    console.log('Failed to create the Texture object');
    return null;
  }

  // Get storage location of u_Sampler
  // 获取u Sampler的存储位置
  var u_Sampler = gl.getUniformLocation(program, 'u_Sampler');
  if (!u_Sampler) {
    console.log('Failed to get the storage location of u_Sampler');
    return null;
  }

  // 图片对象 Create image object
  var image = new Image();  // Create image object
  if (!image) {
    console.log('Failed to create the Image object');
    return null;
  }
  // Register the event handler to be called when image loading is completed
  // 注册要在图像加载完成时调用的事件处理程序
  image.onload = function() {
    // Write image data to texture object
    // 将图像数据写入纹理对象
    // 翻转图像的Y坐标
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);  // Flip the image Y coordinate
    // 绑定纹理
    gl.bindTexture(gl.TEXTURE_2D, texture);
   //设置纹理参数
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    //设置纹理图像
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    // Pass the texure unit 0 to u_Sampler
    //将纹理单位0传递给u Sampler
    gl.uniform1i(u_Sampler, 0);
    // 绑定纹理
    gl.bindTexture(gl.TEXTURE_2D, null); // Unbind the texture object
  };

  // Tell the browser to load an Image
  // 加载图片  
  image.src = sky_cloud ;

  return texture;
}
//  初始化Framebuffer对象
function initFramebufferObject(gl) {
  var framebuffer, texture, depthBuffer;

  // Define the error handling function
  var error = function() {
    if (framebuffer) gl.deleteFramebuffer(framebuffer);
    if (texture) gl.deleteTexture(texture);
    if (depthBuffer) gl.deleteRenderbuffer(depthBuffer);
    return null;
  };

  // Create a frame buffer object (FBO) 
  //   创建一个帧缓冲对象(FBO)
  framebuffer = gl.createFramebuffer();

  if (!framebuffer) {
    console.log('Failed to create frame buffer object');
    return error();
  }

  // Create a texture object and set its size and parameters
  // 创建一个纹理对象并设置其大小和参数
  // 创建纹理对象
  texture = gl.createTexture(); // Create a texture object
  if (!texture) {
    console.log('Failed to create texture object');
    return error();
  }
  // Bind the object to target
  // 将对象绑定到目标
   gl.bindTexture(gl.TEXTURE_2D, texture); 
    //设置纹理图像
    gl.texImage2D(
        gl.TEXTURE_2D, 
        0,
        gl.RGBA,
        OFFSCREEN_WIDTH, 
        OFFSCREEN_HEIGHT, 
        0, 
        gl.RGBA, 
        gl.UNSIGNED_BYTE, 
        null
    );
     //设置纹理参数  
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  
  // Store the texture object
  // 将对象绑定到目标
  framebuffer.texture = texture; 
  // Create a renderbuffer object and Set its size and parameters
  //创建一个renderbuffer对象并设置其大小和参数
  // 创建一个renderbuffer对象
  depthBuffer = gl.createRenderbuffer(); // Create a renderbuffer object
  if (!depthBuffer) {
    console.log('Failed to create renderbuffer object');
    return error();
  }
// Bind the object to target
// 将对象绑定到目标
  gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer); 
  // 创建渲染缓冲区对象
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT);

  // Attach the texture and the renderbuffer object to the FBO
  // 将纹理和renderbuffer对象附加到FBO上
  // 绑定渲染缓冲区对象并设置其尺寸
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

  // 将帧缓冲区的颜色关联对象指定为一个纹理对象
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
  // 将帧缓冲区的深度关联对象指定为一个渲染缓冲区对象
  gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);

  // Check if FBO is configured correctly
  // 检查FBO配置是否正确
  var e = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
  if (gl.FRAMEBUFFER_COMPLETE !== e) {
    console.log('Frame buffer object is incomplete: ' + e.toString());
    return error();
  }

  // Unbind the buffer object
  // 解除缓冲区对象的绑定
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);

  gl.bindTexture(gl.TEXTURE_2D, null);
// 将对象绑定到目标
  gl.bindRenderbuffer(gl.RENDERBUFFER, null);


  return framebuffer;
}




 
// 绘制
function draw(
          gl,   // gl 对象
          canvas, // canvas
          fbo,   // fbo 对象
          plane, // 正方形 矩形定点位置信息
          cube,  // 正方体 六面体定点位置信息
          angle, // 当前角度
          texture,  // 图片纹理对象
          viewProjMatrix,  // 视图投影
          viewProjMatrixFBO // fob视图投影
        ) {
  // Change the drawing destination to FBO

  // 将绘图目标更改为FBO 重点这里
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);      

   // Set a viewport for FBO
    // 为FBO设置一个视口
  gl.viewport(0, 0, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT);

  // Set clear color (the color is slightly changed)
 //  设置清色(颜色略有变化)
  gl.clearColor(0.2, 0.2, 0.4, 1.0); 
   // Clear FBO
   // 清除帧缓冲区中的颜色关联对象和深度关联对象（类似清除颜色缓冲区和深度缓冲区）
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 

   // Draw the cube
  //  绘制立方体
  drawTexturedCube(
          gl,   // gl对象
          program,  // program对象
          cube,  // cube 正方体
          angle,  // 角度
          texture, // 纹理对象
          viewProjMatrixFBO // 纹理缓存视图投影
    );  

    // Change the drawing destination to color buffer
    //将绘制目标更改为颜色缓冲区 重点这里
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);      
   // Set the size of viewport back to that of <canvas>
 //设置viewport的大小为<canvas>
  gl.viewport(0, 0, canvas.width, canvas.height);  

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
   // Clear the color buffer
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Draw the plane
    // 渲染正方形
  drawTexturedPlane(
        gl, // gl 对象
        program,  // program对象
        plane,   // 正方形定点位置信息
        angle,  // 旋转角度
        fbo.texture,  // fbo纹理信息
        viewProjMatrix  // 视图投影矩阵
     );
}

// Coordinate transformation matrix
var g_modelMatrix = new Matrix4();
var g_mvpMatrix = new Matrix4();

// Draw the cube
//  绘制立方体



// gl,   // gl对象
// program,  // program对象
// cube,  // cube 正方体
// angle,  // 角度
// texture, // 纹理对象
// viewProjMatrixFBO // 纹理缓存视图投影

function drawTexturedCube(
          gl,   // gl 对象
          program, // program对象
          o,    // cube 正方体
          angle,  // 角度
          texture, // 纹理对象
          viewProjMatrix  // 视图透视投影
     ) {
  // Calculate a model matrix
  // 模型转转
  g_modelMatrix.setRotate(20.0, 1.0, 0.0, 0.0);
  g_modelMatrix.rotate(angle, 0.0, 1.0, 0.0);

  // Calculate the model view project matrix and pass it to u_MvpMatrix
  // 设置投影
  g_mvpMatrix.set(viewProjMatrix);
  g_mvpMatrix.multiply(g_modelMatrix);
  gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);

  drawTexturedObject(
            gl,  // gl对象
            program,  // program对象
            o,  // 正方形纹理对象
            texture  // 纹理对象
      );
}


  // Draw the plane
  // 渲染正方形
function drawTexturedPlane(gl, program, o, angle, texture, viewProjMatrix) {
  // Calculate a model matrix
  // 偏移 
  g_modelMatrix.setTranslate(0, 0, 1);
  // 旋转
  g_modelMatrix.rotate(20.0, 1.0, 0.0, 0.0);
  g_modelMatrix.rotate(angle, 0.0, 1.0, 0.0);

  // Calculate the model view project matrix and pass it to u_MvpMatrix
  // 视图矩阵
  g_mvpMatrix.set(viewProjMatrix);
  g_mvpMatrix.multiply(g_modelMatrix);

  gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);

  drawTexturedObject(gl, program, o, texture);
}

function drawTexturedObject(gl, program, o, texture) {
  // Assign the buffer objects and enable the assignment
  //分配缓冲区对象并启用分配
  initAttributeVariable(gl, program.a_Position, o.vertexBuffer);    // Vertex coordinates

  // 分配缓冲区对象并启用分配
  initAttributeVariable(gl, program.a_TexCoord, o.texCoordBuffer);  // Texture coordinates

  // Bind the texture object to the target
  //将纹理对象绑定到目标
  // 激活纹理
  gl.activeTexture(gl.TEXTURE0);
  // 绑定纹理
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Draw
  // 渲染
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, o.indexBuffer);
  gl.drawElements(gl.TRIANGLES, o.numIndices, o.indexBuffer.type, 0);
}

// Assign the buffer objects and enable the assignment
// 分配缓冲区对象并启用分配
function initAttributeVariable(gl, a_attribute, buffer) {
  // 绑定buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  // 分配定点数据到显卡中
  gl.vertexAttribPointer(a_attribute, buffer.num, buffer.type, false, 0, 0);
  // 开启
  gl.enableVertexAttribArray(a_attribute);
}

// function drawTexturedCube2(gl, o, angle, texture, viewpProjMatrix, u_MvpMatrix) {
//   // Calculate a model matrix
//   g_modelMatrix.rotate(20.0, 1.0, 0.0, 0.0);
//   g_modelMatrix.rotate(angle, 0.0, 1.0, 0.0);
//   g_modelMatrix.scale(1, 1, 1);

//   // Calculate the model view project matrix and pass it to u_MvpMatrix
//   // g_mvpMatrix.set(vpMatrix);
//   g_mvpMatrix.multiply(g_modelMatrix);
//   gl.uniformMatrix4fv(u_MvpMatrix, false, g_mvpMatrix.elements);

//   drawTexturedObject(gl, o, texture);
// }

var ANGLE_STEP = 30;   // The increments of rotation angle (degrees)

var last = Date.now(); // Last time that this function was called
// 旋转动画
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
