import initShaders from "@/pages/3d/utils/initShader";
import {createBufferInfoFromArrays ,createProgramFromScripts, resizeCanvasToDisplaySize ,setUniforms, createProgramInfo ,setBuffersAndAttributes} from "@/pages/3d/utils/webgl-utils.js";
import FSHADER_SOURCE from "./index.frag";
import VSHADER_SOURCE from "./index.vert";
import {getWebGLContext,} from "@/pages/3d/utils/lib/cuon-utils";
// import PICK_FSHADER_SOURCE from "./pick-fragment.frag";
// import PICK_VSHADER_SOURCE from "./pick-vertex.vert";
import {createHtmlMatrix} from "@/pages/3d/utils/matrix.js";
import primitives from "@/pages/3d/utils/primitives.js";
import m4 from "@/pages/3d/utils/m4";
import chroma from "@/pages/3d/utils/chroma.min";
import * as glMatrix from "gl-matrix";
import {matrixVectorMultiply,makeScale, makeZRotation,makeInverse,makeLookAt,makeIdentity,makeXRotation,makeYRotation,makeTranslation,matrixMultiply,makePerspective} from "@/pages/3d/utils/webgl-3d-math.js";
import controller from "@/pages/3d/utils/controller.js";
import fTexture from "static/image/f-texture.png";
import leaves from "static/image/leaves.jpg";
import example from "static/image/mip-low-res-example.png";
import keyboard from "static/image/keyboard.jpg";
import noodles from "static/image/noodles.jpg"; 



