import initShaders from "@/pages/3d/utils/initShader";
import {
  createBufferInfoFromArrays,
  createProgramFromScripts,
  resizeCanvasToDisplaySize,
  setUniforms,
  createProgramInfo,
  setBuffersAndAttributes
} from "@/pages/3d/utils/webgl-utils.js";
import FSHADER_SOURCE from "./index.frag";
import VSHADER_SOURCE from "./index.vert";
import {getWebGLContext} from "@/pages/3d/utils/lib/cuon-utils";
// import PICK_FSHADER_SOURCE from "./pick-fragment.frag";
// import PICK_VSHADER_SOURCE from "./pick-vertex.vert";
import {createHtmlMatrix} from "@/pages/3d/utils/matrix.js";
import primitives from "@/pages/3d/utils/primitives.js";
import m4 from "@/pages/3d/utils/m4";
import chroma from "@/pages/3d/utils/chroma.min";
import * as glMatrix from "gl-matrix";
import {
  matrixVectorMultiply,
  makeScale,
  makeZRotation,
  makeInverse,
  makeLookAt,
  makeIdentity,
  makeXRotation,
  makeYRotation,
  makeTranslation,
  matrixMultiply,
  makePerspective,
  
} from "@/pages/3d/utils/webgl-3d-math.js";
import controller from "@/pages/3d/utils/controller.js";
import fTexture from "static/image/f-texture.png";
import leaves from "static/image/leaves.jpg";
import example from "static/image/mip-low-res-example.png";
import keyboard from "static/image/keyboard.jpg";
import noodles from "static/image/noodles.jpg";
import {fabric} from 'fabric'; // browser
import panda from 'static/image/panda.png'; //  
import material_kraft from 'static/image/material_kraft.jpeg'; //  
import back from 'static/image/back.png'; //  
import back1 from 'static/image/back1.png'; //  
import back2 from 'static/image/back2.png'; //  
import back3 from 'static/image/back3.png'; //  
import mm from 'static/image/112.png'; //  
import * as dat from "dat.gui";
import  {
  texcoords,
  geometry
}  from "./data";
import  {stabilization} from 'utils'; //  
 
import "./index.less";
import "@/pages/index.less";
import * as SPECTOR from 'spectorjs'; // browser
// var SPECTOR = require("spectorjs");
// var spector = new SPECTOR.Spector();
// spector.displayUI();

