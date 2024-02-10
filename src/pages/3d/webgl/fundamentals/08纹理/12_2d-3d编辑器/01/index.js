import initShaders from "@/pages/3d/utils/initShader";
import {
  createBufferInfoFromArrays,
  createProgramFromScripts,
  resizeCanvasToDisplaySize,
  setUniforms,
  createProgramInfo,
  setBuffersAndAttributes
} from "@/pages/3d/utils/webgl-utils.js";
import FSHADER_SOURCE from "./index.frag";
import VSHADER_SOURCE from "./index.vert";
import {getWebGLContext} from "@/pages/3d/utils/lib/cuon-utils";
// import PICK_FSHADER_SOURCE from "./pick-fragment.frag";
// import PICK_VSHADER_SOURCE from "./pick-vertex.vert";
import {createHtmlMatrix} from "@/pages/3d/utils/matrix.js";
import primitives from "@/pages/3d/utils/primitives.js";
import m4 from "@/pages/3d/utils/m4";
import chroma from "@/pages/3d/utils/chroma.min";
import * as glMatrix from "gl-matrix";
import {
  matrixVectorMultiply,
  makeScale,
  makeZRotation,
  makeInverse,
  makeLookAt,
  makeIdentity,
  makeXRotation,
  makeYRotation,
  makeTranslation,
  matrixMultiply,
  makePerspective
} from "@/pages/3d/utils/webgl-3d-math.js";
import controller from "@/pages/3d/utils/controller.js";
import fTexture from "static/image/f-texture.png";
import leaves from "static/image/leaves.jpg";
import example from "static/image/mip-low-res-example.png";
import keyboard from "static/image/keyboard.jpg";
import noodles from "static/image/noodles.jpg";
import {fabric} from 'fabric'; // browser
import panda from 'static/image/panda.png'; // node
import material_kraft from 'static/image/material_kraft.jpeg'; // node
import * as dat from "dat.gui";
 
import "./index.less";
import "@/pages/index.less";

