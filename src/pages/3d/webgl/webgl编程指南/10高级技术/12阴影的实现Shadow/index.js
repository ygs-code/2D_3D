import initShaders from "@/pages/3d/utils/initShader";
import {resizeCanvasToDisplaySize} from "@/pages/3d/utils/webgl-utils.js";
// import m4 from "./m4";
import FSHADER_SOURCE from "./index.frag";
import VSHADER_SOURCE from "./index.vert";
import SHADOW_FSHADER_SOURCE from "./show.frag";
import SHADOW_VSHADER_SOURCE from "./show.vert";

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




var OFFSCREEN_WIDTH = 2048, OFFSCREEN_HEIGHT = 2048;
var LIGHT_X = 0, LIGHT_Y = 7, LIGHT_Z = 2; // Position of the light source

function main() {
   



  // Initialize shaders for generating a shadow map
  // 初始化着色器以生成阴影贴图
  var shadowProgram = initShaders(gl, SHADOW_VSHADER_SOURCE, SHADOW_FSHADER_SOURCE);

  // 阴影顶点
  shadowProgram.a_Position = gl.getAttribLocation(shadowProgram, 'a_Position');
  // 阴影矩阵 
  shadowProgram.u_MvpMatrix = gl.getUniformLocation(shadowProgram, 'u_MvpMatrix');

  if (shadowProgram.a_Position < 0 || !shadowProgram.u_MvpMatrix) {
    console.log('Failed to get the storage location of attribute or uniform variable from shadowProgram'); 
    return;
  }


  // Initialize shaders for regular drawing
  //为常规绘图初始化着色器
  var normalProgram = initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
  // 模型顶点位置
  normalProgram.a_Position = gl.getAttribLocation(normalProgram, 'a_Position');
  // 模型颜色
  normalProgram.a_Color = gl.getAttribLocation(normalProgram, 'a_Color');
  // mvp 矩阵
  normalProgram.u_MvpMatrix = gl.getUniformLocation(normalProgram, 'u_MvpMatrix');
  // mvp 光
  normalProgram.u_MvpMatrixFromLight = gl.getUniformLocation(normalProgram, 'u_MvpMatrixFromLight');
 // 阴影
  normalProgram.u_ShadowMap = gl.getUniformLocation(normalProgram, 'u_ShadowMap');

  if (normalProgram.a_Position < 0 || normalProgram.a_Color < 0 || !normalProgram.u_MvpMatrix ||
      !normalProgram.u_MvpMatrixFromLight || !normalProgram.u_ShadowMap) {
    console.log('Failed to get the storage location of attribute or uniform variable from normalProgram'); 
    return;
  }

  // Set the vertex information
  // 设置顶点信息
  var triangle = initVertexBuffersForTriangle(gl);

 // 初始化顶点信息
  var plane = initVertexBuffersForPlane(gl);
  if (!triangle || !plane) {
    console.log('Failed to set the vertex information');
    return;
  }

  // Initialize framebuffer object (FBO)  
  // 初始化framebuffer对象
  var fbo = initFramebufferObject(gl);


  if (!fbo) {
    console.log('Failed to initialize frame buffer object');
    return;
  }
  // 激活纹理
  gl.activeTexture(gl.TEXTURE0); // Set a texture object to the texture unit

  // 绑定纹理
  gl.bindTexture(gl.TEXTURE_2D, fbo.texture);

  // Set the clear color and enable the depth test
  gl.clearColor(0, 0, 0, 1);
  gl.enable(gl.DEPTH_TEST);

  //  光mvp 矩阵
  var viewProjMatrixFromLight = new Matrix4(); // Prepare a view projection matrix for generating a shadow map
  // 投影
  viewProjMatrixFromLight.setPerspective(70.0, OFFSCREEN_WIDTH/OFFSCREEN_HEIGHT, 1.0, 100.0);
    // 相机
  viewProjMatrixFromLight.lookAt(LIGHT_X, LIGHT_Y, LIGHT_Z, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);

  // 图形mvp矩阵
  var viewProjMatrix = new Matrix4();          // Prepare a view projection matrix for regular drawing
  // 投影
  viewProjMatrix.setPerspective(45, canvas.width/canvas.height, 1.0, 100.0);
  // 相机
  viewProjMatrix.lookAt(0.0, 7.0, 9.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);

  // 旋转角度
  var currentAngle = 0.0; // Current rotation angle (degrees)

   // A model view projection matrix from light source (for triangle)
   //从光源(对于三角形)得到的模型视图投影矩阵
  var mvpMatrixFromLight_t = new Matrix4();

  //来自光源的模型视图投影矩阵(对于平面)
  var mvpMatrixFromLight_p = new Matrix4();
 
  var tick = function() {
    currentAngle = animate(currentAngle);

    // 将绘图目标更改为FBO
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);               // Change the drawing destination to FBO
    gl.viewport(0, 0, OFFSCREEN_HEIGHT, OFFSCREEN_HEIGHT); // Set view port for FBO
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);   // Clear FBO    

    // 设置生成阴影贴图的着色器
    gl.useProgram(shadowProgram); // Set shaders for generating a shadow map


    // Draw the triangle and the plane (for generating a shadow map)
    // 绘制三角形和平面(用于生成阴影贴图)
    drawTriangle(
      // gl对象
      gl, 
      // 阴影 shader
      shadowProgram, 
      //阴影 顶点信息
      triangle, 
      // 旋转角度
      currentAngle,
       // 变换矩阵 
      viewProjMatrixFromLight
    );

    mvpMatrixFromLight_t.set(g_mvpMatrix); // Used later
   // 绘制平面
    drawPlane(gl, shadowProgram, plane, viewProjMatrixFromLight);

    mvpMatrixFromLight_p.set(g_mvpMatrix); // Used later

    // 将绘图目标更改为颜色缓冲区
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);               // Change the drawing destination to color buffer
    gl.viewport(0, 0, canvas.width, canvas.height);
    // 清晰的颜色和深度缓冲
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);    // Clear color and depth buffer

    // 为常规绘图设置着色器
    gl.useProgram(normalProgram); // Set the shader for regular drawing
    // 设置为0是因为gl.TEXTURE0已启用
    gl.uniform1i(normalProgram.u_ShadowMap, 0);  // Pass 0 because gl.TEXTURE0 is enabledする
    // Draw the triangle and plane ( for regular drawing)
    // 绘制三角形和平面(用于正图)
    gl.uniformMatrix4fv(normalProgram.u_MvpMatrixFromLight, false, mvpMatrixFromLight_t.elements);
 
    // 绘制三角形和平面(用于生成阴影贴图)
    drawTriangle(gl, normalProgram, triangle, currentAngle, viewProjMatrix);

    gl.uniformMatrix4fv(normalProgram.u_MvpMatrixFromLight, false, mvpMatrixFromLight_p.elements);

    // 绘制平面
    drawPlane(gl, normalProgram, plane, viewProjMatrix);

    window.requestAnimationFrame(tick, canvas);
  };
  tick(); 
}

