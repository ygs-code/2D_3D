// import WebGLDebugUtils from "@/pages/3d/utils/lib/webgl-debug.js";
// import WebGLUtils from "@/pages/3d/utils/lib/webgl-utils";
import {getWebGLContext} from "@/pages/3d/utils/lib/cuon-utils";
import initShaders from "@/pages/3d/utils/initShader";
import {
  // 1. 创建 buffer 2.绑定buffer  3.向缓冲区写入数据
  createBufferInfoFromArrays
  // setBuffersAndAttributes,
  // setUniforms,
  // drawBufferInfo,
  // createProgramInfo
} from "@/pages/3d/utils/webgl-utils";

import {
  // createBufferInfoFromArrays,

  setBuffersAndAttributes,
  // 设置  Uniform 值 比如 gl.uniform1fv(location, v);
  setUniforms,
  drawBufferInfo,
  createProgramInfo
} from "@/pages/3d/utils/twgl";

import m4 from "@/pages/3d/utils/m4.js";
import primitives from "@/pages/3d/utils/primitives.js";
import controller from "@/pages/3d/utils/controller.js";
import VSHADER_SOURCE from "./index.vert";
import FSHADER_SOURCE from "./index.frag";
import VSHADER_SOURCE_3D from "./3d.vert";
import FSHADER_SOURCE_3D from "./3d.frag";
import {cubeArrays} from "./data";
import "./index.less";

