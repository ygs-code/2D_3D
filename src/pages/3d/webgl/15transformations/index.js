// import WebGLDebugUtils from "@/pages/3d/utils/lib/webgl-debug.js";
// import WebGLUtils from "@/pages/3d/utils/lib/webgl-utils";
import {getWebGLContext, initShaders} from "@/pages/3d/utils/lib/cuon-utils";
import VSHADER_SOURCE from "./index.vert";
import FSHADER_SOURCE from "./index.frag";

import "./index.less";

//学习帖子 https://blog.csdn.net/weixin_46773434/article/details/126664614
function setFragColor(gl) {
  //获取片元着色器uniform变量u_FragColor的存储地址
  const u_FragColor = gl.getUniformLocation(gl.program, "u_FragColor");
  //向片元着色器uniform变量u_FragColor传值
  gl.uniform4f(u_FragColor, 0.0, 1.0, 0.0, 1.0); //绿色
}

//初始化顶点
function initVertexBuffers(gl) {
  const vertices = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5]);

  //1.创建缓冲区对象
  const vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log("创建缓冲区对象失败！");
    return -1;
  }

  //2.将缓冲区对象绑定到目标
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

  //3.向缓冲区对象中写入数据
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const a_Position = gl.getAttribLocation(gl.program, "a_Position"); //获取着色器attribute变量a_Position的存储地址

  //4.将缓冲区对象分配给a_Position变量
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  //5.连接a_Position变量与分配给它的缓冲区对象
  gl.enableVertexAttribArray(a_Position);

  return vertices.length / 2;
}

window.onload = function () {
  const canvas = document.createElement("canvas");
  canvas.width = 500;
  canvas.height = 500;

  getWebGLContext(canvas);

  document.body.appendChild(canvas);

  if (!canvas.getContext) return;
  let gl = canvas.getContext("webgl");
  // vertexShader, fragmentShader

  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log("failed to initialize shaders");
    return;
  }

  // 使用完全不透明的黑色清除所有图像
  // 清空掉颜色
  gl.clearColor(0, 0, 0, 1.0); // RBGA
  // 用上面指定的颜色清除缓冲区
  gl.clear(gl.COLOR_BUFFER_BIT);

  //给片元着色器uniform变量u_FragColor赋值
  setFragColor(gl);
  //初始化顶点
  const n = initVertexBuffers(gl);

  let Tx = 0.0;
  let direction = "plus";
  const render = () => {
    //获取顶点着色器uniform变量u_Translation的存储地址
    const u_Translation = gl.getUniformLocation(gl.program, "u_Translation");

    if (Tx >= 0.5) {
      direction = "minus";
    }

    if (Tx <= -0.5) {
      direction = "plus";
    }

    //在 x、y、z轴方向上平移的距离
    if (direction === "plus") {
      Tx += 0.01;
    }

    //在 x、y、z轴方向上平移的距离
    if (direction === "minus") {
      Tx -= 0.01;
    }

    // if (Tx >= 0.5) {
    //   Tx -= 0.01;
    // } else {
    //   Tx += 0.01;
    // }
    const Ty = 0.5;
    const Tz = 0.0;

    //向顶点着色器uniform变量u_Translation传值
    gl.uniform4f(u_Translation, Tx, Ty, Tz, 0.0);

    //绘制三角形
    gl.drawArrays(gl.TRIANGLES, 0, n);

    requestAnimationFrame(render);
    console.log("Tx====", Tx);
  };

  render();
};
