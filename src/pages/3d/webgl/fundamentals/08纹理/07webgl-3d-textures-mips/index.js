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
import {makeScale, makeZRotation,makeInverse,makeLookAt,makeIdentity,makeXRotation,makeYRotation,makeTranslation,matrixMultiply,makePerspective} from "@/pages/3d/utils/webgl-3d-math.js";
import controller from "@/pages/3d/utils/controller.js";
import fTexture from "static/image/f-texture.png";
import leaves from "static/image/leaves.jpg";
import example from "static/image/mip-low-res-example.png";

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
    // Get A WebGL context
   
 
    // setup GLSL program
    var program = initShaders(gl,
       VSHADER_SOURCE,
       FSHADER_SOURCE
       );
  
    // look up where the vertex data needs to go.
    // 模型定点
    var positionLocation = gl.getAttribLocation(program, "a_position");
    // 纹理
    var texcoordLocation = gl.getAttribLocation(program, "a_texcoord");
  
    // lookup uniforms
    // 模型矩阵
    var matrixLocation = gl.getUniformLocation(program, "u_matrix");
    // 纹理
    var textureLocation = gl.getUniformLocation(program, "u_texture");
  
    // Create a buffer for positions
    // 创建buffer
    var positionBuffer = gl.createBuffer();
    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    // 绑定buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // Put the positions in the buffer
    // 设置buffer
    setGeometry(gl);
  
    // provide texture coordinates for the rectangle.
    // 创建buffer
    var texcoordBuffer = gl.createBuffer();
    // 绑定buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    // 设置纹理定点
    // Set Texcoords.
    setTexcoords(gl);
  
    var allocateFBTexture = true;
    var framebufferWidth;   // set at render time
    var framebufferHeight;  // set at render time
    // 创建纹理缓存
    var framebuffer = gl.createFramebuffer();
    // 创建纹理
    var fbTexture = gl.createTexture();

    gl.bindTexture(gl.TEXTURE_2D, fbTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, fbTexture, 0);
  
    // Create a texture.
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // Fill the texture with a 1x1 blue pixel.
    gl.texImage2D(
       gl.TEXTURE_2D, 
       0,
       gl.RGBA, 
       1, 
       1, 
       0, 
       gl.RGBA, 
       gl.UNSIGNED_BYTE,
       new Uint8Array([0, 0, 255, 255])
     );
    // Asynchronously load an image
    var image = new Image();
    image.src = example;
    image.addEventListener('load', function() {
      // Now that the image has loaded make copy it to the texture.
      // 现在图像已经加载，复制到纹理。
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
  
      // Check if the image is a power of 2 in both dimensions.
      // 检查图像在两个维度上是否都是2的幂。
      if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
        // 2次幂的图片
         // Yes, it's a power of 2. Generate mips.
         gl.generateMipmap(gl.TEXTURE_2D);
      } else {
         // No, it's not a power of 2. Turn of mips and set wrapping to clamp to edge
         //不，它不是2的幂。旋转mips并设置包装夹紧边缘
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      }
    });
  
    function isPowerOf2(value) {
      return (value & (value - 1)) === 0;
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
  
    requestAnimationFrame(drawScene);
  
    // Draw the scene.
    function drawScene(time) {
      time *= 0.001;  // convert to seconds
  
      if (resizeCanvasToDisplaySize(gl.canvas, window.devicePixelRatio) || allocateFBTexture) {
        allocateFBTexture = false;
        framebufferWidth = gl.canvas.clientWidth / 4;
        framebufferHeight = gl.canvas.clientHeight / 4;
        gl.bindTexture(gl.TEXTURE_2D, fbTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, framebufferWidth, framebufferHeight,
                      0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      }
  
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
      gl.viewport(0, 0, framebufferWidth, framebufferHeight);
  
      // Clear the framebuffer texture.
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
      // Tell it to use our program (pair of shaders)
      gl.useProgram(program);
  
      // Turn on the position attribute
      gl.enableVertexAttribArray(positionLocation);
  
      // Bind the position buffer.
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  
      // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
      var size = 3;          // 3 components per iteration
      var type = gl.FLOAT;   // the data is 32bit floats
      var normalize = false; // don't normalize the data
      var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
      var offset = 0;        // start at the beginning of the buffer
      gl.vertexAttribPointer(
          positionLocation, size, type, normalize, stride, offset);
  
      // Turn on the texcoord attribute
      gl.enableVertexAttribArray(texcoordLocation);
  
      // bind the texcoord buffer.
      gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
  
      // Tell the texcoord attribute how to get data out of texcoordBuffer (ARRAY_BUFFER)
      var size1 = 2;          // 2 components per iteration
      var type1 = gl.FLOAT;   // the data is 32bit floats
      var normalize1 = false; // don't normalize the data
      var stride1 = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
      var offset1 = 0;        // start at the beginning of the buffer
      gl.vertexAttribPointer(texcoordLocation, size1, type1, normalize1, stride1, offset1);
  
      // Compute the projection matrix
      var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
      var zNear  = 1;
      var zFar   = 2000;
      var projectionMatrix =  m4.perspective(fieldOfViewRadians, aspect, zNear, zFar);
  
      var cameraPosition = [0, 0, 3];
      var up = [0, 1, 0];
      var target = [0, 0, 0];
  
      // Compute the camera's matrix using look at.
      var cameraMatrix = m4.lookAt(cameraPosition, target, up);
  
      // Make a view matrix from the camera matrix.
      var viewMatrix = m4.inverse(cameraMatrix);
  
      var settings = [
        {x: -1, y: -3, z: -30, filter: gl.NEAREST,},
        {x:  0, y: -3, z: -30, filter: gl.LINEAR,},
        {x:  1, y: -3, z: -30, filter: gl.NEAREST_MIPMAP_LINEAR,},
        {x: -1, y: -1, z: -10, filter: gl.NEAREST,},
        {x:  0, y: -1, z: -10, filter: gl.LINEAR,},
        {x:  1, y: -1, z: -10, filter: gl.NEAREST_MIPMAP_LINEAR,},
        {x: -1, y:  1, z:   0, filter: gl.NEAREST,},
        {x:  0, y:  1, z:   0, filter: gl.LINEAR,},
        {x:  1, y:  1, z:   0, filter: gl.LINEAR_MIPMAP_NEAREST,},
      ];
      var xSpacing = 1.2;
      var ySpacing = 0.7;
      var zDistance = 30;
      settings.forEach(function(s) {
        var z = -5 + s.z; // Math.cos(time * 0.3) * zDistance - zDistance;
        var r = Math.abs(z) * Math.sin(fieldOfViewRadians * 0.5);
        var x = Math.sin(time * 0.2) * r;
        var y = Math.cos(time * 0.2) * r * 0.5;
        var r2 = 1 + r * 0.2;
  
        gl.bindTexture(gl.TEXTURE_2D, texture);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, s.filter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  
        var matrix = m4.translate(projectionMatrix, x + s.x * xSpacing * r2, y + s.y * ySpacing * r2, z);
        matrix = m4.xRotate(matrix, modelXRotationRadians);
        matrix = m4.yRotate(matrix, modelYRotationRadians);
  
        // Set the matrix.
        gl.uniformMatrix4fv(matrixLocation, false, matrix);
  
        // Tell the shader to use texture unit 0 for u_texture
        gl.uniform1i(textureLocation, 0);
  
        // Draw the geometry.
        gl.drawArrays(gl.TRIANGLES, 0, 1 * 6);
      });
  
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      gl.bindTexture(gl.TEXTURE_2D, fbTexture);
      gl.uniformMatrix4fv(matrixLocation, false,
        [
           2, 0, 0, 0,
          0, 2, 0, 0,

          0, 0, 1, 0,
          0, 0, 0, 1
        ]);
  
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 1 * 6);
  
      requestAnimationFrame(drawScene);
    }
  }
  
  // Fill the buffer with the values that define a plane.
  function setGeometry(gl) {
    var positions = new Float32Array(
      [
      -0.5, -0.5,   0.5,
       0.5, -0.5,   0.5,
      -0.5,  0.5,   0.5,

      -0.5,  0.5,   0.5,
       0.5, -0.5,   0.5,
       0.5,  0.5,   0.5,
  
      ]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
  }
  
  // Fill the buffer with texture coordinates for a plane.
  function setTexcoords(gl) {
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(
          [
          0, 0,
          1, 0,
          0, 1,
          
          0, 1,
          1, 0,
          1, 1,
  
        ]),
          gl.STATIC_DRAW
        );
  }
  
   main();
 };