import {getWebGLContext, initShaders} from "@/pages/3d/utils/lib/cuon-utils";
import * as glMatrix from "gl-matrix";
import m4 from "./m4";
import cat_512 from "@/assets/image/cat_512x512.jpg";
import mask_512x512 from "@/assets/image/mask_512x512.jpg";
import VSHADER_SOURCE from "./index.vert";
import FSHADER_SOURCE from "./index.frag";
import {colors, positions} from "./data";
import * as dat from "dat.gui";
import "./index.less";

window.onload = function () {
  let canvas_w = 400,
    canvas_h = 400;
  const canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 800;
  // getWebGLContext(canvas);
  document.body.appendChild(canvas);

  if (!canvas.getContext) return;
  let gl = canvas.getContext("webgl");
  // vertexShader, fragmentShader

  console.log("VSHADER_SOURCE=====", VSHADER_SOURCE);
  console.log("FSHADER_SOURCE=====", FSHADER_SOURCE);
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log("failed to initialize shaders");
    return;
  }

  // new Uint8Array();

  // 初始化顶点
  function initVertexBuffers(gl) {
    let FSIZE = positions.BYTES_PER_ELEMENT; // Float32 Size = 4

    let positionsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    let a_Position = gl.getAttribLocation(gl.program, "a_Position");
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 3, 0);
    gl.enableVertexAttribArray(a_Position);

    let colorsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
    let a_Colors = gl.getAttribLocation(gl.program, "a_Colors");
    gl.vertexAttribPointer(
      a_Colors,
      4,
      gl.FLOAT,
      false,
      colorsBuffer.BYTES_PER_ELEMENT * 4,
      0
    );
    gl.enableVertexAttribArray(a_Colors);
  }

  let deg = 45;
  let startTime = new Date().getTime();
  let nowTime = new Date().getTime();

  // set
  //     uniform mat4 u_TranslatrMatrix;// 平移矩阵
  // uniform mat4 u_ScaleMatrix;// 缩放矩阵

  // 设置矩阵
  const setMatrix = (parmas) => {
    // 设置的参数
    const {
      position: {x: positionX, y: positionY, z: positionZ},
      scale: {x: scaleX, y: scaleY, z: scaleZ},
      rotation: {angleX, angleY, angleZ}
    } = parmas;

    // 位移矩阵
    let translatrMatrix = m4.translation(positionX, positionY, positionZ);
    // 缩放矩阵
    let scaleMatrix = m4.scaling(scaleX, scaleY, scaleZ);
    // 旋转的x矩阵
    let rotationMatrixX = m4.xRotation((new Number(angleX) * Math.PI) / 180);

    // 旋转的y矩阵;
    let rotationMatrixY = m4.yRotation((new Number(angleY) * Math.PI) / 180);
    // 旋转的z矩阵;
    let rotationMatrixZ = m4.zRotation((new Number(angleZ) * Math.PI) / 180);
    // x 与 y矩阵 结合
    let rotationMatrix = m4.multiply(rotationMatrixX, rotationMatrixY);
    // x 与 y z矩阵 结合
    rotationMatrix = m4.multiply(rotationMatrix, rotationMatrixZ);
    return {
      translatrMatrix,
      scaleMatrix,
      rotationMatrix
    };
  };

  function draw(gl, translatrMatrix, scaleMatrix, rotationMatrix) {
    // nowTime = new Date().getTime();
    // if (nowTime - startTime >= 10) {
    //   deg++;
    //   startTime = nowTime;
    // }

    let u_RotationMatrix = gl.getUniformLocation(
      gl.program,
      "u_RotationMatrix"
    );

    let u_TranslatrMatrix = gl.getUniformLocation(
      gl.program,
      "u_TranslatrMatrix"
    );

    let u_ScaleMatrix = gl.getUniformLocation(gl.program, "u_ScaleMatrix");
    gl.uniformMatrix4fv(u_RotationMatrix, false, rotationMatrix);
    gl.uniformMatrix4fv(u_TranslatrMatrix, false, translatrMatrix);
    gl.uniformMatrix4fv(u_ScaleMatrix, false, scaleMatrix);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    /*
      后面的面挡住拉前面的面。
      添加  gl.enable(gl.DEPTH_TEST); 就这样解决这个问题
    */
    gl.enable(gl.DEPTH_TEST);
    for (let i = 0; i < positions.length; i += 4) {
      gl.drawArrays(gl.TRIANGLE_FAN, i, 4);
      // gl.drawArrays(gl.POINTS, i, 4);
    }

    // requestAnimationFrame(() => {
    //   draw(gl);
    // });
  }

  const init = () => {
    const gui = new dat.GUI();
    // 设置一个文件夹
    const folder = gui.addFolder("设置三角形");
    // 参数设置
    let parmas = {
      color: "rgb(0,0,0,0)",
      position: {
        x: 0,
        y: 0,
        z: 0
      },
      angle: 0,
      scale: {
        x: 1,
        y: 1,
        z: 1
      },
      rotation: {
        angleX: 0,
        angleY: 0,
        angleZ: 0
      },
      fn: () => {}
    };

    initVertexBuffers(gl);
    const {translatrMatrix, scaleMatrix, rotationMatrix} = setMatrix(parmas);
    draw(gl, translatrMatrix, scaleMatrix, rotationMatrix);

    let options = [
      {
        props: parmas.position,
        key: "x",
        min: -1,
        max: 1,
        step: 0.01,
        name: "平移改变x轴",
        onChange: (value) => {},
        onFinishChange: (value) => {
          // 完全修改停下来的时候触发这个事件
          console.log("onFinishChange value==", value);
        }
      },
      {
        props: parmas.position,
        key: "y",
        min: -1,
        max: 1,
        step: 0.01,
        name: "平移改变y轴",
        onChange: (value) => {},
        onFinishChange: (value) => {
          // 完全修改停下来的时候触发这个事件
          console.log("onFinishChange value==", value);
        }
      },
      {
        props: parmas.position,
        key: "z",
        min: -1,
        max: 1,
        step: 0.01,
        name: "平移改变z轴",
        onChange: (value) => {},
        onFinishChange: (value) => {
          // 完全修改停下来的时候触发这个事件
          console.log("onFinishChange value==", value);
        }
      },

      {
        props: parmas.scale,
        key: "x",
        min: 0.5,
        max: 3,
        step: 0.01,
        name: "缩放改变x轴",
        onChange: (value) => {},
        onFinishChange: (value) => {
          // 完全修改停下来的时候触发这个事件
          console.log("onFinishChange value==", value);
        }
      },
      {
        props: parmas.scale,
        key: "y",
        min: 0.5,
        max: 3,
        step: 0.01,
        name: "缩放改变y轴",
        onChange: (value) => {},
        onFinishChange: (value) => {
          // 完全修改停下来的时候触发这个事件
          console.log("onFinishChange value==", value);
        }
      },
      {
        props: parmas.scale,
        key: "z",
        min: 0.5,
        max: 3,
        step: 0.01,
        name: "缩放改变z轴",
        onChange: (value) => {},
        onFinishChange: (value) => {
          // 完全修改停下来的时候触发这个事件
          console.log("onFinishChange value==", value);
        }
      },

      {
        props: parmas.rotation,
        key: "angleX",
        min: 0,
        max: 360,
        step: 0.001,
        name: "旋转改变x轴",
        onChange: (value) => {},
        onFinishChange: (value) => {
          // 完全修改停下来的时候触发这个事件
          console.log("onFinishChange value==", value);
        }
      },

      {
        props: parmas.rotation,
        key: "angleY",
        min: 0,
        max: 360,
        step: 0.01,
        name: "旋转改变y轴",
        onChange: (value) => {},
        onFinishChange: (value) => {
          // 完全修改停下来的时候触发这个事件
          console.log("onFinishChange value==", value);
        }
      },

      {
        props: parmas.rotation,
        key: "angleZ",
        min: 0,
        max: 360,
        step: 0.01,
        name: "旋转改变z轴",
        onChange: (value) => {},
        onFinishChange: (value) => {
          // 完全修改停下来的时候触发这个事件
          console.log("onFinishChange value==", value);
        }
      }
    ];

    for (let item of options) {
      const {
        props,
        key,
        min,
        max,
        step,
        name,
        onChange = () => {},
        onFinishChange = () => {}
      } = item;
      //控制器一个x选项
      folder
        .add(
          props, // 需要修改的对象
          key // 需要修改的属性
        )
        .min(min)
        .max(max)
        // 每次改变为0.1
        .step(step)
        .name(name)
        .onChange((value) => {
          // 回调函数
          onChange(value);
          const {translatrMatrix, scaleMatrix, rotationMatrix} =
            setMatrix(parmas);
          draw(gl, translatrMatrix, scaleMatrix, rotationMatrix);
        })
        .onFinishChange((value) => {
          // 完全修改停下来的时候触发这个事件
          onFinishChange(value);
        });
    }
  };

  init();
};
