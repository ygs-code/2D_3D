import initShaders from "../../initShader.js";
// import {createHtmlMatrix} from "../../matrix.js";
// import m4 from "../../m4.js";
// import VSHADER_SOURCE from "./index.vert";
// import FSHADER_SOURCE from "./index.frag";
// import "./index.less";

window.onload = function () {
  const VSHADER_SOURCE = `
 attribute vec4 a_position;
 uniform mat4 u_matrix;
  void main(){
      // 线性变换矩阵在前面
      gl_Position=u_matrix*a_position;
      gl_PointSize=10.;
  }
 `;
  const FSHADER_SOURCE = `
 void main(){
  precision mediump float;
  // 颜色
  gl_FragColor=vec4(1.,0.,0.,1.);
}
 `;

  /*
  矩阵 A = [
    1,2,0,0,
    3,4,0,0,
    0,0,0,0,
    0,0,0,0,
   ],

  矩阵 B = [
    5,6,0,0,
    7,8,0,0,
    0,0,0,0,
    0,0,0,0,
   ],

   矩阵A* 矩阵B 这里库是
   m4.multiply(B,A)
 */

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
  const program = initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
  if (!program) {
    console.log("failed to initialize shaders");
    return;
  }

  // let u_w = gl.getUniformLocation(gl.program, "u_w");
  // let u_h = gl.getUniformLocation(gl.program, "u_h");
  // gl.uniform1f(u_w, canvas_w);
  // gl.uniform1f(u_h, canvas_h);

  //三角形顶点位置

    // 4个点的坐标信息
    let vertices = new Float32Array([
      //x       y     z    w
       -0.5,   0.5 , 0.5, 1.3,
       -0.5, - 0.5,  0.5, 1.3,
        0.5,  -0.5,  0.5, 1.3,
        0.5,   0.5 , 0.5, 1.3,
   ]);



   let  mat4 = [
    1,0,0,0,
    0,1,0,0,
    0,0,1,0,
    0,0,0,1,
   ]
   // 这里相当于是 vertices *mat4 
   // 相当于是在cpu中做好这种变换在传递给gpu
   vertices = m4.multiply(mat4,vertices)

  // 4个点的坐标信息
  // let vertices = new Float32Array([
  //   //x       y     z     w
  //   -0.11,  0.89 , 0.5, 1.3,
  //   -0.11, -0.11,  0.5, 1.3,
  //   0.89,  -0.11,  0.5, 1.3,
  //   0.89,  0.89 , 0.5, 1.3,
  // ]);



  // 让顶点坐标乘以一个矩阵 
  // vertices = m4.multiply(vertices,[
  //   // x y w
  //   1,0,0,1.3,
  //   0,1,0,1.3,
  //   0,0,1,1.3,
  //   0,0,0,1.3,
  // ])



  matrix.createHtmlMatrix({
    matrix: [...vertices],
    title: "裁剪空间顶点坐标矩阵",
    row: 4,
    list: 4,
    elId: "clip"
  });



  /*
      矩阵平移 
      [
    //  x   y    z   w
        1,  0,   0,  0
        0,  1,   0,  0
        0,  0,   1,  0
        tx, ty ,tz,  1
      ]
    */

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
  // 将缓冲区对象分配给a_position变量
  let a_position = gl.getContextAttributes(gl.isProgram, "a_position"); // 获得变量位置

  /*
     
     告诉显卡从当前绑定的缓冲区（bindBuffer() 指定的缓冲区）中读取顶点数据。
     方法绑定当前缓冲区范围到gl.ARRAY_BUFFER,
     成为当前顶点缓冲区对象的通用顶点属性并指定它的布局 (缓冲区对象中的偏移量)。

     */
  gl.vertexAttribPointer(
    a_position, // 变量 指定要修改的顶点属性的索引。
    4, // size 三个数据为一组 告诉三个点位一组颜色  1, 2, 3, or 4. 指定每个顶点属性的组成数量，必须是 1，2，3 或 4。
    gl.FLOAT, //type gl.FLOAT: 32-bit IEEE floating point number 32 位 IEEE 标准的浮点数
    false, // normalized 当转换为浮点数时是否应该将整数数值归一化到特定的范围。
    FSIZE * 4, // stride 以字节为单位指定连续顶点属性开始之间的偏移量 (即数组中一行长度)。不能大于 255。如果 stride 为 0，则假定该属性是紧密打包的，即不交错属性，每个属性在一个单独的块中，下一个顶点的属性紧跟当前顶点之后。
    0 //offset 指定顶点属性数组中第一部分的字节偏移量。必须是类型的字节长度的倍数。
  ); //  告诉gl如何解析数据

  // 确认 // 启用数据
  // 连接a_position变量与分配给他的缓冲区对象
  gl.enableVertexAttribArray(a_position);

  const matrix4=[
    // x y w
    1,0,0,0,
    0,1,0,0,
    0,0,1,0,
    0,0,0,1,
  ]
  // 获取 uniform
  const u_matrix = gl.getUniformLocation(program,'u_matrix');
 
  matrix.createHtmlMatrix({
    matrix: matrix4,
    title: "线性变换矩阵",
    row: 4,
    list: 4,
    elId: "matrix4"
  });
  

  // vertices * matrix4 但是在gpu中却是 matrix4 * vertices
  matrix.createHtmlMatrix({
    matrix: m4.multiply(matrix4,vertices),
    title: "线性变换矩阵*顶点坐标",
    row: 4,
    list: 4,
    elId: "u_matrix_vertices"
  });






  // 绑定 矩阵
  gl.uniformMatrix4fv(u_matrix, false, matrix4);
 


  // 清空画布
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  // 画图
  gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
  gl.drawArrays(gl.POINTS, 0, 4);
};