// Coordinate transformation matrix
var g_modelMatrix = new Matrix4();
var g_mvpMatrix = new Matrix4();


 


function drawTriangle(
        // gl对象
        gl,
        // 阴影 shader
        program, 
        // 顶点信息
        triangle, 
        // 旋转角度
        angle, 
        // 变换矩阵
        viewProjMatrix
) {
  // Set rotate angle to model matrix and draw triangle
  g_modelMatrix.setRotate(angle, 0, 1, 0);
  draw(
      // gl对象
      gl,
      // 阴影 shader
      program,
      // 顶点信息
      triangle,
      // 变换矩阵
      viewProjMatrix
    );
}
// 绘制 平面
function drawPlane(gl, program, plane, viewProjMatrix) {
  // Set rotate angle to model matrix and draw plane
  // 设置旋转角度来建模矩阵并绘制平面
  g_modelMatrix.setRotate(-45, 0, 1, 1);
  draw(gl, program, plane, viewProjMatrix);
}

// 绘制
function draw(
        // gl对象
        gl,
        // 阴影 shader
        program,
        // 顶点信息
        o, 
        // 变换矩阵
        viewProjMatrix
) {
  // 分配缓冲区对象并启用分配
  initAttributeVariable(gl, program.a_Position, o.vertexBuffer);

  if (program.a_Color != undefined) {
     // If a_Color is defined to attribute
    //  如果a_Color定义为attribute
    initAttributeVariable(gl, program.a_Color, o.colorBuffer);
  }
   

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, o.indexBuffer);

  // Calculate the model view project matrix and pass it to u_MvpMatrix
  // 计算模型视图项目矩阵并将其传递给u_MvpMatrix
  g_mvpMatrix.set(viewProjMatrix);
  g_mvpMatrix.multiply(g_modelMatrix);
  gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);

  // 绘制图形
  gl.drawElements(gl.TRIANGLES, o.numIndices, gl.UNSIGNED_BYTE, 0);

}

