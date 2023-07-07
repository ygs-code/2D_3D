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
    let r = 100;
    ctx.strokeStyle = "green";
    ctx.arc(150, 150, r, 0, 2 * Math.PI);
    ctx.stroke();
  };

  render(500, 500);
};