window.onload = function () {
  

  class ThreeDimensions {
    constructor(options) {
      this.options = options;
      this.angle=0;
      this.parmas={
        color:'#333333',
        brush:false,
        font:false,
        translation:{
          x:0,
          y:0,
          z:0,
        },
        scale:{
          x:-1,
          y:1,
          z:1,
        },
        rotation:{
          angleX:0,
          angleY:0,
          angleZ:0,
        },
        eye:{
          z:-2
        },
        lineWidth:5,
        fontSize:12
      };
      // this.init();
    }
   async  init(main){
      this.main=main;
      this.createCanvas();
      this.createProgram();
      this.attribUniformVaring();
 
      // 定点
      this.positions = this.getGeometry();
      
      this.setBuffer({
        location:this.positionLocation,
        groupNum:3,
        FSIZE:this.positions.BYTES_PER_ELEMENT
      });
      
      this.setBufferData(this.positions);
      this.texcoords = this.getTexcoords( );
      this.setBuffer({
        location: this.texcoordLocation,
        groupNum:2,
        FSIZE: this.texcoords.BYTES_PER_ELEMENT
      });
      this.setBufferData(this.texcoords);

    
    // await this.setTexure0();
    // await this.setTexure1();



    //  setInterval(()=>{
    //   this.angle+=1;
    //   this.drawScene(new Date().getTime());
    //  },1000);



     // 控制 参数改变
   const  {
    gui,
    folder
  } = controller({
      onChange: () => {
        this.drawScene(new Date().getTime());
        // drawScene(parmas);
        // render(settings);

      },
      parmas: this.parmas,
      options: [
        {
          min: 0,
          max: 1,
          step: 0.001,
          key: "translation.x",
          name: "位移X",
          // onChange: (value) => {},
          onFinishChange: (value) => {
            // 完全修改停下来的时候触发这个事件

          }
        },
        {
          min: -1,
          max: 1,
          step: 0.01,
          key: "translation.y",
          name: "位移Y",
          onChange: (value) => {},
          onFinishChange: (value) => {
            // 完全修改停下来的时候触发这个事件
        
          }
        },
        {
          min: -1,
          max: 1,
          step: 0.01,
          key: "translation.z",
          name: "位移Z",
          onChange: (value) => {},
          onFinishChange: (value) => {
            // 完全修改停下来的时候触发这个事件
            
          }
        },

        {
          min: -1,
          max: 1,
          step: 0.001,
          key: "scale.x",
          name: "放大X",
          // onChange: (value) => {},
          onFinishChange: (value) => {
            // 完全修改停下来的时候触发这个事件
          
          }
        },
        {
          min: -1,
          max: 1,
          step: 0.01,
          key: "scale.y",
          name: "放大Y",
          onChange: (value) => {},
          onFinishChange: (value) => {
            // 完全修改停下来的时候触发这个事件
            
          }
        },
        {
          min: -1,
          max: 1,
          step: 0.01,
          key: "scale.z",
          name: "放大Z",
          onChange: (value) => {},
          onFinishChange: (value) => {
            // 完全修改停下来的时候触发这个事件
            
          }
        },

        {
          min: 0,
          max: 360,
          step: 0.0001,
          key: "rotation.angleX",
          name: "旋转X",
          // onChange: (value) => {},
          onFinishChange: (value) => {
            // 完全修改停下来的时候触发这个事件
            
          }
        },
        {
          min: 0,
          max: 360,
          step: 0.0001,
          key: "rotation.angleY",
          name: "旋转Y",
          onChange: (value) => {},
          onFinishChange: (value) => {
            // 完全修改停下来的时候触发这个事件
            
          }
        },
        {
          min: 0,
          max: 360,
          step: 0.0001,
          key: "rotation.angleZ",
          name: "旋转Z",
          onChange: (value) => {},
          onFinishChange: (value) => {
            // 完全修改停下来的时候触发这个事件
            
          }
        },
        {
          min: -10,
          max: -2,
          step: 0.0001,
          key: "eye.z",
          name: "相机eye.z",
          onChange: (value) => {},
          onFinishChange: (value) => {
            // 完全修改停下来的时候触发这个事件
            
          }
        },
        {
          min: 1,
          max: 20,
          step: 0.0001,
          key: "lineWidth",
          name: "画笔线宽",
          onChange: (value) => {
            // console.log('value==',value);
            // debugger;
            // console.log(this);
            // debugger;
            this.main.twoDimension.setLineWidth(value);
          },
          onFinishChange: (value) => {
            // 完全修改停下来的时候触发这个事件
            
          }
        },
        {
          min: 12,
          max: 100,
          step: 0.0001,
          key: "fontSize",
          name: "字体大小",
          onChange: (value) => {
            // console.log('value==',value);
            // debugger;
            // console.log(this);
            // debugger;
            this.main.twoDimension.setFontSize(value);
          },
          onFinishChange: (value) => {
            // 完全修改停下来的时候触发这个事件
            
          }
        }
      ]
  });

  
    folder.addColor(this.parmas, "color").name('颜色值')   .onChange((value) => {
      // 回调函数
      this.main.twoDimension.setColor(value);
    });
    folder.add(this.parmas, "brush").name('选择画笔').listen().onChange((value) => {
      // setBrush(flag){
      //   this.editFabricCanvas.set({
      //     isDrawingMode: flag // 开启绘画模式
      //   });
      // }
      this.parmas.font=false;
      // 回调函数
      this.main.twoDimension.setBrush(value);
      // brush:false,
      // font:false,
    });



    folder.add(this.parmas, "font").name('字体').listen().onChange((value) => {
      // setBrush(flag){
      //   this.editFabricCanvas.set({
      //     isDrawingMode: flag // 开启绘画模式
      //   });
      // }
      // 回调函数
      this.parmas.brush=false;
      this.main.twoDimension.setBrush(false);
      this.main.twoDimension.setFont(value);
    });
    }


  async setTexure0(src){
    await  this.setTexture(
      {
        src,
        index:0,
        activeTextureIndex:this.gl.TEXTURE0,
        uniformLocation:this.u_Sampler0,
        // img:this.main.twoDimension.editCtx.canvas
      }
    );
   }
   async setTexure1(src){
    await  this.setTexture(
      {
        src,
        index:1,
        activeTextureIndex:this.gl.TEXTURE1,
        uniformLocation:this.u_Sampler1
      }
    ); 
   }
   isPowerOf2(value) {
      return (value & (value - 1)) == 0;
    }

    degToRad(d) {
      return (d * Math.PI) / 180;
    }
    loadImage(src){
      return  new Promise((reslove,reject)=>{
          const img = new Image();
          img.src=src;
          img.onload= function (){
            reslove(this);
        };
        img.onerror=function (error){
          reject(error);
        };
      });
  }
     // Draw the scene.
    drawScene(time) {

     const {
        translation={
          // x:0,
          // y:0,
          // z:0,
        },
        scale={
          // x:0,
          // y:0,
          // z:0,
        },
        rotation:{
          angleX,
          angleY,
          angleZ,
        }={
     
        },
        eye={}

      }= this.parmas;

    const gl=this.gl;
    var fieldOfViewRadians = this.degToRad(60);
    var modelXRotationRadians =  this.degToRad(0);
    var modelYRotationRadians =  this.degToRad(0);
    // Get the starting time.
    var then = 0;
      // convert to seconds
      time *= 0.001;
      // Subtract the previous time from the current time
      var deltaTime = time - then;
      // Remember the current time for the next frame.
      then = time;

      // Animate the rotation
      modelYRotationRadians += -0.7 * deltaTime;
      modelXRotationRadians += -0.4 * deltaTime;

      // Clear the canvas AND the depth buffer.
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      // Compute the projection matrix
      var aspect = this.canvas.clientWidth / this.canvas.clientHeight;
      var zNear = 1;
      var zFar = 1000;

      // perspective: perspective,

      // out, fovy, aspect, near, far
      // var projectionMatrix =  glMatrix.mat4.perspective([
      //   1,0,0,0,
      //   0,1,0,0,
      //   0,0,1,0,
      //   0,0,0,1,
      // ], fieldOfViewRadians,aspect,zNear,zFar);

      // 透视投影  有问题 明天换一个
      var projectionMatrix = makePerspective(
        fieldOfViewRadians,
        aspect,
        zNear,
        zFar
      );

      // glMatrix.mat4.ortho(projMatrix, -1, 1, -1, 1, 1, 100);
      // var cameraPosition = [0, 0, 2];
      // var target = [0, 0, 0];
      // var up = [0, 1, 0];
     

   

      var cameraPosition = [0, 0, eye.z];
      var target = [0, 0, -1];
      var up = [0, 1, 0];


      // Compute the camera's matrix using look at.
      // 相机
      var cameraMatrix = makeLookAt(cameraPosition, target, up);

      // Make a view matrix from the camera matrix.
      // 视图矩阵
      var viewMatrix = makeInverse(cameraMatrix);

      //偏移
      var translationMatrix = makeTranslation(0, 0, 0);

      /*
      
      
      弧度
      */ 
      // 旋转

      var scaleMatrix =  makeScale(scale.x,scale.y,scale.z);
      // var scaleMatrix =  makeScale(scale.x,scale.y,)

      var xRotationMatrix = makeXRotation(this.degToRad(angleX));
      var yRotationMatrix = makeYRotation(this.degToRad(angleY));
      var zRotationMatrix = makeZRotation(this.degToRad(angleZ));



      /*
         s r t
      */

      // Multiply the matrices.
      // 矩阵相乘
      var matrix = scaleMatrix;
      // var matrix = yRotationMatrix;
      matrix = matrixMultiply(matrix, zRotationMatrix);
      matrix = matrixMultiply(matrix, yRotationMatrix);
      matrix = matrixMultiply(matrix, xRotationMatrix);
      matrix = matrixMultiply(matrix, translationMatrix);
      matrix = matrixMultiply(matrix, viewMatrix);
      matrix = matrixMultiply(matrix, projectionMatrix);

      // Set the matrix.
      gl.uniformMatrix4fv(this.matrixLocation, false, matrix);

      // Draw the geometry. 定点坐标渲染
      gl.drawArrays(
            gl.TRIANGLES, 0, 6 * 6
        );
      // requestAnimationFrame((...ags)=>{
      //   this.drawScene(...ags);
      // });
    
      // requestAnimationFrame(this.drawScene);
    }
    async setTexture({
      src,
      index,
      activeTextureIndex,
      uniformLocation,
      img
    }){

      if(!img){
        img = await this.loadImage(src);
      }

  

      const gl=this.gl;
         // Create a texture.
    // 创建纹理
    var texture = gl.createTexture();
   //翻转图像的y轴
   gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,1);
  // 翻转图像的y轴
  // gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);// Flip the image's y-axis
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
      //激活 启用纹理unit0
   gl.activeTexture(activeTextureIndex);

    // gl.bindTexture(gl.TEXTURE_2D, texture);
    // Fill the texture with a 1x1 blue pixel.
    // 用1x1的蓝色像素填充纹理。 可以设置不同的贴图方式
    // gl.texImage2D(
    //   gl.TEXTURE_2D,
    //   0,
    //   gl.RGBA,
    //   1,
    //   1,
    //   0,
    //   gl.RGBA,
    //   gl.UNSIGNED_BYTE,
    //   new Uint8Array([0, 0, 255, 255])
    // );

   

    
    // Asynchronously load an image
    //异步加载图像
    // var image = new Image();
    // image.src = material_kraft;
    // image.addEventListener("load",   () =>{
      // Now that the image has loaded make copy it to the texture.
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        img
      );

  
      // Check if the image is a power of 2 in both dimensions.
      if (this.isPowerOf2(img.width) && this.isPowerOf2(img.height)) {
        // Yes, it's a power of 2. Generate mips.
        gl.generateMipmap(gl.TEXTURE_2D);
      } else {
        // No, it's not a power of 2. Turn of mips and set wrapping to clamp to edge
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      }
 

      // this.u_Sampler1 = gl.getUniformLocation

      gl.uniform1i(uniformLocation, index);   // 将纹理单元传递给采样器 Pass the texure unit to u_Sampler
      
      
    // });
    }

      // Fill the buffer with texture coordinates the cube.
    getTexcoords() {
         return   new Float32Array(texcoords); 
    }

  // Fill the buffer with the values that define a cube.
      getGeometry( ) {
          return   new Float32Array(geometry);
      }
    setBufferData(positions){
      const gl=this.gl;
      this.gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    }
    setBuffer(
      {
        location,
        groupNum,
        type= this.gl.FLOAT,
        // FSIZE,
        index=0
      }
      ){
      const gl=this.gl;
      const   FSIZE =   location.BYTES_PER_ELEMENT;
      var buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  /*
     
     告诉显卡从当前绑定的缓 冲区（bindBuffer() 指定的缓冲区）中读取顶点数据。
     方法绑定当前缓冲区范围到gl.ARRAY_BUFFER,
     成为当前顶点缓冲区对象的通用顶点属性并指定它的布局 (缓冲区对象中的偏移量)。

     */
  gl.vertexAttribPointer(
    location, // 变量 指定要修改的顶点属性的索引。
    groupNum, // size 2个数据为一组 告诉三个点位一组颜色  1, 2, 3, or 4. 指定每个顶点属性的组成数量，必须是 1，2，3 或 4。
    type, //type gl.FLOAT: 32-bit IEEE floating point number 32 位 IEEE 标准的浮点数
    false, // normalized 当转换为浮点数时是否应该将整数数值归一化到特定的范围。
    FSIZE * groupNum, // stride 以字节为单位指定连续顶点属性开始之间的偏移量 (即数组中一行长度)。不能大于 255。如果 stride 为 0，则假定该属性是紧密打包的，即不交错属性，每个属性在一个单独的块中，下一个顶点的属性紧跟当前顶点之后。
    FSIZE * index  //offset 指定顶点属性数组中第一部分的字节偏移量。必须是类型的字节长度的倍数。
  ); //  告诉gl如何解析数据

  // 5.确认 // 启用数据
  // 连接a_Position变量与分配给他的缓冲区对象
  gl.enableVertexAttribArray(location);

    }
    createCanvas() {
      const {elId}=this.options; 
      // Get A WebGL context
      var canvas = document.getElementById(elId, {antialias: false});
      var dpr = window.devicePixelRatio || 1;
      // canvas.style.width = 400 + "px";
      // canvas.style.height = 300 + "px";
      canvas.width = Math.floor(canvas.width * dpr);
      canvas.height = Math.floor(canvas.height * dpr);

      // document.body.appendChild(canvas);
      if (!canvas.getContext) return;
      this.gl = canvas.getContext("webgl");
      this.canvas=canvas;
    }
    createProgram(){
   
      // //将被剔除。
      // this.gl.enable(this.gl.CULL_FACE);
      // // // 1.开启隐藏面消除功能
      this.gl.enable(this.gl.DEPTH_TEST); // gl.DEPTH_TEST、gl.BLEND(混合)、gl.POLYGON_OFFSET_FILL(多边形位移)
      // this.gl.enable(this.gl.SCISSOR_TEST); // 启用剪裁测试
      // this.gl.enable(this.gl.POLYGON_OFFSET_FILL);

      // setup GLSL program
      this. program = initShaders(this.gl, VSHADER_SOURCE, FSHADER_SOURCE);
      this.gl.useProgram( this. program);
  
    }
    attribUniformVaring(){
      const gl=this.gl;
    // look up where the vertex data needs to go.
    // 模型定点的 shander 地址
    this.positionLocation = gl.getAttribLocation(this.program, "a_position");
    this.texcoordLocation = gl.getAttribLocation(this.program, "a_texcoord");
    this.u_Sampler0 = gl.getUniformLocation(this.program, 'u_Sampler0');
    this.u_Sampler1 = gl.getUniformLocation(this.program, 'u_Sampler1');
    // lookup uniforms
    this. matrixLocation = gl.getUniformLocation(this.program, "u_matrix");
    }
  }



  

  class TwoDimension {
    constructor() {
      // this.init();
      this.color='#333333';
      this.font=false;
      this.fontSize=12;
      // this.fontsProps=[];
    }
  
    setColor(color){
      this.color=color;
      this.setLineColor(color);
    }
    addFile(callback=()=>{}){

    var elInput = document.getElementById('file');
      elInput.onchange=(event)=>{
        const {
          target
        }= event;
        const reader = new FileReader();
        reader.onload = (e) => {
           callback( e.target.result);
           
        };
        reader.readAsDataURL(target .files[0]);
      };
    }
    setFont(flag){
      this.font=flag;
    }
    setFontSize(v){
      this.fontSize=v;
      try{
        this.text.set({
          fontSize:v
        });
      }catch(e){
       console.log(e);
      }

    }
    addText({
      left,
      top
    }){
      if(!this.font){
        return; 
      }
      const text = new fabric.IText("", {
        fill: this.color,
        left,
        top,
        fontSize:this.fontSize
      });
      text.setControlsVisibility({ // 控制文本的手柄
        mt: false,
        mr: false,
        mb: false,
        ml: false,
      });
      this.editFabricCanvas.add(text);
      // this.editFabricCanvas.viewportCenterObject(text); // 画布中间
      this.editFabricCanvas.setActiveObject(text); // 活跃状态
      text.enterEditing(); // 进入编辑状态
      text.set({
        fontSize:this.fontSize
      });
      // text.selectAll(); // 选中所有文本

      this.text=text;
     
    }
    setBrush(flag){
      this.editFabricCanvas.set({
        isDrawingMode: flag // 开启绘画模式
      });
    }
   async  init(main){
      this.main=main;
      this.createCanvas();
      this.addFile(async(src)=>{
          this.editFabricCanvas.add(await this.addImage({
              src,
          }));//加入到canvas中
      });

      console.log('this.editCanvas=',this.editCanvas);

      this.editFabricCanvas.onClick=(event)=>{
        console.log('event==',event);
      };


      this.editFabricCanvas.on('mouse:down',  async (ev) =>{
        console.log('ev.target===',ev.target);
        const {
          pointer:{
            x,y
          }
        }=ev;

          // // 鼠标的x y 轴
          // var x = ev.clientX,
          // y = ev.clientY+100;

          console.log('ev===',ev);
          // Start dragging if a moue is in <canvas>
          // var rect = ev.target.getBoundingClientRect();
          // x = x-rect.left;
          // y= x-rect.top;
          this.addText({
            left:x,
            top:y
          });
        
      });


      

      // var rect = new fabric.Rect({
      //   left: 100,
      //   top: 100,
      //   fill: 'red',
      //   width: 20,
      //   height: 20
      // });
      // this.canvas.add(rect);
      // this. loadImage();
     

    //   this.editFabricCanvas.add(await  this.addImage({
    //       src:panda,
    //  }));//加入到canvas中



     this.backFabricCanvas.add(await this.addImage({
        src:back3,
        // src:material_kraft,
        left: 100,
        top: 50,
        selectable: false 
     }));
   //加入到canvas中

 
   setTimeout( async ()=>{
    await  this.main.threeDimensions.setTexure0(this.editFabricCanvas.toDataURL('png'));
    await  this.main.threeDimensions.setTexure1(this.backFabricCanvas.toDataURL('png'));
    this.main.threeDimensions.drawScene(new Date().getTime());
   },30);
    
 

   

      this.evnets(async (eventKey)=>{

        // let img1=document.getElementById('img');
   
          //    const img1 = new Image();
          let url =  this.editFabricCanvas.toDataURL('png');

        await  this.main.threeDimensions.setTexure0(url);
        // await  this.main.threeDimensions.setTexure1();
          this.main.threeDimensions.drawScene(new Date().getTime());

      });
    }
    loadImage(src){
        return  new Promise((reslove,reject)=>{
            const img = new Image();
            img.src=src;
            img.onload= function (){
              // this.style.width="100px";
              // this.style.height="100px";
              reslove(this);
          };
          img.onerror=function (error){
            reject(error);
          };
        });
    }
    async addImage(options={}){
        const {src, ...more}=options;
        const img =  await this.loadImage(src);
        return new fabric.Image(img,{  //设置图片位置和样子
                ...more
          });
  
    }
    evnets(callback=()=>{}){
      let evnetKeys=[
        'object:modified', 
        // 'object:rotating', 
        // 'object:skewing',
        // 'object:scaling',
        // 'object:moving',
        'path:created'
      ];

      for(let key of evnetKeys){
        this.editFabricCanvas.on(key,  async (e) =>{
          if(key== 'path:created'){
           await  stabilization(50);
          }
          // stabilization
          callback(key);

        });
      
      }
    }
    setLineWidth(width){
      this.editFabricCanvas.freeDrawingBrush.width = width; // 画笔宽度
    }

    setLineColor(color){
      this.editFabricCanvas.freeDrawingBrush.color = color; // 画笔颜色
    }

    createCanvas(){
      // back

    this.editCanvas = document.getElementById('eidt', {antialias: false});
    this.editCtx =   this.editCanvas.getContext('2d');
    this.editCanvas.width = 500;
    this.editCanvas.height =  500;
    this.editFabricCanvas = new fabric.Canvas('eidt',{
      // isDrawingMode: true // 开启绘画模式
    });
   

    // this.editFabricCanvas.freeDrawingBrush.width = 10; // 画笔宽度
    this. setLineWidth(5);

    this.backCanvas = document.getElementById('back', {antialias: false});
    this.backCtx = this.editCanvas.getContext('2d');
    this.backCanvas.width = 500;
    this.backCanvas.height =  500;
    this.backFabricCanvas = new fabric.Canvas('back');
  

    }
  }

  class Main {
    constructor() {
      this. init();
    }
    init(){
        this.threeDimensions=new ThreeDimensions({
            elId:'view',
     
          });
        this.twoDimension= new TwoDimension();
        this.twoDimension.init(this);
        this.threeDimensions.init(this);
      

    }
  }




  new Main();

};


