window.onload = () => {
  const canvas = document.createElement("canvas");
  canvas.width = 500;
  canvas.height = 500;

  // 初始化 webgl
  const gl = canvas.getContext("webgl");

  if (!gl) {
    console.log("浏览器不支持webgl");
    return false;
  }
  // 使用完成不透明的黑色清除所有图像
  gl.clearColor(0, 0, 0, 1);
  // 用上指定的颜色清除缓冲区
  gl.clear(gl.COLOR_BUFFER_BIT);

  document.body.appendChild(canvas);
};
