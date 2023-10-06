import initShader from "@/pages/3d/utils/initShader.js";

import "./index.less";

window.onload = function () {
  const canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  canvas.width = 1000;
  canvas.height = 1000;

  if (!canvas.getContext) return;
  let gl = canvas.getContext("webgl");

  // vertex shader
  let vertexShader = `
     attribute vec2 a_Position;
    // 列主序列
    uniform mat2 u_Matrix;
     void main(){
        gl_Position = vec4(vec2(a_Position)*u_Matrix,0.0, 1.0);
     }
    `;

  // fragment shader
  let fragmentShader = `
     precision mediump float;
     void main(){
         // 颜色
          gl_FragColor=vec4(1.0, 0.0, 0.0, 1.0);
     }
   `;
  initShader(gl, vertexShader, fragmentShader);

  // 清空画布
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  //三角形顶点位置
  let vertices = new Float32Array([
    -0.1, 0.0, 0.0, -0.1
    // //  0.0, 0.5

    // 0.0, 0.0,
    // 0.1, 0.0
    //  0.0, 0.5
  ]);

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

  // 连接a_Position变量与分配给他的缓冲区对象
  /*
     
     告诉显卡从当前绑定的缓冲区（bindBuffer() 指定的缓冲区）中读取顶点数据。
     方法绑定当前缓冲区范围到gl.ARRAY_BUFFER,
     成为当前顶点缓冲区对象的通用顶点属性并指定它的布局 (缓冲区对象中的偏移量)。

     */
  gl.vertexAttribPointer(
    a_Position, // 变量 指定要修改的顶点属性的索引。
    2, // size 三个数据为一组 告诉三个点位一组颜色  1, 2, 3, or 4. 指定每个顶点属性的组成数量，必须是 1，2，3 或 4。
    gl.FLOAT, //type gl.FLOAT: 32-bit IEEE floating point number 32 位 IEEE 标准的浮点数
    false, // normalized 当转换为浮点数时是否应该将整数数值归一化到特定的范围。
    0, // stride 以字节为单位指定连续顶点属性开始之间的偏移量 (即数组中一行长度)。不能大于 255。如果 stride 为 0，则假定该属性是紧密打包的，即不交错属性，每个属性在一个单独的块中，下一个顶点的属性紧跟当前顶点之后。
    0 //offset 指定顶点属性数组中第一部分的字节偏移量。必须是类型的字节长度的倍数。
  ); //  告诉gl如何解析数据

  // 确认 // 启用数据
  // 连接a_Position变量与分配给他的缓冲区对象
  gl.enableVertexAttribArray(a_Position);

  //获取矩阵uniform变了缓存的地址
  const u_Matrix = gl.getUniformLocation(gl.program, "u_Matrix");

  /*放大*/
  // let sx = 1;
  // let sy = 1;
  // const matrix = new Function(
  //   "sx", // 传参
  //   "sy",
  //   `
  //   return   [
  //         sx, 0.0,
  //         0.0, sy
  //    ];
  //     `
  // )(sx, sy); // 传参

  /*旋转*/
  // let θ = 20;
  // let rad = (θ * Math.PI) / 180;
  // const cosθ = Math.cos(rad);
  // const sinθ = Math.sin(rad);
  // const matrix = new Function(
  //   "cosθ", // 传参
  //   "sinθ",
  //   `
  //    return   [
  //     cosθ, -sinθ,
  //     sinθ, cosθ
  //   ];
  // `
  // )(cosθ, sinθ); // 传参

  /*线性空间变换*/
  let sx = 0;
  let sy = 1;
  // const matrix = new Function(
  //   "sx", // 传参
  //   "sy",
  //   `
  //   return   [
  //           -1.0, -2.0,
  //           1.0, -1.0
  //    ];
  //     `
  // )(sx, sy); // 传参

  const matrix = new Function(
    "sx", // 传参
    "sy",
    `
    return   [
            1.0, 0.0,
            0.0, 1.0
     ];
      `
  )(sx, sy); // 传参

  // 绑定 矩阵
  gl.uniformMatrix2fv(u_Matrix, false, matrix);

  // 画图
  gl.drawArrays(gl.LINE_LOOP, 0, 2);
};