// Assign the buffer objects and enable the assignment
// 分配缓冲区对象并启用分配
function initAttributeVariable(gl, a_attribute, buffer) {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.vertexAttribPointer(a_attribute, buffer.num, buffer.type, false, 0, 0);
  gl.enableVertexAttribArray(a_attribute);
}

// 初始化顶点位置
function initVertexBuffersForPlane(gl) {
  // Create a plane
  //  v1------v0
  //  |        | 
  //  |        |
  //  |        |
  //  v2------v3

  // Vertex coordinates
  // 模型顶点位置信息
  var vertices = new Float32Array([
     3.0, -1.7, 2.5,  
    -3.0, -1.7, 2.5, 
    -3.0, -1.7, -2.5, 
     3.0, -1.7, -2.5    // v0-v1-v2-v3
  ]);

  // Colors
  // 颜色
  var colors = new Float32Array([
        1.0, 1.0, 1.0,   
        1.0, 1.0, 1.0, 
        1.0, 1.0, 1.0, 
        1.0, 1.0, 1.0
  ]);

  // Indices of the vertices
  // 数据组索引
  var indices = new Uint8Array([
            0, 1, 2,  
            0, 2, 3
    ]);

  var o = new Object(); // Utilize Object object to return multiple buffer objects together
  // 利用Object对象一起返回多个缓冲区对象
  // Write vertex information to buffer object
  // 初始化顶点buffer
  o.vertexBuffer = initArrayBufferForLaterUse(gl, vertices, 3, gl.FLOAT);
  // 初始化颜色buffer
  o.colorBuffer = initArrayBufferForLaterUse(gl, colors, 3, gl.FLOAT);
  // 初始化索引buffer
  o.indexBuffer = initElementArrayBufferForLaterUse(gl, indices, gl.UNSIGNED_BYTE);
  if (!o.vertexBuffer || !o.colorBuffer || !o.indexBuffer) return null; 

  o.numIndices = indices.length;

  // Unbind the buffer object
  // 解绑buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  return o;
}

