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
import fTexture from "static/image/f-texture1.png";
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
 
 
  // 深度测试
   gl.enable(gl.CULL_FACE);
   gl.enable(gl.DEPTH_TEST);
 

 
     /**检查数字是否为2的指数
      * @param {Number} value - 要检查的值
      * @return {Boolean}
      */
  function isPowerOf2(value) {
      return !(value & (value - 1));
  }


  var zDepth = 50;

  function main() {
    // Get A WebGL context
    // var canvas = document.getElementById("canvas", {antialias: false});



    // var gl = getWebGLContext(canvas);
    // if (!gl) {
    //   return;
    // }
  
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
  
 

    // setup GLSL program
    // shander
    var program = initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
    gl.useProgram(program);
  
    // look up where the vertex data needs to go.
    var positionLocation = gl.getAttribLocation(program, "a_position");
    var texcoordLocation = gl.getAttribLocation(program, "a_texcoord");
  
    // lookup uniforms
    var matrixLocation = gl.getUniformLocation(program, "u_matrix");
  
    // Create a buffer.
    // 创建buffer
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
  
    // Set Geometry.
    // 设置顶点
    setGeometry(gl);
  
    // Create a buffer for texcoords.
    // 创建纹理buffer
    var buffer1 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer1);
    gl.enableVertexAttribArray(texcoordLocation);
  
    // We'll supply texcoords as floats.
    // 设置纹理顶点
    gl.vertexAttribPointer(texcoordLocation, 2, gl.FLOAT, false, 0, 0);
  
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
  
    var wrapS = gl.REPEAT;
    var wrapT = gl.REPEAT;


    const gui = new dat.GUI();
 

let parameters = { 
  a: false, 
  b: false, 
  c: false,
  wrapS:{
    a: false, 
    b: false, 
    c: false,
  },

  wrapT:{
    a: false, 
    b: false, 
    c: false,
  }

}; 


 

// 设置一个文件夹
var first = gui.addFolder("TEXTURE_WRAP_S"); 
  first.add(parameters.wrapS, 'a').name('REPEAT').listen().onChange(function(){
    setChecked('wrapS',"a");
    wrapS = gl.REPEAT;    
     drawScene();
   }); 
  first.add(parameters.wrapS, 'b').name('CLAMP_TO_EDGE').listen().onChange(function(){
    setChecked('wrapS',"b");
    wrapS = gl.CLAMP_TO_EDGE;
     drawScene();
  }); 
 
var first1 = gui.addFolder("TEXTURE_WRAP_T"); 
  first1.add(parameters.wrapT, 'a').name('REPEAT').listen().onChange(function(){
    setChecked('wrapT',"a");
    wrapT = gl.REPEAT;    
     drawScene();
  }); 
  first1.add(parameters.wrapT, 'b').name('CLAMP_TO_EDGE').listen().onChange(function(){
    setChecked('wrapT',"b");
    wrapT = gl.CLAMP_TO_EDGE;
     drawScene();
  }); 
 

function setChecked(key, prop){ 
  for (let param in  parameters[key]){ 
  parameters[key][param] = false; 
  } 
  parameters[key][prop] = true; 
} 


  

  
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
  
    drawScene();
  
    // Draw the scene.
    function drawScene() {
      // Clear the framebuffer texture.
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
      // Compute the projection matrix
      var aspect = canvas.clientWidth / canvas.clientHeight;
      var zNear  = 1;
      var zFar   = 2000;
      // 透视投影
      var projectionMatrix =  makePerspective(fieldOfViewRadians, aspect, zNear, zFar);
  
      // 相机
      var cameraPosition = [0, 0, 2];
      var up = [0, 1, 0];
      var target = [0, 0, 0];
  
      // Compute the camera's matrix using look at.
      var cameraMatrix = makeLookAt(cameraPosition, target, up);
  
      // 视图矩阵
      // Make a view matrix from the camera matrix.
      var viewMatrix = makeInverse(cameraMatrix);
  
      // 纹理参数设置
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

      // 贴图属性设置
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);

      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);

      var translationMatrix = makeTranslation(0, 0, 0);
      var zRotationMatrix = makeZRotation(0);
      var scaleMatrix = makeScale(1, 1, 1);
  
      // Multiply the matrices.
      var matrix = scaleMatrix;
      matrix = matrixMultiply(matrix, zRotationMatrix);
      matrix = matrixMultiply(matrix, translationMatrix);
      matrix = matrixMultiply(matrix, viewMatrix);
      matrix = matrixMultiply(matrix, projectionMatrix);
  
      // Set the matrix.
      gl.uniformMatrix4fv(matrixLocation, false, matrix);
  
      // Draw the geometry.
      gl.drawArrays(gl.TRIANGLES, 0, 1 * 6);
    }
  }
  
  // Fill the buffer with the values that define a plane.
  // 两个三角形
  function setGeometry(gl) {
    var positions = new Float32Array(
      [

        // -0.5, 0.5,  0.5,
        // -0.5, -0.5,  0.5,
        // 0.5, -0.5,  0.5,
      -0.5, -0.5,  0.5,
       0.5, -0.5,  0.5,
      -0.5,  0.5,  0.5,

      -0.5,  0.5,  0.5,
       0.5, -0.5,  0.5,
       0.5,  0.5,  0.5,
  
      ]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
  }
  
  // Fill the buffer with texture coordinates for a plane.
  // 用平面的纹理坐标填充缓冲区。
  function setTexcoords(gl) {
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(
          [
          -3, -1,
           2, -1,
          -3,  4,

          -3,  4,
           2, -1,
           2,  4,
        ]),
        gl.STATIC_DRAW);
  }
  



 

 
 
main();


 };