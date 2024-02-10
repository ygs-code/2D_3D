import initShaders from "@/pages/3d/utils/initShader";
import {createBufferInfoFromArrays ,createProgramFromScripts, resizeCanvasToDisplaySize ,setUniforms, createProgramInfo ,setBuffersAndAttributes} from "@/pages/3d/utils/webgl-utils.js";
import FSHADER_SOURCE from "./index.frag";
import VSHADER_SOURCE from "./index.vert";
import {getWebGLContext,} from "@/pages/3d/utils/lib/cuon-utils";
// import PICK_FSHADER_SOURCE from "./pick-fragment.frag";
// import PICK_VSHADER_SOURCE from "./pick-vertex.vert";
import {createHtmlMatrix} from "@/pages/3d/utils/matrix.js";
import primitives from "@/pages/3d/utils/primitives.js";
import m4 from "@/pages/3d/utils/m4";
import chroma from "@/pages/3d/utils/chroma.min";
import * as glMatrix from "gl-matrix";
import {matrixVectorMultiply,makeScale, makeZRotation,makeInverse,makeLookAt,makeIdentity,makeXRotation,makeYRotation,makeTranslation,matrixMultiply,makePerspective} from "@/pages/3d/utils/webgl-3d-math.js";
import controller from "@/pages/3d/utils/controller.js";
import fTexture from "static/image/f-texture.png";
import leaves from "static/image/leaves.jpg";
import example from "static/image/mip-low-res-example.png";
import keyboard from "static/image/keyboard.jpg";
import noodles from "static/image/noodles.jpg"; 

 

