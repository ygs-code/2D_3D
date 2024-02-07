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
 
 
var zDepth = 50;

function main() {
  // Get A WebGL context
 

  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);
 
  // setup GLSL program
  var program = initShaders(gl, VSHADER_SOURCE,FSHADER_SOURCE);
  gl.useProgram(program);

  // look up where the vertex data needs to go.
  var positionLocation = gl.getAttribLocation(program, "a_position");
  var texcoordLocation = gl.getAttribLocation(program, "a_texcoord");

  // lookup uniforms
  var matrixLocation = gl.getUniformLocation(program, "u_matrix");

  // Create a buffer.
  //创建buffer
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
  setTexcoords(gl);

  // Create a texture with different colored mips
  var mipTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, mipTexture);
  var c = document.createElement("canvas");
  var ctx = c.getContext("2d");
  var mips = [
    {size: 64, color: "rgb(128,0,255)",},
    {size: 32, color: "rgb(0,0,255)",},
    {size: 16, color: "rgb(255,0,0)",},
    {size:  8, color: "rgb(255,255,0)",},
    {size:  4, color: "rgb(0,255,0)",},
    {size:  2, color: "rgb(0,255,255)",},
    {size:  1, color: "rgb(255,0,255)",},
  ];
  mips.forEach(function(s, level) {
     var size = s.size;
     c.width = size;
     c.height = size;
     ctx.fillStyle = "rgb(255,255,255)";
     ctx.fillRect(0, 0, size, size);
     ctx.fillStyle = s.color;
     ctx.fillRect(0, 0, size / 2, size / 2);
     ctx.fillRect(size / 2, size / 2, size / 2, size / 2);
     gl.texImage2D(gl.TEXTURE_2D, level, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, c);
  });

  // Create a texture.
  var texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  // Fill the texture with a 1x1 blue pixel.
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                new Uint8Array([0, 0, 255, 255]));
  // Asynchronously load an image
  var image = new Image();
  image.src = example;
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
    drawScene();
  });

  var textures = [
    texture,
    mipTexture,
  ];
  var textureIndex = 0;

  document.getElementById('b').onclick = function(){
    textureIndex = (textureIndex + 1) % textures.length;
    drawScene();
  };
  // $("body").click(function() {
  //   textureIndex = (textureIndex + 1) % textures.length;
  //   drawScene();
  // });

  function isPowerOf2(value) {
    return (value & (value - 1)) == 0;
  }

  // 弧度转角度
  function radToDeg(r) {
    return r * 180 / Math.PI;
  }
 // 角度转弧度
  function degToRad(d) {
    return d * Math.PI / 180;
  }
  // 透视角度
  var fieldOfViewRadians = degToRad(60);

   // 渲染场景
  drawScene();

  // Draw the scene.
  function drawScene() {
    // Clear the framebuffer texture.
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Compute the projection matrix
    var aspect = canvas.clientWidth / canvas.clientHeight;
    var zNear  = 1;
    var zFar   = 2000;
    // 透视投影
    var projectionMatrix = makePerspective(fieldOfViewRadians, aspect, zNear, zFar);

    var cameraPosition = [0, 0, 2];

    var target = [0, 0, 0];
    var up = [0, 1, 0];
    // Compute the camera's matrix using look at.
    // 设置相机
    var cameraMatrix = makeLookAt(cameraPosition, target, up);

    // Make a view matrix from the camera matrix.
    // 视图矩阵
    var viewMatrix = makeInverse(cameraMatrix);

    var settings = [
      {x: -1, y:  1, zRot: 0, magFilter: gl.NEAREST, minFilter: gl.NEAREST,},
      {x:  0, y:  1, zRot: 0, magFilter: gl.LINEAR,  minFilter: gl.LINEAR,},
      {x:  1, y:  1, zRot: 0, magFilter: gl.LINEAR,  minFilter: gl.NEAREST_MIPMAP_NEAREST,},
      {x: -1, y: -1, zRot: 1, magFilter: gl.LINEAR,  minFilter: gl.LINEAR_MIPMAP_NEAREST,},
      {x:  0, y: -1, zRot: 1, magFilter: gl.LINEAR,  minFilter: gl.NEAREST_MIPMAP_LINEAR,},
      {x:  1, y: -1, zRot: 1, magFilter: gl.LINEAR,  minFilter: gl.LINEAR_MIPMAP_LINEAR,},
    ];
    var xSpacing = 1.2;
    var ySpacing = 0.7;
    // console.log('settings===',settings);
    // 6个模型
    settings.forEach(function(s) {
      // 绑定纹理
      gl.bindTexture(gl.TEXTURE_2D, textures[textureIndex]);
      // 设置配置纹理
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, s.minFilter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, s.magFilter);

      // console.log('s.x * xSpacing==',s.x * xSpacing);
      // console.log('s.y * ySpacing==',s.y * ySpacing);
      var translationMatrix = makeTranslation(
         s.x * xSpacing,
         s.y * ySpacing, 
        -zDepth * 0.5
        );

      var zRotationMatrix = makeZRotation(s.zRot * Math.PI);

       // 把z拉的很长
      var scaleMatrix = makeScale(1, 1, zDepth);

      // Multiply the matrices.
      // 线性变换矩阵
      var matrix = scaleMatrix;
      matrix = matrixMultiply(matrix, zRotationMatrix);
      matrix = matrixMultiply(matrix, translationMatrix);
      matrix = matrixMultiply(matrix, viewMatrix);
      matrix = matrixMultiply(matrix, projectionMatrix);

      // Set the matrix.
      gl.uniformMatrix4fv(matrixLocation, false, matrix);

      // Draw the geometry.
      gl.drawArrays(gl.TRIANGLES, 0, 1 * 6);
    });
  }
}

// Fill the buffer with the values that define a plane.
function setGeometry(gl) {
  var positions = new Float32Array(
    [
      // 不规则的矩形
    -0.5,  0.5, -0.5,
     0.5,  0.5, -0.5,
    -0.5,  0.5,  0.5,

    -0.5,  0.5,  0.5,
     0.5,  0.5, -0.5,
     0.5,  0.5,  0.5,

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

        0, zDepth,
        0, zDepth,

        1, 0,
        1, zDepth,

      ]),
      gl.STATIC_DRAW);
}


   main();
 };