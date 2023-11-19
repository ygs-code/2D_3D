import "./index.less";

window.onload = function () {
  const canvas = document.createElement("canvas");

  document.body.appendChild(canvas);
  canvas.width = 500;
  canvas.height = 500;

  if (!canvas.getContext) return;
  let gl = canvas.getContext("webgl");
  // vertexShader, fragmentShader
  // program

  // 使用完全不透明的黑色清除所有图像
  // 清空掉颜色
  gl.clearColor(1, 0, 0, 1); // RBGA
  // 用上面指定的颜色清除缓冲区
  gl.clear(gl.COLOR_BUFFER_BIT);
};
