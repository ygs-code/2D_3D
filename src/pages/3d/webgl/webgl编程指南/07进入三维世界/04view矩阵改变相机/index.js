import initShaders from "@/pages/3d/utils/initShader";
import {resizeCanvasToDisplaySize} from "@/pages/3d/utils/webgl-utils.js";
// import m4 from "./m4";
import FSHADER_SOURCE from "./index.frag";
import VSHADER_SOURCE from "./index.vert";
import controller from "@/pages/3d/utils/controller.js";
import {fData} from "./data";
 
// import {createHtmlMatrix} from "@/pages/3d/utils/matrix.js";
import {createHtmlMatrix} from "@/pages/3d/utils/matrix.js";
import m4 from "@/pages/3d/utils/comments/m4";
import * as glMatrix from "gl-matrix";
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
 

   // 改变
   let parmas = {
    // 变换参数，平移  x y z
    translation: {
      x: 0,
      y: 0,
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
      angleX: 0,
      angleY: 0,
      angleZ: 0
    },
    eye:{
      x:0,
      y:0,
      z:0,
    },
    at:{
      x:0,
      y:0,
      z:-1,
    },
    up:{
      x:0,
      y:1,
      z:0,
    },
    fn: () => {}
  };

  // 控制 参数改变
  controller({
    onChange: () => {
      drawScene();
      // render(settings);
      // console.log("parmas========", parmas);
    },
    parmas: parmas,
    options: [
      {
        min: -1,
        max: 1,
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
        min: -1,
        max: 1,
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
        max: 1,
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
      },



/*
    eye:{
      x:0,
      y:0,
      z:0,
    },
    at:{
      x:0,
      y:0,
      z:-1,
    },
    up:{
      x:0,
      y:1,
      z:0,
    },
*/

{
  min: -1,
  max: 1,
  step: 0.01,
  key: "eye.x",
  name: "eye.x",
  onChange: (value) => {},
  onFinishChange: (value) => {
    // 完全修改停下来的时候触发这个事件
    console.log("onFinishChange value==", value);
  }
},
{
  min: -1,
  max: 1,
  step: 0.01,
  key: "eye.y",
  name: "eye.y",
  onChange: (value) => {},
  onFinishChange: (value) => {
    // 完全修改停下来的时候触发这个事件
    console.log("onFinishChange value==", value);
  }
},
{
  min: -1,
  max: 1,
  step: 0.01,
  key: "eye.z",
  name: "eye.z",
  onChange: (value) => {},
  onFinishChange: (value) => {
    // 完全修改停下来的时候触发这个事件
    console.log("onFinishChange value==", value);
  }
},



{
  min: -1,
  max: 1,
  step: 0.01,
  key: "at.x",
  name: "at.x",
  onChange: (value) => {},
  onFinishChange: (value) => {
    // 完全修改停下来的时候触发这个事件
    console.log("onFinishChange value==", value);
  }
},
{
  min: -1,
  max: 1,
  step: 0.01,
  key: "at.y",
  name: "at.y",
  onChange: (value) => {},
  onFinishChange: (value) => {
    // 完全修改停下来的时候触发这个事件
    console.log("onFinishChange value==", value);
  }
},
{
  min: -1,
  max: 1,
  step: 0.01,
  key: "at.z",
  name: "at.z",
  onChange: (value) => {},
  onFinishChange: (value) => {
    // 完全修改停下来的时候触发这个事件
    console.log("onFinishChange value==", value);
  }
},


{
  min: -1,
  max: 1,
  step: 0.01,
  key: "up.x",
  name: "up.x",
  onChange: (value) => {},
  onFinishChange: (value) => {
    // 完全修改停下来的时候触发这个事件
    console.log("onFinishChange value==", value);
  }
},
{
  min: -1,
  max: 1,
  step: 0.01,
  key: "up.y",
  name: "up.y",
  onChange: (value) => {},
  onFinishChange: (value) => {
    // 完全修改停下来的时候触发这个事件
    console.log("onFinishChange value==", value);
  }
},
{
  min: -1,
  max: 1,
  step: 0.01,
  key: "up.z",
  name: "up.z",
  onChange: (value) => {},
  onFinishChange: (value) => {
    // 完全修改停下来的时候触发这个事件
    console.log("onFinishChange value==", value);
  }
},


    ]
  });

 

  function initVertexBuffers(gl) {
    var verticesColors = new Float32Array([
      // Vertex coordinates and color(RGBA)
       0.0,  0.5,  -0.4,  0.4,  1.0,  0.4, // The back green one
      -0.5, -0.5,  -0.4,  0.4,  1.0,  0.4,
       0.5, -0.5,  -0.4,  1.0,  0.4,  0.4, 
     
       0.5,  0.4,  -0.2,  1.0,  0.4,  0.4, // The middle yellow one
      -0.5,  0.4,  -0.2,  1.0,  1.0,  0.4,
       0.0, -0.6,  -0.2,  1.0,  1.0,  0.4, 
  
       0.0,  0.5,   0.0,  0.4,  0.4,  1.0,  // The front blue one 
      -0.5, -0.5,   0.0,  0.4,  0.4,  1.0,
       0.5, -0.5,   0.0,  1.0,  0.4,  0.4, 
    ]);
    var n = 9;
  
    // Create a buffer object
    var vertexColorbuffer = gl.createBuffer();  
    if (!vertexColorbuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }
  
    // Write the vertex coordinates and color to the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorbuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);
  
    var FSIZE = verticesColors.BYTES_PER_ELEMENT;
    // Assign the buffer object to a_Position and enable the assignment
    var a_Position = gl.getAttribLocation(program, 'a_Position');
    if(a_Position < 0) {
      console.log('Failed to get the storage location of a_Position');
      return -1;
    }
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
    gl.enableVertexAttribArray(a_Position);
  
    // Assign the buffer object to a_Color and enable the assignment
    var a_Color = gl.getAttribLocation(program, 'a_Color');
    if(a_Color < 0) {
      console.log('Failed to get the storage location of a_Color');
      return -1;
    }
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    gl.enableVertexAttribArray(a_Color);
  
    // Unbind the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  
    return n;
  }

 function drawScene(){



  let  {
    // 变换参数，平移  x y z
    translation={
      // x: 45,
      // y: 45,
      // z: 0
    },
    // 放大
    scale= {
      // x: 1,
      // y: 1,
      // z: 1
    },
    // 旋转
    rotation= {
      // angleX: 40,
      // angleY: 25,
      // angleZ: 325
    },
    eye,
    at,
    up
    // fn: () => {}
  }=parmas;


    // Specify the color for clearing <canvas>
    gl.clearColor(0, 0, 0, 1);
  
    // Get the storage location of u_ViewMatrix
    var u_ViewMatrix = gl.getUniformLocation(program, 'u_ViewMatrix');
    if (!u_ViewMatrix) { 
      console.log('Failed to get the storage locations of u_ViewMatrix');
      return;
    }
  


    let deg = 10;
   
    /*
    
    s*r*t

    t*r
    */

    // 模型矩阵
    let modelMatrix= glMatrix.mat4.create();

    // 缩放矩阵
    let scaleMatrix = glMatrix.mat4.create();


    scaleMatrix=glMatrix.mat4.scale(scaleMatrix, scaleMatrix, [scale.x,scale.y,scale.z]);

    // 缩放 * 模型
    modelMatrix = glMatrix.mat4.multiply(modelMatrix,
      modelMatrix,
      scaleMatrix
    );
  



    // 旋转矩阵
    let rotateMatrix =  glMatrix.mat4.create();


    // 模型矩阵旋转
    rotateMatrix = glMatrix.mat4.rotateX(rotateMatrix, rotateMatrix,  rotation.angleX*Math.PI/180);
    rotateMatrix = glMatrix.mat4.rotateY(rotateMatrix, rotateMatrix,  rotation.angleY*Math.PI/180);
    rotateMatrix = glMatrix.mat4.rotateZ(rotateMatrix, rotateMatrix,  rotation.angleZ*Math.PI/180);
    

    // 旋转 * 模型
   modelMatrix = glMatrix.mat4.multiply(modelMatrix,
    modelMatrix,
    rotateMatrix
   );


    // 模型矩阵位移
   let translationMatrix = glMatrix.mat4.create();
  // 模型矩阵位移
   translationMatrix = glMatrix.mat4.fromTranslation(translationMatrix,[translation.x,translation.y,translation.z]);
    // 位移 * 模型
    modelMatrix = glMatrix.mat4.multiply(modelMatrix,
      modelMatrix,
      translationMatrix
    );

 
    // Set the matrix to be used for to set the camera view
          //初始化视图矩阵
   var viewMatrix = glMatrix.mat4.create();
 // 视图矩阵
    // let eye = [0.0, 0.0, 0.0]; //  eyeX, eyeY, eyeZ  观察者的默认状态是：视点为系统原点(0,0,0) eyeX, eyeY, eyeZ
    // let center = [0.0, 0.0, -1]; // atX, atY, atZ  视线为Z轴负方向，观察点为(0,0,0)   atX, atY, atZ
    // let up = [0.0, 1.0, 0.0]; // upX, upY, upZ 上方向为Y轴负方向(0,1,0) upX, upY, upZ
    glMatrix.mat4.lookAt(
      viewMatrix,
      [eye.x, eye.y, eye.z],
      [at.x, at.y, at.z],
      [up.x, up.y, up.z]
    );

    // 视图矩阵 * 模型
    viewMatrix = glMatrix.mat4.multiply(modelMatrix,
      modelMatrix,
      viewMatrix
    );

    console.log('deg==',deg);
    
  
    // modelMatrix.setRotate(-10, 0, 0, 1); // Rotate around z-axis

    // Set the view matrix
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix);
  
    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
  
    // Draw the rectangle
    gl.drawArrays(gl.TRIANGLES, 0, 9);

 }

  function main() {
 
  
 
    // Set the vertex coordinates and color (the blue triangle is in the front)
    var n = initVertexBuffers(gl);
    if (n < 0) {
      console.log('Failed to set the vertex information');
      return;
    }
    
    drawScene();



  }
  
  main();
};
