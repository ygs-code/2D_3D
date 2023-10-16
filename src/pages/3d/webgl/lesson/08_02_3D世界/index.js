import {getWebGLContext, initShaders} from "@/pages/3d/utils/lib/cuon-utils";
import {Matrix4} from "@/pages/3d/utils/lib/cuon-matrix.js";
import VSHADER_SOURCE from "./index.vert";
import FSHADER_SOURCE from "./index.frag";

import "./index.less";

//初始化顶点坐标和顶点颜色
const initVertexBuffers = (gl) => {
  var verticesColors = new Float32Array([
    //最后面的三角形
    0.0, 0.5, -0.4, 0.4, 1.0, 0.4, -0.5, -0.5, -0.4, 0.4, 1.0, 0.4, 0.5, -0.5,
    -0.4, 1.0, 0.4, 0.4,

    //中间的三角形
    0.5, 0.4, -0.2, 1.0, 0.4, 0.4, -0.5, 0.4, -0.2, 1.0, 1.0, 0.4, 0.0, -0.6,
    -0.2, 1.0, 1.0, 0.4,

    //最前面的三角形
    0.0, 0.5, 0.0, 0.4, 0.4, 1.0, -0.5, -0.5, 0.0, 0.4, 0.4, 1.0, 0.5, -0.5,
    0.0, 1.0, 0.4, 0.4
  ]);

  //创建缓冲区对象
  var vertexColorBuffer = gl.createBuffer();
  if (!vertexColorBuffer) {
    console.log("创建缓冲区对象失败！");
    return -1;
  }

  //将顶点坐标和顶点颜色信息写入缓冲区对象
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

  //获取类型化数组中每个元素的大小
  var FSIZE = verticesColors.BYTES_PER_ELEMENT;

  //获取顶点着色器attribute变量a_Position的存储地址, 分配缓存并开启
  var a_Position = gl.getAttribLocation(gl.program, "a_Position");
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
  gl.enableVertexAttribArray(a_Position);

  //获取顶点着色器attribute变量a_Color(顶点颜色信息)的存储地址, 分配缓存并开启
  var a_Color = gl.getAttribLocation(gl.program, "a_Color");
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
  gl.enableVertexAttribArray(a_Color);

  // 解绑缓冲区对象
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return verticesColors.length / 6;
};

window.onload = function () {
  let canvas_w = 400,
    canvas_h = 400;
  const canvas = document.createElement("canvas");
  canvas.width = 400;
  canvas.height = 400;
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

  //初始化顶点坐标和顶点颜色
  var n = initVertexBuffers(gl);
  //获取顶点着色器uniform变量u_ViewMatrix的存储地址
  var u_ViewMatrix = gl.getUniformLocation(gl.program, "u_ViewMatrix");
  if (!u_ViewMatrix) {
    console.log("获取u_ViewMatrix的存储地址失败！");
    return;
  }

  //初始化视图矩阵
  var viewMatrix = new Matrix4();

  // 旋转矩阵模型矩阵
  var modelMatrix = new Matrix4();

  //  Matrix4.setLookAt(eyeX, eyeY, eyeZ, atX, atY, atZ, upX, upY, upZ)
  // 观察者的默认状态是：视点为系统原点(0,0,0)；视线为Z轴负方向，观察点为(0,0,-1)；上方向为Y轴负方向(0,1,0)
  //设置视点、视线和上方向

  viewMatrix.setLookAt(0.2, 0.25, 0.25, 0, 0, 0, 0, 1.0, 0);
  // 旋转矩阵
  modelMatrix.setRotate(-40, 0, 0, 1); // 旋转矩阵
  const modelViewMatrix = viewMatrix.multiply(modelMatrix);

  //将视图矩阵传给顶点着色器uniform变量u_ViewMatrix
  gl.uniformMatrix4fv(u_ViewMatrix, false, modelViewMatrix.elements);

  //绘制三角形
  gl.drawArrays(gl.TRIANGLES, 0, n);
};
