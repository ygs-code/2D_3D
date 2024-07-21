import initShaders from "@/pages/3d/utils/initShader.js";
import VSHADER_SOURCE from "./index.vert";
import FSHADER_SOURCE from "./index.frag";
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

  let time = 0.0;
  // vertexShader, fragmentShader

  console.log("VSHADER_SOURCE=====", VSHADER_SOURCE);
  console.log("FSHADER_SOURCE=====", FSHADER_SOURCE);

  const program = initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);

  console.log("program==", program);

  if (!program) {
    console.log("failed to initialize shaders");
    return;
  }

  let uTime = gl.getUniformLocation(program, "u_time");



  // gl.uniform1f(uTime, time);

  // let u_h = gl.getUniformLocation(gl.program, "u_h");
  // gl.uniform1f(u_w, canvas_w);
  // gl.uniform1f(u_h, canvas_h);

  //三角形顶点位置

  // 4个点的坐标信息
  let vertices = new Float32Array([
        -1, 1,
        -1, -1,
         1, -1,

          1, -1,
          1, 1,
          -1, 1,
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

  // 4: 把带有数据的buffer给arrribute
  // 将缓冲区对象分配给a_Position变量
  let a_Position = gl.getContextAttributes(gl.isProgram, "a_Position"); // 获得变量位置

  /*
     
     告诉显卡从当前绑定的缓 冲区（bindBuffer() 指定的缓冲区）中读取顶点数据。
     方法绑定当前缓冲区范围到gl.ARRAY_BUFFER,
     成为当前顶点缓冲区对象的通用顶点属性并指定它的布局 (缓冲区对象中的偏移量)。

     */
  gl.vertexAttribPointer(
    a_Position, // 变量 指定要修改的顶点属性的索引。
    2, // size 2个数据为一组 告诉三个点位一组颜色  1, 2, 3, or 4. 指定每个顶点属性的组成数量，必须是 1，2，3 或 4。
    gl.FLOAT, //type gl.FLOAT: 32-bit IEEE floating point number 32 位 IEEE 标准的浮点数
    false, // normalized 当转换为浮点数时是否应该将整数数值归一化到特定的范围。
    FSIZE * 2, // stride 以字节为单位指定连续顶点属性开始之间的偏移量 (即数组中一行长度)。不能大于 255。如果 stride 为 0，则假定该属性是紧密打包的，即不交错属性，每个属性在一个单独的块中，下一个顶点的属性紧跟当前顶点之后。
    0 //offset 指定顶点属性数组中第一部分的字节偏移量。必须是类型的字节长度的倍数。
  ); //  告诉gl如何解析数据

  // 5.确认 // 启用数据
  // 连接a_Position变量与分配给他的缓冲区对象
  gl.enableVertexAttribArray(a_Position);

  const render = (time) => {
    gl.uniform1f(uTime, time / 360);
    // 清空画布
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    // 画图
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 6);
    // gl.drawArrays(gl.POINTS, 0, 4);


    requestAnimationFrame(() => {
      time+=10;
      render(time);
    });
  };

  render(time);
};
