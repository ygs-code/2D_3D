import initShader from "@/pages/3d/utils/initShader.js";
// import vertexShader from './01.vert';
// import fragmentShader from './01.frag';
import vertexShader from "./vert.glsl";
import fragmentShader from "./frag.glsl";
import "./index.less";

console.log("vertexShader===", vertexShader);

// asdf;

window.onload = function () {
  const canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  canvas.width = 1000;
  canvas.height = 1000;

  if (!canvas.getContext) return;
  let gl = canvas.getContext("webgl");
  // console.log('gl==', gl);

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
  // const vertexShader = `
  //  attribute vec2 a_Position;
  //  uniform vec4 u_translate;
  //  void main(){
  //     //  gl_Position = vec4(a_Position,0.0,1.0) + vec4(0.5, 0.5, 0.0, 0.0);
  //     // 用对象 引用
  //     // gl_Position = vec4(a_Position.x,a_Position.y,  0.0,1.0) + vec4(0.5, 0.5, 0.0, 0.0);
  //     gl_Position = vec4(a_Position,0.0,1.0) + u_translate;
  //     gl_PointSize = 10.0;
  //  }
  // `;
  // 片段代码
  // const fragmentShader = `
  //  precision mediump float;
  //  void main(){
  //   gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  //  }
  // `;
  // 初始化shader
 const program = initShader(gl, vertexShader, fragmentShader);

  let x = 0.0;
  let y = 0.0;
  let xDirection = 1;
  let yDirection = 1;
  const render = () => {
    x += 0.009 * xDirection;
    y += 0.004 * yDirection;
    if (y >= 0.5 || y <= -1) {
      yDirection *= -1;
    }
    if (x >= 0.5 || x <= -0.5) {
      xDirection *= -1;
    }
    // 清除画布
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // 写三角形顶点位置
    const vertices = new Float32Array([
      //x     y      r     g     b
      -0.0, 0.5, -0.5, 0.0, 0.5, 0.0,
      //   -0.5, 0.0,
      // 0.5,   0.5,   0.0, 0.0, 1.0,
    ]);
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

    // console.log('a_Position==', a_Position);
    gl.vertexAttribPointer(
      a_Position, // index：第几个属性，从0开始取，0，1，2，顺序自己定义，例如顶点位置，纹理，法线
      2, // size：一个顶点所有数据的个数，这里每个顶点又两个浮点数属性值，所以是2
      gl.FLOAT, // 顶点描述数据的类型，这里position数组中的数据全部为float，所以是GL_FLOAT
      false, // 是否需要显卡帮忙把数据归一化到-1到+1区间，这里不需要，所以设置GL_FALSE
      FSIZE * 2, // 一个顶点占有的总的字节数，这里为两个float，所以是sizeof(float)*5
      0 // 这里是指向第一个属性，顶点坐标，偏移量为0    [-0, 0.5, 1.0,0.0,0.0,] 从索引下表是从0开始  2就是颜色下标了
    );
    // 连接a_Position变量与分配给他的缓冲区对象
    gl.enableVertexAttribArray(a_Position);

    let u_translate = gl.getUniformLocation(program, "u_translate");
    gl.uniform4f(u_translate, x, y, 0.0, 0.0);

    let n = 3;

    // 画图
    gl.drawArrays(
      gl.TRIANGLES, // 画什么图形
      0, // 从哪个点开始
      n
    );
    // 画点
    gl.drawArrays(
      gl.POINTS, // 画什么图形
      0, // 从哪个点开始
      n
    );

    requestAnimationFrame(render);
  };

  render();
};
