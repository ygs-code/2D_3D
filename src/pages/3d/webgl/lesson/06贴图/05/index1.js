import {getWebGLContext, initShaders} from "@/pages/3d/utils/lib/cuon-utils";
import cat_512 from "@/assets/image/cat_512x512.jpg";
import VSHADER_SOURCE from "./index.vert";
import FSHADER_SOURCE from "./index.frag";
import "./index.less";
import {doc} from "prettier";
console.log("cat_512===", cat_512);
window.onload = function () {
  let canvas_w = 400,
    canvas_h = 400;
  const canvas = document.createElement("canvas");
  canvas.width = 500;
  canvas.height = 500;
  // getWebGLContext(canvas);
  document.body.appendChild(canvas);

  if (!canvas.getContext) return;
  let gl = canvas.getContext("webgl");

  //   let canvas = document.getElementById('webgl')
  // let gl = canvas.getContext('webgl')

  let vertexShader = `
attribute vec3 a_position;
attribute vec2 a_uv;
varying vec2 v_uv;

void main() {
    v_uv = a_uv;
    gl_Position = vec4(a_position, 1.0);
}
`;

  let fragmentShader = `
precision mediump float;
varying vec2 v_uv;
uniform sampler2D u_sampler;

void main() {
    vec4 color = texture2D(u_sampler, v_uv);
    gl_FragColor = color;
}
`;

  initShaders(gl, vertexShader, fragmentShader);

  initVertexBuffers(gl);

  initTextures(gl);
  function initTextures(gl) {
    let texture = gl.createTexture();

    let u_sampler = gl.getUniformLocation(gl.program, "u_sampler");

    let image = new Image();
    image.src = cat_512;

    // 异步的过程：图片加载完成之后执行这个函数里的任务
    image.onload = function () {
      // 翻转图片的Y轴,默认是不翻转
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

      gl.activeTexture(gl.TEXTURE0); //激活贴图，放在第0个单元上（最少可以支持8个单元）
      gl.bindTexture(gl.TEXTURE_2D, texture); //绑定贴图：哪种贴图和哪个贴图

      // 对贴图的参数进行设置gl.texParameteri(贴图的种类，参数的名称，具体值)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      console.log("image==", image);

      // 贴图用哪张图片，即用image作为texture
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        image
      );

      gl.uniform1i(u_sampler, 0);

      draw(gl);
      // document.body.appendChild(image);
    };
  }

  function initVertexBuffers(gl) {
    // 4个点的坐标信息-形状的4个顶点
    let positions = new Float32Array([
      -0.5, -0.5, 0.0, 0.5, -0.5, 0.0, 0.5, 0.5, 0.0, -0.5, 0.5, 0.0
    ]);

    // 4个点的信息-图片的4个顶点
    let uvs = new Float32Array([0.0, 0.0, 0.5, 0.0, 0.5, 1.0, 0.0, 1.0]);

    let FSIZE = positions.BYTES_PER_ELEMENT; // Float32 Size = 4

    let positionsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    let a_position = gl.getAttribLocation(gl.program, "a_position");
    gl.vertexAttribPointer(a_position, 3, gl.FLOAT, false, FSIZE * 3, 0);
    gl.enableVertexAttribArray(a_position);

    let uvsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.STATIC_DRAW);
    let a_uv = gl.getAttribLocation(gl.program, "a_uv");
    gl.vertexAttribPointer(a_uv, 2, gl.FLOAT, false, FSIZE * 2, 0);
    gl.enableVertexAttribArray(a_uv);
  }

  function draw(gl) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.drawArrays(gl.POINTS, 0, 4);
  }
};
