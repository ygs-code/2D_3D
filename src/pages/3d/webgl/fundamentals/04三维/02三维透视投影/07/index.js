import * as twgl from "@/pages/3d/utils/twgl";
import eyeIcon from "static/image/eye-icon.png";
// import initShaders from "./initShader";
// import initShaders from "@/pages/3d/utils/initShader";
import initShaders from "@/pages/3d/utils/initShader";
import m4 from "./m4";
import FSHADER_SOURCE from "./index.frag";
import VSHADER_SOURCE from "./index.vert";
import $m4 from "@/pages/3d/utils/comments/m4";

// import FSHADER_SOURCE from "./color.frag";
// import VSHADER_SOURCE from "./color.vert";
import {
  FArrays,
  cubeArrays,
  colorVerts,
  faceColors,
  cubeRaysArrays,
  wireCubeArrays,
  colors
} from "./data";

import "@/pages/index.less";
import "./index.less";
import controller from "@/pages/3d/utils/controller.js";
window.onload = () => {
  const v3 = twgl.v3;
  // const m4 = twgl.m4;

  // "use strict";

  function main() {
    // Get A WebGL context
    /** @type {HTMLCanvasElement} */
    var canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
    canvas.width = 500;
    canvas.height = 500;
    // var canvas = document.querySelector("#canvas");
    var gl = canvas.getContext("webgl");

    if (!gl) {
      return;
    }

    // setup GLSL program
    //  var program = webglUtils.createProgramFromScripts(gl, [VSHADER_SOURCE,FSHADER_SOURCE]);
           // setup GLSL program
        // // 创建 ProgramFromSources
        const program = initShaders(
          gl,
          VSHADER_SOURCE,
          FSHADER_SOURCE
          // progOptions
        );
        console.log('$program====',program);
        console.log('program====',program);
    // look up where the vertex data needs to go.
    var positionLocation = gl.getAttribLocation(program, "a_position");
    var colorLocation = gl.getAttribLocation(program, "a_color");

    // lookup uniforms
    var matrixLocation = gl.getUniformLocation(program, "u_matrix");

    // Create a buffer to put positions in
    var positionBuffer = gl.createBuffer();
    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // Put geometry data into buffer
    setGeometry(gl);

    // Create a buffer to put colors in
    var colorBuffer = gl.createBuffer();
    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = colorBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    // Put geometry data into buffer
    setColors(gl);

    function radToDeg(r) {
      return r * 180 / Math.PI;
    }

    function degToRad(d) {
      return d * Math.PI / 180;
    }

    let parmas = {
      zNear: 10,
      zFar: 50,
      fieldOfView: 30,
      zPosition: -25,

      // 
      translation:{
        x:-150,
        y:0,
        z:-360
      },
      rotation:{
        degX:(190),
        degY:(40),
        degZ:(320),
      },
      scale:{
        x:1,
        y:1,
        z:1
      },
      fieldOfViewRadians:(60),
    };


    var translation = [-150, 0, -360];
    var rotation = [degToRad(190), degToRad(40), degToRad(320)];
    var scale = [1, 1, 1];

    var fieldOfViewRadians = degToRad(60);

    drawScene();




  
    // 控制 参数改变
    controller({
      onChange: () => {
        drawScene();
      },
      parmas: parmas,
      options: [
        {
          min: 0,
          max: 179,
          step: 0.001,
          key: "fieldOfViewRadians",
          name: "fieldOfViewRadians",
          // onChange: (value) => {},
          onFinishChange: (value) => {
            // parmas.fieldOfViewRadians=degToRad(value);
            // 完全修改停下来的时候触发这个事件
            console.log("onFinishChange value==", value);
          }
        },
        {
          min: -200,
          max: 200,
          step: 0.001,
          key: "translation.x",
          name: "移动x轴",
          // onChange: (value) => {},
          onFinishChange: (value) => {
            // 完全修改停下来的时候触发这个事件
            console.log("onFinishChange value==", value);
          }
        },
        {
          min: -200,
          max: 200,
          step: 0.001,
          key: "translation.y",
          name: "移动y轴",
          // onChange: (value) => {},
          onFinishChange: (value) => {
            // 完全修改停下来的时候触发这个事件
            console.log("onFinishChange value==", value);
          }
        },
        {
          min: -200,
          max: 200,
          step: 0.001,
          key: "translation.z",
          name: "移动z轴",
          // onChange: (value) => {},
          onFinishChange: (value) => {
            // 完全修改停下来的时候触发这个事件
            console.log("onFinishChange value==", value);
          }
        },



        {
          min: 0,
          max: 360,
          step: 0.001,
          key: "rotation.degX",
          name: "旋转x轴",
          // onChange: (value) => {},
          onFinishChange: (value) => {
            // 完全修改停下来的时候触发这个事件
            console.log("onFinishChange value==", value);
          }
        },
        {
          min: 0,
          max: 360,
          step: 0.001,
          key: "rotation.degY",
          name: "旋转y轴",
          // onChange: (value) => {},
          onFinishChange: (value) => {
            // 完全修改停下来的时候触发这个事件
            console.log("onFinishChange value==", value);
          }
        },
        {
          min: 0,
          max: 360,
          step: 0.001,
          key: "rotation.degZ",
          name: "旋转z轴",
          // onChange: (value) => {},
          onFinishChange: (value) => {
            // 完全修改停下来的时候触发这个事件
            console.log("onFinishChange value==", value);
          }
        },




        {
          min: -5,
          max: 5,
          step: 0.001,
          key: "scale.x",
          name: "缩放x轴",
          // onChange: (value) => {},
          onFinishChange: (value) => {
            // 完全修改停下来的时候触发这个事件
            console.log("onFinishChange value==", value);
          }
        },

        {
          min: -5,
          max: 5,
          step: 0.001,
          key: "scale.y",
          name: "缩放y轴",
          // onChange: (value) => {},
          onFinishChange: (value) => {
            // 完全修改停下来的时候触发这个事件
            console.log("onFinishChange value==", value);
          }
        },

        {
          min: -5,
          max: 5,
          step: 0.001,
          key: "scale.z",
          name: "缩放z轴",
          // onChange: (value) => {},
          onFinishChange: (value) => {
            // 完全修改停下来的时候触发这个事件
            console.log("onFinishChange value==", value);
          }
        },


      ]
    });


 
    function updateFieldOfView(event, ui) {
      fieldOfViewRadians = degToRad(ui.value);
      drawScene();
    }

    function updatePosition(index) {
      return function (event, ui) {
        translation[index] = ui.value;
        drawScene();
      };
    }

    function updateRotation(index) {
      return function (event, ui) {
        var angleInDegrees = ui.value;
        var angleInRadians = angleInDegrees * Math.PI / 180;
        rotation[index] = angleInRadians;
        drawScene();
      };
    }

    function updateScale(index) {
      return function (event, ui) {
        scale[index] = ui.value;
        drawScene();
      };
    }

    // Draw the scene.
    function drawScene() {

      let   {
        // zNear: 10,
        // zFar: 50,
        // fieldOfView: 30,
        // zPosition: -25,
  
        // 
        translation={
          // x:-150,
          // y:0,
          // z:-360
        },
        rotation={
          // degX:190,
          // degY:40,
          // degZ:320,
        },
        scale={
          // x:1,
          // y:1,
          // z:1
        },
        fieldOfViewRadians ,
      }=parmas;


      // webglUtils.resizeCanvasToDisplaySize(gl.canvas);

      // Tell WebGL how to convert from clip space to pixels
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

      // Clear the canvas AND the depth buffer.
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      // Turn on culling. By default backfacing triangles
      // will be culled.
      gl.enable(gl.CULL_FACE);

      // Enable the depth buffer
      gl.enable(gl.DEPTH_TEST);

      // Tell it to use our program (pair of shaders)
      // 告诉它使用我们的程序(一对着色器) 这里会有问题
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

      // Turn on the color attribute
      gl.enableVertexAttribArray(colorLocation);

      // Bind the color buffer.
      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

      // Tell the attribute how to get data out of colorBuffer (ARRAY_BUFFER)
      var $size = 3;                 // 3 components per iteration
      var $type = gl.UNSIGNED_BYTE;  // the data is 8bit unsigned values
      var $normalize = true;         // normalize the data (convert from 0-255 to 0-1)
      // var stride = 0;               // 0 = move forward size * sizeof(type) each iteration to get the next position
      // var offset = 0;               // start at the beginning of the buffer
      gl.vertexAttribPointer(
        colorLocation, $size , $type, $normalize, stride, offset);

      // Compute the matrix
      var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
      var zNear = 1;
      var zFar = 2000;


        // 透视矩阵
      var matrix = m4.perspective(degToRad(fieldOfViewRadians), aspect, zNear, zFar);

      // 平移
      matrix = m4.translate(matrix, translation.x, translation.y, translation.z);
     // 旋转
      matrix = m4.xRotate(matrix, degToRad(rotation.degX));
      //  旋转
      matrix = m4.yRotate(matrix, degToRad(rotation.degY));

      matrix = m4.zRotate(matrix, degToRad(rotation.degZ));
      // 缩放
      matrix = m4.scale(matrix, scale.x, scale.y, scale.z);


      // Set the matrix.
      gl.uniformMatrix4fv(matrixLocation, false, matrix);

      // Draw the geometry.
      var primitiveType = gl.TRIANGLES;
      // var offset = 0;
      var count = 16 * 6;
      gl.drawArrays(primitiveType, offset, count);
    }
  }

  // Fill the buffer with the values that define a letter 'F'.
  function setGeometry(gl) {
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        // left column front
        0, 0, 0,
        0, 150, 0,
        30, 0, 0,
        0, 150, 0,
        30, 150, 0,
        30, 0, 0,

        // top rung front
        30, 0, 0,
        30, 30, 0,
        100, 0, 0,
        30, 30, 0,
        100, 30, 0,
        100, 0, 0,

        // middle rung front
        30, 60, 0,
        30, 90, 0,
        67, 60, 0,
        30, 90, 0,
        67, 90, 0,
        67, 60, 0,

        // left column back
        0, 0, 30,
        30, 0, 30,
        0, 150, 30,
        0, 150, 30,
        30, 0, 30,
        30, 150, 30,

        // top rung back
        30, 0, 30,
        100, 0, 30,
        30, 30, 30,
        30, 30, 30,
        100, 0, 30,
        100, 30, 30,

        // middle rung back
        30, 60, 30,
        67, 60, 30,
        30, 90, 30,
        30, 90, 30,
        67, 60, 30,
        67, 90, 30,

        // top
        0, 0, 0,
        100, 0, 0,
        100, 0, 30,
        0, 0, 0,
        100, 0, 30,
        0, 0, 30,

        // top rung right
        100, 0, 0,
        100, 30, 0,
        100, 30, 30,
        100, 0, 0,
        100, 30, 30,
        100, 0, 30,

        // under top rung
        30, 30, 0,
        30, 30, 30,
        100, 30, 30,
        30, 30, 0,
        100, 30, 30,
        100, 30, 0,

        // between top rung and middle
        30, 30, 0,
        30, 60, 30,
        30, 30, 30,
        30, 30, 0,
        30, 60, 0,
        30, 60, 30,

        // top of middle rung
        30, 60, 0,
        67, 60, 30,
        30, 60, 30,
        30, 60, 0,
        67, 60, 0,
        67, 60, 30,

        // right of middle rung
        67, 60, 0,
        67, 90, 30,
        67, 60, 30,
        67, 60, 0,
        67, 90, 0,
        67, 90, 30,

        // bottom of middle rung.
        30, 90, 0,
        30, 90, 30,
        67, 90, 30,
        30, 90, 0,
        67, 90, 30,
        67, 90, 0,

        // right of bottom
        30, 90, 0,
        30, 150, 30,
        30, 90, 30,
        30, 90, 0,
        30, 150, 0,
        30, 150, 30,

        // bottom
        0, 150, 0,
        0, 150, 30,
        30, 150, 30,
        0, 150, 0,
        30, 150, 30,
        30, 150, 0,

        // left side
        0, 0, 0,
        0, 0, 30,
        0, 150, 30,
        0, 0, 0,
        0, 150, 30,
        0, 150, 0]),
      gl.STATIC_DRAW);
  }

  // Fill the buffer with colors for the 'F'.
  function setColors(gl) {
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Uint8Array([
        // left column front
        200, 70, 120,
        200, 70, 120,
        200, 70, 120,
        200, 70, 120,
        200, 70, 120,
        200, 70, 120,

        // top rung front
        200, 70, 120,
        200, 70, 120,
        200, 70, 120,
        200, 70, 120,
        200, 70, 120,
        200, 70, 120,

        // middle rung front
        200, 70, 120,
        200, 70, 120,
        200, 70, 120,
        200, 70, 120,
        200, 70, 120,
        200, 70, 120,

        // left column back
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,

        // top rung back
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,

        // middle rung back
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,

        // top
        70, 200, 210,
        70, 200, 210,
        70, 200, 210,
        70, 200, 210,
        70, 200, 210,
        70, 200, 210,

        // top rung right
        200, 200, 70,
        200, 200, 70,
        200, 200, 70,
        200, 200, 70,
        200, 200, 70,
        200, 200, 70,

        // under top rung
        210, 100, 70,
        210, 100, 70,
        210, 100, 70,
        210, 100, 70,
        210, 100, 70,
        210, 100, 70,

        // between top rung and middle
        210, 160, 70,
        210, 160, 70,
        210, 160, 70,
        210, 160, 70,
        210, 160, 70,
        210, 160, 70,

        // top of middle rung
        70, 180, 210,
        70, 180, 210,
        70, 180, 210,
        70, 180, 210,
        70, 180, 210,
        70, 180, 210,

        // right of middle rung
        100, 70, 210,
        100, 70, 210,
        100, 70, 210,
        100, 70, 210,
        100, 70, 210,
        100, 70, 210,

        // bottom of middle rung.
        76, 210, 100,
        76, 210, 100,
        76, 210, 100,
        76, 210, 100,
        76, 210, 100,
        76, 210, 100,

        // right of bottom
        140, 210, 80,
        140, 210, 80,
        140, 210, 80,
        140, 210, 80,
        140, 210, 80,
        140, 210, 80,

        // bottom
        90, 130, 110,
        90, 130, 110,
        90, 130, 110,
        90, 130, 110,
        90, 130, 110,
        90, 130, 110,

        // left side
        160, 160, 220,
        160, 160, 220,
        160, 160, 220,
        160, 160, 220,
        160, 160, 220,
        160, 160, 220]),
      gl.STATIC_DRAW);
  }

  main();
};

