import {getWebGLContext, initShaders} from "@/pages/3d/utils/lib/cuon-utils";
import cat_512 from "@/assets/image/1.png";
import VSHADER_SOURCE from "./index.vert";
import FSHADER_SOURCE from "./index.frag";
import "./index.less";
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
  // vertexShader, fragmentShader

  console.log("VSHADER_SOURCE=====", VSHADER_SOURCE);
  console.log("FSHADER_SOURCE=====", FSHADER_SOURCE);
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log("failed to initialize shaders");
    return;
  }

  // let u_w = gl.getUniformLocation(gl.program, "u_w");
  // let u_h = gl.getUniformLocation(gl.program, "u_h");
  // gl.uniform1f(u_w, canvas_w);
  // gl.uniform1f(u_h, canvas_h);

  const initTextures = (gl) => {
    let texture = gl.createTexture(); // 创建纹理对象
    let u_Sampler = gl.getUniformLocation(gl.program, "u_Sampler");
    let image = new Image();
    image.src = cat_512;
    image.onload = function () {
      let ratio = this.width / this.height;
      let shape = "";
      let verticesArr = [];
      if (ratio === 1) {
        shape = "square";
        verticesArr = [];
      } else if (ratio > 1) {
        shape = "crosswiseRectangle";
      } else {
        shape = "verticalRectangle";
      }

      console.log(this.width);
      console.log(this.height);
      /*
      
      
      webgl中图像纹理坐标系的v和图片的坐标Y是相反的，
      因此，要先把图像Y轴进行反转，才能正确的映射纹理坐标：
      
      */

      // 翻转图片的Y轴,默认是不翻转
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); // 图像反转Y轴

      gl.activeTexture(gl.TEXTURE0); //激活贴图，放在第0个单元上（最少可以支持8个单元） // 激活纹理单元
      gl.bindTexture(gl.TEXTURE_2D, texture); //绑定贴图：哪种贴图和哪个贴图 绑定纹理对象

      // // 对贴图的参数进行设置gl.texParameteri(贴图的种类，参数的名称，具体值)
      // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

      //设置参数，使我们可以渲染任何大小的图像。
      // Set the parameters so we can render any size image.
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

      // 贴图用哪张图片，即用image作为texture
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        image
      );

      gl.uniform1f(u_Sampler, 0);

      initVertexBuffers(gl);
      draw(gl);
    };
  };

  function initVertexBuffers(gl, verticesArr) {
    //三角形顶点位置
    // 4个点的坐标信息 - 形状的四个顶点
    let vertices = new Float32Array([
        -0.5, -0.5, 0.0, 
        0.5,  -0.5, 0.0,
        0.5, 0.5,  0.0, 
        -0.5, 0.5, 0.0
    ]);

    let FSIZE = vertices.BYTES_PER_ELEMENT; // Float32 Size = 4

    /*
      buffer: 分5个步骤
    */
    //1 创建 buffer
    let buffer = gl.createBuffer(); // 创建缓冲

    // 2
    // 将缓冲区对象绑定指定目标
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    //3
    // 向缓冲区写入数据
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // 4: 把带有数据的buffer给arrribute
    // 将缓冲区对象分配给a_Position变量
    let a_Position = gl.getContextAttributes(gl.isProgram, "a_Position"); // 获得变量位置

    // 连接a_Position变量与分配给他的缓冲区对象
    /*
     
     告诉显卡从当前绑定的缓冲区（bindBuffer() 指定的缓冲区）中读取顶点数据。
     方法绑定当前缓冲区范围到gl.ARRAY_BUFFER,
     成为当前顶点缓冲区对象的通用顶点属性并指定它的布局 (缓冲区对象中的偏移量)。

     */
    gl.vertexAttribPointer(
      a_Position, // 变量 指定要修改的顶点属性的索引。
      3, // size 三个数据为一组 告诉三个点位一组颜色  1, 2, 3, or 4. 指定每个顶点属性的组成数量，必须是 1，2，3 或 4。
      gl.FLOAT, //type gl.FLOAT: 32-bit IEEE floating point number 32 位 IEEE 标准的浮点数
      false, // normalized 当转换为浮点数时是否应该将整数数值归一化到特定的范围。
      FSIZE * 3, // stride 以字节为单位指定连续顶点属性开始之间的偏移量 (即数组中一行长度)。不能大于 255。如果 stride 为 0，则假定该属性是紧密打包的，即不交错属性，每个属性在一个单独的块中，下一个顶点的属性紧跟当前顶点之后。
      0 //offset 指定顶点属性数组中第一部分的字节偏移量。必须是类型的字节长度的倍数。
    ); //  告诉gl如何解析数据

    // 确认 // 启用数据
    // 连接a_Position变量与分配给他的缓冲区对象
    gl.enableVertexAttribArray(a_Position);

    // 正方形 4个点信息 - 贴图的
    let uvs = new Float32Array([0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0]);

    // 创建buffer
    let uvsBuffer = gl.createBuffer();
    // 将缓冲区对象绑定指定目标
    gl.bindBuffer(gl.ARRAY_BUFFER, uvsBuffer);
    // 像缓冲区写入数据
    gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.STATIC_DRAW);
    // 4: 把带有数据的buffer给arrribute
    // 将缓冲区对象分配给a_Position变量
    let a_Uvs = gl.getAttribLocation(gl.program, "a_Uvs");
    // 连接a_Position变量与分配给他的缓冲区对象
    /*
     
     告诉显卡从当前绑定的缓冲区（bindBuffer() 指定的缓冲区）中读取顶点数据。
     方法绑定当前缓冲区范围到gl.ARRAY_BUFFER,
     成为当前顶点缓冲区对象的通用顶点属性并指定它的布局 (缓冲区对象中的偏移量)。

     */
    gl.vertexAttribPointer(
      a_Uvs,
      2,
      gl.FLOAT,
      false,
      uvs.BYTES_PER_ELEMENT * 2,
      0
    );
    //连接缓冲区
    gl.enableVertexAttribArray(a_Uvs);
  }

  function draw(gl) {
    // 清空画布
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    // 画图
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.drawArrays(gl.POINTS, 0, 4);
  }

  initTextures(gl);
};
