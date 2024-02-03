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
 

 

 window.onload = function () {
  const canvas = document.createElement("canvas");
  canvas.width = 500;
  canvas.height = 500;
  // getWebGLContext(canvas);
  document.body.appendChild(canvas);

  if (!canvas.getContext) return;
  let gl = canvas.getContext("webgl");

 

function main() {
  var image = new Image();
  image.src = leaves;  // MUST BE SAME DOMAIN!!!
  // 加载图片
  image.onload = function() {
    render(image);
  };
}

function render(image) {
 
  // setup GLSL program
  // 创建 program
  var program = initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
  gl.useProgram(program);

  // look up where the vertex data needs to go.
  var positionLocation = gl.getAttribLocation(program, "a_position");
  var texCoordLocation = gl.getAttribLocation(program, "a_texCoord");

  // provide texture coordinates for the rectangle.
  //为矩形提供纹理坐标。
  var texCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      0.0,  0.0,
      1.0,  0.0,
      0.0,  1.0,
      0.0,  1.0,
      1.0,  0.0,
      1.0,  1.0]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(texCoordLocation);
  gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

  var texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the parameters so we can render any size image.
  //设置参数，使我们可以渲染任何大小的图像。
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  // Upload the image into the texture.
  //上传图像到纹理。
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

  // lookup uniforms 查找制服
  var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
  var textureSizeLocation = gl.getUniformLocation(program, "u_textureSize");

  // set the resolution
  gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

  // set the size of the image //设置分辨率
  gl.uniform2f(textureSizeLocation, image.width, image.height);

  // Create a buffer for the position of the rectangle corners.
  var positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  setRectangle( gl, 0, 0, image.width, image.height);

  // Draw the rectangle.
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function randomInt(range) {
  return Math.floor(Math.random() * range);
}

function setRectangle(gl, x, y, width, height) {
  var x1 = x;
  var x2 = x + width;
  var y1 = y;
  var y2 = y + height;
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
     x1, y1,
     x2, y1,
     x1, y2,
     x1, y2,
     x2, y1,
     x2, y2]), gl.STATIC_DRAW);
}

  
 
  main();
 
 
 };
