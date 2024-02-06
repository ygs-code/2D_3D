import {getWebGLContext, initShaders} from "@/pages/3d/utils/lib/cuon-utils";
import cat_512 from "@/assets/image/cat_512x512.jpg";
import mask_512x512 from "@/assets/image/mask_512x512.jpg";
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

  initVertexBuffers(gl);

  initTextures(gl);
  function initTextures(gl) {
    let texture1 = gl.createTexture();
    let texture2 = gl.createTexture();

    let u_sampler1 = gl.getUniformLocation(gl.program, "u_sampler1");
    let u_sampler2 = gl.getUniformLocation(gl.program, "u_sampler2");

    let image1 = new Image();
    image1.src = cat_512;
    let image2 = new Image();
    image2.src = mask_512x512;

    // 异步的过程：图片加载完成之后执行这个函数里的任务
    let unit0 = false,
      unit1 = false;
    image1.onload = function () {
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture1);

      // // 对贴图的参数进行设置gl.texParameteri(贴图的种类，参数的名称，具体值)
      // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

      //设置参数，使我们可以渲染任何大小的图像。
      // Set the parameters so we can render any size image.

      gl.texParameteri(
        gl.TEXTURE_2D, // gl.TEXTURE_2D或gl.TEXTURE_BUVE_MAP 分别代表二维纹理和立方体纹理
        gl.TEXTURE_WRAP_S, // 纹理水平填充，默认值gl.REPEAT
        gl.CLAMP_TO_EDGE // 使用纹理图像边缘值
      );

      /*

       REPEAT 重复平铺

       CLAMP_TO_EDGE 使用纹理图像边缘值		
       值	描述
gl.REPEAT	平铺重复
gl.MIRRORED_REPEAT	镜像对称重复
gl.CLAMP_TO_EDGE	使用纹理边缘拉伸值



  那是因为WebGL限制了纹理的维度必须是2的整数次幂，
  2 的幂有 1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 等等。
  'F' 纹理是 256 × 256，256 是 2 的幂。键盘纹理是 320x240，都不是 2 的幂，
  所以显示纹理失败，在着色器中当 texture2D 被调用的时候由于纹理没有正确设置，
  就会使用颜色 (0, 0, 0, 1) 也就是黑色。如果打开 JavaScript 控制台或者浏览器控制台，
  根据浏览器不同可能会显示不同的错误信息，像这样

WebGL: INVALID_OPERATION: generateMipmap: level 0 not power of 2
   or not all the same size
WebGL: drawArrays: texture bound to texture unit 0 is not renderable.
   It maybe non-power-of-2 and have incompatible texture filtering or
   is not 'texture complete'.
解决这个问题只需要将包裹模式设置为 CLAMP_TO_EDGE 并且通过设置过滤器为 LINEAR or NEAREST 来关闭贴图映射。
让我们来更新图像加载的代码解决这个问题，首先需要一个方法判断一个数是不是 2 的幂。
       */
      gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_WRAP_T, // 纹理垂直填充，默认值gl.REPEAT
        gl.CLAMP_TO_EDGE
      );

      gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_MIN_FILTER, // 纹理缩小方法，默认值gl.NEAREST_MIPMAP_LINEAR  // 大的图片贴到小的形状上去
        gl.NEAREST // 使用原纹理上距离映射后像素（新像素）中心最近的那个像素的颜色值，作为新像素的值
      );
      
      gl.texParameteri(
        gl.TEXTURE_2D, // gl.TEXTURE_2D或gl.TEXTURE_BUVE_MAP 分别代表二维纹理和立方体纹理
        gl.TEXTURE_MAG_FILTER, //纹理放大方法  // 小的图片贴到大的形状上去
        gl.NEAREST // 使用原纹理上距离映射后像素（新像素）中心最近的那个像素的颜色值，作为新像素的值
      );

      // 贴图用哪张图片，即用image作为texture
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        image1
      );

      gl.uniform1i(u_sampler1, 0);

      unit0 = true;
      if (unit0 && unit1) draw(gl);
    };

    image2.onload = function () {
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, texture2);

      // // 对贴图的参数进行设置gl.texParameteri(贴图的种类，参数的名称，具体值)
      // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

      //设置参数，使我们可以渲染任何大小的图像。
      // Set the parameters so we can render any size image.

      gl.texParameteri(
        gl.TEXTURE_2D, // gl.TEXTURE_2D或gl.TEXTURE_BUVE_MAP 分别代表二维纹理和立方体纹理
        gl.TEXTURE_WRAP_S, // 纹理水平填充，默认值gl.REPEAT
        gl.CLAMP_TO_EDGE // 使用纹理图像边缘值
      );

      /*

       REPEAT 重复平铺

       CLAMP_TO_EDGE 使用纹理图像边缘值		
       值	描述
gl.REPEAT	平铺重复
gl.MIRRORED_REPEAT	镜像对称重复
gl.CLAMP_TO_EDGE	使用纹理边缘拉伸值



  那是因为WebGL限制了纹理的维度必须是2的整数次幂，
  2 的幂有 1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 等等。
  'F' 纹理是 256 × 256，256 是 2 的幂。键盘纹理是 320x240，都不是 2 的幂，
  所以显示纹理失败，在着色器中当 texture2D 被调用的时候由于纹理没有正确设置，
  就会使用颜色 (0, 0, 0, 1) 也就是黑色。如果打开 JavaScript 控制台或者浏览器控制台，
  根据浏览器不同可能会显示不同的错误信息，像这样

WebGL: INVALID_OPERATION: generateMipmap: level 0 not power of 2
   or not all the same size
WebGL: drawArrays: texture bound to texture unit 0 is not renderable.
   It maybe non-power-of-2 and have incompatible texture filtering or
   is not 'texture complete'.
解决这个问题只需要将包裹模式设置为 CLAMP_TO_EDGE 并且通过设置过滤器为 LINEAR or NEAREST 来关闭贴图映射。
让我们来更新图像加载的代码解决这个问题，首先需要一个方法判断一个数是不是 2 的幂。
       */
      gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_WRAP_T, // 纹理垂直填充，默认值gl.REPEAT
        gl.CLAMP_TO_EDGE
      );

      gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_MIN_FILTER, // 纹理缩小方法，默认值gl.NEAREST_MIPMAP_LINEAR  // 大的图片贴到小的形状上去
        gl.NEAREST // 使用原纹理上距离映射后像素（新像素）中心最近的那个像素的颜色值，作为新像素的值
      );
      gl.texParameteri(
        gl.TEXTURE_2D, // gl.TEXTURE_2D或gl.TEXTURE_BUVE_MAP 分别代表二维纹理和立方体纹理
        gl.TEXTURE_MAG_FILTER, //纹理放大方法  // 小的图片贴到大的形状上去
        gl.NEAREST // 使用原纹理上距离映射后像素（新像素）中心最近的那个像素的颜色值，作为新像素的值
      );

      // 贴图用哪张图片，即用image作为texture
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        image2
      );

      gl.uniform1i(u_sampler2, 1);

      unit1 = true;
      if (unit0 && unit1) draw(gl);
    };
  }

  function initVertexBuffers(gl) {
    // 4个点的坐标信息-形状的4个顶点
    let positions = new Float32Array([
      -0.5, -0.5, 0.0, 0.5, -0.5, 0.0, 0.5, 0.5, 0.0, -0.5, 0.5, 0.0
    ]);

    // 4个点的信息-图片的4个顶点
    let uvs = new Float32Array([0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0]);

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