import * as dat from "dat.gui";
import "./index.less";
import "@/pages/index.less";
import FlyMath from "@/pages/3d/utils/flymath_min";
 

 window.onload = function () {
   // Get A WebGL context
   var canvas = document.createElement("canvas", {antialias: false});
   var dpr = window.devicePixelRatio || 1;
   canvas.style.width = 400 + "px";
   canvas.style.height = 300 + "px";
   canvas.width = Math.floor(canvas.width * dpr);
   canvas.height = Math.floor(canvas.height * dpr);
 
   document.body.appendChild(canvas);
  if (!canvas.getContext) return;
  let gl_context = canvas.getContext("webgl");
 

 
     

  
//循环控制参数
var curTime;
var isStop=1;
    
//偏移步长
var cur_x = 0;
var x_step = 0.01;
     
//定义Camera位置
var camera = [0,0,1];
var camera_to = [0,0,0];
var camera_up = [0,1,0];
     
//定义颜色数组
var color = [1,0,0];
    
//定义camera矩阵和工程矩阵
var matView = new Array;
var matProject = new Array;
     
//定义纹理图片
var curImg;
var imgSrc = keyboard;
     
//时间函数
function onTime()
{
    cur_x += x_step;
        
    if(cur_x>0.5 || cur_x<-0.5)
        x_step *=-1;
        
    draw_quad();  
    // curTime = setTimeout("onTime()",100);
}
      
//处理点击事件
function click(ev)
{
    if(isStop==1)
        isStop=0;
    else
        isStop=1;
          
    if(isStop==0)
        onTime();
    else
        clearTimeout(curTime);
}
     
//加载纹理图片
function pre_loadImg()
{ 
    curImg = new Image();
    curImg.src = imgSrc;
         
    curImg.onload = function()  {
        draw_quad();
        return;
    };
         
    curImg.onerror = function()    {
        alert("加载纹理图片失败!");
        return;
    };   
}
     
//初始化WebGL
function init_webgl()
{
//   var canvas = document.getElementById("webGL");
       
//   if(!canvas){
//     alert("获取<Canvas>标签失败！");
//     return;
// }
     
//   //获取webGL统计图上下文
//   gl_context = canvas.getContext('webgl',
//                 { antialias:true,
//                                   depth:true,
//                   stencil:true});
     
//   if(!gl_context){
//     alert("获取WebGL上下文失败！");
//     return;
//   }
     
//   canvas.width = $("#area").width();
//   canvas.height = $("#area").width()*3/5;
       
  canvas.onmousedown = function(ev){ click(ev);};
     
  //设置视口大小
  gl_context.viewport(0,0,canvas.width,canvas.height);
     
  
    /* eslint-disable   */

  //设置matView和matProject矩阵
  FlyMath.Matrix.LookAtRH(matView,camera,camera_to,camera_up);
  FlyMath.Matrix.PerspectiveRH(matProject,Math.PI/3,1,1,100);
  
    /* eslint-disable   */

  pre_loadImg();
}
     
//绘制正方形
function draw_quad()
{
//清空canvas的背景颜色
  gl_context.clearColor(0,0,0.5,1);
     
  //清空webgl颜色缓冲区和深度缓冲区里的内容
  gl_context.clear(gl_context.COLOR_BUFFER_BIT | gl_context.DEPTH_BUFFER_BIT);
  //开启深度缓冲检测
  gl_context.enable(gl_context.DEPTH_TEST);

      // setup GLSL program
      var shaderProgram = initShaders(gl_context, VSHADER_SOURCE, FSHADER_SOURCE);
      gl_context.useProgram(shaderProgram);
    
   
//绑定shader中的参数变量
    var shader_pos = gl_context.getAttribLocation(shaderProgram, "a_Position");
    var shader_uv = gl_context.getAttribLocation(shaderProgram, "a_UV");
    
    var shaderModelViewMatrixUniform = gl_context.getUniformLocation(shaderProgram,"modelViewMatrix");
    var shaderProjectionMatrixUniform = gl_context.getUniformLocation(shaderProgram,"projectionMatrix");
    var shaderOffsetMatrixUniform = gl_context.getUniformLocation(shaderProgram,"offsetMatrix");
    var SamplerUniform = gl_context.getUniformLocation(shaderProgram,"A_Texture");
     
/* 正方形顶点位置
    0 , 1
    2 , 3 
*/
    var vertices = new Float32Array([
        -0.3, 0.3,  -1,
        0.3,  0.3,  -1,
        -0.3, -0.3, -1,
        0.3,  -0.3,  -1
    ]);
    var indices =  [0,1,2,1,2,3];
    var uvs = [
        0,0,
        1,0,
        0,1,
        1,1
    ];
    var matOffset = [];
    FlyMath.Matrix.Identity(matOffset);
     
    var quad_buf = gl_context.createBuffer();
    var indexBuffer = gl_context.createBuffer();
    var uvBuffer = gl_context.createBuffer();
                
//使用选择的程序，激活缓冲区，渲染
    gl_context.useProgram(shaderProgram);
    gl_context.enableVertexAttribArray(shader_pos);
    gl_context.enableVertexAttribArray(shader_uv);
     
    gl_context.bindBuffer(gl_context.ARRAY_BUFFER, quad_buf);
    gl_context.bufferData(gl_context.ARRAY_BUFFER, new Float32Array(vertices), gl_context.STATIC_DRAW);
    gl_context.vertexAttribPointer(shader_pos, 3, gl_context.FLOAT, false, 0, 0);
     
    gl_context.bindBuffer(gl_context.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl_context.bufferData(gl_context.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl_context.STATIC_DRAW);
         
    gl_context.bindBuffer(gl_context.ARRAY_BUFFER,uvBuffer);
    gl_context.bufferData(gl_context.ARRAY_BUFFER,new Float32Array(uvs),gl_context.STATIC_DRAW);
    gl_context.vertexAttribPointer(shader_uv, 2, gl_context.FLOAT, false, 0, 0);
     
//绑定矩阵
    gl_context.uniformMatrix4fv(shaderModelViewMatrixUniform,false,matView);
    gl_context.uniformMatrix4fv(shaderProjectionMatrixUniform,false,matProject);
    gl_context.uniformMatrix4fv(shaderOffsetMatrixUniform,false,matOffset);
         
//绑定纹理图片，设置纹理坐标方式
    var img_texture = gl_context.createTexture();
    gl_context.bindTexture(gl_context.TEXTURE_2D, img_texture);
    gl_context.texImage2D(gl_context.TEXTURE_2D, 0, gl_context.RGBA, gl_context.RGBA, gl_context.UNSIGNED_BYTE, curImg);
     
    gl_context.texParameteri(gl_context.TEXTURE_2D, gl_context.TEXTURE_MIN_FILTER, gl_context.NEAREST);
    gl_context.texParameteri(gl_context.TEXTURE_2D, gl_context.TEXTURE_MAG_FILTER, gl_context.NEAREST);
    gl_context.texParameteri(gl_context.TEXTURE_2D, gl_context.TEXTURE_WRAP_S, gl_context.CLAMP_TO_EDGE);
    gl_context.texParameteri(gl_context.TEXTURE_2D, gl_context.TEXTURE_WRAP_T, gl_context.CLAMP_TO_EDGE);
         
    gl_context.activeTexture(gl_context.TEXTURE0);
    gl_context.bindTexture(gl_context.TEXTURE_2D, img_texture);
         
    gl_context.uniform1i(SamplerUniform, 0);
         
    //关闭混合功能　
    gl_context.disable(gl_context.BLEND);
    gl_context.drawElements(gl_context.TRIANGLES,indices.length,gl_context.UNSIGNED_BYTE, 0);
        
//设置第二个正方形的偏移矩阵
    FlyMath.Matrix.Identity(matOffset);
    FlyMath.Matrix.Translation(matOffset,cur_x,0.0,0.1);
    gl_context.uniformMatrix4fv(shaderOffsetMatrixUniform,false,matOffset);
        
    //开启混合功能
    gl_context.enable(gl_context.BLEND);
    //混合函数设置
    gl_context.blendFunc(gl_context.DST_COLOR,gl_context.ONE);
    gl_context.drawElements(gl_context.TRIANGLES,indices.length,gl_context.UNSIGNED_BYTE, 0); 
}
  
init_webgl();
 
//    main();
 };