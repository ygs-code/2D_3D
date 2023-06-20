import initShader from "@/pages/3d/utils/initShader.js";

import "./index.less";

window.onload = function () {
  const canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  canvas.width = 1000;
  canvas.height = 1000;

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

  // 第一步清空这个画布
  gl.clearColor(0.5, 0.5, 0.5, 1.0); // rgba()
  // 真正清空颜色 并填充为黑色

  //gl.COLOR_BUFFER_BIT  webgl 常量api
  gl.clear(
    // 指定颜色缓存
    gl.COLOR_BUFFER_BIT
  );

  let PointSize = 10.0;
  let Position = [-5.0, 5.0, 0.0, 10.0];
  let linType = "top";

  let i = 0;

  // // 画一个斜线
  // while (i <= 100) {
  //     // 不断的控制偏移量
  //     Position[0] += 0.1;
  //     Position[1] += 0.1;
  //     // 将顶点位置输入给 attribute变量
  //     gl.vertexAttrib1f(a_PointSize, PointSize);
  //     // // 数组传递
  //     gl.vertexAttrib4fv(a_Position, new Float32Array(Position));
  //     // 画一个点
  //     gl.drawArrays(
  //         gl.POINTS, // 画点参数
  //         0,
  //         1
  //     );
  //     console.log('Position==', Position);
  //     i++;
  // }

  // // 画一个正方形
  // while (i <= 1000) {
  //     if (linType === 'top' && Position[0] < 5) {
  //         Position[0] = (Position[0] * 10 + 0.1 * 10) / 10;
  //     } else if (linType === 'top' && Position[0] === 5) {
  //         linType = 'right';
  //     } else if (linType === 'right' && Position[1] > -5) {
  //         Position[1] = (Position[1] * 10 - 0.1 * 10) / 10;
  //     } else if (linType === 'right' && Position[1] === -5) {
  //         linType = 'bottom';
  //     } else if (linType === 'bottom' && Position[0] > -5) {
  //         Position[0] = (Position[0] * 10 - 0.1 * 10) / 10;
  //     } else if (linType === 'bottom' && Position[0] === -5) {
  //         linType = 'left';
  //     } else if (linType === 'left' && Position[1] < 5) {
  //         Position[1] = (Position[1] * 10 + 0.1 * 10) / 10;
  //     }
  //     // console.log('Position==', Position);
  //     // console.log('linType==', linType);
  //     // 将顶点位置输入给 attribute变量
  //     gl.vertexAttrib1f(a_PointSize, PointSize);
  //     // // 数组传递
  //     gl.vertexAttrib4fv(a_Position, new Float32Array(Position));
  //     // 画一个点
  //     gl.drawArrays(
  //         gl.POINTS, // 画点参数
  //         0,
  //         1
  //     );

  //     i++;
  // }

  //  画一个圆
  let angle = 0;
  let r = 0.1;
  Position = [-5.0, 1.0, 0.0, 10.0];
  let x = -5.0;
  while (i <= 10000) {
    angle += 1;

    // 画多个圆
    if (angle >= 360) {
      angle = 0;
      r += 0.02;
      x -= 1.0;
      Position = [x, 1.0, 0.0, 10.0];
    }

    Position[0] = Position[0] + Math.sin((angle * 2 * Math.PI) / 360) * r;
    Position[1] = Position[1] + Math.cos((angle * 2 * Math.PI) / 360) * r;

    console.log("Position==", Position);
    // 将顶点位置输入给 attribute变量
    gl.vertexAttrib1f(a_PointSize, PointSize);
    // // 数组传递
    gl.vertexAttrib4fv(a_Position, new Float32Array(Position));
    // 画一个点
    gl.drawArrays(
      gl.POINTS, // 画点参数
      0,
      1
    );

    i++;
  }
};
