import {getWebGLContext, initShaders} from "@/pages/3d/utils/lib/cuon-utils";
import {resizeCanvasToDisplaySize} from "@/pages/3d/utils/webgl-utils.js";
import * as m3 from "@/pages/3d/utils/m3.js";
import VSHADER_SOURCE from "./index.vert";
import FSHADER_SOURCE from "./index.frag";
import * as dat from "dat.gui";
import "./index.less";
// Returns a random integer from 0 to range - 1.
function randomInt(range) {
  return Math.floor(Math.random() * range);
}

// Fill the buffer with the values that define a rectangle.
// 用定义矩形的值填充缓冲区。
// 随机更新 vertices 数据
function setRectangle(gl, x, y, width, height) {
  var x1 = x;
  var x2 = x + width;
  var y1 = y;
  var y2 = y + height;
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]),
    gl.STATIC_DRAW
  );
}
// Fill the buffer with the values that define a triangle.
// Note, will put the values in whatever buffer is currently
// bound to the ARRAY_BUFFER bind point
function setGeometry(gl) {
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([0, -100, 150, 125, -175, 100]),
    gl.STATIC_DRAW
  );
}

// Draw the scene.
function drawScene({
  gl,
  positionAttributeLocation,
  translation,
  positionBuffer,
  angleInRadians,
  scale,
  matrixLocation
}) {
  resizeCanvasToDisplaySize(gl.canvas);

  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Clear the canvas.
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Tell it to use our program (pair of shaders)
  gl.useProgram(gl.program);

  // Turn on the attribute
  gl.enableVertexAttribArray(positionAttributeLocation);

  // Bind the position buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  var size = 2; // 2 components per iteration
  var type = gl.FLOAT; // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0; // start at the beginning of the buffer
  gl.vertexAttribPointer(
    positionAttributeLocation,
    size,
    type,
    normalize,
    stride,
    offset
  );

  // Compute the matrix
  var matrix = m3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight);

  // 平移
  matrix = m3.translate(matrix, translation[0], translation[1]);

  // 旋转
  matrix = m3.rotate(matrix, angleInRadians);

  // 缩放
  matrix = m3.scale(matrix, scale[0], scale[1]);


  // 平移 * 旋转 * 缩放 * 顶点

  // Set the matrix.
  gl.uniformMatrix3fv(matrixLocation, false, matrix);

  // Draw the geometry.
  var primitiveType = gl.TRIANGLES;
  // var offset = 0;
  var count = 3;
  gl.drawArrays(primitiveType, offset, count);
}

function updatePosition({
  gl,
  positionAttributeLocation,
  translation,
  positionBuffer,
  angleInRadians,
  scale,
  matrixLocation,
  index,
  value
}) {
  translation[index] = value;
  drawScene({
    gl,
    positionAttributeLocation,
    translation,
    positionBuffer,
    angleInRadians,
    scale,
    matrixLocation
  });
}

function updateAngle({
  gl,
  positionAttributeLocation,
  translation,
  positionBuffer,
  angleInRadians,
  scale,
  matrixLocation,
  value
}) {
  var angleInDegrees = 360 - value;
  angleInRadians = (angleInDegrees * Math.PI) / 180;
  drawScene({
    gl,
    positionAttributeLocation,
    translation,
    positionBuffer,
    angleInRadians,
    scale,
    matrixLocation
  });
}

