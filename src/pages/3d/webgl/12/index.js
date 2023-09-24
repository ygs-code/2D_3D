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
  initShader(gl, vertexShader, fragmentShader);

  // 清除画布
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // 写三角形顶点位置
  const vertices = new Float32Array(
    new Function(`
      return [
        //x    y     r     g     b
        -0,   0.5,   1.0,  0.0,  0.0, 
        0.5,  0.0,   0.0,  1.0,  0.0,
        -0.5, 0.0,   0.0,  0.0,  1.0,
        // 0.5,   0.5,   0.0, 0.0, 1.0,
      ]
    `)()
  );
  console.log("vertices===", vertices);
  debugger;
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
  const a_Position = gl.getAttribLocation(gl.program, "a_Position");

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


 
index：第几个属性，从0开始取，0，1，2，顺序自己定义，例如顶点位置，纹理，法线

这里只有顶点位置，也只能讨论顶点位置，所以为0

size：一个顶点所有数据的个数，这里每个顶点又两个浮点数属性值，所以是2

type：顶点描述数据的类型，这里position数组中的数据全部为float，所以是GL_FLOAT

normalized：是否需要显卡帮忙把数据归一化到-1到+1区间，这里不需要，所以设置GL_FALSE

stride：一个顶点占有的总的字节数，这里为两个float，所以是sizeof(float)*2

pointer：当前指针指向的vertex内部的偏离字节数，可以唯一的标识顶点某个属性的偏移量
这里是指向第一个属性，顶点坐标，偏移量为0
 
*/

  console.log("a_Position==", a_Position);
  gl.vertexAttribPointer(
    a_Position, // index：第几个属性，从0开始取，0，1，2，顺序自己定义，例如顶点位置，纹理，法线
    2, // size：一个顶点所有数据的个数，这里每个顶点又两个浮点数属性值，所以是2
    gl.FLOAT, // 顶点描述数据的类型，这里position数组中的数据全部为float，所以是GL_FLOAT
    false, // 是否需要显卡帮忙把数据归一化到-1到+1区间，这里不需要，所以设置GL_FALSE
    FSIZE * 5, // 一个顶点占有的总的字节数，这里为两个float，所以是sizeof(float)*5
    0 // 这里是指向第一个属性，顶点坐标，偏移量为0    [-0, 0.5, 1.0,0.0,0.0,] 从索引下表是从0开始  2就是颜色下标了
  );
  // 连接a_Position变量与分配给他的缓冲区对象
  gl.enableVertexAttribArray(a_Position);

  const a_Color = gl.getAttribLocation(gl.program, "a_Color");
  console.log("a_Color==", a_Color);

  gl.vertexAttribPointer(
    a_Color, // 颜色变量
    3, // size：一个顶点所有数据的个数，这里每个顶点又两个浮点数属性值，所以是 3
    gl.FLOAT,
    false,
    FSIZE * 5, // 一个顶点占有的总的字节数，这里为两个float，所以是sizeof(float)*5
    FSIZE * 2 // 这里是指向第一个属性，顶点坐标，偏移量为2 从第二个开始 比如
  );
  gl.enableVertexAttribArray(a_Color);

  let n = 3;

  // 画图
  gl.drawArrays(
    gl.TRIANGLES, // 画什么图形
    0, // 从哪个点开始
    3
  );
  // 画点
  gl.drawArrays(
    gl.POINTS, // 画什么图形
    0, // 从哪个点开始
    n
  );
};