import * as dat from "dat.gui";
import "./index.less";
import "@/pages/index.less";
 

 

 window.onload = function () {
   // Get A WebGL context
   var canvas = document.createElement("canvas", {antialias: false});
   var dpr = window.devicePixelRatio || 1;
   canvas.style.width = 400 + "px";
   canvas.style.height = 300 + "px";
   canvas.width = Math.floor(canvas.width * dpr);
   canvas.height = Math.floor(canvas.height * dpr);
 
   document.body.appendChild(canvas);
  if (!canvas.getContext) return;
  let gl = canvas.getContext("webgl");
 

  function main() {
  
  
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
  
    // setup GLSL program
    var program = initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
    gl.useProgram(program);
  
    // look up where the vertex data needs to go.
    // 模型定点的 shander 地址
    var positionLocation = gl.getAttribLocation(program, "a_position");
    var texcoordLocation = gl.getAttribLocation(program, "a_texcoord");
  
    // lookup uniforms
    var matrixLocation = gl.getUniformLocation(program, "u_matrix");
  
    // Create a buffer.
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
  
    // Set Geometry.
    // 设置定点
    setGeometry(gl);
  
    // Create a buffer for texcoords.
    var buffer1 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer1);
    gl.enableVertexAttribArray(texcoordLocation);
  
    // We'll supply texcoords as floats.
    gl.vertexAttribPointer(texcoordLocation, 2, gl.FLOAT, false, 0, 0);
  
    // Set Texcoords.
    // 设置纹理顶点
    setTexcoords(gl);
  
    // Create a texture.
    // 创建纹理
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // Fill the texture with a 1x1 blue pixel.
    // 用1x1的蓝色像素填充纹理。 可以设置不同的贴图方式
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                  new Uint8Array([0, 0, 255, 255]));
    // Asynchronously load an image
    //异步加载图像
    var image = new Image();
    image.src = noodles;
    image.addEventListener('load', function() {
      // Now that the image has loaded make copy it to the texture.
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
  
      // Check if the image is a power of 2 in both dimensions.
      if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
         // Yes, it's a power of 2. Generate mips.
         gl.generateMipmap(gl.TEXTURE_2D);
      } else {
         // No, it's not a power of 2. Turn of mips and set wrapping to clamp to edge
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      }
    });
  
    function isPowerOf2(value) {
      return (value & (value - 1)) == 0;
    }
  
    function radToDeg(r) {
      return r * 180 / Math.PI;
    }
  
    function degToRad(d) {
      return d * Math.PI / 180;
    }
  
    var fieldOfViewRadians = degToRad(60);
    var modelXRotationRadians = degToRad(0);
    var modelYRotationRadians = degToRad(0);
  
    // Get the starting time.
    var then = 0;
  
    requestAnimationFrame(drawScene);
  
    // Draw the scene.
    function drawScene(time) {
      // convert to seconds
      time *= 0.001;
      // Subtract the previous time from the current time
      var deltaTime = time - then;
      // Remember the current time for the next frame.
      then = time;
  
      // Animate the rotation
      modelYRotationRadians += -0.7 * deltaTime;
      modelXRotationRadians += -0.4 * deltaTime;
  
      // Clear the canvas AND the depth buffer.
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
      // Compute the projection matrix
      var aspect = canvas.clientWidth / canvas.clientHeight;
      var zNear  = 1;
      var zFar   = 2000;
      var projectionMatrix = makePerspective(fieldOfViewRadians, aspect, zNear, zFar);
  
      var cameraPosition = [0, 0, 2];
      var up = [0, 1, 0];
      var target = [0, 0, 0];
  
      // Compute the camera's matrix using look at.
      var cameraMatrix = makeLookAt(cameraPosition, target, up);
  
      // Make a view matrix from the camera matrix.
      var viewMatrix = makeInverse(cameraMatrix);
  
      var translationMatrix = makeTranslation(0, 0, 0);
      var xRotationMatrix = makeXRotation(modelXRotationRadians);
      var yRotationMatrix = makeYRotation(modelYRotationRadians);
  
      // Multiply the matrices.
      var matrix = yRotationMatrix;
      matrix = matrixMultiply(matrix, xRotationMatrix);
      matrix = matrixMultiply(matrix, translationMatrix);
      matrix = matrixMultiply(matrix, viewMatrix);
      matrix = matrixMultiply(matrix, projectionMatrix);
  
      // Set the matrix.
      gl.uniformMatrix4fv(matrixLocation, false, matrix);
  
      // Draw the geometry.
      gl.drawArrays(gl.TRIANGLES, 0, 6 * 6);
  
      requestAnimationFrame(drawScene);
    }
  }
  
  // Fill the buffer with the values that define a cube.
  function setGeometry(gl) {
    var positions = new Float32Array(
      [
      -0.5, -0.5,  -0.5,
      -0.5,  0.5,  -0.5,
       0.5, -0.5,  -0.5,

      -0.5,  0.5,  -0.5,
       0.5,  0.5,  -0.5,
       0.5, -0.5,  -0.5,
  
      -0.5, -0.5,   0.5,
       0.5, -0.5,   0.5,
      -0.5,  0.5,   0.5,

      -0.5,  0.5,   0.5,
       0.5, -0.5,   0.5,
       0.5,  0.5,   0.5,
  
      -0.5,   0.5, -0.5,
      -0.5,   0.5,  0.5,
       0.5,   0.5, -0.5,

      -0.5,   0.5,  0.5,
       0.5,   0.5,  0.5,
       0.5,   0.5, -0.5,
  
      -0.5,  -0.5, -0.5,
       0.5,  -0.5, -0.5,
      -0.5,  -0.5,  0.5,

      -0.5,  -0.5,  0.5,
       0.5,  -0.5, -0.5,
       0.5,  -0.5,  0.5,
  
      -0.5,  -0.5, -0.5,
      -0.5,  -0.5,  0.5,
      -0.5,   0.5, -0.5,

      -0.5,  -0.5,  0.5,
      -0.5,   0.5,  0.5,
      -0.5,   0.5, -0.5,
  
       0.5,  -0.5, -0.5,
       0.5,   0.5, -0.5,
       0.5,  -0.5,  0.5,

       0.5,  -0.5,  0.5,
       0.5,   0.5, -0.5,
       0.5,   0.5,  0.5,
  
      ]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
  }
  
  // Fill the buffer with texture coordinates the cube.
  function setTexcoords(gl) {
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(
          [
            // 底面
          // select the bottom left image
          0   , 0  ,
          0   , 0.5,
          0.25, 0  ,
          0   , 0.5,
          0.25, 0.5,
          0.25, 0  ,
          
          // select the bottom middle image
          0.25, 0  ,
          0.5 , 0  ,
          0.25, 0.5,
          0.25, 0.5,
          0.5 , 0  ,
          0.5 , 0.5,
          // select to bottom right image
          0.5 , 0  ,
          0.5 , 0.5,
          0.75, 0  ,
          0.5 , 0.5,
          0.75, 0.5,
          0.75, 0  ,
          // select the top left image
          0   , 0.5,
          0.25, 0.5,
          0   , 1  ,
          0   , 1  ,
          0.25, 0.5,
          0.25, 1  ,
          // select the top middle image
          0.25, 0.5,
          0.25, 1  ,
          0.5 , 0.5,
          0.25, 1  ,
          0.5 , 1  ,
          0.5 , 0.5,
          // select the top right image
          0.5 , 0.5,
          0.75, 0.5,
          0.5 , 1  ,
          0.5 , 1  ,
          0.75, 0.5,
          0.75, 1  ,
  
        ]),
        gl.STATIC_DRAW);
  }
  

 
   main();
 };