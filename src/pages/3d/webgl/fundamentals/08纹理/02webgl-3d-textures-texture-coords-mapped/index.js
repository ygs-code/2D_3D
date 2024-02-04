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
import fTexture from "static/image/f-texture1.png";
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
     /**检查数字是否为2的指数
      * @param {Number} value - 要检查的值
      * @return {Boolean}
      */
  function isPowerOf2(value) {
      return !(value & (value - 1));
  }


    // setup GLSL program
    var program = initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
  
    // look up where the vertex data needs to go.
    var positionLocation = gl.getAttribLocation(program, "a_position");
    var texcoordLocation = gl.getAttribLocation(program, "a_texcoord");
  
    // lookup uniforms
    var matrixLocation = gl.getUniformLocation(program, "u_matrix");
    var textureLocation = gl.getUniformLocation(program, "u_texture");
  
    // Create a buffer for positions
    var positionBuffer = gl.createBuffer();
    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // Put the positions in the buffer
    setGeometry(gl);
  
    // provide texture coordinates for the rectangle.
    var texcoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    // Set Texcoords.
    setTexcoords(gl);
  
    // Create a texture.
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // Fill the texture with a 1x1 blue pixel.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                  new Uint8Array([0, 0, 255, 255]));

                  
    // Asynchronously load an image
    var image = new Image();
    image.src = fTexture;
    image.addEventListener('load', function() {

      // Now that the image has loaded make copy it to the texture.
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
      gl.generateMipmap(gl.TEXTURE_2D);


   if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        return texture;
    }
            
 
    /*
第四纹理加载的一些小问题
如果你参照《webGL编程指南》的demo去写添加纹理，
如果你是在网上随便找一张自己的图片的话，
你可能会发现纹理渲染不出来，
即便你的代码和例子一摸一样。它会报这样一行错：
image.png
这里的解决办法非常简单，最简单的解决办法，是先检查你使用的贴图尺寸。
如果长和宽的大小都不是2的n次幂 即错误信息里面所说的non-power-of-2
那么请用PS等图像处理软件把它的长和宽分别处理为2的n次幂
如 1x1 2x2 4x4 8x8 16x16 32x32 64x64 128x128 256x256 512x512.....
一般来说这样就能够解决了 然后参考一下stackoverflow一位dalao给的代码
你可以这样写一个创建纹理的函数：
    */ 

 


    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    });
  
  
    function radToDeg(r) {
      return r * 180 / Math.PI;
    }
  
    function degToRad(d) {
      return d * Math.PI / 180;
    }
  
    var fieldOfViewRadians = degToRad(60);
    var modelXRotationRadians = degToRad(0);
    var modelYRotationRadians = degToRad(0);
  
    var then = 0;
  
    requestAnimationFrame(drawScene);
  
    // Draw the scene.
    function drawScene(now) {
      // Convert to seconds
      now *= 0.001;
      // Subtract the previous time from the current time
      var deltaTime = now - then;
      // Remember the current time for the next frame.
      then = now;
  
       resizeCanvasToDisplaySize(gl.canvas);
  
      // Tell WebGL how to convert from clip space to pixels
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  
      gl.enable(gl.CULL_FACE);
      gl.enable(gl.DEPTH_TEST);
  
      // Animate the rotation
      modelXRotationRadians += 1.2 * deltaTime;
      modelYRotationRadians += 0.7 * deltaTime;
  
      // Clear the canvas AND the depth buffer.
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
      var offset1= 0;        // start at the beginning of the buffer
      gl.vertexAttribPointer(
          texcoordLocation, size1, type1, normalize1, stride1, offset1);
  
      // Compute the projection matrix
      var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
      var projectionMatrix =
          m4.perspective(fieldOfViewRadians, aspect, 1, 2000);
  
      var cameraPosition = [0, 0, 200];
      var up = [0, 1, 0];
      var target = [0, 0, 0];
  
      // Compute the camera's matrix using look at.
      var cameraMatrix = m4.lookAt(cameraPosition, target, up);
  
      // Make a view matrix from the camera matrix.
      var viewMatrix = m4.inverse(cameraMatrix);
  
      var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);
  
      var matrix = m4.xRotate(viewProjectionMatrix, modelXRotationRadians);
      matrix = m4.yRotate(matrix, modelYRotationRadians);
  
      // Set the matrix.
      gl.uniformMatrix4fv(matrixLocation, false, matrix);
  
      // Tell the shader to use texture unit 0 for u_texture
      gl.uniform1i(textureLocation, 0);
  
      // Draw the geometry.
      gl.drawArrays(gl.TRIANGLES, 0, 16 * 6);
  
      requestAnimationFrame(drawScene);
    }
  }
  
  // Fill the buffer with the values that define a letter 'F'.
  function setGeometry(gl) {
    var positions = new Float32Array([
            // left column front
            0,   0,  0,
            0, 150,  0,
            30,   0,  0,
            0, 150,  0,
            30, 150,  0,
            30,   0,  0,
  
            // top rung front
            30,   0,  0,
            30,  30,  0,
            100,   0,  0,
            30,  30,  0,
            100,  30,  0,
            100,   0,  0,
  
            // middle rung front
            30,  60,  0,
            30,  90,  0,
            67,  60,  0,
            30,  90,  0,
            67,  90,  0,
            67,  60,  0,
  
            // left column back
              0,   0,  30,
             30,   0,  30,
              0, 150,  30,
              0, 150,  30,
             30,   0,  30,
             30, 150,  30,
  
            // top rung back
             30,   0,  30,
            100,   0,  30,
             30,  30,  30,
             30,  30,  30,
            100,   0,  30,
            100,  30,  30,
  
            // middle rung back
             30,  60,  30,
             67,  60,  30,
             30,  90,  30,
             30,  90,  30,
             67,  60,  30,
             67,  90,  30,
  
            // top
              0,   0,   0,
            100,   0,   0,
            100,   0,  30,
              0,   0,   0,
            100,   0,  30,
              0,   0,  30,
  
            // top rung right
            100,   0,   0,
            100,  30,   0,
            100,  30,  30,
            100,   0,   0,
            100,  30,  30,
            100,   0,  30,
  
            // under top rung
            30,   30,   0,
            30,   30,  30,
            100,  30,  30,
            30,   30,   0,
            100,  30,  30,
            100,  30,   0,
  
            // between top rung and middle
            30,   30,   0,
            30,   60,  30,
            30,   30,  30,
            30,   30,   0,
            30,   60,   0,
            30,   60,  30,
  
            // top of middle rung
            30,   60,   0,
            67,   60,  30,
            30,   60,  30,
            30,   60,   0,
            67,   60,   0,
            67,   60,  30,
  
            // right of middle rung
            67,   60,   0,
            67,   90,  30,
            67,   60,  30,
            67,   60,   0,
            67,   90,   0,
            67,   90,  30,
  
            // bottom of middle rung.
            30,   90,   0,
            30,   90,  30,
            67,   90,  30,
            30,   90,   0,
            67,   90,  30,
            67,   90,   0,
  
            // right of bottom
            30,   90,   0,
            30,  150,  30,
            30,   90,  30,
            30,   90,   0,
            30,  150,   0,
            30,  150,  30,
  
            // bottom
            0,   150,   0,
            0,   150,  30,
            30,  150,  30,
            0,   150,   0,
            30,  150,  30,
            30,  150,   0,
  
            // left side
            0,   0,   0,
            0,   0,  30,
            0, 150,  30,
            0,   0,   0,
            0, 150,  30,
            0, 150,   0]);
  
    // Center the F around the origin and Flip it around. We do this because
    // we're in 3D now with and +Y is up where as before when we started with 2D
    // we had +Y as down.
  
    // We could do by changing all the values above but I'm lazy.
    // We could also do it with a matrix at draw time but you should
    // never do stuff at draw time if you can do it at init time.
    var matrix = m4.identity();// m4.xRotation(Math.PI);
    matrix = m4.translate(matrix, -50, -75, -15);
  
    for (var ii = 0; ii < positions.length; ii += 3) {
      var vector = m4.transformVector(matrix, [positions[ii + 0], positions[ii + 1], positions[ii + 2], 1]);
      positions[ii + 0] = vector[0];
      positions[ii + 1] = vector[1];
      positions[ii + 2] = vector[2];
    }
  
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
  }
  
  // Fill the current ARRAY_BUFFER buffer
  // with texture coordinates for the letter 'F'.
  function setTexcoords(gl) {
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
          // left column front
          /*

           贴图坐标 = 2d坐标 / 图片的宽高

            图片上的 坐标  除以 255   255   255 是图片的 宽 高
          */ 
           38 / 255,  44 / 255,
           38 / 255, 223 / 255,
          113 / 255,  44 / 255,

           38 / 255, 223 / 255,
          113 / 255, 223 / 255,
          113 / 255,  44 / 255,
  
          // top rung front
          113 / 255, 44 / 255,
          113 / 255, 85 / 255,
          218 / 255, 44 / 255,
          113 / 255, 85 / 255,
          218 / 255, 85 / 255,
          218 / 255, 44 / 255,
  
          // middle rung front
          113 / 255, 112 / 255,
          113 / 255, 151 / 255,
          203 / 255, 112 / 255,
          113 / 255, 151 / 255,
          203 / 255, 151 / 255,
          203 / 255, 112 / 255,
  
          // left column back
           38 / 255,  44 / 255,
          113 / 255,  44 / 255,
           38 / 255, 223 / 255,
           38 / 255, 223 / 255,
          113 / 255,  44 / 255,
          113 / 255, 223 / 255,
  
          // top rung back
          113 / 255, 44 / 255,
          218 / 255, 44 / 255,
          113 / 255, 85 / 255,
          113 / 255, 85 / 255,
          218 / 255, 44 / 255,
          218 / 255, 85 / 255,
  
          // middle rung back
          113 / 255, 112 / 255,
          203 / 255, 112 / 255,
          113 / 255, 151 / 255,
          113 / 255, 151 / 255,
          203 / 255, 112 / 255,
          203 / 255, 151 / 255,
  
          // top
          0, 0,
          1, 0,
          1, 1,
          0, 0,
          1, 1,
          0, 1,
  
          // top rung right
          0, 0,
          1, 0,
          1, 1,
          0, 0,
          1, 1,
          0, 1,
  
          // under top rung
          0, 0,
          0, 1,
          1, 1,
          0, 0,
          1, 1,
          1, 0,
  
          // between top rung and middle
          0, 0,
          1, 1,
          0, 1,
          0, 0,
          1, 0,
          1, 1,
  
          // top of middle rung
          0, 0,
          1, 1,
          0, 1,
          0, 0,
          1, 0,
          1, 1,
  
          // right of middle rung
          0, 0,
          1, 1,
          0, 1,
          0, 0,
          1, 0,
          1, 1,
  
          // bottom of middle rung.
          0, 0,
          0, 1,
          1, 1,
          0, 0,
          1, 1,
          1, 0,
  
          // right of bottom
          0, 0,
          1, 1,
          0, 1,
          0, 0,
          1, 0,
          1, 1,
  
          // bottom
          0, 0,
          0, 1,
          1, 1,
          0, 0,
          1, 1,
          1, 0,
  
          // left side
          0, 0,
          0, 1,
          1, 1,
          0, 0,
          1, 1,
          1, 0,
        ]),
        gl.STATIC_DRAW);
  }
  
  
 
  main();
 
 
 };
