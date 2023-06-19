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
      attribute vec4  a_Position;  // 声明a_Position变量
      attribute float a_PointSize; // 声明a_PointSize变量
      void main(){
        // vec4 表示是由4位float小数组成
        gl_Position = a_Position;
        // vec4(
        //   0.0,  // x 轴
        //   0.0,  // y轴
        //   0.0,   // z 轴
        //   1.0  // 偏移量缩放参数 但这个值最小值不能小于0
        //   );  // 表示顶点颜色的位置
        gl_PointSize = a_PointSize;   //w 表示顶点颜色的尺寸，设置越大，这个像素就会越大
      }
    `;

  // 片元着色器程序
  let fragmentShader = `
      void main(){
          gl_FragColor = vec4(1.0, 1.0, 0.0 , 1.0);    // 颜色rgba
      }
    `;

  // 初始化initShader
  initShader(gl, vertexShader, fragmentShader);

  // 设置动态变量
  //获取arrtibute变量
  const a_Position = gl.getAttribLocation(gl.program, "a_Position");

  if (a_Position < 0) {
    console.log("Failed to get the storage loacation of a_Position");
    return false;
  }

  const a_PointSize = gl.getAttribLocation(gl.program, "a_PointSize");
  if (a_PointSize < 0) {
    console.log("Failed to get the storage loacation of a_PointSize");
    return false;
  }

  let PointSize = 10.0;
  let Position = [0.0, 0.0, 0.0, 1.0];
  // 将顶点位置输入给 attribute变量
  gl.vertexAttrib1f(a_PointSize, PointSize);
  // // 数组传递
  gl.vertexAttrib3fv(a_Position, new Float32Array(Position));

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