function updateScale({
  gl,
  positionAttributeLocation,
  translation,
  positionBuffer,
  angleInRadians,
  scale,
  matrixLocation,
  index,
  value
}) {
  scale[index] = value;
  drawScene({
    gl,
    positionAttributeLocation,
    translation,
    positionBuffer,
    angleInRadians,
    scale,
    matrixLocation
  });
}

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
  // vertexShader, fragmentShader

  console.log("VSHADER_SOURCE=====", VSHADER_SOURCE);
  console.log("FSHADER_SOURCE=====", FSHADER_SOURCE);
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log("failed to initialize shaders");
    return;
  }

  // look up where the vertex data needs to go.
  var positionAttributeLocation = gl.getAttribLocation(
    gl.program,
    "a_position"
  );

  // lookup uniforms
  var matrixLocation = gl.getUniformLocation(gl.program, "u_matrix");

  // Create a buffer.  创建 buffer
  var positionBuffer = gl.createBuffer();
  // 绑定 buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Set Geometry. 设置buffer数据
  setGeometry(gl);

  var translation = [200, 150];
  var angleInRadians = 0;
  var scale = [1, 1];

  drawScene({
    gl,
    positionAttributeLocation,
    translation,
    positionBuffer,
    angleInRadians,
    scale,
    matrixLocation
  });

  const gui = new dat.GUI();

  // 设置一个文件夹
  const folder = gui.addFolder("设置三角形");
  // 改变
  let parmas = {
    color: "rgb(0,0,0,0)",
    position: {
      x: 0,
      y: 0
    },
    angle: 0,
    scale: {
      x: 0,
      y: 0
    },
    fn: () => {}
  };
  // // 改变颜色
  // folder
  //   .addColor(parmas, "color")
  //   .onChange((color) => {
  //     console.log("color==", color);
  //   })
  //   .name("颜色");

  //控制器一个x选项
  folder
    .add(
      parmas.position, // 需要修改的对象
      "x" // 需要修改的属性
    )
    .min(0)
    .max(gl.canvas.width)
    // 每次改变为0.1
    .step(0.01)
    .name("改变x轴")
    .onChange((value) => {
      // 回调函数
      updatePosition({
        gl,
        positionAttributeLocation,
        translation,
        positionBuffer,
        angleInRadians,
        scale,
        matrixLocation,
        index: 0,
        value
      });
    })
    .onFinishChange((value) => {
      // 完全修改停下来的时候触发这个事件
      console.log("onFinishChange value==", value);
    });

  //控制器一个x选项
  folder
    .add(
      parmas.position, // 需要修改的对象
      "y" // 需要修改的属性
    )
    .min(0)
    .max(gl.canvas.height)
    // 每次改变为0.1
    .step(0.01)
    .name("改变y轴")
    .onChange((value) => {
      // 回调函数
      updatePosition({
        gl,
        positionAttributeLocation,
        translation,
        positionBuffer,
        angleInRadians,
        scale,
        matrixLocation,
        index: 1,
        value
      });
    })
    .onFinishChange((value) => {
      // 完全修改停下来的时候触发这个事件
      console.log("onFinishChange value==", value);
    });

  //控制器一个angle选项
  folder
    .add(
      parmas, // 需要修改的对象
      "angle" // 需要修改的属性
    )
    .min(0)
    .max(360)
    // 每次改变为0.1
    .step(0.01)
    .name("改变三角形角度")
    .onChange((value) => {
      // 回调函数
      updateAngle({
        gl,
        positionAttributeLocation,
        translation,
        positionBuffer,
        angleInRadians,
        scale,
        matrixLocation,
        index: 1,
        value
      });
    })
    .onFinishChange((value) => {
      // 完全修改停下来的时候触发这个事件
      console.log("onFinishChange value==", value);
    });

  //控制器一个scaleX选项
  folder
    .add(
      parmas.scale, // 需要修改的对象
      "x" // 需要修改的属性
    )
    .min(-5)
    .max(5)
    // 每次改变为0.1
    .step(0.01)
    .name("改变scaleX轴")
    .onChange((value) => {
      // 回调函数
      updateScale({
        gl,
        positionAttributeLocation,
        translation,
        positionBuffer,
        angleInRadians,
        scale,
        matrixLocation,
        index: 0,
        value
      });
    })
    .onFinishChange((value) => {
      // 完全修改停下来的时候触发这个事件
      console.log("onFinishChange value==", value);
    });

  //控制器一个scaleY选项
  folder
    .add(
      parmas.scale, // 需要修改的对象
      "y" // 需要修改的属性
    )
    .min(-5)
    .max(5)
    // 每次改变为0.1
    .step(0.01)
    .name("改变scaleX轴")
    .onChange((value) => {
      // 回调函数
      updateScale({
        gl,
        positionAttributeLocation,
        translation,
        positionBuffer,
        angleInRadians,
        scale,
        matrixLocation,
        index: 1,
        value
      });
    })
    .onFinishChange((value) => {
      // 完全修改停下来的时候触发这个事件
      console.log("onFinishChange value==", value);
    });
};
