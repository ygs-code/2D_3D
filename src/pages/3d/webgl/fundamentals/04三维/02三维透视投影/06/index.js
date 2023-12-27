import * as twgl from "@/pages/3d/utils/twgl";
import eyeIcon from "static/image/eye-icon.png";
import initShader from "@/pages/3d/utils/initShader";
import FSHADER_SOURCE from "./index.frag";
import VSHADER_SOURCE from "./index.vert";

import COLOR_FSHADER_SOURCE from "./color.frag";
import COLOR_VSHADER_SOURCE from "./color.vert";
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
  const m4 = twgl.m4;

  var eyePosition;
  var target;

  // globals
  var pixelRatio = window.devicePixelRatio || 1;
  var scale = 1;

  function main() {
    // Get A WebGL context
    /** @type {HTMLCanvasElement} */

    var canvas = document.createElement("canvas");
    canvas.style.width = 796 / 2 + "px";
    canvas.style.height = 1196 / 2 + "px";

    //

    // 眼镜 相机
    const eyeElem = document.createElement("img"); // document.querySelector("#eye");
    eyeElem.id = "#eye";
    eyeElem.src = eyeIcon;

    eyeElem.style.cssText =
      "position: absolute; z-index: 2; left: 18px; top: 269px; width: 32px; height: auto;";

    document.body.appendChild(canvas);
    document.body.appendChild(eyeElem);

    // var canvas = document.querySelector("#canvas");
    var gl = canvas.getContext("webgl");
    if (!gl) {
      return;
    }

    // 创建 ProgramFromSources
    const program = initShader(
      gl,
      COLOR_VSHADER_SOURCE,
      COLOR_FSHADER_SOURCE
      // progOptions
    );

    /*
  返回一个对象 对象包含
  program
  uniformSetters    uniform中有uniform变量设置函数
  attribSetters attrib中有attrib变量设置函数
  */
    const vertexColorProgramInfo = twgl.createProgramInfoFromProgram(
      gl,
      program
    );

    console.log("vertexColorProgramInfo======", vertexColorProgramInfo);

    // 1. 创建 buffer 2.绑定buffer  3.向缓冲区写入数据
    var wireCubeBufferInfo = twgl.createBufferInfoFromArrays(
      gl,
      wireCubeArrays
    );

    // 1. 创建 buffer 2.绑定buffer  3.向缓冲区写入数据
    var cubeRaysBufferInfo = twgl.createBufferInfoFromArrays(
      gl,
      cubeRaysArrays
    );

    // 创建Program 返回 program
    /*
  返回一个对象 对象包含
  program
  uniformSetters    uniform中有uniform变量设置函数
  attribSetters     attrib中有attrib变量设置函数
  */
    var colorProgramInfo = twgl.createProgramInfo(gl, [
      "baseVertexShader",
      "colorFragmentShader"
    ]);

    // 创建Program 返回 program
    // var colorProgramInfo = initShader(gl,
    //   VSHADER_SOURCE,
    //   FSHADER_SOURCE,
    // );

    // *创建立方体的顶点和索引。 3个立方体一共 72个顶点数据
    // var cubeArrays = twgl.primitives.createCubeVertices(2);

    console.log("cubeArrays==", cubeArrays);

    // 1. 创建 buffer 2.绑定buffer  3.向缓冲区写入数据
    var cubeBufferInfo = twgl.createBufferInfoFromArrays(gl, cubeArrays);

    // 1. 创建 buffer 2.绑定buffer  3.向缓冲区写入数据
    var fBufferInfo = twgl.createBufferInfoFromArrays(gl, FArrays);

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

    let parmas = {
      zNear: 10,
      zFar: 50,
      fieldOfView: 30,
      zPosition: -25
    };

    // 控制 参数改变
    controller({
      onChange: () => {},
      parmas: parmas,
      options: [
        {
          min: 0,
          max: 179,
          step: 0.001,
          key: "fieldOfView",
          name: "fieldOfView",
          // onChange: (value) => {},
          onFinishChange: (value) => {
            // 完全修改停下来的时候触发这个事件
            console.log("onFinishChange value==", value);
          }
        },
        {
          min: 0,
          max: 50,
          step: 0.001,
          key: "zNear",
          name: "zNear",
          // onChange: (value) => {},
          onFinishChange: (value) => {
            // 完全修改停下来的时候触发这个事件
            console.log("onFinishChange value==", value);
          }
        },
        {
          min: 0,
          max: 100,
          step: 0.01,
          key: "zFar",
          name: "zFar",
          onChange: (value) => {},
          onFinishChange: (value) => {
            // 完全修改停下来的时候触发这个事件
            console.log("onFinishChange value==", value);
          }
        },
        {
          min: -120,
          max: 0,
          step: 0.01,
          key: "zPosition",
          name: "zPosition",
          onChange: (value) => {},
          onFinishChange: (value) => {
            // 完全修改停下来的时候触发这个事件
            console.log("onFinishChange value==", value);
          }
        }
      ]
    });

    // 渲染
    function render(time) {
      time *= 0.001;
      // 设置 canvas 的宽高
      twgl.resizeCanvasToDisplaySize(canvas, pixelRatio);
      const halfHeight = gl.canvas.height / 2;
      const width = gl.canvas.width;

      // clear the screen.
      // 启用剪裁测试
      /*
      片断测试其实就是测试每一个像素，
      只有通过测试的像素才会被绘制，
      没有通过测试的像素则不进行绘制。
      之前用的深度测试就是一种片段测试，还有裁剪，也是一种片段测试。
      OpenGL提供了深度测试、剪裁测试、Alpha测试和模板测试这4中片段测试。
       剪裁测试
       剪裁测试用于限制绘制区域。我们可以指定一个矩形的剪裁窗口，当启用剪裁测试后，
       只有在这个窗口之内的像素才能被绘制，其它像素则会被丢弃。
      */
      gl.disable(gl.SCISSOR_TEST);
      // 关闭颜色缓冲的所有通道
      gl.colorMask(true, true, true, true);
      // 方法指定清除颜色缓冲区时使用的颜色值。这指定了调用clear()方法时使用的颜色值。这些值被限制在0和1之间。
      gl.clearColor(0, 0, 0, 0);
      /*
          WebGL API的WebGLRenderingContext.clear()方法将缓冲区清除为预设值。
          预设值可以通过clearColor()， clearDepth()或clearStencil()来设置。
          剪刀盒、抖动和缓冲区写掩码会影响clear()方法。
      */
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      /*
      WebGL API的WebGLRenderingContext.viewport()
      方法设置viewport，
      它指定x和y从标准化设备坐标到窗口坐标的仿射变换。
      */
      gl.viewport(0, halfHeight, width, halfHeight);

      // 激活深度比较并更新深度缓冲区。看到
      gl.enable(gl.DEPTH_TEST);
      // 激活计算片段颜色值的混合。看到
      gl.enable(gl.BLEND);
      // WebGL API的WebGLRenderingContext.blendFunc()方法定义了用于混合像素算法的函数。
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      // 宽高比例
      var aspect = gl.canvas.clientWidth / (gl.canvas.clientHeight / 2);

      // 透视矩阵
      m4.perspective(
        degToRad(60), // 这个是相机弧度
        aspect, // 宽高比
        1, //近截面
        5000, //远截面
        projection // 矩阵
      );

      var f = Math.max(30, parmas.fieldOfView) - 30;
      f = f / (179 - 30);
      f = f * f * f * f;
      f = lerp(1, 179 * 0.9, f);
      f = 1;
      // 用一个向量乘以一个标量。
      v3.mulScalar(targetToEye, f, v3t0);
      
      // *两个向量相加;假设a和b有相同的维数。
      v3.add(v3t0, target, v3t0);

      // 眼镜 相机
      m4.lookAt(
        v3t0, //eyePosition,
        target,
        up,
        view
      );

      //  *计算4 × 4矩阵的逆。
      m4.inverse(view, view);

      // 4x4 矩阵乘法
      m4.multiply(projection, view, viewProjection);

      // Draw scene  绘画场景
      function drawScene(viewProjection, exampleProjection) {
        gl.useProgram(colorProgramInfo.program);

        /*
       执行set函数 比如  gl.vertexAttrib4iv
       或者：
        1.绑定buffer数据  bindBuffer  
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

        2.连接 attrib 变量与分配给他的缓冲区对象
            gl.enableVertexAttribArray(a_texcoordLocation);

        3.告诉显卡从当前绑定的缓冲区（bindBuffer() 指定的缓冲区）中读取顶点数据。
        方法绑定当前缓冲区范围到gl.ARRAY_BUFFER,
        成为当前顶点缓冲区对象的通用顶点属性并指定它的布局 (缓冲区对象中的偏移量)。
           gl.vertexAttribPointer(a_texcoordLocation, 4, gl.FLOAT, false, 0, 0);
     */
        twgl.setBuffersAndAttributes(gl, colorProgramInfo, cubeBufferInfo);

        var cubeScale = scale * 3;
        for (var ii = -1; ii <= 1; ++ii) {
          // 变换 偏移
          m4.translation([ii * 10, 0, parmas.zPosition], world);
          // 旋转 Y 轴
          m4.rotateY(world, time + (ii * Math.PI) / 6, world);
          // 旋转 X 轴
          m4.rotateX(world, Math.PI / 4, world);
          // 旋转 Z 轴
          m4.rotateZ(world, Math.PI / 4, world);
          // 放大
          m4.scale(world, [cubeScale, cubeScale, cubeScale], world);
          //  矩阵相乘
          m4.multiply(viewProjection, world, worldViewProjection);
          //  矩阵相乘
          m4.multiply(exampleProjection, world, exampleWorldViewProjection);
          // 设置  Uniform 值 比如 gl.uniform1fv(location, v);
          twgl.setUniforms(colorProgramInfo, sceneCubeUniforms);
          /*
            绘画顶点数据
            *调用' gl.drawElements '或' gl.drawarray '，取合适的
            *
            通常你会叫“gl.drawElements '或' gl.drawArrays”自己
            但是调用这个方法意味着如果你从索引数据切换到非索引数据
            *数据你不需要记得更新你的draw调用。
          */
          twgl.drawBufferInfo(gl, cubeBufferInfo);
        }

        var rotation = [degToRad(40), degToRad(25), degToRad(325)];
        // 变换
        m4.translation([45, 150, 0], world);
        // 旋转X轴
        m4.rotateX(world, rotation[0], world);
        // 旋转Y轴
        m4.rotateY(world, rotation[1], world);
        // 旋转Z轴
        m4.rotateZ(world, rotation[2], world);
        // 矩阵相乘
        m4.multiply(viewProjection, world, worldViewProjection);
        // 矩阵相乘
        m4.multiply(exampleProjection, world, exampleWorldViewProjection);
        /*
       执行set函数 比如  gl.vertexAttrib4iv
       或者：
        1.绑定buffer数据  bindBuffer  
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

        2.连接 attrib 变量与分配给他的缓冲区对象
            gl.enableVertexAttribArray(a_texcoordLocation);

        3.告诉显卡从当前绑定的缓冲区（bindBuffer() 指定的缓冲区）中读取顶点数据。
        方法绑定当前缓冲区范围到gl.ARRAY_BUFFER,
        成为当前顶点缓冲区对象的通用顶点属性并指定它的布局 (缓冲区对象中的偏移量)。
           gl.vertexAttribPointer(a_texcoordLocation, 4, gl.FLOAT, false, 0, 0);
     */
        twgl.setBuffersAndAttributes(gl, colorProgramInfo, fBufferInfo);
        // 设置  Uniform 值 比如 gl.uniform1fv(location, v);
        twgl.setUniforms(colorProgramInfo, sceneCubeUniforms);
        /*
            绘画顶点数据
            *调用' gl.drawElements '或' gl.drawarray '，取合适的
            *
            通常你会叫“gl.drawElements '或' gl.drawArrays”自己
            但是调用这个方法意味着如果你从索引数据切换到非索引数据
            *数据你不需要记得更新你的draw调用。
          */
        twgl.drawBufferInfo(gl, fBufferInfo);
      }
      // Draw scene  绘画场景
      drawScene(viewProjection, exampleProjection);

      // Draw Frustum Cube behind 把Frustum Cube画在后面
      function drawFrustumCube() {
        gl.useProgram(colorProgramInfo.program);
        /*
       执行set函数 比如  gl.vertexAttrib4iv
       或者：
        1.绑定buffer数据  bindBuffer  
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

        2.连接 attrib 变量与分配给他的缓冲区对象
            gl.enableVertexAttribArray(a_texcoordLocation);

        3.告诉显卡从当前绑定的缓冲区（bindBuffer() 指定的缓冲区）中读取顶点数据。
        方法绑定当前缓冲区范围到gl.ARRAY_BUFFER,
        成为当前顶点缓冲区对象的通用顶点属性并指定它的布局 (缓冲区对象中的偏移量)。
           gl.vertexAttribPointer(a_texcoordLocation, 4, gl.FLOAT, false, 0, 0);
     */
        twgl.setBuffersAndAttributes(gl, colorProgramInfo, cubeBufferInfo);
        // 透视矩阵
        m4.perspective(
          degToRad(parmas.fieldOfView),
          aspect,
          parmas.zNear,
          parmas.zFar * scale,
          exampleProjection
        );
        //  *计算4 × 4矩阵的逆。
        m4.inverse(exampleProjection, exampleInverseProjection);
        // 变换 偏移
        m4.translation([0, 0, 0], world);
        m4.multiply(exampleInverseProjection, world, world);
        m4.scale(world, [scale, scale, scale], world);
        m4.multiply(viewProjection, world, worldViewProjection);
        // 设置  Uniform 值 比如 gl.uniform1fv(location, v);
        twgl.setUniforms(colorProgramInfo, sharedUniforms);
        // 设置  Uniform 值 比如 gl.uniform1fv(location, v);
        twgl.setUniforms(colorProgramInfo, frustumCubeUniforms);
        /*
            绘画顶点数据
            *调用' gl.drawElements '或' gl.drawarray '，取合适的
            *
            通常你会叫“gl.drawElements '或' gl.drawArrays”自己
            但是调用这个方法意味着如果你从索引数据切换到非索引数据
            *数据你不需要记得更新你的draw调用。
          */
        twgl.drawBufferInfo(gl, cubeBufferInfo);
      }
      gl.enable(gl.CULL_FACE);
      gl.cullFace(gl.BACK);
      // 把Frustum Cube画在后面
      drawFrustumCube();
      gl.disable(gl.CULL_FACE);

      gl.enable(gl.CULL_FACE);
      gl.cullFace(gl.FRONT);
      //    drawFrustumCube();
      gl.disable(gl.CULL_FACE);

      // Draw view cone.
      // 透视矩阵
      m4.perspective(
        degToRad(parmas.fieldOfView),
        aspect,
        1,
        5000,
        exampleProjection
      );
      //  *计算4 × 4矩阵的逆。
      m4.inverse(exampleProjection, exampleInverseProjection);
      // 变换 偏移
      m4.translation([0, 0, 0], world);
      m4.multiply(world, exampleInverseProjection, world);
      m4.scale(world, [scale, scale, scale], world);
      m4.multiply(viewProjection, world, worldViewProjection);

      gl.useProgram(vertexColorProgramInfo.program);
      /*
       执行set函数 比如  gl.vertexAttrib4iv
       或者：
        1.绑定buffer数据  bindBuffer  
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

        2.连接 attrib 变量与分配给他的缓冲区对象
            gl.enableVertexAttribArray(a_texcoordLocation);

        3.告诉显卡从当前绑定的缓冲区（bindBuffer() 指定的缓冲区）中读取顶点数据。
        方法绑定当前缓冲区范围到gl.ARRAY_BUFFER,
        成为当前顶点缓冲区对象的通用顶点属性并指定它的布局 (缓冲区对象中的偏移量)。
           gl.vertexAttribPointer(a_texcoordLocation, 4, gl.FLOAT, false, 0, 0);
     */
      twgl.setBuffersAndAttributes(
        gl,
        vertexColorProgramInfo,
        cubeRaysBufferInfo
      );
      // 设置  Uniform 值 比如 gl.uniform1fv(location, v);
      twgl.setUniforms(vertexColorProgramInfo, sharedUniforms);
      // 设置  Uniform 值 比如 gl.uniform1fv(location, v);
      twgl.setUniforms(vertexColorProgramInfo, cubeRaysUniforms);
      /*
            绘画顶点数据
            *调用' gl.drawElements '或' gl.drawarray '，取合适的
            *
            通常你会叫“gl.drawElements '或' gl.drawArrays”自己
            但是调用这个方法意味着如果你从索引数据切换到非索引数据
            *数据你不需要记得更新你的draw调用。
          */
      twgl.drawBufferInfo(gl, cubeRaysBufferInfo, gl.LINES);

      {
        /*
          *取一个4 × 4矩阵和一个有3个元素的向量，
          *将向量解释为一个点，用矩阵变换这个点，然后
          *返回结果为包含3个条目的向量。
          一个坐标转换，将矩阵坐标化为屏幕坐标
          */
        const eyePosition = m4.transformPoint(worldViewProjection, [0, 0, 0]);
        const ex = ((eyePosition[0] * 0.5 + 0.5) * width) / pixelRatio;
        const ey = ((eyePosition[1] * -0.5 + 0.5) * halfHeight) / pixelRatio;
        
        eyeElem.style.left = px(ex - eyeElem.width / 2 + 50);
        eyeElem.style.top = px(ey - eyeElem.height / 2 + 50);
      }

      // Draw Frustum Wire 画截锥体线
      // 透视矩阵
      m4.perspective(
        degToRad(parmas.fieldOfView),
        aspect,
        parmas.zNear,
        parmas.zFar * scale,
        exampleProjection
      );
      //  *计算4 × 4矩阵的逆。
      m4.inverse(exampleProjection, exampleInverseProjection);
      // 变换 偏移
      m4.translation([0, 0, 0], world);
      // 矩阵相乘
      m4.multiply(world, exampleInverseProjection, world);
      // 矩阵缩放
      m4.scale(world, [scale, scale, scale], world);
      // 矩阵相乘
      m4.multiply(viewProjection, world, worldViewProjection);
      /*
       执行set函数 比如  gl.vertexAttrib4iv
       或者：
        1.绑定buffer数据  bindBuffer  
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

        2.连接 attrib 变量与分配给他的缓冲区对象
            gl.enableVertexAttribArray(a_texcoordLocation);

        3.告诉显卡从当前绑定的缓冲区（bindBuffer() 指定的缓冲区）中读取顶点数据。
        方法绑定当前缓冲区范围到gl.ARRAY_BUFFER,
        成为当前顶点缓冲区对象的通用顶点属性并指定它的布局 (缓冲区对象中的偏移量)。
           gl.vertexAttribPointer(a_texcoordLocation, 4, gl.FLOAT, false, 0, 0);
     */
      twgl.setBuffersAndAttributes(
        gl,
        vertexColorProgramInfo,
        wireCubeBufferInfo
      );
      // 设置  Uniform 值 比如 gl.uniform1fv(location, v);
      twgl.setUniforms(vertexColorProgramInfo, sharedUniforms);
      // 设置  Uniform 值 比如 gl.uniform1fv(location, v);
      twgl.setUniforms(vertexColorProgramInfo, wireFrustumUniforms);
      /*
            绘画顶点数据
            *调用' gl.drawElements '或' gl.drawarray '，取合适的
            *
            通常你会叫“gl.drawElements '或' gl.drawArrays”自己
            但是调用这个方法意味着如果你从索引数据切换到非索引数据
            *数据你不需要记得更新你的draw调用。
          */
      twgl.drawBufferInfo(gl, wireCubeBufferInfo, gl.LINES);

      // Draw 3D view
      gl.enable(gl.SCISSOR_TEST);
      gl.viewport(0, 0, width, halfHeight);
      gl.scissor(0, 0, width, halfHeight);
      gl.clearColor(0.5, 0.5, 0.5, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      // 透视矩阵
      m4.perspective(
        degToRad(parmas.fieldOfView),
        aspect,
        parmas.zNear,
        parmas.zFar * scale,
        projection
      );
      // Draw scene  绘画场景
      drawScene(exampleProjection, zeroMat);

      // 动画定时器
      requestAnimationFrame(render);
    }
    // 动画定时器
    requestAnimationFrame(render);
  }

  // px
  function px(v) {
    return `${v | 0}px`;
  }

  // 角度转弧度    deg *  2 * Math.PI / 360  等于弧度
  function degToRad(deg) {
    return (deg * Math.PI) / 180;
  }

  //
  function lerp(a, b, l) {
    return a + (b - a) * l;
  }

  main();
};
