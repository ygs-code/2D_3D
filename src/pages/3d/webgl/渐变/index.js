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
  // 初始化顶点位置
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
  // getWebGLContext(canvas);
  document.body.appendChild(canvas);

  if (!canvas.getContext) return;
  let gl = canvas.getContext("webgl");
  // vertexShader, fragmentShader

  console.log("VSHADER_SOURCE=====", VSHADER_SOURCE);
  console.log("FSHADER_SOURCE=====", FSHADER_SOURCE);
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log("failed to initialize shaders");
    return;
  }

  let scale = 0;

  // 旋转
  const render = () => {
    const n = initVertexBuffers(gl);
    if (n < 0) {
      console.error("n<0");
      return;
    }
    //旋转90°
    scale += 0.01;
    if (scale >= 2) {
      scale = 0;
    }
    const u_Scale = gl.getUniformLocation(gl.program, "u_Scale");
    gl.uniform1f(u_Scale, scale);
    // gl.uniform1f(u_CosB, cosB);

    // const a_Scale = gl.getAttribLocation(gl.program, "a_Scale");
    // if (a_Scale < 0) {
    //   console.log("Failed to get the storage loacation of a_PointSize");
    //   return false;
    // }

    // let PointSize = 10.0;
    // let Position = [0.1, 0.0, 0.0, 1.0];
    // 将顶点位置输入给 attribute变量
    // gl.vertexAttrib1f(a_Scale, PointSize);

    // 使用完全不透明的黑色清除所有图像
    // 清空掉颜色
    gl.clearColor(255, 255, 255, 1.0); // RBGA
    // 用上面指定的颜色清除缓冲区
    gl.clear(gl.COLOR_BUFFER_BIT);

    //绘制一个点
    gl.drawArrays(gl.LINE_LOOP, 0, n);
    requestAnimationFrame(render);
  };

  render();
};
