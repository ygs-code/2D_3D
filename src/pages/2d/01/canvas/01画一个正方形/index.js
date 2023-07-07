import "./index.less";
window.onload = () => {
  const hDVrender = ({canvas, width, height, ctx}) => {
    canvas.width = width;
    canvas.height = height;
    var ratio = window.devicePixelRatio || 1;
    canvas.style.width = canvas.width + "px";
    canvas.style.height = canvas.height + "px";
    canvas.width = canvas.width * ratio;
    canvas.height = canvas.height * ratio;
    ctx.scale(ratio, ratio);
    return ctx;
  };
  const render = (width, height) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    hDVrender({canvas, width, height, ctx});

    document.body.appendChild(canvas);
    // 清除指定矩形区域，让清除部分完全透明。
    ctx.clearRect(0, 0, width, height);

    // 设置颜色
    ctx.fillStyle = "red";
    ctx.fillRect(
      10, // x
      10, // y
      200, // 宽
      200 // 高
    );
  };

  render(500, 500);
};
