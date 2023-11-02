import {getWebGLContext, initShaders} from "@/pages/3d/utils/lib/cuon-utils";
import {resizeCanvasToDisplaySize} from "@/pages/3d/utils/webgl-utils.js";
import m4 from "./m4";
import FSHADER_SOURCE from "./index.frag";
import VSHADER_SOURCE from "./index.vert";
import controller from "@/pages/3d/utils/controller.js";
import {fData} from "./data";
// import {createHtmlMatrix} from "@/pages/3d/utils/matrix.js";
import {createHtmlMatrix, multiply} from "@/pages/3d/utils/matrix.js";
import * as glMatrix from "gl-matrix";
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

  // setup GLSL program
  // var program = webglUtils.createProgramFromScripts(gl, ["vertex-shader-3d", "fragment-shader-3d"]);

  // look up where the vertex data needs to go. 查找顶点数据需要放到哪里。
  var positionLocation = gl.getAttribLocation(gl.program, "a_position");

  // lookup uniforms 颜色
  var colorLocation = gl.getUniformLocation(gl.program, "u_color");
  // 矩阵
  var matrixLocation = gl.getUniformLocation(gl.program, "u_matrix");

  // Create a buffer to put positions in
  // 创建一个缓冲区来放置位置
  var positionBuffer = gl.createBuffer();

  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  // 将其绑定到ARRAY_BUFFER(将其视为ARRAY_BUFFER = positionBuffer) 绑定缓冲区数据
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Fill the buffer with the values that define a letter 'F'.
  // //用定义字母'F'的值填充缓冲区。
  function setGeometry(gl) {
    // F 顶点数据
    gl.bufferData(gl.ARRAY_BUFFER, fData, gl.STATIC_DRAW);
  }
  // Put geometry data into buffer 将几何数据放入缓冲区
  setGeometry(gl);

  // 弧度变角度
  function radToDeg(r) {
    return (r * 180) / Math.PI;
  }

  //角度变弧度
  function degToRad(d) {
    return (d * Math.PI) / 180;
  }

  // 改变
  let parmas = {
    color: [Math.random(), Math.random(), Math.random(), 1],
    // 变换参数，平移  x y z
    translation: {
      x: 45,
      y: 45,
      z: 0
    },
    // 放大
    scale: {
      x: 1,
      y: 1,
      z: 1
    },
    // 旋转
    rotation: {
      angleX: 40,
      angleY: 25,
      angleZ: 325
    },
    fn: () => {}
  };

  // 控制 参数改变
  controller({
    onChange: () => {
      drawScene(parmas);
      // render(settings);
      // console.log("parmas========", parmas);
    },
    parmas: parmas,
    options: [
      {
        min: 0,
        max: 400,
        step: 0.001,
        key: "translation.x",
        name: "位移X",
        // onChange: (value) => {},
        onFinishChange: (value) => {
          // 完全修改停下来的时候触发这个事件
          console.log("onFinishChange value==", value);
        }
      },
      {
        min: 0,
        max: 400,
        step: 0.01,
        key: "translation.y",
        name: "位移Y",
        onChange: (value) => {},
        onFinishChange: (value) => {
          // 完全修改停下来的时候触发这个事件
          console.log("onFinishChange value==", value);
        }
      },
      {
        min: -1,
        max: 400,
        step: 0.01,
        key: "translation.z",
        name: "位移Z",
        onChange: (value) => {},
        onFinishChange: (value) => {
          // 完全修改停下来的时候触发这个事件
          console.log("onFinishChange value==", value);
        }
      },

      {
        min: -1,
        max: 10,
        step: 0.001,
        key: "scale.x",
        name: "放大X",
        // onChange: (value) => {},
        onFinishChange: (value) => {
          // 完全修改停下来的时候触发这个事件
          console.log("onFinishChange value==", value);
        }
      },
      {
        min: -1,
        max: 10,
        step: 0.01,
        key: "scale.y",
        name: "放大Y",
        onChange: (value) => {},
        onFinishChange: (value) => {
          // 完全修改停下来的时候触发这个事件
          console.log("onFinishChange value==", value);
        }
      },
      {
        min: -1,
        max: 10,
        step: 0.01,
        key: "scale.z",
        name: "放大Z",
        onChange: (value) => {},
        onFinishChange: (value) => {
          // 完全修改停下来的时候触发这个事件
          console.log("onFinishChange value==", value);
        }
      },

      {
        min: 0,
        max: 360,
        step: 0.001,
        key: "rotation.angleX",
        name: "旋转X",
        // onChange: (value) => {},
        onFinishChange: (value) => {
          // 完全修改停下来的时候触发这个事件
          console.log("onFinishChange value==", value);
        }
      },
      {
        min: -1,
        max: 360,
        step: 0.01,
        key: "rotation.angleY",
        name: "旋转Y",
        onChange: (value) => {},
        onFinishChange: (value) => {
          // 完全修改停下来的时候触发这个事件
          console.log("onFinishChange value==", value);
        }
      },
      {
        min: -1,
        max: 360,
        step: 0.01,
        key: "rotation.angleZ",
        name: "旋转Z",
        onChange: (value) => {},
        onFinishChange: (value) => {
          // 完全修改停下来的时候触发这个事件
          console.log("onFinishChange value==", value);
        }
      }
    ]
  });

  // //  变换参数，平移  x y z
  // var translation = [45, 150, 0];

  // // 旋转 参数  x y z
  // var rotation = [degToRad(40), degToRad(25), degToRad(325)];

  // // 缩放参数 x y z
  // var scale = [1, 1, 1];

  // // 颜色随机
  // var color = [Math.random(), Math.random(), Math.random(), 1];

  // Draw the scene. 画出场景。
  function drawScene(parmas) {
    const {
      color,
      // 变换参数，平移  x y z
      translation = {},
      // 放大
      scale = {},
      // 旋转
      rotation: {angleX, angleY, angleZ}
    } = parmas;

    //  将画布调整为显示大小
    resizeCanvasToDisplaySize(gl.canvas);

    // Tell WebGL how to convert from clip space to pixels //告诉WebGL如何从剪辑空间转换为像素
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas. //清除画布。
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Tell it to use our program (pair of shaders) //告诉它使用我们的程序(shaders pair)
    gl.useProgram(gl.program);

    // Turn on the attribute //打开属性
    gl.enableVertexAttribArray(positionLocation);

    // Bind the position buffer. // 绑定顶点数据 绑定位置缓冲区。/
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    // //告诉属性如何从positionBuffer (ARRAY_BUFFER)中获取数据
    var size = 3; // 3 components per iteration 每次迭代3个组件
    var type = gl.FLOAT; // the data is 32bit floats 数据是32位浮点数
    var normalize = false; // don't normalize the data 不要规范化数据
    var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position 0 =每次迭代向前移动size * sizeof(type)以获得下一个位置
    var offset = 0; // start at the beginning of the buffer 从缓冲区的开头开始
    // 连接a_position变量与分配给他的缓冲区对象
    /*
     
     告诉显卡从当前绑定的缓冲区（bindBuffer() 指定的缓冲区）中读取顶点数据。
     方法绑定当前缓冲区范围到gl.ARRAY_BUFFER,
     成为当前顶点缓冲区对象的通用顶点属性并指定它的布局 (缓冲区对象中的偏移量)。

     */
    gl.vertexAttribPointer(
      positionLocation,
      size,
      type,
      normalize,
      stride,
      offset
    );

    // set the color  设置颜色值到 u_color 变量中
    gl.uniform4fv(colorLocation, color);

    // Compute the matrices 计算矩阵 创建一个正交投影
    var matrix = m4.projection(
      gl.canvas.clientWidth,
      gl.canvas.clientHeight,
      400
    );

    let translationMatrix = [];

    // 变换这个正交投影 位移
    matrix = m4.translate(matrix, translation.x, translation.y, translation.z);

    // 旋转正交矩阵
    matrix = m4.xRotate(matrix, degToRad(angleX));

    matrix = m4.yRotate(matrix, degToRad(angleY));

    matrix = m4.zRotate(matrix, degToRad(angleZ));

    // 放大
    matrix = m4.scale(matrix, scale.x, scale.y, scale.z);

    // 输出正交投影矩阵
    // createHtmlMatrix(matrix, 4, 4, "matrix");

    createHtmlMatrix({
      matrix,
      title: "正交投影矩阵",
      row: 4,
      list: 4,
      elId: "matrix"
    });

    /*
    
      createHtmlMatrix(
        
        {
          matrix,
          row:4,
          list:4,
          el:"matrix"
        }
        
      
      
      );
    */

    // F数据矩阵
    createHtmlMatrix({
      matrix: fData,
      title: "F矩阵",
      row: 16 * 6,
      list: 3,
      elId: "fData"
    });
    // createHtmlMatrix(fData, 16 * 6, 3, "fData");

    let fMatrix = [];
    for (let i = 0; i < 16 * 6; i++) {
      // console.log(
      //   multiply(
      //     {
      //       //
      //       matrix: fData,
      //       row: {
      //         n: 16 * 6,
      //         start: i,
      //         end: i
      //       },
      //       list: {
      //         n: 3
      //         // start: 0,
      //         // end: 3
      //       }
      //     },

      //     {
      //       matrix: matrix,
      //       row: {
      //         n: 4
      //         // start: 0,
      //         // end: 0
      //       },
      //       list: {
      //         n: 4
      //         // start: 0,
      //         // end: 3
      //       }
      //     }
      //   )
      // );

      fMatrix = fMatrix.concat(
        multiply(
          {
            //
            matrix: fData,
            row: {
              n: 16 * 6,
              start: i,
              end: i
            },
            list: {
              n: 3
              // start: 0,
              // end: 3
            }
          },

          {
            matrix: matrix,
            row: {
              n: 4
              // start: 0,
              // end: 0
            },
            list: {
              n: 4
              // start: 0,
              // end: 3
            }
          }
        )
      );
    }

    // F*正交投影矩阵
    createHtmlMatrix(fMatrix, 16 * 6, 4, "fData");

    // Set the matrix.
    // 得到一个矩阵 放入 u_matrix 变量中传入gpu
    gl.uniformMatrix4fv(matrixLocation, false, matrix);

    // 绘画顶点位置
    // Draw the geometry.
    var primitiveType = gl.TRIANGLES; // 绘画类型
    // var offset = 0;
    // var count = 18; // 6 triangles in the 'F', 3 points per triangle  18个顶点
    var count = 16 * 6;
    gl.drawArrays(primitiveType, offset, count);
  }

  drawScene(parmas);
};
