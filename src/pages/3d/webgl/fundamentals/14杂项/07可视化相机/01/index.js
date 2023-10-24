// import WebGLDebugUtils from "@/pages/3d/utils/lib/webgl-debug.js";
// import WebGLUtils from "@/pages/3d/utils/lib/webgl-utils";
import {getWebGLContext} from "@/pages/3d/utils/lib/cuon-utils";
import initShaders from "./initShader";
import {
  createBufferInfoFromArrays,
  setBuffersAndAttributes,
  setUniforms,
  drawBufferInfo,
  createProgramInfo
} from "@/pages/3d/utils/webgl-utils";
import m4 from "@/pages/3d/utils/m4.js";
import primitives from "@/pages/3d/utils/primitives.js";
import controller from "@/pages/3d/utils/controller.js";
import VSHADER_SOURCE from "./index.vert";
import FSHADER_SOURCE from "./index.frag";
import VSHADER_SOURCE_3D from "./3d.vert";
import FSHADER_SOURCE_3D from "./3d.frag";
import "./index.less";

window.onload = function () {
  const canvas = document.createElement("canvas");
  canvas.width = 398;
  canvas.height = 298;

  getWebGLContext(canvas);

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

  // create geometry for a camera
  // 创建相机的几何形状
  function createCameraBufferInfo(gl, scale = 1) {
    // first let's add a cube. It goes from 1 to 3
    // because cameras look down -Z so we want
    // the camera to start at Z = 0. We'll put a
    // a cone in front of this cube opening
    // toward -Z

    const positions = new Function(`
                     return    [
                          -1, -1,  1,  // cube vertices
                           1, -1,  1,
                          -1,  1,  1,
                          1,  1,  1,
                          -1, -1,  3,
                          1, -1,  3,
                          -1,  1,  3,
                          1,  1,  3,
                          0,  0,  1,  // cone tip
                      ];`)();

    const indices = new Function(`
                    return  [
                      0, 1, 1, 3, 3, 2, 2, 0, // cube indices
                      4, 5, 5, 7, 7, 6, 6, 4,
                      0, 4, 1, 5, 3, 7, 2, 6,
                    ];
    `)();

    // add cone segments
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

    //
    return createBufferInfoFromArrays(gl, {
      position: positions,
      indices
    });
  }

  // setup GLSL programs
  // compiles shaders, links program, looks up locations
  const vertexColorProgramInfo = createProgramInfo(gl, [
    VSHADER_SOURCE_3D,
    FSHADER_SOURCE_3D
  ]);
  const solidColorProgramInfo = createProgramInfo(gl, [
    VSHADER_SOURCE,
    FSHADER_SOURCE
  ]);
  // console.log('vertexColorProgramInfo1=',vertexColorProgramInfo1);
  // console.log('solidColorProgramInfo1=',solidColorProgramInfo1);
  // console.log('vertexColorProgramInfo=',vertexColorProgramInfo);
  // console.log('solidColorProgramInfo=',solidColorProgramInfo);

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

  // 参数设置
  const settings = {
    rotation: 150, // in degrees
    cam1FieldOfView: 60, // in degrees
    cam1PosX: 0,
    cam1PosY: 0,
    cam1PosZ: -200
  };

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

  // 绘画场景
  function drawScene(projectionMatrix, cameraMatrix, worldMatrix) {
    // Clear the canvas AND the depth buffer.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Make a view matrix from the camera matrix.
    const viewMatrix = m4.inverse(cameraMatrix);

    let mat = m4.multiply(projectionMatrix, viewMatrix);
    mat = m4.multiply(mat, worldMatrix);

    gl.useProgram(vertexColorProgramInfo.program);

    // ------ Draw the F --------

    // Setup all the needed attributes.
    setBuffersAndAttributes(gl, vertexColorProgramInfo, fBufferInfo);

    // Set the uniforms
    setUniforms(vertexColorProgramInfo, {
      u_matrix: mat
    });

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
      degToRad(settings.cam1FieldOfView),
      aspect,
      near,
      far
    );

    // Compute the camera's matrix using look at.
    // 使用look计算相机的矩阵。
    const cameraPosition = [
      settings.cam1PosX,
      settings.cam1PosY,
      settings.cam1PosZ
    ];

    const target = [0, 0, 0];
    const up = [0, 1, 0];
    const cameraMatrix = m4.lookAt(cameraPosition, target, up);

    let worldMatrix = m4.yRotation(degToRad(settings.rotation));
    worldMatrix = m4.xRotate(worldMatrix, degToRad(settings.rotation));
    // center the 'F' around its origin
    worldMatrix = m4.translate(worldMatrix, -35, -75, -5);

    const {width, height} = gl.canvas;
    const leftWidth = (width / 2) | 0;

    // draw on the left with orthographic camera
    gl.viewport(0, 0, leftWidth, height);
    gl.scissor(0, 0, leftWidth, height);
    gl.clearColor(1, 0.8, 0.8, 1);

    drawScene(perspectiveProjectionMatrix, cameraMatrix, worldMatrix);

    // draw on right with perspective camera
    const rightWidth = width - leftWidth;
    gl.viewport(leftWidth, 0, rightWidth, height);
    gl.scissor(leftWidth, 0, rightWidth, height);
    gl.clearColor(0.8, 0.8, 1, 1);

    // compute a second projection matrix and a second camera
    const perspectiveProjectionMatrix2 = m4.perspective(
      degToRad(60),
      aspect,
      near,
      far
    );

    // Compute the camera's matrix using look at.
    const cameraPosition2 = [-600, 400, -400];
    const target2 = [0, 0, 0];
    const cameraMatrix2 = m4.lookAt(cameraPosition2, target2, up);

    drawScene(perspectiveProjectionMatrix2, cameraMatrix2, worldMatrix);

    // draw object to represent first camera
    {
      // Make a view matrix from the 2nd camera matrix.
      const viewMatrix = m4.inverse(cameraMatrix2);

      let mat = m4.multiply(perspectiveProjectionMatrix2, viewMatrix);
      // use the first's camera's matrix as the matrix to position
      // the camera's representative in the scene
      mat = m4.multiply(mat, cameraMatrix);

      gl.useProgram(solidColorProgramInfo.program);

      // ------ Draw the Camera Representation --------

      // Setup all the needed attributes.
      setBuffersAndAttributes(gl, solidColorProgramInfo, cameraBufferInfo);

      // Set the uniforms
      setUniforms(solidColorProgramInfo, {
        u_matrix: mat,
        u_color: [0, 0, 0, 1]
      });

      drawBufferInfo(gl, cameraBufferInfo, gl.LINES);
    }
  }
  render();
};