window.onload = function () {
  const canvas = document.createElement("canvas");
  canvas.width = 398;
  canvas.height = 298;

  // getWebGLContext(canvas);

  document.body.appendChild(canvas);

  if (!canvas.getContext) return;
  let gl = canvas.getContext("webgl");
  // vertexShader, fragmentShader
  // let program = initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);

  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log("failed to initialize shaders");
    return;
  }

  // 使用完全不透明的黑色清除所有图像
  // 清空掉颜色
  gl.clearColor(0, 0, 0, 1.0); // RBGA
  // 用上面指定的颜色清除缓冲区
  gl.clear(gl.COLOR_BUFFER_BIT);

  // 参数设置
  const settings = {
    rotation: 150, // in degrees
    cam1FieldOfView: 60, // in degrees
    cam1PosX: 0,
    cam1PosY: 0,
    cam1PosZ: -200
  };

  // setup GLSL programs
  // compiles shaders, links program, looks up locations
  /*
  返回一个对象 对象包含
  program
  uniformSetters    uniform中有uniform变量设置函数
  attribSetters attrib中有attrib变量设置函数
*/
  const vertexColorProgramInfo = createProgramInfo(gl, [
    VSHADER_SOURCE_3D,
    FSHADER_SOURCE_3D
  ]);
  /*
  返回一个对象 对象包含
  program
  uniformSetters    uniform中有uniform变量设置函数
  attribSetters attrib中有attrib变量设置函数
*/
  const solidColorProgramInfo = createProgramInfo(gl, [
    VSHADER_SOURCE,
    FSHADER_SOURCE
  ]);

  // create geometry for a camera
  // 创建相机的几何形状
  function createCameraBufferInfo(gl, scale = 1) {
    // first let's add a cube. It goes from 1 to 3
    // because cameras look down -Z so we want
    // the camera to start at Z = 0. We'll put a
    // a cone in front of this cube opening
    // toward -Z

    // 顶点
    const positions = cubeArrays.positions;

    const indices = cubeArrays.indices;

    // add cone segments 添加锥段
    const numSegments = 6;

    const coneBaseIndex = positions.length / 3;

    const coneTipIndex = coneBaseIndex - 1;

    for (let i = 0; i < numSegments; ++i) {
      const u = i / numSegments;
      const angle = u * Math.PI * 2;
      const x = Math.cos(angle);
      const y = Math.sin(angle);
      positions.push(x, y, 0);
      // line from tip to edge
      indices.push(coneTipIndex, coneBaseIndex + i);
      // line from point on edge to next point on edge
      indices.push(coneBaseIndex + i, coneBaseIndex + ((i + 1) % numSegments));
    }
    positions.forEach((v, ndx) => {
      positions[ndx] *= scale;
    });

    console.log("positions==", positions);
    console.log("indices==", indices);

    // 1. 创建 buffer 2.绑定buffer  3.向缓冲区写入数据
    return createBufferInfoFromArrays(gl, {
      position: positions,
      indices
    });
  }

  // create buffers and fill with data for a 3D 'F'
  //  创建缓冲区并填充3D 'F'的数据
  const fBufferInfo = primitives.create3DFBufferInfo(gl);

  const cameraScale = 20;
  // 创建相机 buff
  const cameraBufferInfo = createCameraBufferInfo(gl, cameraScale);
  console.log("cameraBufferInfo==", cameraBufferInfo);

  // 角度转弧度
  function degToRad(d) {
    return (d * Math.PI) / 180;
  }

  // 绘画场景
  function drawScene(
    // 透视投影矩阵
    projectionMatrix,
    // 相机矩阵
    cameraMatrix,
    //x y轴旋转矩阵
    worldMatrix
  ) {
    // Clear the canvas AND the depth buffer.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Make a view matrix from the camera matrix. 从相机矩阵中创建一个视图矩阵。
    // 相机 逆矩阵
    const viewMatrix = m4.inverse(cameraMatrix);

    //   透视投影矩阵 *   相机 逆矩阵
    let mat = m4.multiply(projectionMatrix, viewMatrix);
    //   透视投影矩阵 *   相机 逆矩阵  * x y 轴相乘矩阵
    mat = m4.multiply(mat, worldMatrix);

    gl.useProgram(vertexColorProgramInfo.program);

    // ------ Draw the F --------

    // Setup all the needed attributes.
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
    setBuffersAndAttributes(gl, vertexColorProgramInfo, fBufferInfo);

    // Set the uniforms
    // 设置  Uniform 值 比如 gl.uniform1fv(location, v);
    setUniforms(vertexColorProgramInfo, {
      u_matrix: mat
    });
    /*
绘画顶点数据
*调用' gl.drawElements '或' gl.drawarray '，取合适的
*
通常你会叫“gl.drawElements '或' gl.drawArrays”自己
但是调用这个方法意味着如果你从索引数据切换到非索引数据
*数据你不需要记得更新你的draw调用。
*/
    drawBufferInfo(gl, fBufferInfo);
  }

  function render() {
    // resizeCanvasToDisplaySize(gl.canvas);

    //打开筛选。默认情况下，背面三角形
    //将被剔除。
    gl.enable(gl.CULL_FACE);
    // 1.开启隐藏面消除功能
    gl.enable(gl.DEPTH_TEST); // gl.DEPTH_TEST、gl.BLEND(混合)、gl.POLYGON_OFFSET_FILL(多边形位移)
    gl.enable(gl.SCISSOR_TEST); // 启用剪裁测试

    // 我们将把视图一分为二
    // we're going to split the view in 2
    const effectiveWidth = gl.canvas.clientWidth / 2;
    const aspect = effectiveWidth / gl.canvas.clientHeight;

    const near = 1;
    const far = 2000;

    // Compute a perspective projection matrix
    // 计算一个透视投影矩阵
    const perspectiveProjectionMatrix = m4.perspective(
      degToRad(settings.cam1FieldOfView), // 相机角度
      aspect, // 宽高比例
      near, // 近截面
      far // 远截面
    );

    // Compute the camera's matrix using look at.
    // 使用look计算相机的矩阵。
    const cameraPosition = [
      // eye
      settings.cam1PosX,
      settings.cam1PosY,
      settings.cam1PosZ
    ];

    //
    const target = [0, 0, 0]; // at center 目标
    const up = [0, 1, 0]; // 上方向
    // 视图矩阵 相机
    const cameraMatrix = m4.lookAt(cameraPosition, target, up);

    // y 轴旋转
    let worldMatrix = m4.yRotation(degToRad(settings.rotation));

    // x轴旋转
    worldMatrix = m4.xRotate(worldMatrix, degToRad(settings.rotation));
    // center the 'F' around its origin   把“F”放在原点周围
    // 位移
    worldMatrix = m4.translate(worldMatrix, -35, -75, -5);

    const {width, height} = gl.canvas;

    const leftWidth = (width / 2) | 0;

    // draw on the left with orthographic camera
    // 用正射相机在左边画
    /*
      调用glViewPort函数来决定视见区域，告诉OpenGL应把渲染之后的图形绘制在窗体的哪个部位。当视见区域是整个窗体时，OpenGL将把渲染结果绘制到整个窗口。
    gl.ViewPort(x:GLInt;y:GLInt;Width:GLSizei;Height:GLSizei);
    其中，参数X，Y指定了视见区域的左下角在窗口中的位置，一般情况下为（0，0），Width和Height指定了视见区域的宽度和高度。注意OpenGL使用的窗口坐标和WindowsGDI使用的窗口坐标是不一样的。图3.1-1表示了在WindowsGDI中的窗口坐标，而图3.1-2则是OpenGL所定义的窗口坐标。

          gl.scissor    函数定义剪刀框。拆剪

      */

    // 左边是f
    gl.viewport(0, 0, leftWidth, height);
    gl.scissor(0, 0, leftWidth, height);
    gl.clearColor(1, 0.8, 0.8, 1);

    drawScene(
      // 透视投影矩阵
      perspectiveProjectionMatrix,
      // 相机矩阵
      cameraMatrix,
      //x y轴旋转矩阵
      worldMatrix
    );

    // draw on right with perspective camera
    // 用透视相机在右侧绘制  右边是相机
    const rightWidth = width - leftWidth;

    // 右边是相机
    gl.viewport(leftWidth, 0, rightWidth, height);
    gl.scissor(leftWidth, 0, rightWidth, height);
    gl.clearColor(0.8, 0.8, 1, 1);

    // // compute a second projection matrix and a second camera
    // // 计算第二投影矩阵和第二摄像机
    // const perspectiveProjectionMatrix2 = m4.perspective(
    //   degToRad(60), // 透视弧度
    //   aspect, // 宽高比
    //   near, // 近截面
    //   far // 远截面
    // );

    // // Compute the camera's matrix using look at.
    // // 使用look计算相机的矩阵。
    // // eye
    // const cameraPosition2 = [-600, 400, -400];

    // // at
    // const target2 = [0, 0, 0];

    // // 相机 2
    // const cameraMatrix2 = m4.lookAt(cameraPosition2, target2, up);

    // drawScene(
    //   // 透视矩阵
    //   perspectiveProjectionMatrix2,
    //   // 相机
    //   cameraMatrix2,
    //   //x y轴旋转矩阵
    //   worldMatrix
    // );






    // return 
    
//     // draw object to represent first camera 绘制对象来表示第一个摄像机
//     {
//       // Make a view matrix from the 2nd camera matrix.
//       // *  m矩阵计算逆
//       //从第二个相机矩阵创建一个视图矩阵。
//       const viewMatrix = m4.inverse(cameraMatrix2);

//       let mat = m4.multiply(perspectiveProjectionMatrix2, viewMatrix);
//       // use the first's camera's matrix as the matrix to position
//       // the camera's representative in the scene
//       //使用第一个相机的矩阵作为矩阵来定位
//       //镜头在场景中的代表
//       mat = m4.multiply(mat, cameraMatrix);

//       gl.useProgram(solidColorProgramInfo.program);

//       // ------ Draw the Camera Representation --------

//       // Setup all the needed attributes.
//       /*
//        执行set函数 比如  gl.vertexAttrib4iv
//        或者：
//         1.绑定buffer数据  bindBuffer  
//             gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

//         2.连接 attrib 变量与分配给他的缓冲区对象
//             gl.enableVertexAttribArray(a_texcoordLocation);

//         3.告诉显卡从当前绑定的缓冲区（bindBuffer() 指定的缓冲区）中读取顶点数据。
//         方法绑定当前缓冲区范围到gl.ARRAY_BUFFER,
//         成为当前顶点缓冲区对象的通用顶点属性并指定它的布局 (缓冲区对象中的偏移量)。
//            gl.vertexAttribPointer(a_texcoordLocation, 4, gl.FLOAT, false, 0, 0);
//      */
//       setBuffersAndAttributes(gl, solidColorProgramInfo, cameraBufferInfo);

//       // Set the uniforms
//       // 设置  Uniform 值 比如 gl.uniform1fv(location, v);
//       setUniforms(solidColorProgramInfo, {
//         u_matrix: mat,
//         u_color: [0, 0, 0, 1]
//       });

//       /*
// 绘画顶点数据
// *调用' gl.drawElements '或' gl.drawarray '，取合适的
// *
// 通常你会叫“gl.drawElements '或' gl.drawArrays”自己
// 但是调用这个方法意味着如果你从索引数据切换到非索引数据
// *数据你不需要记得更新你的draw调用。
// */
//       // drawBufferInfo(gl, cameraBufferInfo, gl.LINES);
//     }
    
  }


  render();

  // 控制 参数改变
  controller({
    onChange: () => {
      render();
      console.log("render========", settings);
    },
    parmas: settings,
    options: [
      {
        min: 0,
        max: 360,
        step: 0.001,
        key: "rotation",
        name: "旋转",
        // onChange: (value) => {},
        onFinishChange: (value) => {
          // 完全修改停下来的时候触发这个事件
          console.log("onFinishChange value==", value);
        }
      },
      {
        key: "cam1FieldOfView",
        min: 1,
        max: 170,
        step: 0.01,
        name: "相机视野",
        onChange: (value) => {},
        onFinishChange: (value) => {
          // 完全修改停下来的时候触发这个事件
          console.log("onFinishChange value==", value);
        }
      },
      {
        key: "cam1PosX",
        min: -200,
        max: 200,
        step: 0.01,
        name: "改变相机X轴",
        onChange: (value) => {},
        onFinishChange: (value) => {
          // 完全修改停下来的时候触发这个事件
          console.log("onFinishChange value==", value);
        }
      },

      {
        key: "cam1PosY",
        min: -200,
        max: 200,
        step: 0.01,
        name: "改变相机Y轴",
        onChange: (value) => {},
        onFinishChange: (value) => {
          // 完全修改停下来的时候触发这个事件
          console.log("onFinishChange value==", value);
        }
      },
      {
        key: "cam1PosZ",
        min: -200,
        max: 200,
        step: 0.01,
        name: "改变相机Z轴",
        onChange: (value) => {},
        onFinishChange: (value) => {
          // 完全修改停下来的时候触发这个事件
          console.log("onFinishChange value==", value);
        }
      }
    ]
  });
};