window.onload = function () {
  // Get A WebGL context
    /*
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
    //异步加载图像
    var image = new Image();
    image.src = noodles;
    image.addEventListener("load", function () {
      // Now that the image has loaded make copy it to the texture.
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        image
      );

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
      return (r * 180) / Math.PI;
    }

    function degToRad(d) {
      return (d * Math.PI) / 180;
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
      var zNear = 1;
      var zFar = 2000;
      var projectionMatrix = makePerspective(
        fieldOfViewRadians,
        aspect,
        zNear,
        zFar
      );

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
    var positions = new Float32Array([
      -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, -0.5, -0.5,

      -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5, -0.5,

      -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5, 0.5, 0.5,

      -0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5,

      -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5,

      -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5,

      -0.5, -0.5, -0.5, 0.5, -0.5, -0.5, -0.5, -0.5, 0.5,

      -0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5,

      -0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, -0.5,

      -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5,

      0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5, 0.5,

      0.5, -0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
  }

  // Fill the buffer with texture coordinates the cube.
  function setTexcoords(gl) {
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        // 底面
        // select the bottom left image
        0, 0, 0, 0.5, 0.25, 0, 0, 0.5, 0.25, 0.5, 0.25, 0,

        // select the bottom middle image
        0.25, 0, 0.5, 0, 0.25, 0.5, 0.25, 0.5, 0.5, 0, 0.5, 0.5,
        // select to bottom right image
        0.5, 0, 0.5, 0.5, 0.75, 0, 0.5, 0.5, 0.75, 0.5, 0.75, 0,
        // select the top left image
        0, 0.5, 0.25, 0.5, 0, 1, 0, 1, 0.25, 0.5, 0.25, 1,
        // select the top middle image
        0.25, 0.5, 0.25, 1, 0.5, 0.5, 0.25, 1, 0.5, 1, 0.5, 0.5,
        // select the top right image
        0.5, 0.5, 0.75, 0.5, 0.5, 1, 0.5, 1, 0.75, 0.5, 0.75, 1
      ]),
      gl.STATIC_DRAW
    );
  }

  main();


  */

  class ThreeDimensions {
    constructor(options) {
      this.options = options;
      this.init();
    }
    init(){
      this.createCanvas();
      this.createProgram();
      this.attribUniformVaring();
     

      // 定点
      this.positions = this.getGeometry();
      
      this.setBuffer({
        location:this.positionLocation,
        groupNum:3,
        FSIZE:this.positions.BYTES_PER_ELEMENT
      });
      
      this.setBufferData(this.positions);
      this.texcoords = this.getTexcoords( );
      this.setBuffer({
        location: this.texcoordLocation,
        groupNum:2,
        FSIZE: this.texcoords.BYTES_PER_ELEMENT
      });
      this.setBufferData(this.texcoords);
      
      this.setTexture(()=>{
        this.drawScene(new Date().getTime());
      });
      this.drawScene(new Date().getTime());
    }

   isPowerOf2(value) {
      return (value & (value - 1)) == 0;
    }

    degToRad(d) {
      return (d * Math.PI) / 180;
    }
     // Draw the scene.
    drawScene(time) {
    const gl=this.gl;
    var fieldOfViewRadians = this.degToRad(60);
    var modelXRotationRadians =  this.degToRad(0);
    var modelYRotationRadians =  this.degToRad(0);
    // Get the starting time.
    var then = 0;
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
      var aspect = this.canvas.clientWidth / this.canvas.clientHeight;
      var zNear = 1;
      var zFar = 2000;
      // 透视投影
      var projectionMatrix = makePerspective(
        fieldOfViewRadians,
        aspect,
        zNear,
        zFar
      );

      var cameraPosition = [0, 0, 2];
      var up = [0, 1, 0];
      var target = [0, 0, 0];

      // Compute the camera's matrix using look at.
      // 相机
      var cameraMatrix = makeLookAt(cameraPosition, target, up);

      // Make a view matrix from the camera matrix.
      // 视图矩阵
      var viewMatrix = makeInverse(cameraMatrix);

      //偏移
      var translationMatrix = makeTranslation(0, 0, 0);

      // 旋转
      var xRotationMatrix = makeXRotation(modelXRotationRadians);
      var yRotationMatrix = makeYRotation(modelYRotationRadians);

      // Multiply the matrices.
      // 矩阵相乘
      var matrix = yRotationMatrix;
      matrix = matrixMultiply(matrix, xRotationMatrix);
      matrix = matrixMultiply(matrix, translationMatrix);
      matrix = matrixMultiply(matrix, viewMatrix);
      matrix = matrixMultiply(matrix, projectionMatrix);

      // Set the matrix.
      gl.uniformMatrix4fv(this.matrixLocation, false, matrix);

      // Draw the geometry. 定点坐标渲染
      gl.drawArrays(gl.TRIANGLES, 0, 6 * 6);
      // requestAnimationFrame((...ags)=>{
      //   this.drawScene(...ags);
      // });
    
      // requestAnimationFrame(this.drawScene);
    }
    setTexture(callback=()=>{}){
      const gl=this.gl;
         // Create a texture.
    // 创建纹理
    var texture = gl.createTexture();
   //翻转图像的y轴
   gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,1);
      //启用纹理unit0
   gl.activeTexture(gl.TEXTURE0);

    gl.bindTexture(gl.TEXTURE_2D, texture);
    // Fill the texture with a 1x1 blue pixel.
    // 用1x1的蓝色像素填充纹理。 可以设置不同的贴图方式
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
    //异步加载图像
    var image = new Image();
    image.src = material_kraft;
    image.addEventListener("load",   () =>{
      // Now that the image has loaded make copy it to the texture.
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        image
      );

      // Check if the image is a power of 2 in both dimensions.
      if (this.isPowerOf2(image.width) && this.isPowerOf2(image.height)) {
        // Yes, it's a power of 2. Generate mips.
        gl.generateMipmap(gl.TEXTURE_2D);
      } else {
        // No, it's not a power of 2. Turn of mips and set wrapping to clamp to edge
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      }
      callback();
    });
    }

      // Fill the buffer with texture coordinates the cube.
    getTexcoords( ) {
    // gl.bufferData(
    //   gl.ARRAY_BUFFER,
   return   new Float32Array([
        // 底面
        // select the bottom left image
        0, 0, 0, 0.5, 0.25, 0, 0, 0.5, 0.25, 0.5, 0.25, 0,
        // select the bottom middle image
        0.25, 0, 0.5, 0, 0.25, 0.5, 0.25, 0.5, 0.5, 0, 0.5, 0.5,
        // select to bottom right image
        0.5, 0, 0.5, 0.5, 0.75, 0, 0.5, 0.5, 0.75, 0.5, 0.75, 0,
        // select the top left image
        0, 0.5, 0.25, 0.5, 0, 1, 0, 1, 0.25, 0.5, 0.25, 1,
        // select the top middle image
        0.25, 0.5, 0.25, 1, 0.5, 0.5, 0.25, 1, 0.5, 1, 0.5, 0.5,
        // select the top right image
        0.5, 0.5, 0.75, 0.5, 0.5, 1, 0.5, 1, 0.75, 0.5, 0.75, 1
      ]);  //,
    //   gl.STATIC_DRAW
    // );
  }

  // Fill the buffer with the values that define a cube.
    getGeometry( ) {
    return   new Float32Array([
      -0.5, -0.5, -0.5, 
      -0.5, 0.5, -0.5, 
      0.5, -0.5, -0.5,

      -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5, -0.5,

      -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5, 0.5, 0.5,

      -0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5,

      -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5,

      -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5,

      -0.5, -0.5, -0.5, 0.5, -0.5, -0.5, -0.5, -0.5, 0.5,

      -0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5,

      -0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, -0.5,

      -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5,

      0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5, 0.5,

      0.5, -0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5
    ]);
    // gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
  }
    setBufferData(positions){
      const gl=this.gl;
      this.gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    }
    setBuffer(
      {
        location,
        groupNum,
        type= this.gl.FLOAT,
        // FSIZE,
        index=0
      }
      ){
      const gl=this.gl;
      const   FSIZE =   location.BYTES_PER_ELEMENT;
      var buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  /*
     
     告诉显卡从当前绑定的缓 冲区（bindBuffer() 指定的缓冲区）中读取顶点数据。
     方法绑定当前缓冲区范围到gl.ARRAY_BUFFER,
     成为当前顶点缓冲区对象的通用顶点属性并指定它的布局 (缓冲区对象中的偏移量)。

     */
  gl.vertexAttribPointer(
    location, // 变量 指定要修改的顶点属性的索引。
    groupNum, // size 2个数据为一组 告诉三个点位一组颜色  1, 2, 3, or 4. 指定每个顶点属性的组成数量，必须是 1，2，3 或 4。
    type, //type gl.FLOAT: 32-bit IEEE floating point number 32 位 IEEE 标准的浮点数
    false, // normalized 当转换为浮点数时是否应该将整数数值归一化到特定的范围。
    FSIZE * groupNum, // stride 以字节为单位指定连续顶点属性开始之间的偏移量 (即数组中一行长度)。不能大于 255。如果 stride 为 0，则假定该属性是紧密打包的，即不交错属性，每个属性在一个单独的块中，下一个顶点的属性紧跟当前顶点之后。
    FSIZE * index  //offset 指定顶点属性数组中第一部分的字节偏移量。必须是类型的字节长度的倍数。
  ); //  告诉gl如何解析数据

  // 5.确认 // 启用数据
  // 连接a_Position变量与分配给他的缓冲区对象
  gl.enableVertexAttribArray(location);

    }
    createCanvas() {
      const {elId}=this.options; 
      // Get A WebGL context
      var canvas = document.getElementById(elId, {antialias: false});
      var dpr = window.devicePixelRatio || 1;
      // canvas.style.width = 400 + "px";
      // canvas.style.height = 300 + "px";
      canvas.width = Math.floor(canvas.width * dpr);
      canvas.height = Math.floor(canvas.height * dpr);

      // document.body.appendChild(canvas);
      if (!canvas.getContext) return;
      this.gl = canvas.getContext("webgl");
      this.canvas=canvas;
    }
    createProgram(){
      this.gl.enable(this.gl.CULL_FACE);
      this.gl.enable(this.gl.DEPTH_TEST);
      // setup GLSL program
      this. program = initShaders(this.gl, VSHADER_SOURCE, FSHADER_SOURCE);
      this.gl.useProgram( this. program);
  
    }
    attribUniformVaring(){
      const gl=this.gl;
    // look up where the vertex data needs to go.
    // 模型定点的 shander 地址
    this. positionLocation = gl.getAttribLocation(this.program, "a_position");
    this. texcoordLocation = gl.getAttribLocation(this.program, "a_texcoord");

    // lookup uniforms
    this. matrixLocation = gl.getUniformLocation(this.program, "u_matrix");
    }
  }



  /*
 

  window.onload = function () {
    let canvas1 = document.createElement("canvas");
    canvas1 .id='canvas';
    canvas1.width = 500;
    canvas1.height = 500;
    // getWebGLContext(canvas);
    document.body.appendChild(canvas1);
    let ctx = canvas1.getContext('2d');

    let  canvas = new fabric.Canvas('canvas');
    console.log('canvas==',canvas);
   // create a rectangle object
var rect = new fabric.Rect({
    left: 100,
    top: 100,
    fill: 'red',
    width: 20,
    height: 20
  });

 

const img = new Image();
img.src=panda;

img.onload=function(){
    var imgInstance = new fabric.Image(this,{  //设置图片位置和样子
        // left:100,
        // top:100,
        // width:200,
        // height:100,
        // angle:30//设置图形顺时针旋转角度
      });
      canvas.add(imgInstance);//加入到canvas中


    //   setTimeout(()=>{
    //    // show the result
    //    ctx.canvas.toBlob((blob) => {
    //     const img = new Image();
    //     img.src = URL.createObjectURL(blob);
    //     document.body.appendChild(img);
    // });

    //    const img1 = new Image();
    // let url =   canvas.toDataURL('png');
    // img1.src = url;
    // document.body.appendChild(img1);

    //   },100);

    // const img1 = new Image();
    // let url =   canvas.toDataURL('png');
    // img1.src = url;
    // document.body.appendChild(img1);
};




canvas.on('mouse:over', function (e) {
    console.log('Mouse over object:', e.target);
  });


  

  canvas.on('object:modified', function (e) {
    console.log('object:modified');
    let img1=document.getElementById('img');
    //    const img1 = new Image();
    let url =   canvas.toDataURL('png');
    img1.src = url;
    document.body.appendChild(img1);
  });


  canvas.on('object:rotating', function (e) {
    console.log('object:rotating');
    let img1=document.getElementById('img');
    //    const img1 = new Image();
    let url =   canvas.toDataURL('png');
    img1.src = url;
    document.body.appendChild(img1);
  });


  canvas.on('object:skewing', function (e) {
    console.log('object:scaling');
    let img1=document.getElementById('img');
    //    const img1 = new Image();
    let url =   canvas.toDataURL('png');
    img1.src = url;
    document.body.appendChild(img1);
  });

  canvas.on('object:scaling', function (e) {
    console.log('object:scaling');
    let img1=document.getElementById('img');
    //    const img1 = new Image();
    let url =   canvas.toDataURL('png');
    img1.src = url;
    document.body.appendChild(img1);
  });


  canvas.on('object:moving', function (e) {
    console.log('object:moving');
    let img1=document.getElementById('img');
    //    const img1 = new Image();
    let url =   canvas.toDataURL('png');
    img1.src = url;
    document.body.appendChild(img1);
  });

  // 事件触发
  canvas.on('after:render', function (e) {
   
    // const img1 = new Image();
    // let url =   canvas.toDataURL('png');
    // img1.src = url;
    // document.body.appendChild(img1);
  });

   
  // "add" rectangle onto canvas
  canvas.add(rect);
   
   };

 */

  class TwoDimension {
    constructor() {
      this.init();
    }
    init(){
      this.createCanvas();
      // var rect = new fabric.Rect({
      //   left: 100,
      //   top: 100,
      //   fill: 'red',
      //   width: 20,
      //   height: 20
      // });
      // this.canvas.add(rect);
      // this. loadImage();
      this.addImage({
         src:panda,
      });
      this.evnets((eventKey)=>{

        let img1=document.getElementById('img');
   
          //    const img1 = new Image();
          let url =  this.editFabricCanvas.toDataURL('png');
          console.log('url==',url);
          console.log('img1==',img1);
          img1.src = url;
          // document.body.appendChild(img1);

      });
    }
    loadImage(src){
        return  new Promise((reslove,reject)=>{
            const img = new Image();
            img.src=src;
            img.onload= function (){
              reslove(this);
          };
          img.onerror=function (error){
            reject(error);
          };
        });
    }
    async addImage(options={}){
        const {src, ...more}=options;
        const img =  await this.loadImage(src);
        console.log('img===',img);
            var imgInstance = new fabric.Image(img,{  //设置图片位置和样子
              ...more
              });
          this.editFabricCanvas.add(imgInstance);//加入到canvas中
    }
    evnets(callback=()=>{}){
      let evnetKeys=[
        'object:modified', 
        'object:rotating', 
        'object:skewing',
        'object:scaling',
        'object:moving'
      ];

      for(let key of evnetKeys){
        this.editFabricCanvas.on(key,  (e) =>{
          console.log('eventKey=',key);
          callback(key);
          // let img1=document.getElementById('img');
          // //    const img1 = new Image();
          // let url =   canvas.toDataURL('png');
          // img1.src = url;
          // document.body.appendChild(img1);
        });
      
      }
    }
    createCanvas(){
  
    this.editCanvas = document.getElementById('eidt', {antialias: false});
    this.editCtx =   this.editCanvas.getContext('2d');
    this.editCanvas.width = 500;
    this.editCanvas.height =  500;
    this.editFabricCanvas = new fabric.Canvas('eidt');
  

    }
  }

  class Main {
    constructor() {}
  }


  new ThreeDimensions({
    elId:'view',
  });
  new TwoDimension();
};


