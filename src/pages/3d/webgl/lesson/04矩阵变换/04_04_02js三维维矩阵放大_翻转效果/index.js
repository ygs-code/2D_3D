// import WebGLDebugUtils from "@/pages/3d/utils/lib/webgl-debug.js";
// import WebGLUtils from "@/pages/3d/utils/lib/webgl-utils";
// import {getWebGLContext, initShaders} from "@/pages/3d/utils/lib/cuon-utils";
import initShaders from "@/pages/3d/utils/initShader.js";
import VSHADER_SOURCE from "./index.vert";
import FSHADER_SOURCE from "./index.frag";

import "./index.less";

window.onload = function () {
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

  // 定点位置
  const vereices = new Float32Array(
    new Function(`return [
      0.0, 0.1,
      -0.1, -0.1,
      0.1, -0.1
     ]`)()
  );

  let SIZE = vereices.BYTES_PER_ELEMENT;
  // 创建buffer
  const vertexBuffer = gl.createBuffer();
  // 绑定buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  //3.向缓冲区对象中写入数据
  gl.bufferData(gl.ARRAY_BUFFER, vereices, gl.STATIC_DRAW);
  //4.将缓冲区对象分配给a_Position变量
  const a_PointSize = gl.getAttribLocation(gl.program, "a_Position");
  // WebGL系统会根据stride和offset参数从缓冲区中正确地抽取出数据，依次赋值给着色器中的各个attribute变量并进行绘制
  // stride（第5个参数）为FSIZE*5意味着verticesColors数据中5个数为一组是属于一个顶点的所有数据(包括顶点坐标和颜色大小等)，
  // offset（第6个参数）为0意味着从5个数一组的单元中的第0个数开始取值（offset代表当前考虑的数据项距离首个元素的距离，即偏移参数）
  // size（第2个参数）为2意味着从5个数一组的单元中取出两个数，
  // type(第3个参数)为gl.FLOAT意味着数据类型为浮点数
  // normalize(第4个参数)为false意味着不对这些数据进行归一化操作
  /*
     
     告诉显卡从当前绑定的缓冲区（bindBuffer() 指定的缓冲区）中读取顶点数据。
     方法绑定当前缓冲区范围到gl.ARRAY_BUFFER,
     成为当前顶点缓冲区对象的通用顶点属性并指定它的布局 (缓冲区对象中的偏移量)。


 
index：第几个属性，从0开始取，0，1，2，顺序自己定义，例如顶点位置，纹理，法线

这里只有顶点位置，也只能讨论顶点位置，所以为0

size：一个顶点所有数据的个数，这里每个顶点又两个浮点数属性值，所以是2

type：顶点描述数据的类型，这里position数组中的数据全部为float，所以是GL_FLOAT

normalized：是否需要显卡帮忙把数据归一化到-1到+1区间，这里不需要，所以设置GL_FALSE

stride：一个顶点占有的总的字节数，这里为两个float，所以是sizeof(float)*2

pointer：当前指针指向的vertex内部的偏离字节数，可以唯一的标识顶点某个属性的偏移量
这里是指向第一个属性，顶点坐标，偏移量为0
 
*/
  gl.vertexAttribPointer(a_PointSize, 2, gl.FLOAT, false, SIZE * 2, 0);

  // 连接a_Position变量与分配给他的缓冲区对象
  gl.enableVertexAttribArray(a_PointSize);

  // 定点位置
  const colors = new Float32Array(
    new Function(`return [
      1.0, 0.0, 0.0,
      0.0, 1.0, 0.0,
      0.0, 0.0, 1.0,
     ]`)()
  );

  // 创建buffer
  const colorsBuffer = gl.createBuffer();
  // 绑定buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, colorsBuffer);
  //3.向缓冲区对象中写入数据
  gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
  //4.将缓冲区对象分配给a_Position变量
  const a_colors = gl.getAttribLocation(gl.program, "a_colors");
  // WebGL系统会根据stride和offset参数从缓冲区中正确地抽取出数据，依次赋值给着色器中的各个attribute变量并进行绘制
  // stride（第5个参数）为FSIZE*5意味着verticesColors数据中5个数为一组是属于一个顶点的所有数据(包括顶点坐标和颜色大小等)，
  // offset（第6个参数）为0意味着从5个数一组的单元中的第0个数开始取值（offset代表当前考虑的数据项距离首个元素的距离，即偏移参数）
  // size（第2个参数）为2意味着从5个数一组的单元中取出两个数，
  // type(第3个参数)为gl.FLOAT意味着数据类型为浮点数
  // normalize(第4个参数)为false意味着不对这些数据进行归一化操作
  /*
       
       告诉显卡从当前绑定的缓冲区（bindBuffer() 指定的缓冲区）中读取顶点数据。
       方法绑定当前缓冲区范围到gl.ARRAY_BUFFER,
       成为当前顶点缓冲区对象的通用顶点属性并指定它的布局 (缓冲区对象中的偏移量)。
  
  
   
  index：第几个属性，从0开始取，0，1，2，顺序自己定义，例如顶点位置，纹理，法线
  
  这里只有顶点位置，也只能讨论顶点位置，所以为0
  
  size：一个顶点所有数据的个数，这里每个顶点又两个浮点数属性值，所以是2
  
  type：顶点描述数据的类型，这里position数组中的数据全部为float，所以是GL_FLOAT
  
  normalized：是否需要显卡帮忙把数据归一化到-1到+1区间，这里不需要，所以设置GL_FALSE
  
  stride：一个顶点占有的总的字节数，这里为两个float，所以是sizeof(float)*2
  
  pointer：当前指针指向的vertex内部的偏离字节数，可以唯一的标识顶点某个属性的偏移量
  这里是指向第一个属性，顶点坐标，偏移量为0
   
  */
  gl.vertexAttribPointer(
    a_colors,
    3,
    gl.FLOAT,
    false,
    a_colors.BYTES_PER_ELEMENT * 3,
    0
  );

  // 连接a_Position变量与分配给他的缓冲区对象
  gl.enableVertexAttribArray(a_colors);

  // gl.enable(gl.CULL_FACE);

  let θ = 0; // theta 打印出来θ符号
  let tx = -1;
  let ty = 1;
  let tz = 1;
  let directionX = "add";
  let directionY = "add";

  let render = () => {
    if (tx > 1) {
      directionX = "subtraction";
    }

    if (tx < -1) {
      directionX = "add";
    }

    // if(directionX==='add'){
    //   // tx += 0.1;
    //   tx += 0.1;
    // }else{
    //   // tx -= 0.1;
    //   tx -= 0.1;
    // }

    // if(ty>1){
    //   directionY='subtraction';
    // }

    // if(ty<-1){
    //   directionY='add';
    // }

    // if(directionY==='add'){
    //   // tx += 0.1;
    //   ty += 0.1;
    // }else{
    //   // tx -= 0.1;
    //   ty -= 0.1;
    // }

    // ty += 0.1;
    // tz += 0.1;

    //获取矩阵uniform变了缓存的地址
    const u_Matrix = gl.getUniformLocation(gl.program, "u_Matrix");
    let rad = (θ * Math.PI) / 180;
    const cosθ = Math.cos(rad);
    const sinθ = Math.sin(rad);
    const matrix = new Function(
      "sx", // 传参
      "sy",
      "sz",
      `
       return   [
         sx,0.0,0.0,
         0.0,sy,0.0,
         0.0,0.0,1.0,
      ];
    `
    )(tx, ty); // 传参

    // 绑定 矩阵
    gl.uniformMatrix3fv(u_Matrix, false, matrix);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    requestAnimationFrame(render);
  };

  render();
};
