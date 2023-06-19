import initShader from "@/pages/3d/utils/initShader.js";

import "./index.less";

window.onload = function () {
  const canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  canvas.width = 500;
  canvas.height = 500;

  if (!canvas.getContext) return;
  let gl = canvas.getContext("webgl");

  // vertexShader, fragmentShader
  // 类似 c 语言的东西
  // 顶点着色器程序
  let vertexShader = `
      void main(){
        // vec4 表示是由4位float小数组成
        gl_Position = vec4(
          0.0,  // x 轴
          0.0,  // y轴
          0.0,   // z 轴
          1.0  // 偏移量缩放参数 但这个值最小值不能小于0
          );  // 表示顶点颜色的位置
        gl_PointSize = 10.0;   //w 表示顶点颜色的尺寸，设置越大，这个像素就会越大
      }
    `; // glsl

  // 片元着色器程序
  let fragmentShader = `
      void main(){
          gl_FragColor = vec4(1.0, 1.0, 0.0 , 1.0);    // 颜色rgba
      }
    `;

  // 初始化initShader
  initShader(gl, vertexShader, fragmentShader);

  // // 真正创建shaser()
  // // 创建 vertexShader
  // /*

  // 用于创建一个 WebGLShader 着色器对象，
  // 该对象可以使用 WebGLRenderingContext.shaderSource()
  // 和 WebGLRenderingContext.compileShader() 方法配置着色器代码。
  // */
  // // 创建着色器对象
  // let vertexShader = gl.createShader(gl.VERTEX_SHADER);

  // // 创建fragmentShader 创建着色器对象
  // let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

  // // 向着色器对象中填充着色器程序的源代码
  // gl.shaderSource(vertexShader, vertexSource);
  // //向着色器对象中填充着色器程序的源代码
  // gl.shaderSource(fragmentShader, fragmentSource);
  // //

  // //编译着色器
  // gl.compileShader(vertexShader);
  // //编译着色器
  // gl.compileShader(fragmentShader);

  // // program
  // // 讲两个Shader连接合在一起
  // // 创建程序对象
  // let program = gl.createProgram();
  // // 为程序对象分配着色器
  // gl.attachShader(program, vertexShader);
  // gl.attachShader(program, fragmentShader);

  // // 链接程序对象
  // gl.linkProgram(program);
  // // 使用程序对象
  // gl.useProgram(program);

  // 第一步清空这个画布
  gl.clearColor(0.5, 0.5, 0.5, 1.0); // rgba()
  // 真正清空颜色 并填充为黑色

  //gl.COLOR_BUFFER_BIT  webgl 常量api
  gl.clear(
    // 指定颜色缓存
    gl.COLOR_BUFFER_BIT
  );

  // 画一个点
  gl.drawArrays(
    gl.POINTS, // 画点参数
    0,
    1
  );
};
