import initShaders from "@/pages/3d/utils/initShader";
import {createBufferInfoFromArrays ,createProgramFromScripts, resizeCanvasToDisplaySize ,setUniforms, createProgramInfo ,setBuffersAndAttributes} from "@/pages/3d/utils/webgl-utils.js";
import FSHADER_SOURCE from "./index.frag";
import VSHADER_SOURCE from "./index.vert";
// import PICK_FSHADER_SOURCE from "./pick-fragment.frag";
// import PICK_VSHADER_SOURCE from "./pick-vertex.vert";
import {createHtmlMatrix} from "@/pages/3d/utils/matrix.js";
import primitives from "@/pages/3d/utils/primitives.js";
import m4 from "@/pages/3d/utils/m4";
import chroma from "@/pages/3d/utils/chroma.min";
import * as glMatrix from "gl-matrix";
import {makeInverse,makeLookAt,makeIdentity,makeXRotation,makeYRotation,makeTranslation,matrixMultiply,makePerspective} from "@/pages/3d/utils/webgl-3d-math.js";
import controller from "@/pages/3d/utils/controller.js";
import fTexture from "static/image/f-texture.png";
import leaves from "static/image/leaves.jpg";

import "./index.less";
// import "@/pages/index.less";
 

console.log('m4=======',m4);

 window.onload = function () {
  const canvas = document.createElement("canvas");
  canvas.width = 500;
  canvas.height = 500;
  // getWebGLContext(canvas);
  document.body.appendChild(canvas);

  if (!canvas.getContext) return;
  let gl = canvas.getContext("webgl");

  // 加载图片
  function main() {


    var image = new Image();
    image.src = leaves;  // MUST BE SAME DOMAIN!!!
    image.onload = function() {
      render(image);
    };
  }
  
  function render(image) {
    // Get A WebGL context
    // var canvas = document.getElementById("canvas");
    // var gl = getWebGLContext(canvas);
    // if (!gl) {
    //   return;
    // }
 
  
    // setup GLSL program
    // 添加shader
    var program = initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
    // gl.useProgram(program);
  
    // look up where the vertex data needs to go.
    // 获取shader 顶点位置地址
    var positionLocation = gl.getAttribLocation(program, "a_position");



    
    // 获取shader 贴图 地址
    var texCoordLocation = gl.getAttribLocation(program, "a_texCoord");
  
    // provide texture coordinates for the rectangle.
    // 创建buffer
    var texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        0.0,  0.0,
        1.0,  0.0,
        0.0,  1.0,

        0.0,  1.0,
        1.0,  0.0,
        1.0,  1.0

      ]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(texCoordLocation);
    // 2 数据为一组
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);
  
    // Create a texture.
    // 创建纹理
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
  
    // Set the parameters so we can render any size image.
    // 设置纹理参数 
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  
    // Upload the image into the texture.
    // 加载更新纹理
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  
    // lookup uniforms
    // 获取shader uninform 地址
    var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
  
    // set the resolution
    // 设置 resolution 值
    gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
  
    // Create a buffer for the position of the rectangle corners.
    // 为矩形角的位置创建一个缓冲区。
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    // 把顶点位置参数设置到显卡
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
  
    // Set a rectangle the same size as the image.
    // 设置一个与图像大小相同的矩形。
    setRectangle(gl, 0, 0, image.width, image.height);
  
    // Draw the rectangle.
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
  
  function randomInt(range) {
    return Math.floor(Math.random() * range);
  }
  
  // 设置一个顶点位置 与 照片大小一样的图形
  function setRectangle(gl, x, y, width, height) {
    var x1 = x;

    var x2 = x + width;

    var y1 = y;

    var y2 = y + height;

    // console.log('width==',width);
    // console.log('height==',height);
    // console.log('111',[
    //   x1, y1,
    //   x2, y1,
    //   x1, y2,
    //   x1, y2,
    //   x2, y1,
    //   x2, y2
    //  ]);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
       x1, y1,
       x2, y1,
       x1, y2,

       x1, y2,
       x2, y1,
       x2, y2

      ]), gl.STATIC_DRAW);
  }
  
 
  main();
 
 
 };
