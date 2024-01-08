import initShaders from "@/pages/3d/utils/initShader";
import {resizeCanvasToDisplaySize} from "@/pages/3d/utils/webgl-utils.js";
// import m4 from "./m4";
import FSHADER_SOURCE from "./index.frag";
import VSHADER_SOURCE from "./index.vert";
import controller from "@/pages/3d/utils/controller.js";
// import {createHtmlMatrix} from "@/pages/3d/utils/matrix.js";
import {createHtmlMatrix} from "@/pages/3d/utils/matrix.js";
import m4 from "@/pages/3d/utils/comments/m4";
import * as glMatrix from "gl-matrix";
import {Matrix4}  from "@/pages/3d/utils/lib/cuon-matrix";
import sky  from "@/assets/image/sky.jpg";
import "./index.less";
// import "@/pages/index.less";
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

 
  const program = initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
  if (!program) {
    console.log("failed to initialize shaders");
    return;
  }

  function main() {
    
    // 
    var n = initVertexBuffers(gl);
    if (n < 0) {
      console.log('Failed to set the vertex information');
      return;
    }
  
    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
  
    
   // Set texture
   if (!initTextures(gl, n)) {
    console.log('Failed to intialize the texture.');
    return;
  }


  }
  
  function initVertexBuffers(gl) {
    /*

    webgl 坐标
            +1
    
     -1             +1      
    
            -1


    -1.0,  1.0,        1.0, 1.0,


    -1.0, -1.0,        1.0, -1.0,


    纹理坐标
  
    0.0, 1.0            1.0,1.0,

    0.0, 0.0            1.0, 0.0   

    */
   // 顶点位置
    var verticesTexCoords = new Float32Array([
      /*
      两个三角形
      -0.5,  0.5,
       -0.5,  -0.5,
       0.5,  -0.5,

       0.5,  -0.5,
       0.5,  0.5,
       -0.5,  0.5,
      */
       -1.0,  1.0,  0.0, 1.0,
       -1.0,  -1.0, 0.0, 0.0, 
       1.0,   1.0,   1.0, 1.0,
       1.0,  -1.0,   1.0, 0.0,
    ]);
    var n = 4; // The number of vertices
  
    // Create a buffer object

   
    // 创建buffer
    var vertexTexCoordBuffer = gl.createBuffer();  
    if (!vertexTexCoordBuffer) {
      console.log('Failed to create the buffer object');
      return false;
    }
  
    // Write the vertex coordinates and colors to the buffer object
    // 绑定buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
    // 往buffer 写入数据到缓存中
    gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);
  
    var FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;
    //Get the storage location of a_Position, assign and enable buffer
    // 获取a_Position shader的地址
    var a_Position = gl.getAttribLocation(program, 'a_Position');
    if (a_Position < 0) {
      console.log('Failed to get the storage location of a_Position');
      return -1;
    }
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
    gl.enableVertexAttribArray(a_Position);  // Enable the assignment of the buffer object

 
      // Get the storage location of a_TexCoord
  var a_TexCoord = gl.getAttribLocation(program, 'a_TexCoord');
    if(a_TexCoord<0){
      console.log('Failed to get the storage location of a_TexCoord');
      return false;
    }

    // v_TexCoord
    // //将缓冲区对象分配给a_TexCoord变量
    gl.vertexAttribPointer(a_TexCoord,2,gl.FLOAT,false,FSIZE*4,FSIZE*2);
    gl.enableVertexAttribArray(a_TexCoord);
  
    return n;
  }
  


   function loadTexture(gl,n,texture,u_Sampler,image){
       //翻转图像的y轴
       gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,1);
       //启用纹理unit0
       gl.activeTexture(gl.TEXTURE0);
       //将纹理对象绑定到目标
       gl.bindTexture(gl.TEXTURE_2D,texture);
       //设置纹理参数
       gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
      //设置纹理图像
      gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,image);

     //将纹理单元0设置为采样器
     gl.uniform1i(u_Sampler,0);

     // 清除画板
     gl.clear(gl.COLOR_BUFFER_BIT);
    //  绘制矩形
     gl.drawArrays(gl.TRIANGLE_STRIP , 0 , n );

   }

  function initTextures(gl,n){
    // 创建纹理
     var texture = gl.createTexture();
     if(!texture){
      console.log('Failed to create the texture object');
      return false;
     }
   //获取u Sampler的存储位置
    var u_Sampler = gl.getUniformLocation(program,'u_Sampler');

    if(!u_Sampler){
      console.log('Failed to get the storage location of u_Sampler');
      return false;
    }
    var image = new Image();
    if(!image){
      console.log('创建图片对象错误');
      return ;
    }

    console.log(0);
    debugger;
    image.src=sky;
    image.onload = function(){
      console.log(1111111111);
              // loadTexture()
              loadTexture(gl, n, texture, u_Sampler, image);
    };
    image.onerror=function(){
       console.error('图片加载失败');
    };
  }
  

main(); 
};
