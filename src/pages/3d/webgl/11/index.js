import initShader from "@/pages/3d/utils/initShader.js";

import "./index.less";

window.onload = function () {
  const canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  canvas.width = 1000;
  canvas.height = 1000;

  if (!canvas.getContext) return;
  let gl = canvas.getContext("webgl");
  console.log("gl==", gl);

  /*

    // 这个和下面这个声明一样
    // vertexShader
    // 顶点坐标
    const vertexShader = `
     attribute vec4   a_Position;
     attribute vec4   a_Color;
     varying vec4  v_Color;
     void main(){
         gl_Position = a_Position;
         gl_PointSize = 10.0;
         v_Color = a_Color;
     }
    `;
    // 片段代码
    const fragmentShader = `
     precision mediump float;
     varying vec4  v_Color;
     void main(){
      gl_FragColor = v_Color;
     }
    `;

*/

  // vertexShader
  // 顶点坐标
  const vertexShader = `
     attribute vec2 a_Position;
     attribute vec3 a_Color;
     varying vec3 v_Color;
     void main(){
         gl_Position = vec4(a_Position,0.0,1.0);
         gl_PointSize = 10.0;
         v_Color = a_Color;
     }
    `;
  // 片段代码
  const fragmentShader = `
     precision mediump float;
     varying vec3 v_Color;
     void main(){
      gl_FragColor = vec4(v_Color, 1.0);
     }
    `;
  // 初始化shader
 const program= initShader(gl, vertexShader, fragmentShader);

  // 清除画布
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  /* eslint-disable   */

  // 写三角形顶点位置
  const vertices = new Float32Array([
    //x    y    r    g    b
    -0.5,
    0.0,
    1.0,
    0.0,
    0.0, //
    0.5,
    0.0,
    0.0,
    1.0,
    0.0, //
    0.0,
    0.8,
    0.0,
    0.0,
    1.0, //
  ]);
  /* eslint-disable   */

  const FSIZE = vertices.BYTES_PER_ELEMENT;

  //1. 创建 buffer
  const vertexBuffer = gl.createBuffer();

  //2. 绑定bindbuffer
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  //3
  // 向缓冲区写入数据
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  // 4: 把带有数据的buffer给arrribute
  // 将缓冲区对象分配给a_Position变量
  const a_Position = gl.getAttribLocation(program, "a_Position");

  // WebGL系统会根据stride和offset参数从缓冲区中正确地抽取出数据，依次赋值给着色器中的各个attribute变量并进行绘制
  // stride（第5个参数）为FSIZE*5意味着verticesColors数据中5个数为一组是属于一个顶点的所有数据(包括顶点坐标和颜色大小等)，
  // offset（第6个参数）为0意味着从5个数一组的单元中的第0个数开始取值（offset代表当前考虑的数据项距离首个元素的距离，即偏移参数）
  // size（第2个参数）为2意味着从5个数一组的单元中取出两个数，
  // type(第3个参数)为gl.FLOAT意味着数据类型为浮点数
  // normalize(第4个参数)为false意味着不对这些数据进行归一化操作
  /*
     告诉显卡从当前绑定的缓冲区（bindBuffer() 指定的缓冲区）中读取顶点数据。
     方法绑定当前缓冲区范围到gl.ARRAY_BUFFER,
     成为当前顶点缓冲区对象的通用顶点属性并指定它的布局 (缓冲区对象中的偏移量)。
     将缓冲区对象分配给a_Position
     */
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 5, 0);
  // 连接a_Position变量与分配给他的缓冲区对象
  gl.enableVertexAttribArray(a_Position);
  // 将缓冲区对象分配给a_Color变量
  const a_Color = gl.getAttribLocation(program, "a_Color");
  // 将缓冲区对象分配给a_Color
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2);
  gl.enableVertexAttribArray(a_Color);

  // 画图
  // gl.drawArrays(
  //       gl.TRIANGLES, // 画什么图形
  //       0,  // 从哪个点开始
  //       3
  //       );
  // 画点
  gl.drawArrays(
    gl.LINE_LOOP, // 画什么图形
    0, // 从哪个点开始
    3
  );
};
