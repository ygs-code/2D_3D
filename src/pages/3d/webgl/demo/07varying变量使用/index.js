import initShader from "@/pages/3d/utils/initShader.js";
import vertexShader from "./index.vert";
import fragmentShader from "./index.frag";
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
  // let vertexShader = `
  //     attribute vec4  a_Position;  // 声明a_Position变量
  //     attribute float a_PointSize; // 声明a_PointSize变量
  //     varying   vec4  v_Color;  // 声明中间变量 v_Color
  //     void main(){
  //       // vec4 表示是由4位float小数组成
  //       gl_Position = a_Position;
  //       v_Color = a_Position;  // 将a_Position赋值给v_Color
  //       // vec4(
  //       //   0.0,  // x 轴
  //       //   0.0,  // y轴
  //       //   0.0,   // z 轴
  //       //   1.0  // 偏移量缩放参数 但这个值最小值不能小于0
  //       //   );  // 表示顶点颜色的位置
  //       gl_PointSize = a_PointSize;   //w 表示顶点颜色的尺寸，设置越大，这个像素就会越大
  //     }
  //   `;

  // 片元着色器程序
  // let fragmentShader = `
  //     precision mediump float;
  //     uniform   vec4 u_FragColor;
  //     varying   vec4  v_Color;
  //     void main(){
  //         //gl_FragColor = vec4(1.0, 1.0, 0.0 , 1.0);    // 颜色rgba
  //         // gl_FragColor = u_FragColor;    // 颜色rgba
  //         gl_FragColor = v_Color;    // 将 v_Color 值赋值给颜色gl_FragColor
  //     }
  //   `;

  // 初始化initShader
 const program = initShader(gl, vertexShader, fragmentShader);

  // 设置动态变量
  //获取arrtibute变量
  const a_Position = gl.getAttribLocation(program, "a_Position");

  if (a_Position < 0) {
    console.log("Failed to get the storage loacation of a_Position");
    return false;
  }

  const a_PointSize = gl.getAttribLocation(program, "a_PointSize");
  if (a_PointSize < 0) {
    console.log("Failed to get the storage loacation of a_PointSize");
    return false;
  }

  const u_FragColor = gl.getUniformLocation(program, "u_FragColor");
  if (a_PointSize < 0) {
    console.log("Failed to get the storage loacation of u_FragColor");
    return false;
  }

  let PointSize = 10.0;
  let Position = [Math.random(), Math.random(), Math.random(), 1.0];
  // 这里的rgb 最大值是1 而不是 255
  // let rgba = [Math.random(), Math.random(), Math.random(), Math.random()];
  // 将顶点位置输入给 attribute变量
  gl.vertexAttrib1f(a_PointSize, PointSize);
  // // 数组传递
  gl.vertexAttrib3fv(a_Position, new Float32Array(Position));
  // // 设置颜色
  // gl.uniform4fv(u_FragColor, new Float32Array(rgba));

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
