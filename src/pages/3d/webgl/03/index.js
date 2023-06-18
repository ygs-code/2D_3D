function hDVrender({canvas, width, height, ctx}) {
  canvas.width = width;
  canvas.height = height;
  var ratio = window.devicePixelRatio || 1;
  canvas.style.width = canvas.width + "px";
  canvas.style.height = canvas.height + "px";
  canvas.width = canvas.width * ratio;
  canvas.height = canvas.height * ratio;
  ctx.scale(ratio, ratio);
  return ctx;
}

// 这个函数就是动画的一帧
function draw(ctx) {
  let second = new Date().getSeconds();
  // 清除画布
  ctx.clearRect(0, 0, 300, 300);
  ctx.save();
  ctx.translate(100, 100);
  ctx.rotate(((Math.PI * 2) / 60) * second);
  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  ctx.strokeStyle = "green";
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, -80);
  ctx.stroke();
  ctx.restore();

  requestAnimationFrame(() => {
    draw(ctx);
  });
}

window.onload = function () {
  const canvas = document.createElement("canvas");

  document.body.appendChild(canvas);

  if (!canvas.getContext) return;
  let ctx = canvas.getContext("2d");
  hDVrender({canvas, width: 500, height: 500, ctx});
  requestAnimationFrame(() => {
    draw(ctx);
  });
};
