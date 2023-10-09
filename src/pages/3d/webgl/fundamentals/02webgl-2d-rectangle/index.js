import {getWebGLContext, initShaders} from "@/pages/3d/utils/lib/cuon-utils";
import {resizeCanvasToDisplaySize} from "@/pages/3d/utils/webgl-utils.js";
import VSHADER_SOURCE from "./index.vert";
import FSHADER_SOURCE from "./index.frag";
import * as dat from "dat.gui";
import "./index.less";

window.onload = function () {
  let canvas_w = 400,
    canvas_h = 400;
  const canvas = document.createElement("canvas");
  canvas.width = 500;
  canvas.height = 500;
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

  const gui = new dat.GUI();

  // 设置一个文件夹
  const folder = gui.addFolder("设置立方体");
  // 改变颜色
  let parmas = {
    color: "rgb(0,0,0,0)",
    fn: () => {}
  };
  // 改变颜色
  folder
    .addColor(parmas, "color")
    .onChange((color) => {
      console.log("color==", color);
    })
    .name("颜色");

  // let u_w = gl.getUniformLocation(gl.program, "u_w");
  // let u_h = gl.getUniformLocation(gl.program, "u_h");
  // gl.uniform1f(u_w, canvas_w);
  // gl.uniform1f(u_h, canvas_h);

  //三角形顶点位置

  // 4个点的坐标信息
  let vertices = new Float32Array([
    10, 20, 80, 20, 10, 30, 10, 30, 80, 20, 80, 30

    // 10, 20,
    // 80, 20,
    // 10, 30,
    // 10, 30,
    // 80, 20,
    // 80, 30,
  ]);

  let FSIZE = vertices.BYTES_PER_ELEMENT; // Float32 Size = 4

  /*
      buffer: 分5个步骤
    */
  //1 创建 buffer
  let buffer = gl.createBuffer(); // 创建缓冲

  // 2
  // 将缓冲区对象绑定指定目标
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

  //3
  // 向缓冲区写入数据
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  // 设置canvas 宽高
  resizeCanvasToDisplaySize(gl.canvas);

  // Tell WebGL how to convert from clip space to pixels
  //告诉WebGL如何从剪辑空间转换为像素
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Tell it to use our program (pair of shaders)
  //告诉它使用我们的程序(shaders pair)
  gl.useProgram(gl.program);

  // 4: 把带有数据的buffer给arrribute
  // 将缓冲区对象分配给a_position变量
  let a_position = gl.getContextAttributes(gl.isProgram, "a_position"); // 获得变量位置

  // 连接a_position变量与分配给他的缓冲区对象
  /*
     
     告诉显卡从当前绑定的缓冲区（bindBuffer() 指定的缓冲区）中读取顶点数据。
     方法绑定当前缓冲区范围到gl.ARRAY_BUFFER,
     成为当前顶点缓冲区对象的通用顶点属性并指定它的布局 (缓冲区对象中的偏移量)。

     */
  gl.vertexAttribPointer(
    a_position, // 变量 指定要修改的顶点属性的索引。
    2, // size 三个数据为一组 告诉三个点位一组颜色  1, 2, 3, or 4. 指定每个顶点属性的组成数量，必须是 1，2，3 或 4。
    gl.FLOAT, //type gl.FLOAT: 32-bit IEEE floating point number 32 位 IEEE 标准的浮点数
    false, // normalized 当转换为浮点数时是否应该将整数数值归一化到特定的范围。
    FSIZE * 2, // stride 以字节为单位指定连续顶点属性开始之间的偏移量 (即数组中一行长度)。不能大于 255。如果 stride 为 0，则假定该属性是紧密打包的，即不交错属性，每个属性在一个单独的块中，下一个顶点的属性紧跟当前顶点之后。
    0 //offset 指定顶点属性数组中第一部分的字节偏移量。必须是类型的字节长度的倍数。
  ); //  告诉gl如何解析数据

  // 确认 // 启用数据
  // 连接a_position变量与分配给他的缓冲区对象
  gl.enableVertexAttribArray(a_position);

  // look up uniform locations
  const resolutionUniformLocation = gl.getUniformLocation(
    gl.program,
    "u_resolution"
  );

  console.log("gl.canvas.width=", gl.canvas.width);
  console.log("gl.canvas.height=", gl.canvas.height);

  // set the resolution
  gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

  // 清空画布
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  // // 画图
  // gl.drawArrays(gl.TRIANGLE_FAN, 0, 6);
  // gl.drawArrays(gl.POINTS, 0, 6);

  // var primitiveType = gl.TRIANGLES;
  var offset = 0;
  var count = 6;
  gl.drawArrays(gl.TRIANGLES, offset, count);
};
