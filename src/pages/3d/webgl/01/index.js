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

    ctx.fillStyle = "green";

    ctx.fillRect(
      10, // x
      10, // y
      100, // w
      100 // h
    );

    document.body.appendChild(canvas);
  };

  render(500, 500);
};
