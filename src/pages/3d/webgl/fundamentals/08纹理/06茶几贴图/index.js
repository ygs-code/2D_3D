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
import wood_128x128 from "static/image/wood_128x128.jpg";
import wood_floor_256 from "static/image/wood_floor_256.jpg";
import wicker_256 from "static/image/wicker_256.jpg";
import example from "static/image/mip-low-res-example.png";
import {WebGLDebugUtils} from "@/pages/3d/utils/lib/webgl-debug.js";
import * as dat from "dat.gui";
import "./index.less";
import "@/pages/index.less";
 


/**
 * Provides cancelRequestAnimationFrame in a cross browser way.
 */
let  cancelRequestAnimFrame = (function() {
  return window.cancelCancelRequestAnimationFrame ||
         window.webkitCancelRequestAnimationFrame ||
         window.mozCancelRequestAnimationFrame ||
         window.oCancelRequestAnimationFrame ||
         window.msCancelRequestAnimationFrame ||
         window.clearTimeout;
})();




const requestAnimFrame = (function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (
      /* function FrameRequestCallback */ callback,
      /* DOMElement Element */ element
    ) {
      return window.setTimeout(callback, 1000 / 60);
    }
  );
})();

 

 window.onload = function () {
   // Get A WebGL context
   var canvas = document.createElement("canvas", {antialias: false});
   var dpr = window.devicePixelRatio || 1;
   canvas.style.width = 400 + "px";
   canvas.style.height = 300 + "px";
   canvas.width = Math.floor(canvas.width * dpr);
   canvas.height = Math.floor(canvas.height * dpr);
 
   document.body.appendChild(canvas);
  // if (!canvas.getContext) return;
  // let gl = canvas.getContext("webgl");
 
  let gl; 
  var pwgl = {};
  pwgl.ongoingImageLoads = [];

  function createGLContext(canvas) {
      var names = ["webgl", "experimental-webgl"];
      var context = null;
      for (var i = 0; i < names.length; i++) {
          try {
              context = canvas.getContext(names[i]);
          } catch (e) {
            console.log(e);
           }
          if (context) {
              break;
          }
      }
      if (context) {
          // 添加动态属性记录画布的大小
          context.viewportWidth = canvas.width;
          context.viewportHeight = canvas.height;
      } else {
          alert("Failed to create WebGL context!");
      }
      return context;
  }

  function setupShaders() {
      // 从 DOM 上创建对应的着色器
      var vertexShader = loadShaderFromDOM("shader-vs");
      var fragmentShader = loadShaderFromDOM("shader-fs");

      // 创建程序并连接着色器
      let  shaderProgram = gl.createProgram();
      gl.attachShader(shaderProgram, vertexShader);
      gl.attachShader(shaderProgram, fragmentShader);
      gl.linkProgram(shaderProgram);

      // 连接失败的检测
      if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
          alert("Failed to setup shaders");
      }

      // 使用着色器
      gl.useProgram(shaderProgram);

      // 获取属性位置
      pwgl.vertexPositionAttributeLoc = gl.getAttribLocation(shaderProgram, "aVertexPosition");
      pwgl.vertexTextureAttributeLoc = gl.getAttribLocation(shaderProgram, "aTextureCoordinates");
      pwgl.uniformMVMatrixLoc = gl.getUniformLocation(shaderProgram, "uMVMatrix");
      pwgl.uniformProjMatrixLoc = gl.getUniformLocation(shaderProgram, "uPMatrix");
      pwgl.uniformSamplerLoc = gl.getUniformLocation(shaderProgram, "uSampler");

      // 设定为数组类型的变量数据
      gl.enableVertexAttribArray(pwgl.vertexPositionAttributeLoc);
      gl.enableVertexAttribArray(pwgl.vertexTextureAttributeLoc);

      // 初始化矩阵
      pwgl.modelViewMatrix = glMatrix.mat4.create();
      pwgl.projectionMatrix = glMatrix.mat4.create();
      pwgl.modelViewMatrixStack = [];
  }

  function loadShaderFromDOM(id) {
      // 获取 DOM
      var shaderScript = document.getElementById(id);

      if (!shaderScript) {
          return null;
      }

      // 获取着色器代码
      var shaderSource = "";
      var currentChild = shaderScript.firstChild;
      while (currentChild) {
          if (currentChild.nodeType == 3) { // 3 corresponds to TEXT_NODE
              shaderSource += currentChild.textContent;
          }
          currentChild = currentChild.nextSibling;
      }

      // 创建着色器
      var shader;
      if (shaderScript.type == "x-shader/x-fragment") {
          shader = gl.createShader(gl.FRAGMENT_SHADER);
      } else if (shaderScript.type == "x-shader/x-vertex") {
          shader = gl.createShader(gl.VERTEX_SHADER);
      } else {
          return null;
      } 

      // 编译着色器
      gl.shaderSource(shader, shaderSource);
      gl.compileShader(shader);

      // 判断编译是否成功
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          alert(gl.getShaderInfoLog(shader));
          return null;
      }
      return shader;
  }

  function setupBuffers() {
      setupFloorBuffers();
      setupCubeBuffers();
  }

  function setupFloorBuffers() {
      // 顶点数据
      pwgl.floorVertexPositionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, pwgl.floorVertexPositionBuffer);
      var floorVertexPosition = [
          // Plane in y=0
          5.0, 0.0, 5.0,      //v0
          5.0, 0.0, -5.0,     //v1
          -5.0, 0.0, -5.0,    //v2
          -5.0, 0.0, 5.0];    //v3

      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(floorVertexPosition), gl.STATIC_DRAW);

      pwgl.FLOOR_VERTEX_POS_BUF_ITEM_SIZE = 3;
      pwgl.FLOOR_VERTEX_POS_BUF_NUM_ITEMS = 4;

      // uv 数据
      pwgl.floorVertexTextureCoordinateBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, pwgl.floorVertexTextureCoordinateBuffer);
      var floorVertexTextureCoordinates = [
          2.0, 0.0,
          2.0, 2.0,
          0.0, 2.0,
          0.0, 0.0
      ];

      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(floorVertexTextureCoordinates), gl.STATIC_DRAW);

      pwgl.FLOOR_VERTEX_TEX_COORD_BUF_ITEM_SIZE = 2;
      pwgl.FLOOR_VERTEX_TEX_COORD_BUF_NUM_ITEMS = 4;

      // 索引数据
      pwgl.floorVertexIndexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, pwgl.floorVertexIndexBuffer);
      var floorVertexIndices = [0, 1, 2, 3];

      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(floorVertexIndices), gl.STATIC_DRAW);

      pwgl.FLOOR_VERTEX_INDEX_BUF_ITEM_SIZE = 1;
      pwgl.FLOOR_VERTEX_INDEX_BUF_NUM_ITEMS = 4;
  }

  function setupCubeBuffers() {
      // 顶点数据
      pwgl.cubeVertexPositionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, pwgl.cubeVertexPositionBuffer);

      var cubeVertexPosition = [
          // Front face
          1.0, 1.0, 1.0,      //v0
          -1.0, 1.0, 1.0,     //v1
          -1.0, -1.0, 1.0,    //v2
          1.0, -1.0, 1.0,     //v3

          // Back face
          1.0, 1.0, -1.0,     //v4
          -1.0, 1.0, -1.0,    //v5
          -1.0, -1.0, -1.0,   //v6
          1.0, -1.0, -1.0,    //v7

          // Left face
          -1.0, 1.0, 1.0,     //v8
          -1.0, 1.0, -1.0,    //v9
          -1.0, -1.0, -1.0,   //v10
          -1.0, -1.0, 1.0,    //v11

          // Right face
          1.0, 1.0, 1.0,      //12
          1.0, -1.0, 1.0,     //13
          1.0, -1.0, -1.0,    //14
          1.0, 1.0, -1.0,     //15

          // Top face
          1.0, 1.0, 1.0,      //v16
          1.0, 1.0, -1.0,     //v17
          -1.0, 1.0, -1.0,    //v18
          -1.0, 1.0, 1.0,     //v19

          // Bottom face
          1.0, -1.0, 1.0,     //v20
          1.0, -1.0, -1.0,    //v21
          -1.0, -1.0, -1.0,   //v22
          -1.0, -1.0, 1.0,    //v23
      ];

      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeVertexPosition), gl.STATIC_DRAW);

      pwgl.CUBE_VERTEX_POS_BUF_ITEM_SIZE = 3;
      pwgl.CUBE_VERTEX_POS_BUF_NUM_ITEMS = 24;

      // uv 数据
      pwgl.cubeVertexTextureCoordinateBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, pwgl.cubeVertexTextureCoordinateBuffer);

      var textureCoordinates = [
          //Front face
          0.0, 0.0, //v0
          1.0, 0.0, //v1
          1.0, 1.0, //v2
          0.0, 1.0, //v3

          // Back face
          0.0, 1.0, //v4
          1.0, 1.0, //v5
          1.0, 0.0, //v6
          0.0, 0.0, //v7

          // Left face
          0.0, 1.0, //v8
          1.0, 1.0, //v9
          1.0, 0.0, //v10
          0.0, 0.0, //v11

          // Right face
          0.0, 1.0, //v12
          1.0, 1.0, //v13
          1.0, 0.0, //v14
          0.0, 0.0, //v15

          // Top face
          0.0, 1.0, //v16
          1.0, 1.0, //v17
          1.0, 0.0, //v18
          0.0, 0.0, //v19

          // Bottom face
          0.0, 1.0, //v20
          1.0, 1.0, //v21
          1.0, 0.0, //v22
          0.0, 0.0, //v23
      ];

      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);

      pwgl.CUBE_VERTEX_TEX_COORD_BUF_ITEM_SIZE = 2;
      pwgl.CUBE_VERTEX_TEX_COORD_BUF_NUM_ITEMS = 24;

      // 索引数据
      pwgl.cubeVertexIndexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, pwgl.cubeVertexIndexBuffer);

      var cubeVertexIndices = [
          0, 1, 2, 0, 2, 3,       // Front face
          4, 6, 5, 4, 7, 6,       // Back face
          8, 9, 10, 8, 10, 11,    // Left face
          12, 13, 14, 12, 14, 15, // Right face
          16, 17, 18, 16, 18, 19, // Top face
          20, 22, 21, 20, 23, 22  // Bottom face
      ];

      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);

      pwgl.CUBE_VERTEX_INDEX_BUF_ITEM_SIZE = 1;
      pwgl.CUBE_VERTEX_INDEX_BUF_NUM_ITEMS = 36;
  }

  function setupTextures() {
      pwgl.woodTexture = gl.createTexture();

      loadImageForTexture(wood_128x128, pwgl.woodTexture);

      pwgl.groundTexture = gl.createTexture();
      loadImageForTexture(wood_floor_256, pwgl.groundTexture);

      pwgl.boxTexture = gl.createTexture();
      loadImageForTexture(wicker_256, pwgl.boxTexture);
  }

  function loadImageForTexture(url, texture) {
      var image = new Image();
      image.onload = function () {
          // pwgl.ongoingImageLoads.splice(pwgl.ongoingImageLoads.indexOf(image), 1);
          textureFinishedLoading(image, texture);
          
      };
      // pwgl.ongoingImageLoads.push(image);
      image.src = url;
  }

  function textureFinishedLoading(image, texture) {
      // 指定当前操作的贴图
      gl.bindTexture(gl.TEXTURE_2D, texture);
      // Y 轴取反
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

      // 创建贴图, 绑定对应的图像并设置数据格式
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

      // 生成 MipMap 映射
      gl.generateMipmap(gl.TEXTURE_2D);

      // 设定参数, 放大滤镜和缩小滤镜的采样方式
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

      // 设定参数, x 轴和 y 轴为镜面重复绘制
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);

      // 清除当前操作的贴图
      gl.bindTexture(gl.TEXTURE_2D, null);
  }

  function draw() {
      gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      // 设置为正交矩阵
      // glMatrix.mat4.ortho(pwgl.projectionMatrix, -8, 8, -8, 8, 0.1, 100);
      // 设置为透视矩阵
      glMatrix.mat4.perspective(pwgl.projectionMatrix, 60 * Math.PI / 180, gl.viewportWidth / gl.viewportHeight, 0.1, 100);
      // 初始化模型视图矩阵
      glMatrix.mat4.identity(pwgl.modelViewMatrix);
      glMatrix.mat4.lookAt(pwgl.modelViewMatrix, [8, 5, -10], [0, 0, 0], [0, 1, 0]);

      uploadModelViewMatrixToShader();
      uploadProjectionMatrixToShader();
      gl.uniform1i(pwgl.uniformSamplerLoc, 0);

      // 绘制地板
      drawFloor();

      // 绘制桌子
      pushModelViewMatrix();
      glMatrix.mat4.translate(pwgl.modelViewMatrix, pwgl.modelViewMatrix, [0, 1.1, 0]);
      uploadModelViewMatrixToShader();
      drawTable();
      popModelViewMatrix();

      // 绘制桌子上的小盒子
      pushModelViewMatrix();
      glMatrix.mat4.translate(pwgl.modelViewMatrix, pwgl.modelViewMatrix, [0, 2.7, 0]);
      glMatrix.mat4.scale(pwgl.modelViewMatrix, pwgl.modelViewMatrix, [0.5, 0.5, 0.5]);
      uploadModelViewMatrixToShader();
      drawCube(pwgl.boxTexture);
      popModelViewMatrix();

      // 开启动画帧循环
      pwgl.requestId = requestAnimFrame(draw, canvas);
  }

  function uploadModelViewMatrixToShader() {
      gl.uniformMatrix4fv(pwgl.uniformMVMatrixLoc, false, pwgl.modelViewMatrix);
  }

  function uploadProjectionMatrixToShader() {
      gl.uniformMatrix4fv(pwgl.uniformProjMatrixLoc, false, pwgl.projectionMatrix);
  }

  // 将 modelViewMatrix 矩阵压入堆栈
  function pushModelViewMatrix() {
      var copyToPush = glMatrix.mat4.clone(pwgl.modelViewMatrix);
      pwgl.modelViewMatrixStack.push(copyToPush);
  }

  // 从矩阵堆栈中取出矩阵并设定为当前的 modelViewMatrix 矩阵
  function popModelViewMatrix() {
      if (pwgl.modelViewMatrixStack.length == 0) {
          throw "Error popModelViewMatrix() - Stack was empty ";
      }
      pwgl.modelViewMatrix = pwgl.modelViewMatrixStack.pop();
  }

  function drawFloor(r, g, b, a) {
      gl.bindBuffer(gl.ARRAY_BUFFER, pwgl.floorVertexPositionBuffer);
      gl.vertexAttribPointer(pwgl.vertexPositionAttributeLoc, pwgl.FLOOR_VERTEX_POS_BUF_ITEM_SIZE, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, pwgl.floorVertexTextureCoordinateBuffer);
      gl.vertexAttribPointer(pwgl.vertexTextureAttributeLoc, pwgl.FLOOR_VERTEX_TEX_COORD_BUF_ITEM_SIZE, gl.FLOAT, false, 0, 0);

      // 激活 0 号纹理单元
      gl.activeTexture(gl.TEXTURE0);
      // 指定当前操作的贴图
      gl.bindTexture(gl.TEXTURE_2D, pwgl.groundTexture);

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, pwgl.floorVertexIndexBuffer);
      gl.drawElements(gl.TRIANGLE_FAN, pwgl.FLOOR_VERTEX_INDEX_BUF_NUM_ITEMS, gl.UNSIGNED_SHORT, 0);
  }

  function drawTable() {
      pushModelViewMatrix();
      glMatrix.mat4.translate(pwgl.modelViewMatrix, pwgl.modelViewMatrix, [0.0, 1.0, 0.0]);
      glMatrix.mat4.scale(pwgl.modelViewMatrix, pwgl.modelViewMatrix, [2.0, 0.1, 2.0]);
      uploadModelViewMatrixToShader();
      // 绘制桌面
      drawCube(pwgl.woodTexture);
      popModelViewMatrix();

      // 绘制 4 个腿
      for (var i = -1; i <= 1; i += 2) {
          for (var j = -1; j <= 1; j += 2) {
              pushModelViewMatrix();
              glMatrix.mat4.translate(pwgl.modelViewMatrix, pwgl.modelViewMatrix, [i * 1.9, -0.1, j * 1.9]);
              glMatrix.mat4.scale(pwgl.modelViewMatrix, pwgl.modelViewMatrix, [0.1, 1.0, 0.1]);
              uploadModelViewMatrixToShader();
              drawCube(pwgl.woodTexture);
              popModelViewMatrix();
          }
      }
  }

  function drawCube(texture) {
      gl.bindBuffer(gl.ARRAY_BUFFER, pwgl.cubeVertexPositionBuffer);
      gl.vertexAttribPointer(pwgl.vertexPositionAttributeLoc, pwgl.CUBE_VERTEX_POS_BUF_ITEM_SIZE, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, pwgl.cubeVertexTextureCoordinateBuffer);
      gl.vertexAttribPointer(pwgl.vertexTextureAttributeLoc, pwgl.CUBE_VERTEX_TEX_COORD_BUF_ITEM_SIZE, gl.FLOAT, false, 0, 0);

      // 激活 0 号纹理单元
      gl.activeTexture(gl.TEXTURE0);
      // 指定当前操作的贴图
      gl.bindTexture(gl.TEXTURE_2D, texture);

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, pwgl.cubeVertexIndexBuffer);

      gl.drawElements(gl.TRIANGLES, pwgl.CUBE_VERTEX_INDEX_BUF_NUM_ITEMS, gl.UNSIGNED_SHORT, 0);
  }

  function handleContextLost(event) {
      event.preventDefault();

      // // 取消动画帧循环
      cancelRequestAnimFrame(pwgl.requestId);

      // 取消所有的加载事件
      for (var i = 0; i < pwgl.ongoingImageLoads.length; i++) {
          pwgl.ongoingImageLoads[i].onload = undefined;
      }
      // 清除图片
      pwgl.ongoingImageLoads = [];
  }

  function handleContextRestored(event) {
      setupShaders();
      setupBuffers();
      setupTextures();
      gl.clearColor(1.0, 1.0, 1.0, 1.0);
      gl.enable(gl.DEPTH_TEST);
      // 开启动画帧循环
      pwgl.requestId =  requestAnimFrame(draw, canvas);
  }

  function startup() {

      // canvas = document.getElementById("myGLCanvas");

      canvas = WebGLDebugUtils.makeLostContextSimulatingCanvas(canvas);
      debugger;
      canvas.addEventListener('webglcontextlost', handleContextLost, false);
      canvas.addEventListener('webglcontextrestored', handleContextRestored, false);

      // 鼠标点击模拟上下文丢失
      // window.addEventListener('mousedown', function() {
      //   canvas.loseContext();
      // });

      gl = createGLContext(canvas);
      setupShaders();
      setupBuffers();
      setupTextures();
      gl.clearColor(1.0, 1.0, 1.0, 1.0);
      gl.enable(gl.DEPTH_TEST);

      draw();
  }


  startup();
 };