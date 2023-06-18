window.onload = () => {
  function Rect(width, height) {
    this.canvas = document.createElement("canvas");

    this.ctx = this.canvas.getContext("2d");
    document.body.appendChild(this.canvas);
    this.hDVrender({canvas: this.canvas, width, height, ctx: this.ctx});
    this.width = width;
    this.height = height;
  }
  Rect.prototype = {
    hDVrender({canvas, width, height, ctx}) {
      canvas.width = width;
      canvas.height = height;
      var ratio = window.devicePixelRatio || 1;
      canvas.style.width = canvas.width + "px";
      canvas.style.height = canvas.height + "px";
      canvas.width = canvas.width * ratio;
      canvas.height = canvas.height * ratio;
      ctx.scale(ratio, ratio);
      return ctx;
    },
    render({x, y}) {
      // 擦除画布内容
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.ctx.fillStyle = "green";
      // 重画
      this.ctx.fillRect(x, y, 10, 10);
    },
  };

  let x = 0;
  let y = 0;
  let rect = new Rect(500, 500);
  setInterval(() => {
    x += 10;
    y += 10;
    if (x >= 490) {
      x = 0;
      y = 0;
    }
    rect.render({x, y});
  }, 100);
};

// // 这个函数就是动画的一帧
// function draw(ctx) {
//     let second = new Date().getSeconds();
//     ctx.clearRect(0, 0, 300, 300);
//     ctx.save();
//     ctx.translate(100, 100);
//     ctx.rotate(((Math.PI * 2) / 60) * second);
//     ctx.lineWidth = 6;
//     ctx.lineCap = 'round';
//     ctx.strokeStyle = 'green';
//     ctx.beginPath();
//     ctx.moveTo(0, 0);
//     ctx.lineTo(0, -80);
//     ctx.stroke();
//     ctx.restore();

//     requestAnimationFrame(() => {
//         draw(ctx);
//     });
// }

// window.onload = function () {
//     const canvasEl = document.getElementById('box');
//     if (!canvasEl.getContext) return;
//     let ctx = canvasEl.getContext('2d');
//     requestAnimationFrame(() => {
//         draw(ctx);
//     });
// };
