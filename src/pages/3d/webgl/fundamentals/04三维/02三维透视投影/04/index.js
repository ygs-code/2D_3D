import {getWebGLContext, initShaders} from "@/pages/3d/utils/lib/cuon-utils";
import {resizeCanvasToDisplaySize} from "@/pages/3d/utils/webgl-utils.js";
import m4 from "./m4";
import FSHADER_SOURCE from "./index.frag";
import VSHADER_SOURCE from "./index.vert";
import controller from "@/pages/3d/utils/controller.js";
import {colors, fData} from "./data";
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
  class WebGl {
    constructor(options) {
      this.options = options;

      // 改变
      this.parmas = {
        perspective: {
          z: 1
        },
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
      this.init();
    }
    init() {
      this.createCanvas();
      this.initShaders();

      this.setAttributeData();
      this.setUniform();
      this.drawScene();
      this.controller();
    }
    createCanvas() {
      const {canvas_w, canvas_h} = this.options;

      this.canvas = document.createElement("canvas");
      this.canvas.width = canvas_w;
      this.canvas.height = canvas_h;
      document.body.appendChild(this.canvas);

      if (!this.canvas.getContext) return;
      this.gl = this.canvas.getContext("webgl");

      //打开筛选。默认情况下，背面三角形
      //将被剔除。
      this.gl.enable(this.gl.CULL_FACE);
      // 1.开启隐藏面消除功能
      this.gl.enable(this.gl.DEPTH_TEST); // gl.DEPTH_TEST、gl.BLEND(混合)、gl.POLYGON_OFFSET_FILL(多边形位移)
      // this.gl.enable(this.gl.SCISSOR_TEST); // 启用剪裁测试
    }
    initShaders() {
      if (!initShaders(this.gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log("failed to initialize shaders");
        return;
      }
    }
    // 设置F数据
    setAttributeData = () => {
      /*
      buffer: 分5个步骤
    */
      //1 创建 buffer
      let positionBuffer = this.gl.createBuffer(); // 创建缓冲

      // 2
      // 将缓冲区对象绑定指定目标
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);

      //3
      // 向缓冲区写入数据
      this.gl.bufferData(this.gl.ARRAY_BUFFER, fData, this.gl.STATIC_DRAW);

      // 设置canvas 宽高
      resizeCanvasToDisplaySize(this.gl.canvas);

      // Tell WebGL how to convert from clip space to pixels
      //告诉WebGL如何从剪辑空间转换为像素
      this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

      // Tell it to use our program (pair of shaders)
      //告诉它使用我们的程序(shaders pair)
      this.gl.useProgram(this.gl.program);

      // 4: 把带有数据的buffer给arrribute
      // 将缓冲区对象分配给a_position变量

      var a_position = this.gl.getAttribLocation(this.gl.program, "a_position");

      // let a_position = this.gl.getContextAttributes(
      //   this.gl.isProgram,
      //   "a_position"
      // ); // 获得变量位置

      // 连接a_position变量与分配给他的缓冲区对象
      /*
     
     告诉显卡从当前绑定的缓冲区（bindBuffer() 指定的缓冲区）中读取顶点数据。
     方法绑定当前缓冲区范围到gl.ARRAY_BUFFER,
     成为当前顶点缓冲区对象的通用顶点属性并指定它的布局 (缓冲区对象中的偏移量)。
  
     */
      this.gl.vertexAttribPointer(
        a_position, // 变量 指定要修改的顶点属性的索引。
        3, // size 三个数据为一组 告诉三个点位一组颜色  1, 2, 3, or 4. 指定每个顶点属性的组成数量，必须是 1，2，3 或 4。
        this.gl.FLOAT, //type gl.FLOAT: 32-bit IEEE floating point number 32 位 IEEE 标准的浮点数
        false, // normalized 当转换为浮点数时是否应该将整数数值归一化到特定的范围。
        fData.BYTES_PER_ELEMENT * 3, // stride 以字节为单位指定连续顶点属性开始之间的偏移量 (即数组中一行长度)。不能大于 255。如果 stride 为 0，则假定该属性是紧密打包的，即不交错属性，每个属性在一个单独的块中，下一个顶点的属性紧跟当前顶点之后。
        0 //offset 指定顶点属性数组中第一部分的字节偏移量。必须是类型的字节长度的倍数。 // 索引 从 0 开始
      ); //  告诉gl如何解析数据

      // 确认 // 启用数据
      // 连接a_position变量与分配给他的缓冲区对象
      this.gl.enableVertexAttribArray(a_position);

      /*
      buffer: 分5个步骤
    */
      //1 创建 buffer
      let colorBuffer = this.gl.createBuffer(); // 创建缓冲

      // 2
      // 将缓冲区对象绑定指定目标
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer);

      //3
      // 向缓冲区写入数据
      this.gl.bufferData(this.gl.ARRAY_BUFFER, colors, this.gl.STATIC_DRAW);

      // 设置canvas 宽高
      resizeCanvasToDisplaySize(this.gl.canvas);

      // Tell WebGL how to convert from clip space to pixels
      //告诉WebGL如何从剪辑空间转换为像素
      this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

      // Tell it to use our program (pair of shaders)
      //告诉它使用我们的程序(shaders pair)
      this.gl.useProgram(this.gl.program);

      // 4: 把带有数据的buffer给arrribute
      // 将缓冲区对象分配给a_position变量

      var a_colors = this.gl.getAttribLocation(this.gl.program, "a_colors");

      // let a_position = this.gl.getContextAttributes(
      //   this.gl.isProgram,
      //   "a_position"
      // ); // 获得变量位置

      // 连接a_position变量与分配给他的缓冲区对象
      /*
     
     告诉显卡从当前绑定的缓冲区（bindBuffer() 指定的缓冲区）中读取顶点数据。
     方法绑定当前缓冲区范围到gl.ARRAY_BUFFER,
     成为当前顶点缓冲区对象的通用顶点属性并指定它的布局 (缓冲区对象中的偏移量)。
     var type = gl.UNSIGNED_BYTE;  // the data is 8bit unsigned values
      var normalize = true;         // normalize the data (convert from 0-255 to 0-1)
     */
      this.gl.vertexAttribPointer(
        a_colors, // 变量 指定要修改的顶点属性的索引。
        3, // size 三个数据为一组 告诉三个点位一组颜色  1, 2, 3, or 4. 指定每个顶点属性的组成数量，必须是 1，2，3 或 4。
        this.gl.UNSIGNED_BYTE, //gl.UNSIGNED_BYTE 数据是8位无符号值  , type gl.FLOAT: 32-bit IEEE floating point number 32 位 IEEE 标准的浮点数 ,
        true, // normalized 当转换为浮点数时是否应该将整数数值归一化到特定的范围。, 如果是false 则是0-1，如果是true 则是 0-255
        colors.BYTES_PER_ELEMENT * 3, //colors.BYTES_PER_ELEMENT * 3, // stride 以字节为单位指定连续顶点属性开始之间的偏移量 (即数组中一行长度)。不能大于 255。如果 stride 为 0，则假定该属性是紧密打包的，即不交错属性，每个属性在一个单独的块中，下一个顶点的属性紧跟当前顶点之后。
        0 //offset 指定顶点属性数组中第一部分的字节偏移量。必须是类型的字节长度的倍数。 // 索引 从 0 开始
      ); //  告诉gl如何解析数据

      // 确认 // 启用数据
      // 连接a_colors变量与分配给他的缓冲区对象
      this.gl.enableVertexAttribArray(a_colors);
    };

    //角度变弧度
    degToRad(d) {
      return (d * Math.PI) / 180;
    }
    drawScene() {
      //  将画布调整为显示大小
      resizeCanvasToDisplaySize(this.gl.canvas);

      // Tell WebGL how to convert from clip space to pixels //告诉WebGL如何从剪辑空间转换为像素
      this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

      // Clear the canvas. //清除画布。
      this.gl.clear(this.gl.COLOR_BUFFER_BIT);

      // Tell it to use our program (pair of shaders) //告诉它使用我们的程序(shaders pair)
      this.gl.useProgram(this.gl.program);

      // 绘画顶点位置
      // Draw the geometry.
      var primitiveType = this.gl.TRIANGLES; // 绘画类型
      var offset = 0;
      // var count = 18; // 6 triangles in the 'F', 3 points per triangle  18个顶点
      var count = 16 * 6;

      this.gl.drawArrays(primitiveType, offset, count);

      // this.gl.drawArrays(primitiveType, 0, 6);
      // this.gl.drawArrays(primitiveType, 6, 6);
      // this.gl.drawArrays(primitiveType, 12, 6);
      // this.gl.drawArrays(primitiveType, 18, 6);
      // this.gl.drawArrays(primitiveType, 24, 6);
      // this.gl.drawArrays(primitiveType, 30, 6);
      // this.gl.drawArrays(primitiveType, 36, 6);
      // this.gl.drawArrays(primitiveType, 42, 6);
      // this.gl.drawArrays(primitiveType, 48, 6);
      // this.gl.drawArrays(primitiveType, 54, 6);
      // this.gl.drawArrays(primitiveType, 60, 6);
      // this.gl.drawArrays(primitiveType, 66, 6);
      // this.gl.drawArrays(primitiveType, 72, 6);
      // this.gl.drawArrays(primitiveType, 78, 6);
      // this.gl.drawArrays(primitiveType, 84, 6);
      // this.gl.drawArrays(primitiveType, 90, 6);
    }
    makeZToWMatrix=(fudegFactor)=>{
      return [
         1,0,0,0,
         0,1,0,0,
         0,0,1,fudegFactor,
         0,0,0,1,
      ];
    };
    setUniform() {
      const {
        color,
        // 变换参数，平移  x y z
        translation = {},
        // 放大
        scale = {},
        // 旋转
        rotation: {angleX, angleY, angleZ},
        perspective: {z}
      } = this.parmas;

      // 矩阵
      var matrixLocation = this.gl.getUniformLocation(
        this.gl.program,
        "u_matrix"
      );


      // 透视矩阵
      var matrix=this.makeZToWMatrix(z);

      // Compute the matrices 计算矩阵 创建一个正交投影
      // 透视 乘以 一个正交矩阵
      matrix = m4.multiply(matrix,
      m4.projection(
        this.gl.canvas.clientWidth,
        this.gl.canvas.clientHeight,
        400
      ));


 
      //
      // 变换这个正交投影 位移
      matrix = m4.translate(
        matrix,
        translation.x,
        translation.y,
        translation.z
      );

      // 旋转正交矩阵
      matrix = m4.xRotate(matrix, this.degToRad(angleX));

      matrix = m4.yRotate(matrix, this.degToRad(angleY));

      matrix = m4.zRotate(matrix, this.degToRad(angleZ));

      // 放大
      matrix = m4.scale(matrix, scale.x, scale.y, scale.z);


      // 得到一个矩阵 放入 u_matrix 变量中传入gpu
      this.gl.uniformMatrix4fv(matrixLocation, false, matrix);


      // // 透视
      // let fudgeLocation = this.gl.getUniformLocation(
      //   this.gl.program,
      //   "u_fudgeFactor"
      // );
      // // 设置fudgeFactor
      // this.gl.uniform1f(fudgeLocation, z);
    }

    controller() {
      // 控制 参数改变
      controller({
        onChange: () => {
          this.setUniform();
          this.drawScene();
          // render(settings);
          // console.log("parmas========", parmas);
        },
        parmas: this.parmas,
        options: [
          {
            min: 0,
            max: 2,
            step: 0.001,
            key: "perspective.z",
            name: "透视投影z",
            // onChange: (value) => {},
            onFinishChange: (value) => {
              // 完全修改停下来的时候触发这个事件
              console.log("onFinishChange value==", value);
            }
          },
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
    }

    //
  }

  new WebGl({canvas_w: 500, canvas_h: 500});

  return;
};
