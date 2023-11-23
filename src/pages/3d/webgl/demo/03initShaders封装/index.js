import WebGLDebugUtils from "@/pages/3d/utils/lib/webgl-debug.js";
import WebGLUtils from "@/pages/3d/utils/lib/webgl-utils";
import {getWebGLContext, initShaders} from "@/pages/3d/utils/lib/cuon-utils";
import VSHADER_SOURCE from "./index.vert";
import FSHADER_SOURCE from "./index.frag";

import "./index.less";
 

window.onload = function () {
  const canvas = document.createElement("canvas");
  getWebGLContext(canvas);

  document.body.appendChild(canvas);
  canvas.width = 500;
  canvas.height = 500;

  if (!canvas.getContext) return;
  let gl = canvas.getContext("webgl");
  // vertexShader, fragmentShader

  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log("failed to initialize shaders");
    return;
  }

  // 顶点颜色着色器
  console.log("VSHADER_SOURCE=====", VSHADER_SOURCE);

  // 片元着色器程序
  console.log("FSHADER_SOURCE=====", FSHADER_SOURCE);

  // program

  // 使用完全不透明的黑色清除所有图像
  // 清空掉颜色
  gl.clearColor(0, 0, 0, 1.0); // RBGA
  // 用上面指定的颜色清除缓冲区
  gl.clear(gl.COLOR_BUFFER_BIT);

  // 绘制一个顶点
  gl.drawArrays(gl.POINTS, 0, 1);
};
