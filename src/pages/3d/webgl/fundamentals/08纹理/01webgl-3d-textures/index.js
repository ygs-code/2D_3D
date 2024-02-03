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
 
   
    // setup GLSL program
    // 加载 shander
    var program = initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
  
    // look up where the vertex data needs to go.
    //查找顶点数据需要放到哪里。
    var positionLocation = gl.getAttribLocation(program, "a_position");
    // 纹理
    var texcoordLocation = gl.getAttribLocation(program, "a_texcoord");
  
    // lookup uniforms
    // lookup uniforms
    var matrixLocation = gl.getUniformLocation(program, "u_matrix");
    // 纹理
    var textureLocation = gl.getUniformLocation(program, "u_texture");
  
    // Create a buffer for positions
    // 为位置创建一个缓冲区
    var positionBuffer = gl.createBuffer();
    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    // 将其绑定到ARRAY_BUFFER(将其视为ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Put the positions in the buffer
    // 把位置放在缓冲区中
    setGeometry(gl);
  
    
    // provide texture coordinates for the rectangle.
     //为矩形提供纹理坐标。
    var texcoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    // Set Texcoords. 设置纹理颜色
    setTexcoords(gl);
  
    // Create a texture. //创建纹理。
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // Fill the texture with a 1x1 blue pixel. //用1x1的蓝色像素填充纹理。
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
    // Asynchronously load an 
    // 加载图片
    var image = new Image();
    image.src = fTexture;
    image.addEventListener('load', function() {
      // Now that the image has loaded make copy it to the texture.
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
      gl.generateMipmap(gl.TEXTURE_2D);
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
      // 转换为秒
      now *= 0.001;
      // Subtract the previous time from the current time
      //当前时间减去前一个时间
      var deltaTime = now - then;
      // Remember the current time for the next frame.
      //记住下一帧的当前时间。
      then = now;
  
       resizeCanvasToDisplaySize(gl.canvas);
  
      // Tell WebGL how to convert from clip space to pixels
      //告诉WebGL如何从剪辑空间转换为像素
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  
      gl.enable(gl.CULL_FACE);
      gl.enable(gl.DEPTH_TEST);
  
      // Animate the rotation
      //动画旋转
      modelXRotationRadians += 1.2 * deltaTime;
      modelYRotationRadians += 0.7 * deltaTime;
  
      // Clear the canvas AND the depth buffer.
      //清除画布和深度缓冲区。
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
      // Tell it to use our program (pair of shaders)
      //告诉它使用我们的程序(shaders pair)
      gl.useProgram(program);
  
      // Turn on the position attribute
      //打开position属性
      gl.enableVertexAttribArray(positionLocation);
  
      // Bind the position buffer.
      //绑定位置缓冲区。
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  
      // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
      //告诉position属性如何从positionBuffer (ARRAY_BUFFER)中获取数据
      var size = 3;          // 3 components per iteration
      var type = gl.FLOAT;   // the data is 32bit floats
      var normalize = false; // don't normalize the data
      var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
      var offset = 0;        // start at the beginning of the buffer
      gl.vertexAttribPointer(
            positionLocation,
            size, 
            type, 
            normalize,
            stride, 
            offset
        );
  
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
      gl.vertexAttribPointer(
                texcoordLocation,
                size1,
                type1, 
                normalize1,
                stride1, 
                offset1
           );
  
      // Compute the projection matrix
      // 透视投影
      var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
      var projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, 1, 2000);
  
      var cameraPosition = [0, 0, 200];
      var up = [0, 1, 0];
      var target = [0, 0, 0];
  
      // Compute the camera's matrix using look at.
      // 相机设置
      var cameraMatrix = m4.lookAt(cameraPosition, target, up);
  
      // Make a view matrix from the camera matrix.
      // 逆矩阵
      var viewMatrix = m4.inverse(cameraMatrix);
  
      var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);
  
      var matrix = m4.xRotate(viewProjectionMatrix, modelXRotationRadians);

      matrix = m4.yRotate(matrix, modelYRotationRadians);
  
      // Set the matrix. //设置矩阵。
      gl.uniformMatrix4fv(matrixLocation, false, matrix);
  
      // Tell the shader to use texture unit 0 for u_texture
      //告诉着色器为u_texture使用纹理单位0
      gl.uniform1i(textureLocation, 0);
  
      // Draw the geometry.
      gl.drawArrays(gl.TRIANGLES, 0, 16 * 6);
  
      requestAnimationFrame(drawScene);
    }
  }
  
  // Fill the buffer with the values that define a letter 'F'.
  // 用定义字母“F”的值填充缓冲区。
  function setGeometry(gl) {
    // F 顶点位置
    var positions = new Float32Array([
            // left column front  |
            // x   y    z 
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
    // 创建矩阵
    var matrix = m4.identity();// m4.xRotation(Math.PI);
    // 偏移
    matrix = m4.translate(matrix, -50, -75, -15);
  
    // 转化 到 原点
    for (var ii = 0; ii < positions.length; ii += 3) {

      var vector = m4.transformVector(matrix, [positions[ii + 0], positions[ii + 1], positions[ii + 2], 1]);
      positions[ii + 0] = vector[0];
      positions[ii + 1] = vector[1];
      positions[ii + 2] = vector[2];
    }
  
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
  }
  
  // Fill the buffer with texture coordinates the F.
  //  用纹理坐标F填充缓冲区。
  function setTexcoords(gl) {
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
          // left column front
          0, 0,
          0, 1,
          1, 0,

          0, 1,
          1, 1,
          1, 0,
  
          // top rung front
          0, 0,
          0, 1,
          1, 0,

          0, 1,
          1, 1,
          1, 0,
  
          // middle rung front
          0, 0,
          0, 1,
          1, 0,

          0, 1,
          1, 1,
          1, 0,
  
          // left column back
          0, 0,
          1, 0,
          0, 1,

          0, 1,
          1, 0,
          1, 1,
  
          // top rung back
          0, 0,
          1, 0,
          0, 1,

          0, 1,
          1, 0,
          1, 1,
  
          // middle rung back
          0, 0,
          1, 0,
          0, 1,

          0, 1,
          1, 0,
          1, 1,
  
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
          1, 0
        ]),
        gl.STATIC_DRAW);
  }
  
   
  
 
  main();
 
 
 };
