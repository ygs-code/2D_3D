// import WebGLDebugUtils from "@/pages/3d/utils/lib/webgl-debug.js";
// import WebGLUtils from "@/pages/3d/utils/lib/webgl-utils";
import {getWebGLContext, initShaders} from "@/pages/3d/utils/lib/cuon-utils";
import VSHADER_SOURCE from "./index.vert";
import FSHADER_SOURCE from "./index.frag";

import "./index.less";

window.onload = function () {
  const canvas = document.createElement("canvas");
  canvas.width = 500;
  canvas.height = 500;
  // getWebGLContext(canvas);
  document.body.appendChild(canvas);

  if (!canvas.getContext) return;
  let gl = canvas.getContext("webgl");
  // vertexShader, fragmentShader

  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log("failed to initialize shaders");
    return;
  }

  const vertices = new Float32Array([0.0, 0.1, -0.1, -0.1, 0.1, -0.1]);

  // 创建一个buff
  let vertextBuff = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertextBuff);
  gl.bufferData(gl.ARRAY_BUFFER, vertices);
};
