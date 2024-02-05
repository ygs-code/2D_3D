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
 
    
    // setup GLSL program
    var program = initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
  
    // look up where the vertex data needs to go.
    var positionLocation = gl.getAttribLocation(program, "a_position");
    var texcoordLocation = gl.getAttribLocation(program, "a_texcoord");
  
    // lookup uniforms
    var matrixLocation = gl.getUniformLocation(program, "u_matrix");
    var textureLocation = gl.getUniformLocation(program, "u_texture");
  
    // Create a buffer for positions
    // 创建顶点buffer
    var positionBuffer = gl.createBuffer();
    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // Put the positions in the buffer
    // 设置 顶点
    setGeometry(gl);
  
    // provide texture coordinates for the rectangle.
    // 创建纹理buffer
    var texcoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    // Set Texcoords.
    // 设置纹理
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
     //翻转图像的y轴
    //  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,1);
      // Now that the image has loaded make copy it to the texture.
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
  
      // // Check if the image is a power of 2 in both dimensions.
      // if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
      //    // Yes, it's a power of 2. Generate mips.
      //    gl.generateMipmap(gl.TEXTURE_2D);
      // } else {
      //    // No, it's not a power of 2. Turn of mips and set wrapping to clamp to edge
      //    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      //    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      //    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      // }
      drawScene();
    });
  
    var wrapS = gl.REPEAT;
    var wrapT = gl.REPEAT;


    

    const gui = new dat.GUI();
 
console.log(11111111111);
let parameters = { 
  a: false, 
  b: false, 
  c: false,
  wrapS:{
    a: false, 
    b: false, 
    c: false,
    d: false,
  },

  wrapT:{
    a: false, 
    b: false, 
    c: false,
    d: false,
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
 
  first.add(parameters.wrapS, 'c').name('MIRRORED_REPEAT').listen().onChange(function(){
    setChecked('wrapS',"c");
    wrapS = gl.MIRRORED_REPEAT;
     drawScene();
  }); 
 


  // first.add(parameters.wrapS, 'd').name('gl.CLAMP_TO_BORDER').listen().onChange(function(){
  //   setChecked('wrapS',"d");
  //   // wrapS = gl.CLAMP_TO_BORDER;
  //    drawScene();
  // }); 
 



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

  first1.add(parameters.wrapT, 'c').name('MIRRORED_REPEAT').listen().onChange(function(){
    setChecked('wrapT',"c");
    wrapT = gl.MIRRORED_REPEAT;
     drawScene();
  }); 
 

  // first1.add(parameters.wrapT, 'd').name('gl.CLAMP_TO_BORDER').listen().onChange(function(){
  //   setChecked('wrapT',"d");
  //   wrapT = gl.CLAMP_TO_BORDER;
  //    drawScene();
  // }); 
 

function setChecked(key, prop){ 
  for (let param in  parameters[key]){ 
  parameters[key][param] = false; 
  } 
  parameters[key][prop] = true; 
} 


  


  
    // document.querySelector("#wrap_s0").addEventListener('change', function() { wrapS = gl.REPEAT;          drawScene(); });  // eslint-disable-line
    // document.querySelector("#wrap_s1").addEventListener('change', function() { wrapS = gl.CLAMP_TO_EDGE;   drawScene(); });  // eslint-disable-line
    // document.querySelector("#wrap_s2").addEventListener('change', function() { wrapS = gl.MIRRORED_REPEAT; drawScene(); });  // eslint-disable-line
    // document.querySelector("#wrap_t0").addEventListener('change', function() { wrapT = gl.REPEAT;          drawScene(); });  // eslint-disable-line
    // document.querySelector("#wrap_t1").addEventListener('change', function() { wrapT = gl.CLAMP_TO_EDGE;   drawScene(); });  // eslint-disable-line
    // document.querySelector("#wrap_t2").addEventListener('change', function() { wrapT = gl.MIRRORED_REPEAT; drawScene(); });  // eslint-disable-line
  
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
  
    window.addEventListener('resize', drawScene);
  
    // Draw the scene.
    function drawScene() {
       resizeCanvasToDisplaySize(gl.canvas);
  
      // Tell WebGL how to convert from clip space to pixels
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  
      // Clear the framebuffer texture.
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
      gl.enable(gl.CULL_FACE);
      gl.enable(gl.DEPTH_TEST);
  
      // Compute the matrix
      var scaleFactor = 2.5;
      var tsize = 80 * scaleFactor;
      var x = gl.canvas.clientWidth / 2 - tsize / 2;
      var y = gl.canvas.clientHeight - tsize - 60;

      // gridContainer.style.left = (x - 50 * scaleFactor) + 'px';
      // gridContainer.style.top  = (y - 50 * scaleFactor) + 'px';
      // gridContainer.style.width  = (scaleFactor * 400) + 'px';
      // gridContainer.style.height = (scaleFactor * 300) + 'px';
  
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
      // 透视投影
      var projectionMatrix =   m4.orthographic(0, gl.canvas.clientWidth, gl.canvas.clientHeight, 0, -1, 1);
  
      gl.bindTexture(gl.TEXTURE_2D, texture);
      /*
      纹理缩小滤波器 TEXTURE_MIN_FILTER 纹理缩小滤波器，是纹理在webgl图形中被缩小的情况。
      NEAREST 最近滤镜， 获得最靠近纹理坐标点的像素，效果锐利
      */ 
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      // 纹理坐标水平填充 s
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
      // 纹理坐标垂直填充 t
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);

 

  
      var matrix = m4.translate(projectionMatrix, x, y, 0);
      matrix = m4.scale(matrix, tsize, tsize, 1);
      matrix = m4.translate(matrix, 0.5, 0.5, 0);
  
      // Set the matrix.
      gl.uniformMatrix4fv(matrixLocation, false, matrix);
  
      // Tell the shader to use texture unit 0 for u_texture
      gl.uniform1i(textureLocation, 0);
  
      // Draw the geometry.
      gl.drawArrays(gl.TRIANGLES, 0, 1 * 6);
    }
  }
  
  // Fill the buffer with the values that define a plane.
  function setGeometry(gl) {
    var positions = new Float32Array(
      [
        -0.5,  0.5,  0.5,
         0.5,  0.5,  0.5,
        -0.5, -0.5,  0.5,

        -0.5, -0.5,  0.5,
         0.5,  0.5,  0.5,
         0.5, -0.5,  0.5,
      ]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
  }
  
  // Fill the buffer with texture coordinates for a plane.
  function setTexcoords(gl) {
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(
          [

            0,1,
            1,1,
            0,0,


            0,0,
            1,1,
            1,0,


            // -3, -1,
            //  2, -1,
            // -3,  4,

            // -3,  4,
            //  2, -1,
            //  2,  4,

          ]),
        gl.STATIC_DRAW);
  }
  


 

 
 
main();


 };