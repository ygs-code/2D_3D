import {getWebGLContext, initShaders} from "@/pages/3d/utils/lib/cuon-utils";
import initShader from "./initShader";
import {resizeCanvasToDisplaySize} from "@/pages/3d/utils/webgl-utils.js";
import m4 from "./m4";
import FSHADER_SOURCE from "./index.frag";
import VSHADER_SOURCE from "./index.vert";

import COLOR_FSHADER_SOURCE from "./color.frag";
import COLOR_VSHADER_SOURCE from "./color.vert";

import controller from "@/pages/3d/utils/controller.js";
// import {colors, fData} from "./data";
// import {createHtmlMatrix} from "@/pages/3d/utils/matrix.js";
import {createHtmlMatrix, multiply} from "@/pages/3d/utils/matrix.js";
import * as twgl from "@/pages/3d/utils/twgl";
import * as glMatrix from "gl-matrix";

import "./index.less";

window.onload = function () {
  function px(v) {
    return `${v | 0}px`;
  }

  function degToRad(deg) {
    return (deg * Math.PI) / 180;
  }

  function lerp(a, b, l) {
    return a + (b - a) * l;
  }

  const v3 = twgl.v3;
  const m4 = twgl.m4;

  var eyePosition;
  var target;

  // globals
  var pixelRatio = window.devicePixelRatio || 1;
  var scale = 1;

  var canvas = document.createElement("canvas");
  canvas.width = 500;
  canvas.height = 500;
  document.body.appendChild(canvas);

  if (!canvas.getContext) return;
  var gl = canvas.getContext("webgl");

  const darkColors = {
    lines: [1, 1, 1, 1]
  };
  const lightColors = {
    lines: [0, 0, 0, 1]
  };

  // 媒体查询
  const darkMatcher = window.matchMedia("(prefers-color-scheme: dark)");

  const isDarkMode = darkMatcher.matches;
  // 颜色 背景颜色
  const colors = isDarkMode ? darkColors : lightColors;

  // Create Geometry. 创建几何。
  // 线立方阵列
  var wireCubeArrays = {
    position: [
      // 顶点位置
      -1, 1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1,

      -1, 1, 1, 1, 1, 1, 1, -1, 1, -1, -1, 1
    ],
    color: [
      // 颜色
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,

      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
    ],
    indices: [
      //指数
      0, 1, 1, 2, 2, 3, 3, 0, 4, 5, 5, 6, 6, 7, 7, 4, 0, 4, 1, 5, 2, 6, 3, 7
    ]
  };

  // 颜色
  // 创建Program 返回 program
  var vertexColorProgramInfo = initShader(
    gl,
    COLOR_VSHADER_SOURCE,
    COLOR_FSHADER_SOURCE
  );

  // 创建 Buffer
  var wireCubeBufferInfo = twgl.createBufferInfoFromArrays(gl, wireCubeArrays);

  //顶点参数选项
  var cubeRaysArrays = {
    position: wireCubeArrays.position,
    // 颜色
    color: [
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,

      ...colors.lines,
      ...colors.lines,
      ...colors.lines,
      ...colors.lines
    ],
    indices: [0, 4, 1, 5, 2, 6, 3, 7]
  };

  // 创建 Buffer
  var cubeRaysBufferInfo = twgl.createBufferInfoFromArrays(gl, cubeRaysArrays);

  // 创建Program 返回 program
  var colorProgramInfo = initShader(gl, VSHADER_SOURCE, FSHADER_SOURCE);

  // *创建立方体的顶点和索引。
  var cubeArrays = twgl.primitives.createCubeVertices(2);

  delete cubeArrays.normal;
  delete cubeArrays.texcoord;

  // 颜色
  var faceColors = [
    [1, 0, 0, 1],
    [0, 1, 0, 1],
    [1, 1, 0, 1],
    [0, 0, 1, 1],
    [1, 0, 1, 1],
    [0, 1, 1, 1]
  ];
  var colorVerts = [];
  for (var f = 0; f < 6; ++f) {
    for (var v = 0; v < 4; ++v) {
      colorVerts.push(...faceColors[f]);
    }
  }
  cubeArrays.color = colorVerts;
  // 创建 Buffer
  var cubeBufferInfo = twgl.createBufferInfoFromArrays(gl, cubeArrays);

  // 创建 Buffer
  var fBufferInfo = twgl.createBufferInfoFromArrays(gl, {
    position: [
      // left column front
      0, 0, 0, 0, 150, 0, 30, 0, 0, 0, 150, 0, 30, 150, 0, 30, 0, 0,

      // top rung front
      30, 0, 0, 30, 30, 0, 100, 0, 0, 30, 30, 0, 100, 30, 0, 100, 0, 0,

      // middle rung front
      30, 60, 0, 30, 90, 0, 67, 60, 0, 30, 90, 0, 67, 90, 0, 67, 60, 0,

      // left column back
      0, 0, 30, 30, 0, 30, 0, 150, 30, 0, 150, 30, 30, 0, 30, 30, 150, 30,

      // top rung back
      30, 0, 30, 100, 0, 30, 30, 30, 30, 30, 30, 30, 100, 0, 30, 100, 30, 30,

      // middle rung back
      30, 60, 30, 67, 60, 30, 30, 90, 30, 30, 90, 30, 67, 60, 30, 67, 90, 30,

      // top
      0, 0, 0, 100, 0, 0, 100, 0, 30, 0, 0, 0, 100, 0, 30, 0, 0, 30,

      // top rung right
      100, 0, 0, 100, 30, 0, 100, 30, 30, 100, 0, 0, 100, 30, 30, 100, 0, 30,

      // under top rung
      30, 30, 0, 30, 30, 30, 100, 30, 30, 30, 30, 0, 100, 30, 30, 100, 30, 0,

      // between top rung and middle
      30, 30, 0, 30, 60, 30, 30, 30, 30, 30, 30, 0, 30, 60, 0, 30, 60, 30,

      // top of middle rung
      30, 60, 0, 67, 60, 30, 30, 60, 30, 30, 60, 0, 67, 60, 0, 67, 60, 30,

      // right of middle rung
      67, 60, 0, 67, 90, 30, 67, 60, 30, 67, 60, 0, 67, 90, 0, 67, 90, 30,

      // bottom of middle rung.
      30, 90, 0, 30, 90, 30, 67, 90, 30, 30, 90, 0, 67, 90, 30, 67, 90, 0,

      // right of bottom
      30, 90, 0, 30, 150, 30, 30, 90, 30, 30, 90, 0, 30, 150, 0, 30, 150, 30,

      // bottom
      0, 150, 0, 0, 150, 30, 30, 150, 30, 0, 150, 0, 30, 150, 30, 30, 150, 0,

      // left side
      0, 0, 0, 0, 0, 30, 0, 150, 30, 0, 0, 0, 0, 150, 30, 0, 150, 0
    ],
    color: {
      numComponents: 3,
      data: new Uint8Array([
        // left column front
        200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70, 120,
        200, 70, 120,

        // top rung front
        200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70, 120,
        200, 70, 120,

        // middle rung front
        200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70, 120,
        200, 70, 120,

        // left column back
        80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70,
        200,

        // top rung back
        80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70,
        200,

        // middle rung back
        80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70,
        200,

        // top
        70, 200, 210, 70, 200, 210, 70, 200, 210, 70, 200, 210, 70, 200, 210,
        70, 200, 210,

        // top rung right
        200, 200, 70, 200, 200, 70, 200, 200, 70, 200, 200, 70, 200, 200, 70,
        200, 200, 70,

        // under top rung
        210, 100, 70, 210, 100, 70, 210, 100, 70, 210, 100, 70, 210, 100, 70,
        210, 100, 70,

        // between top rung and middle
        210, 160, 70, 210, 160, 70, 210, 160, 70, 210, 160, 70, 210, 160, 70,
        210, 160, 70,

        // top of middle rung
        70, 180, 210, 70, 180, 210, 70, 180, 210, 70, 180, 210, 70, 180, 210,
        70, 180, 210,

        // right of middle rung
        100, 70, 210, 100, 70, 210, 100, 70, 210, 100, 70, 210, 100, 70, 210,
        100, 70, 210,

        // bottom of middle rung.
        76, 210, 100, 76, 210, 100, 76, 210, 100, 76, 210, 100, 76, 210, 100,
        76, 210, 100,

        // right of bottom
        140, 210, 80, 140, 210, 80, 140, 210, 80, 140, 210, 80, 140, 210, 80,
        140, 210, 80,

        // bottom
        90, 130, 110, 90, 130, 110, 90, 130, 110, 90, 130, 110, 90, 130, 110,
        90, 130, 110,

        // left side
        160, 160, 220, 160, 160, 220, 160, 160, 220, 160, 160, 220, 160, 160,
        220, 160, 160, 220
      ])
    }
  });

  // pre-allocate a bunch of arrays
  var projection = new Float32Array(16);
  var exampleProjection = new Float32Array(16);
  var exampleInverseProjection = new Float32Array(16);
  var view = new Float32Array(16);
  var world = new Float32Array(16);
  var viewProjection = new Float32Array(16);
  eyePosition = new Float32Array([31, 17, 15]);
  var worldViewProjection = new Float32Array(16);
  var exampleWorldViewProjection = new Float32Array(16);
  target = new Float32Array([23, 16, 0]);
  var up = new Float32Array([0, 1, 0]);
  var v3t0 = new Float32Array(3);
  var zeroMat = new Float32Array(16);

  var targetToEye = new Float32Array(3);
  // 相机
  v3.subtract(eyePosition, target, targetToEye);

  // uniforms.
  var sharedUniforms = {};

  var sceneCubeUniforms = {
    u_color: [1, 1, 1, 1],
    u_worldViewProjection: worldViewProjection,
    u_exampleWorldViewProjection: exampleWorldViewProjection
  };

  var frustumCubeUniforms = {
    u_color: [1, 1, 1, 0.4],
    u_worldViewProjection: worldViewProjection,
    u_exampleWorldViewProjection: zeroMat
  };

  var cubeRaysUniforms = {
    u_color: colors.lines,
    u_worldViewProjection: worldViewProjection
  };

  var wireFrustumUniforms = {
    u_color: colors.lines,
    u_worldViewProjection: worldViewProjection
  };

  var zNear = 10;
  var zFar = 50;
  var fieldOfView = 30;
  var zPosition = -25;

  // Draw scene
  function drawScene(viewProjection, exampleProjection, time) {
    gl.useProgram(colorProgramInfo.program);
    twgl.setBuffersAndAttributes(gl, colorProgramInfo, cubeBufferInfo);
    var cubeScale = scale * 3;
    for (var ii = -1; ii <= 1; ++ii) {
      m4.translation([ii * 10, 0, zPosition], world);
      m4.rotateY(world, time + (ii * Math.PI) / 6, world);
      m4.rotateX(world, Math.PI / 4, world);
      m4.rotateZ(world, Math.PI / 4, world);
      m4.scale(world, [cubeScale, cubeScale, cubeScale], world);
      m4.multiply(viewProjection, world, worldViewProjection);

      m4.multiply(exampleProjection, world, exampleWorldViewProjection);

      twgl.setUniforms(colorProgramInfo, sceneCubeUniforms);
      twgl.drawBufferInfo(gl, cubeBufferInfo);
    }

    var rotation = [degToRad(40), degToRad(25), degToRad(325)];
    m4.translation([45, 150, 0], world);
    m4.rotateX(world, rotation[0], world);
    m4.rotateY(world, rotation[1], world);
    m4.rotateZ(world, rotation[2], world);
    m4.multiply(viewProjection, world, worldViewProjection);
    m4.multiply(exampleProjection, world, exampleWorldViewProjection);
    twgl.setBuffersAndAttributes(gl, colorProgramInfo, fBufferInfo);
    twgl.setUniforms(colorProgramInfo, sceneCubeUniforms);
    twgl.drawBufferInfo(gl, fBufferInfo);
  }

  // Draw Frustum Cube behind
  function drawFrustumCube(aspect) {
    gl.useProgram(colorProgramInfo.program);
    twgl.setBuffersAndAttributes(gl, colorProgramInfo, cubeBufferInfo);
    // 透视矩阵
    m4.perspective(
      degToRad(fieldOfView),
      aspect,
      zNear,
      zFar * scale,
      exampleProjection
    );
    m4.inverse(exampleProjection, exampleInverseProjection);

    m4.translation([0, 0, 0], world);
    m4.multiply(exampleInverseProjection, world, world);
    m4.scale(world, [scale, scale, scale], world);
    m4.multiply(viewProjection, world, worldViewProjection);

    twgl.setUniforms(colorProgramInfo, sharedUniforms);
    twgl.setUniforms(colorProgramInfo, frustumCubeUniforms);
    twgl.drawBufferInfo(gl, cubeBufferInfo);
  }
  function render(time) {
    time *= 0.001;

    twgl.resizeCanvasToDisplaySize(canvas, pixelRatio);
    const halfHeight = gl.canvas.height / 2;
    const width = gl.canvas.width;

    // clear the screen.
    gl.disable(gl.SCISSOR_TEST);
    gl.colorMask(true, true, true, true);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.viewport(0, halfHeight, width, halfHeight);

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    var aspect = gl.canvas.clientWidth / (gl.canvas.clientHeight / 2);

    // 透视矩阵
    m4.perspective(degToRad(60), aspect, 1, 5000, projection);

    var f = Math.max(30, fieldOfView) - 30;
    f = f / (179 - 30);
    f = f * f * f * f;
    f = lerp(1, 179 * 0.9, f);
    f = 1;
    v3.mulScalar(targetToEye, f, v3t0);
    v3.add(v3t0, target, v3t0);
    m4.lookAt(
      v3t0, //eyePosition,
      target,
      up,
      view
    );
    m4.inverse(view, view);
    m4.multiply(projection, view, viewProjection);

    drawScene(viewProjection, exampleProjection, time);

    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    drawFrustumCube(aspect);
    gl.disable(gl.CULL_FACE);

    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.FRONT);
    //    drawFrustumCube();
    gl.disable(gl.CULL_FACE);

    // Draw view cone.
    // 透视矩阵
    m4.perspective(degToRad(fieldOfView), aspect, 1, 5000, exampleProjection);
    m4.inverse(exampleProjection, exampleInverseProjection);

    m4.translation([0, 0, 0], world);
    m4.multiply(world, exampleInverseProjection, world);
    m4.scale(world, [scale, scale, scale], world);
    m4.multiply(viewProjection, world, worldViewProjection);

    gl.useProgram(vertexColorProgramInfo.program);
    twgl.setBuffersAndAttributes(
      gl,
      vertexColorProgramInfo,
      cubeRaysBufferInfo
    );
    twgl.setUniforms(vertexColorProgramInfo, sharedUniforms);
    twgl.setUniforms(vertexColorProgramInfo, cubeRaysUniforms);
    twgl.drawBufferInfo(gl, cubeRaysBufferInfo, gl.LINES);

    {
      const eyePosition = m4.transformPoint(worldViewProjection, [0, 0, 0]);
      const ex = ((eyePosition[0] * 0.5 + 0.5) * width) / pixelRatio;
      const ey = ((eyePosition[1] * -0.5 + 0.5) * halfHeight) / pixelRatio;
      // eyeElem.style.left = px(ex - eyeElem.width / 2);
      // eyeElem.style.top = px(ey - eyeElem.height / 2);
    }

    // Draw Frustum Wire
    m4.perspective(
      degToRad(fieldOfView),
      aspect,
      zNear,
      zFar * scale,
      exampleProjection
    );
    m4.inverse(exampleProjection, exampleInverseProjection);

    m4.translation([0, 0, 0], world);
    m4.multiply(world, exampleInverseProjection, world);
    m4.scale(world, [scale, scale, scale], world);
    m4.multiply(viewProjection, world, worldViewProjection);

    twgl.setBuffersAndAttributes(
      gl,
      vertexColorProgramInfo,
      wireCubeBufferInfo
    );
    twgl.setUniforms(vertexColorProgramInfo, sharedUniforms);
    twgl.setUniforms(vertexColorProgramInfo, wireFrustumUniforms);
    twgl.drawBufferInfo(gl, wireCubeBufferInfo, gl.LINES);

    // Draw 3D view
    gl.enable(gl.SCISSOR_TEST);
    gl.viewport(0, 0, width, halfHeight);
    gl.scissor(0, 0, width, halfHeight);
    gl.clearColor(0.5, 0.5, 0.5, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    m4.perspective(
      degToRad(fieldOfView),
      aspect,
      zNear,
      zFar * scale,
      projection
    );

    drawScene(exampleProjection, zeroMat ,time);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);

  // const initShader(gl,)

  //打开筛选。默认情况下，背面三角形
  //将被剔除。
  // this.gl.enable(this.gl.CULL_FACE);
  // // 1.开启隐藏面消除功能
  // this.gl.enable(this.gl.DEPTH_TEST); // gl.DEPTH_TEST、gl.BLEND(混合)、gl.POLYGON_OFFSET_FILL(多边形位移)
  // this.gl.enable(this.gl.SCISSOR_TEST); // 启用剪裁测试

  // class WebGl {
  //   constructor(options) {
  //     this.options = options;

  //     // 改变
  //     this.parmas = {
  //       perspective: {
  //         z: 1
  //       },
  //       color: [Math.random(), Math.random(), Math.random(), 1],
  //       // 变换参数，平移  x y z
  //       translation: {
  //         x: 45,
  //         y: 45,
  //         z: 0
  //       },
  //       // 放大
  //       scale: {
  //         x: 1,
  //         y: 1,
  //         z: 1
  //       },
  //       // 旋转
  //       rotation: {
  //         angleX: 40,
  //         angleY: 25,
  //         angleZ: 325
  //       },
  //       fn: () => {}
  //     };

  //     // const v3 = twgl.v3;
  //     // const m4 = twgl.m4;

  //     this.eyePosition=null;
  //     this.target=null;

  //     // globals
  //     this.pixelRatio = window.devicePixelRatio || 1;
  //     this.scale = 1;

  //     this.init();
  //   }
  //   init() {
  //     this.createCanvas();
  //     this.initShaders();

  //     this.setAttributeData();
  //     this.setUniform();
  //     this.drawScene();
  //     this.controller();
  //   }
  //   createCanvas() {
  //     const {canvas_w, canvas_h} = this.options;

  //     this.canvas = document.createElement("canvas");
  //     this.canvas.width = canvas_w;
  //     this.canvas.height = canvas_h;
  //     document.body.appendChild(this.canvas);

  //     if (!this.canvas.getContext) return;
  //     this.gl = this.canvas.getContext("webgl");

  //     //打开筛选。默认情况下，背面三角形
  //     //将被剔除。
  //     // this.gl.enable(this.gl.CULL_FACE);
  //     // // 1.开启隐藏面消除功能
  //     // this.gl.enable(this.gl.DEPTH_TEST); // gl.DEPTH_TEST、gl.BLEND(混合)、gl.POLYGON_OFFSET_FILL(多边形位移)
  //     // this.gl.enable(this.gl.SCISSOR_TEST); // 启用剪裁测试
  //   }
  //   initShaders() {
  //     // if (!initShaders(this.gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
  //     //   console.log("failed to initialize shaders");
  //     //   return;
  //     // }
  //   }
  //   // 设置F数据
  //   setAttributeData = () => {
  //     /*
  //     buffer: 分5个步骤
  //   */
  //     //1 创建 buffer
  //     let positionBuffer = this.gl.createBuffer(); // 创建缓冲

  //     // 2
  //     // 将缓冲区对象绑定指定目标
  //     this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);

  //     //3
  //     // 向缓冲区写入数据
  //     this.gl.bufferData(this.gl.ARRAY_BUFFER, fData, this.gl.STATIC_DRAW);

  //     // 设置canvas 宽高
  //     resizeCanvasToDisplaySize(this.gl.canvas);

  //     // Tell WebGL how to convert from clip space to pixels
  //     //告诉WebGL如何从剪辑空间转换为像素
  //     this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

  //     // Tell it to use our program (pair of shaders)
  //     //告诉它使用我们的程序(shaders pair)
  //     this.gl.useProgram(this.gl.program);

  //     // 4: 把带有数据的buffer给arrribute
  //     // 将缓冲区对象分配给a_position变量

  //     var a_position = this.gl.getAttribLocation(this.gl.program, "a_position");

  //     // let a_position = this.gl.getContextAttributes(
  //     //   this.gl.isProgram,
  //     //   "a_position"
  //     // ); // 获得变量位置

  //     // 连接a_position变量与分配给他的缓冲区对象
  //     /*

  //    告诉显卡从当前绑定的缓冲区（bindBuffer() 指定的缓冲区）中读取顶点数据。
  //    方法绑定当前缓冲区范围到gl.ARRAY_BUFFER,
  //    成为当前顶点缓冲区对象的通用顶点属性并指定它的布局 (缓冲区对象中的偏移量)。

  //    */
  //     this.gl.vertexAttribPointer(
  //       a_position, // 变量 指定要修改的顶点属性的索引。
  //       3, // size 三个数据为一组 告诉三个点位一组颜色  1, 2, 3, or 4. 指定每个顶点属性的组成数量，必须是 1，2，3 或 4。
  //       this.gl.FLOAT, //type gl.FLOAT: 32-bit IEEE floating point number 32 位 IEEE 标准的浮点数
  //       false, // normalized 当转换为浮点数时是否应该将整数数值归一化到特定的范围。
  //       fData.BYTES_PER_ELEMENT * 3, // stride 以字节为单位指定连续顶点属性开始之间的偏移量 (即数组中一行长度)。不能大于 255。如果 stride 为 0，则假定该属性是紧密打包的，即不交错属性，每个属性在一个单独的块中，下一个顶点的属性紧跟当前顶点之后。
  //       0 //offset 指定顶点属性数组中第一部分的字节偏移量。必须是类型的字节长度的倍数。 // 索引 从 0 开始
  //     ); //  告诉gl如何解析数据

  //     // 确认 // 启用数据
  //     // 连接a_position变量与分配给他的缓冲区对象
  //     this.gl.enableVertexAttribArray(a_position);

  //     /*
  //     buffer: 分5个步骤
  //   */
  //     //1 创建 buffer
  //     let colorBuffer = this.gl.createBuffer(); // 创建缓冲

  //     // 2
  //     // 将缓冲区对象绑定指定目标
  //     this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer);

  //     //3
  //     // 向缓冲区写入数据
  //     this.gl.bufferData(this.gl.ARRAY_BUFFER, colors, this.gl.STATIC_DRAW);

  //     // 设置canvas 宽高
  //     resizeCanvasToDisplaySize(this.gl.canvas);

  //     // Tell WebGL how to convert from clip space to pixels
  //     //告诉WebGL如何从剪辑空间转换为像素
  //     this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

  //     // Tell it to use our program (pair of shaders)
  //     //告诉它使用我们的程序(shaders pair)
  //     this.gl.useProgram(this.gl.program);

  //     // 4: 把带有数据的buffer给arrribute
  //     // 将缓冲区对象分配给a_position变量

  //     var a_colors = this.gl.getAttribLocation(this.gl.program, "a_colors");

  //     // let a_position = this.gl.getContextAttributes(
  //     //   this.gl.isProgram,
  //     //   "a_position"
  //     // ); // 获得变量位置

  //     // 连接a_position变量与分配给他的缓冲区对象
  //     /*

  //    告诉显卡从当前绑定的缓冲区（bindBuffer() 指定的缓冲区）中读取顶点数据。
  //    方法绑定当前缓冲区范围到gl.ARRAY_BUFFER,
  //    成为当前顶点缓冲区对象的通用顶点属性并指定它的布局 (缓冲区对象中的偏移量)。
  //    var type = gl.UNSIGNED_BYTE;  // the data is 8bit unsigned values
  //     var normalize = true;         // normalize the data (convert from 0-255 to 0-1)
  //    */
  //     this.gl.vertexAttribPointer(
  //       a_colors, // 变量 指定要修改的顶点属性的索引。
  //       3, // size 三个数据为一组 告诉三个点位一组颜色  1, 2, 3, or 4. 指定每个顶点属性的组成数量，必须是 1，2，3 或 4。
  //       this.gl.UNSIGNED_BYTE, //gl.UNSIGNED_BYTE 数据是8位无符号值  , type gl.FLOAT: 32-bit IEEE floating point number 32 位 IEEE 标准的浮点数 ,
  //       true, // normalized 当转换为浮点数时是否应该将整数数值归一化到特定的范围。, 如果是false 则是0-1，如果是true 则是 0-255
  //       colors.BYTES_PER_ELEMENT * 3, //colors.BYTES_PER_ELEMENT * 3, // stride 以字节为单位指定连续顶点属性开始之间的偏移量 (即数组中一行长度)。不能大于 255。如果 stride 为 0，则假定该属性是紧密打包的，即不交错属性，每个属性在一个单独的块中，下一个顶点的属性紧跟当前顶点之后。
  //       0 //offset 指定顶点属性数组中第一部分的字节偏移量。必须是类型的字节长度的倍数。 // 索引 从 0 开始
  //     ); //  告诉gl如何解析数据

  //     // 确认 // 启用数据
  //     // 连接a_colors变量与分配给他的缓冲区对象
  //     this.gl.enableVertexAttribArray(a_colors);
  //   };

  //   //角度变弧度
  //   degToRad(d) {
  //     return (d * Math.PI) / 180;
  //   }
  //   drawScene() {
  //     //  将画布调整为显示大小
  //     resizeCanvasToDisplaySize(this.gl.canvas);

  //     // Tell WebGL how to convert from clip space to pixels //告诉WebGL如何从剪辑空间转换为像素
  //     this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

  //     // Clear the canvas. //清除画布。
  //     this.gl.clear(this.gl.COLOR_BUFFER_BIT);

  //     // Tell it to use our program (pair of shaders) //告诉它使用我们的程序(shaders pair)
  //     this.gl.useProgram(this.gl.program);

  //     // 绘画顶点位置
  //     // Draw the geometry.
  //     var primitiveType = this.gl.TRIANGLES; // 绘画类型
  //     var offset = 0;
  //     // var count = 18; // 6 triangles in the 'F', 3 points per triangle  18个顶点
  //     var count = 16 * 6;

  //     this.gl.drawArrays(primitiveType, offset, count);

  //     // this.gl.drawArrays(primitiveType, 0, 6);
  //     // this.gl.drawArrays(primitiveType, 6, 6);
  //     // this.gl.drawArrays(primitiveType, 12, 6);
  //     // this.gl.drawArrays(primitiveType, 18, 6);
  //     // this.gl.drawArrays(primitiveType, 24, 6);
  //     // this.gl.drawArrays(primitiveType, 30, 6);
  //     // this.gl.drawArrays(primitiveType, 36, 6);
  //     // this.gl.drawArrays(primitiveType, 42, 6);
  //     // this.gl.drawArrays(primitiveType, 48, 6);
  //     // this.gl.drawArrays(primitiveType, 54, 6);
  //     // this.gl.drawArrays(primitiveType, 60, 6);
  //     // this.gl.drawArrays(primitiveType, 66, 6);
  //     // this.gl.drawArrays(primitiveType, 72, 6);
  //     // this.gl.drawArrays(primitiveType, 78, 6);
  //     // this.gl.drawArrays(primitiveType, 84, 6);
  //     // this.gl.drawArrays(primitiveType, 90, 6);
  //   }
  //   makeZToWMatrix = (fudegFactor) => {
  //     return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, fudegFactor, 0, 0, 0, 1];
  //   };
  //   setUniform() {
  //     const {
  //       color,
  //       // 变换参数，平移  x y z
  //       translation = {},
  //       // 放大
  //       scale = {},
  //       // 旋转
  //       rotation: {angleX, angleY, angleZ},
  //       perspective: {z}
  //     } = this.parmas;

  //     // 矩阵
  //     var matrixLocation = this.gl.getUniformLocation(
  //       this.gl.program,
  //       "u_matrix"
  //     );

  //     // 透视矩阵
  //     var matrix = this.makeZToWMatrix(z);

  //     // Compute the matrices 计算矩阵 创建一个正交投影
  //     // 透视 乘以 一个正交矩阵
  //     matrix = m4.multiply(
  //       matrix,
  //       m4.projection(
  //         this.gl.canvas.clientWidth,
  //         this.gl.canvas.clientHeight,
  //         400
  //       )
  //     );

  //     //
  //     // 变换这个正交投影 位移
  //     matrix = m4.translate(
  //       matrix,
  //       translation.x,
  //       translation.y,
  //       translation.z
  //     );

  //     // 旋转正交矩阵
  //     matrix = m4.xRotate(matrix, this.degToRad(angleX));

  //     matrix = m4.yRotate(matrix, this.degToRad(angleY));

  //     matrix = m4.zRotate(matrix, this.degToRad(angleZ));

  //     // 放大
  //     matrix = m4.scale(matrix, scale.x, scale.y, scale.z);

  //     // 得到一个矩阵 放入 u_matrix 变量中传入gpu
  //     this.gl.uniformMatrix4fv(matrixLocation, false, matrix);

  //     // // 透视
  //     // let fudgeLocation = this.gl.getUniformLocation(
  //     //   this.gl.program,
  //     //   "u_fudgeFactor"
  //     // );
  //     // // 设置fudgeFactor
  //     // this.gl.uniform1f(fudgeLocation, z);
  //   }

  //   controller() {
  //     // 控制 参数改变
  //     controller({
  //       onChange: () => {
  //         this.setUniform();
  //         this.drawScene();
  //         // render(settings);
  //         // console.log("parmas========", parmas);
  //       },
  //       parmas: this.parmas,
  //       options: [
  //         {
  //           min: 0,
  //           max: 2,
  //           step: 0.001,
  //           key: "perspective.z",
  //           name: "透视投影z",
  //           // onChange: (value) => {},
  //           onFinishChange: (value) => {
  //             // 完全修改停下来的时候触发这个事件
  //             console.log("onFinishChange value==", value);
  //           }
  //         },
  //         {
  //           min: 0,
  //           max: 400,
  //           step: 0.001,
  //           key: "translation.x",
  //           name: "位移X",
  //           // onChange: (value) => {},
  //           onFinishChange: (value) => {
  //             // 完全修改停下来的时候触发这个事件
  //             console.log("onFinishChange value==", value);
  //           }
  //         },
  //         {
  //           min: 0,
  //           max: 400,
  //           step: 0.01,
  //           key: "translation.y",
  //           name: "位移Y",
  //           onChange: (value) => {},
  //           onFinishChange: (value) => {
  //             // 完全修改停下来的时候触发这个事件
  //             console.log("onFinishChange value==", value);
  //           }
  //         },
  //         {
  //           min: -1,
  //           max: 400,
  //           step: 0.01,
  //           key: "translation.z",
  //           name: "位移Z",
  //           onChange: (value) => {},
  //           onFinishChange: (value) => {
  //             // 完全修改停下来的时候触发这个事件
  //             console.log("onFinishChange value==", value);
  //           }
  //         },

  //         {
  //           min: -1,
  //           max: 10,
  //           step: 0.001,
  //           key: "scale.x",
  //           name: "放大X",
  //           // onChange: (value) => {},
  //           onFinishChange: (value) => {
  //             // 完全修改停下来的时候触发这个事件
  //             console.log("onFinishChange value==", value);
  //           }
  //         },
  //         {
  //           min: -1,
  //           max: 10,
  //           step: 0.01,
  //           key: "scale.y",
  //           name: "放大Y",
  //           onChange: (value) => {},
  //           onFinishChange: (value) => {
  //             // 完全修改停下来的时候触发这个事件
  //             console.log("onFinishChange value==", value);
  //           }
  //         },
  //         {
  //           min: -1,
  //           max: 10,
  //           step: 0.01,
  //           key: "scale.z",
  //           name: "放大Z",
  //           onChange: (value) => {},
  //           onFinishChange: (value) => {
  //             // 完全修改停下来的时候触发这个事件
  //             console.log("onFinishChange value==", value);
  //           }
  //         },

  //         {
  //           min: 0,
  //           max: 360,
  //           step: 0.001,
  //           key: "rotation.angleX",
  //           name: "旋转X",
  //           // onChange: (value) => {},
  //           onFinishChange: (value) => {
  //             // 完全修改停下来的时候触发这个事件
  //             console.log("onFinishChange value==", value);
  //           }
  //         },
  //         {
  //           min: -1,
  //           max: 360,
  //           step: 0.01,
  //           key: "rotation.angleY",
  //           name: "旋转Y",
  //           onChange: (value) => {},
  //           onFinishChange: (value) => {
  //             // 完全修改停下来的时候触发这个事件
  //             console.log("onFinishChange value==", value);
  //           }
  //         },
  //         {
  //           min: -1,
  //           max: 360,
  //           step: 0.01,
  //           key: "rotation.angleZ",
  //           name: "旋转Z",
  //           onChange: (value) => {},
  //           onFinishChange: (value) => {
  //             // 完全修改停下来的时候触发这个事件
  //             console.log("onFinishChange value==", value);
  //           }
  //         }
  //       ]
  //     });
  //   }

  //   //
  // }

  // new WebGl({canvas_w: 500, canvas_h: 500});

  return;
};
