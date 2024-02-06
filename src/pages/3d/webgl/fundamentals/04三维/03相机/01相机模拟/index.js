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
 
  function main() {
    // Get A WebGL context
    var canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
    canvas.width = 500;
    canvas.height = 500;
    // var canvas = document.querySelector("#canvas");
    var gl = canvas.getContext("webgl");
    if (!gl) {
      return;
    }
  
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
  
    // setup GLSL program
         // // 创建 ProgramFromSources
         const program = initShaders(
          gl,
          VSHADER_SOURCE,
          FSHADER_SOURCE
          // progOptions
        );
    gl.useProgram(program);
  
    // look up where the vertex data needs to go.
    // 顶点坐标
    var positionLocation = gl.getAttribLocation(program, "a_position");
    // 颜色坐标
    var colorLocation = gl.getAttribLocation(program, "a_color");
  
    // lookup uniforms
    // 获取 u_matrix 矩阵地址
    var matrixLocation = gl.getUniformLocation(program, "u_matrix");
  
    // Create a buffer.
    // 创建 buffer
    var buffer = gl.createBuffer();
    // 绑定 buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    // 
    gl.enableVertexAttribArray(positionLocation);
  
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
  
    // Set Geometry.
    setGeometry(gl);
  
    // Create a buffer for colors.
    var $buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, $buffer);
    gl.enableVertexAttribArray(colorLocation);
  
    // We'll supply RGB as bytes.
    gl.vertexAttribPointer(colorLocation, 3, gl.UNSIGNED_BYTE, true, 0, 0);
  
    // Set Colors.
    setColors(gl);
  
    function radToDeg(r) {
      return r * 180 / Math.PI;
    }
  
    function degToRad(d) {
      return d * Math.PI / 180;
    }
  
    // var cameraAngleRadians = degToRad(0);
    // var fieldOfViewRadians = degToRad(60);
  
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
      cameraAngleRadians:0,
      fieldOfViewRadians:60,
    };
    drawScene();


  
    // Setup a ui.
    // $("#cameraAngle").gmanSlider({value: radToDeg(cameraAngleRadians), slide: updateCameraAngle, min: -360, max: 360});
  


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
          name: "相机广角",
          // onChange: (value) => {},
          onFinishChange: (value) => {
            // parmas.fieldOfViewRadians=degToRad(value);
            // 完全修改停下来的时候触发这个事件
            console.log("onFinishChange value==", value);
          }
        },
        {
          min: -360,
          max: 360,
          step: 0.001,
          key: "cameraAngleRadians",
          name: "相机Y轴旋转",
          // onChange: (value) => {},
          onFinishChange: (value) => {
            // 完全修改停下来的时候触发这个事件
            console.log("onFinishChange value==", value);
          }
        },
      ]
    });



    // function updateFieldOfView(event, ui) {
    //   fieldOfViewRadians = degToRad(ui.value);
    //   drawScene();
    // }
  
    // function updateCameraAngle(event, ui) {
    //   cameraAngleRadians = degToRad(ui.value);
    //   drawScene();
    // }
  
  
    // Draw the scene.
    function drawScene() {
      

      let {
        cameraAngleRadians,
        fieldOfViewRadians,
      }=parmas;
      
      var numFs = 5;
      var radius = 200;
  
      // Clear the canvas AND the depth buffer.
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
      // Compute the projection matrix
      // 宽高比
      var aspect = canvas.clientWidth / canvas.clientHeight;
  
      //  
      /*
      fieldOfViewRadians 焦距 角度  
      aspect  宽高比
      near 进截面
      far 远截面
      */
      const [near, far] = [1,2000];
  
      // 透视投影
      var projectionMatrix = makePerspective(
        degToRad(fieldOfViewRadians),aspect, near, far
      );
      // Compute the camera's matrix
      // 相机矩阵 偏移 
      var cameraMatrix = makeTranslation(0, 0, radius * 1.5);
  
      //  makeYRotation y 轴旋转
      cameraMatrix = matrixMultiply(cameraMatrix, makeYRotation(
        degToRad(cameraAngleRadians)
        ));
  
      // Make a view matrix from the camera matrix.  从相机矩阵中创建一个视图矩阵。
      // 逆矩阵
      // 相机矩阵
      var viewMatrix = makeInverse(cameraMatrix);
  
      // Draw 'F's in a circle
      // 绘画5次 绘画 5个 F 并且每个 角度 偏移 一样
      for (var ii = 0; ii < numFs; ++ii) {
        var angle = ii * Math.PI * 2 / numFs;
  
        var x = Math.cos(angle) * radius;
        var z = Math.sin(angle) * radius;
  
        // 移动
        
        var translationMatrix = makeTranslation(x, 0, z);
  
        /*
        
          M * V * P
  
        */
        // Multiply the matrices.
        // 模型矩阵 P model
        var matrix = translationMatrix;
  
        // 视图矩阵 也可以 理解是相机 V
        matrix = matrixMultiply(matrix, viewMatrix);
  
        // 投影 透视投影  M
        matrix = matrixMultiply(matrix, projectionMatrix);
  
        // Set the matrix.
        // 传入shader中
        gl.uniformMatrix4fv(matrixLocation, false, matrix);
  
        // Draw the geometry.
        gl.drawArrays(gl.TRIANGLES, 0, 16 * 6);
      }
    }
  }
  // 透视投影
  function makePerspective(fieldOfViewInRadians, aspect, near, far) {
    var f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
    var rangeInv = 1.0 / (near - far);
  
    return [
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (near + far) * rangeInv, -1,
      0, 0, near * far * rangeInv * 2, 0
    ];
  }
  
  // 平移
  function makeTranslation(tx, ty, tz) {
    return [
       1,  0,  0,  0,
       0,  1,  0,  0,
       0,  0,  1,  0,
      tx, ty, tz,  1
    ];
  }
  
  // 旋转
  function makeXRotation(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);
  
    return [
      1, 0, 0, 0,
      0, c, s, 0,
      0, -s, c, 0,
      0, 0, 0, 1
    ];
  }
  
  function makeYRotation(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);
  
    return [
      c, 0, -s, 0,
      0, 1, 0, 0,
      s, 0, c, 0,
      0, 0, 0, 1
    ];
  }
  
  function makeZRotation(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);
    return [
       c, s, 0, 0,
      -s, c, 0, 0,
       0, 0, 1, 0,
       0, 0, 0, 1,
    ];
  }
  
  function makeScale(sx, sy, sz) {
    return [
      sx, 0,  0,  0,
      0, sy,  0,  0,
      0,  0, sz,  0,
      0,  0,  0,  1,
    ];
  }
  
  function matrixMultiply(a, b) {
    var a00 = a[0*4+0];
    var a01 = a[0*4+1];
    var a02 = a[0*4+2];
    var a03 = a[0*4+3];
    var a10 = a[1*4+0];
    var a11 = a[1*4+1];
    var a12 = a[1*4+2];
    var a13 = a[1*4+3];
    var a20 = a[2*4+0];
    var a21 = a[2*4+1];
    var a22 = a[2*4+2];
    var a23 = a[2*4+3];
    var a30 = a[3*4+0];
    var a31 = a[3*4+1];
    var a32 = a[3*4+2];
    var a33 = a[3*4+3];
    var b00 = b[0*4+0];
    var b01 = b[0*4+1];
    var b02 = b[0*4+2];
    var b03 = b[0*4+3];
    var b10 = b[1*4+0];
    var b11 = b[1*4+1];
    var b12 = b[1*4+2];
    var b13 = b[1*4+3];
    var b20 = b[2*4+0];
    var b21 = b[2*4+1];
    var b22 = b[2*4+2];
    var b23 = b[2*4+3];
    var b30 = b[3*4+0];
    var b31 = b[3*4+1];
    var b32 = b[3*4+2];
    var b33 = b[3*4+3];
    return [a00 * b00 + a01 * b10 + a02 * b20 + a03 * b30,
            a00 * b01 + a01 * b11 + a02 * b21 + a03 * b31,
            a00 * b02 + a01 * b12 + a02 * b22 + a03 * b32,
            a00 * b03 + a01 * b13 + a02 * b23 + a03 * b33,
            a10 * b00 + a11 * b10 + a12 * b20 + a13 * b30,
            a10 * b01 + a11 * b11 + a12 * b21 + a13 * b31,
            a10 * b02 + a11 * b12 + a12 * b22 + a13 * b32,
            a10 * b03 + a11 * b13 + a12 * b23 + a13 * b33,
            a20 * b00 + a21 * b10 + a22 * b20 + a23 * b30,
            a20 * b01 + a21 * b11 + a22 * b21 + a23 * b31,
            a20 * b02 + a21 * b12 + a22 * b22 + a23 * b32,
            a20 * b03 + a21 * b13 + a22 * b23 + a23 * b33,
            a30 * b00 + a31 * b10 + a32 * b20 + a33 * b30,
            a30 * b01 + a31 * b11 + a32 * b21 + a33 * b31,
            a30 * b02 + a31 * b12 + a32 * b22 + a33 * b32,
            a30 * b03 + a31 * b13 + a32 * b23 + a33 * b33];
  }
  
  function makeInverse(m) {
    var m00 = m[0 * 4 + 0];
    var m01 = m[0 * 4 + 1];
    var m02 = m[0 * 4 + 2];
    var m03 = m[0 * 4 + 3];
    var m10 = m[1 * 4 + 0];
    var m11 = m[1 * 4 + 1];
    var m12 = m[1 * 4 + 2];
    var m13 = m[1 * 4 + 3];
    var m20 = m[2 * 4 + 0];
    var m21 = m[2 * 4 + 1];
    var m22 = m[2 * 4 + 2];
    var m23 = m[2 * 4 + 3];
    var m30 = m[3 * 4 + 0];
    var m31 = m[3 * 4 + 1];
    var m32 = m[3 * 4 + 2];
    var m33 = m[3 * 4 + 3];
    var tmp_0  = m22 * m33;
    var tmp_1  = m32 * m23;
    var tmp_2  = m12 * m33;
    var tmp_3  = m32 * m13;
    var tmp_4  = m12 * m23;
    var tmp_5  = m22 * m13;
    var tmp_6  = m02 * m33;
    var tmp_7  = m32 * m03;
    var tmp_8  = m02 * m23;
    var tmp_9  = m22 * m03;
    var tmp_10 = m02 * m13;
    var tmp_11 = m12 * m03;
    var tmp_12 = m20 * m31;
    var tmp_13 = m30 * m21;
    var tmp_14 = m10 * m31;
    var tmp_15 = m30 * m11;
    var tmp_16 = m10 * m21;
    var tmp_17 = m20 * m11;
    var tmp_18 = m00 * m31;
    var tmp_19 = m30 * m01;
    var tmp_20 = m00 * m21;
    var tmp_21 = m20 * m01;
    var tmp_22 = m00 * m11;
    var tmp_23 = m10 * m01;
  
    var t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
        (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
    var t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
        (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
    var t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
        (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
    var t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
        (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);
  
    var d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);
  
    return [
      d * t0,
      d * t1,
      d * t2,
      d * t3,
      d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
            (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30)),
      d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
            (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30)),
      d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
            (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30)),
      d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
            (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20)),
      d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
            (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33)),
      d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
            (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33)),
      d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
            (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33)),
      d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
            (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23)),
      d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
            (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22)),
      d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
            (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02)),
      d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
            (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12)),
      d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
            (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02))
    ];
  }
  
  function matrixVectorMultiply(v, m) {
    var dst = [];
    for (var i = 0; i < 4; ++i) {
      dst[i] = 0.0;
      for (var j = 0; j < 4; ++j)
        dst[i] += v[j] * m[j * 4 + i];
    }
    return dst;
  }
  
  // Fill the buffer with the values that define a letter 'F'.
  // 用定义字母“F”的值填充缓冲区。
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
  
            // top rung front
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
  
            // front of middle rung
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
  
            // front of bottom
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
            0, 150,   0]
            );
  
    // Center the F around the origin and Flip it around. We do this because
    // we're in 3D now with and +Y is up where as before when we started with 2D
    // we had +Y as down.
  
    // We could do by changing all the values above but I'm lazy.
    // We could also do it with a matrix at draw time but you should
    // never do stuff at draw time if you can do it at init time.
    /*
    
      // F在原点周围居中并翻转。我们这样做是因为
      //我们现在是在3D中，+Y向上，就像我们开始2D时一样
      // +Y是向下的。
  
      //我们可以改变上面所有的值，但是我很懒。
      //我们也可以在绘制时使用矩阵，但你应该这样做
      //如果可以在init时做，就不要在draw时做。
    
    */
    // 平移
    var matrix = makeTranslation(-50, -75, -15);
  
  
    // 旋转 180 度 因为 在 2d中 y 轴向下， 在3d 中y轴向上 所以要 旋转180度
    matrix = matrixMultiply(matrix, makeXRotation(Math.PI));
    
  // matrixVectorMultiply
    for (var ii = 0; ii < positions.length; ii += 3) {
     //  变换矩阵 * 向量
      var vector = matrixVectorMultiply([positions[ii + 0], positions[ii + 1], positions[ii + 2], 1], matrix);
      positions[ii + 0] = vector[0];
      positions[ii + 1] = vector[1];
      positions[ii + 2] = vector[2];
    }
  
    console.log('positions==',positions);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
  }
  
  // Fill the buffer with colors for the 'F'.
  function setColors(gl) {
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Uint8Array([
            // left column front
          200,  70, 120,
          200,  70, 120,
          200,  70, 120,
          200,  70, 120,
          200,  70, 120,
          200,  70, 120,
  
            // top rung front
          200,  70, 120,
          200,  70, 120,
          200,  70, 120,
          200,  70, 120,
          200,  70, 120,
          200,  70, 120,
  
            // middle rung front
          200,  70, 120,
          200,  70, 120,
          200,  70, 120,
          200,  70, 120,
          200,  70, 120,
          200,  70, 120,
  
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
  
            // top rung front
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
  
            // front of middle rung
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
  
            // front of bottom
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
          160, 160, 220
        ]
          ),
        gl.STATIC_DRAW);
  }
  

  main();
};