// 初始化顶点信息
function initVertexBuffersForTriangle(gl) {
  // Create a triangle
  //       v2
  //      / | 
  //     /  |
  //    /   |
  //  v0----v1

  // Vertex coordinates
  // 顶点坐标
  var vertices = new Float32Array([
    -0.8, 3.5, 0.0, 
     0.8, 3.5, 0.0, 
      0.0, 3.5, 1.8
    ]);
  // Colors
  // 颜色
  var colors = new Float32Array([
      1.0, 0.5, 0.0, 
      1.0, 0.5, 0.0, 
      1.0, 0.0, 0.0
    ]);    
  // Indices of the vertices
  var indices = new Uint8Array([0, 1, 2]);

  var o = new Object();  // Utilize Object object to return multiple buffer objects together

  // Write vertex information to buffer object
  // 写入顶点信息到缓冲对象
  // 初始化顶点 buffer
  o.vertexBuffer = initArrayBufferForLaterUse(gl, vertices, 3, gl.FLOAT);
  // 初始化 颜色 buffer
  o.colorBuffer = initArrayBufferForLaterUse(gl, colors, 3, gl.FLOAT);
  // 初始化索引buffer
  o.indexBuffer = initElementArrayBufferForLaterUse(gl, indices, gl.UNSIGNED_BYTE);

  if (!o.vertexBuffer || !o.colorBuffer || !o.indexBuffer) return null; 

  o.numIndices = indices.length;

  // Unbind the buffer object
  // 解绑buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  return o;
}

// 初始化buffer
function initArrayBufferForLaterUse(gl, data, num, type) {
  // Create a buffer object
  // 创建buffer
  var buffer = gl.createBuffer();
  if (!buffer) {
    console.log('Failed to create the buffer object');
    return null;
  }
  // Write date into the buffer object
  // 绑定buffer 和 写入 buffer 数据
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

  // Store the necessary information to assign the object to the attribute variable later
  // 存储必要的信息，以便稍后将对象分配给属性变量
  // buffer 一些信息
  buffer.num = num;
  buffer.type = type;

  return buffer;
}

function initElementArrayBufferForLaterUse(gl, data, type) {
  // Create a buffer object
  var buffer = gl.createBuffer();
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

// 创建一个帧缓冲区对象
function initFramebufferObject(gl) {
  var framebuffer, texture, depthBuffer;

  // Define the error handling function
  var error = function() {
    if (framebuffer) gl.deleteFramebuffer(framebuffer);
    if (texture) gl.deleteTexture(texture);
    if (depthBuffer) gl.deleteRenderbuffer(depthBuffer);
    return null;
  }

  // Create a framebuffer object (FBO)
  // 创建离线存储 buffer
  framebuffer = gl.createFramebuffer();
  if (!framebuffer) {
    console.log('Failed to create frame buffer object');
    return error();
  }

  // Create a texture object and set its size and parameters
  // 创建一个纹理对象并设置其大小和参数
  texture = gl.createTexture(); // Create a texture object
  if (!texture) {
    console.log('Failed to create texture object');
    return error();
  }
  // 2d 贴图
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  // Create a renderbuffer object and Set its size and parameters
  // 创建一个renderbuffer对象并设置其大小和参数
  depthBuffer = gl.createRenderbuffer(); // Create a renderbuffer object
  // 创建一个renderbuffer对象
  if (!depthBuffer) {
    console.log('Failed to create renderbuffer object');
    return error();
  }
  //绑定渲染缓冲区
  gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
  // 设置渲染缓冲区尺寸
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT);

  // Attach the texture and the renderbuffer object to the FBO
  // 绑定帧缓冲区
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  // 纹理对象关联到帧缓冲区对象
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
  // 将渲染缓冲区对象关联到帧缓冲区对象
  gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);

  // Check if FBO is configured correctly
  // 检查帧缓冲区的配置
  var e = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
  if (gl.FRAMEBUFFER_COMPLETE !== e) {
    console.log('Frame buffer object is incomplete: ' + e.toString());
    return error();
  }

  framebuffer.texture = texture; // keep the required object

  // Unbind the buffer object
  // 解绑缓冲区
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.bindTexture(gl.TEXTURE_2D, null);
  gl.bindRenderbuffer(gl.RENDERBUFFER, null);

  return framebuffer;
}

var ANGLE_STEP = 40;   // The increments of rotation angle (degrees)

var last = Date.now(); // Last time that this function was called
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
