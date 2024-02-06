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
 

//    // 改变
//    let parmas = {
//     // 变换参数，平移  x y z
//     translation: {
//       x: 0,
//       y: 0,
//       z: 0
//     },
//     // 放大
//     scale: {
//       x: 1,
//       y: 1,
//       z: 1
//     },
//     // 旋转
//     rotation: {
//       angleX: 0,
//       angleY: 0,
//       angleZ: 0
//     },
//     eye:{
//       x:0,
//       y:0,
//       z:0,
//     },
//     at:{
//       x:0,
//       y:0,
//       z:-1,
//     },
//     up:{
//       x:0,
//       y:1,
//       z:0,
//     },
//     fn: () => {}
//   };

//   // 控制 参数改变
//   controller({
//     onChange: () => {
//       drawScene();
//       // render(settings);
//       // console.log("parmas========", parmas);
//     },
//     parmas: parmas,
//     options: [
//       {
//         min: -1,
//         max: 1,
//         step: 0.001,
//         key: "translation.x",
//         name: "位移X",
//         // onChange: (value) => {},
//         onFinishChange: (value) => {
//           // 完全修改停下来的时候触发这个事件
//           console.log("onFinishChange value==", value);
//         }
//       },
//       {
//         min: -1,
//         max: 1,
//         step: 0.01,
//         key: "translation.y",
//         name: "位移Y",
//         onChange: (value) => {},
//         onFinishChange: (value) => {
//           // 完全修改停下来的时候触发这个事件
//           console.log("onFinishChange value==", value);
//         }
//       },
//       {
//         min: -1,
//         max: 1,
//         step: 0.01,
//         key: "translation.z",
//         name: "位移Z",
//         onChange: (value) => {},
//         onFinishChange: (value) => {
//           // 完全修改停下来的时候触发这个事件
//           console.log("onFinishChange value==", value);
//         }
//       },

//       {
//         min: -1,
//         max: 10,
//         step: 0.001,
//         key: "scale.x",
//         name: "放大X",
//         // onChange: (value) => {},
//         onFinishChange: (value) => {
//           // 完全修改停下来的时候触发这个事件
//           console.log("onFinishChange value==", value);
//         }
//       },
//       {
//         min: -1,
//         max: 10,
//         step: 0.01,
//         key: "scale.y",
//         name: "放大Y",
//         onChange: (value) => {},
//         onFinishChange: (value) => {
//           // 完全修改停下来的时候触发这个事件
//           console.log("onFinishChange value==", value);
//         }
//       },
//       {
//         min: -1,
//         max: 10,
//         step: 0.01,
//         key: "scale.z",
//         name: "放大Z",
//         onChange: (value) => {},
//         onFinishChange: (value) => {
//           // 完全修改停下来的时候触发这个事件
//           console.log("onFinishChange value==", value);
//         }
//       },

//       {
//         min: 0,
//         max: 360,
//         step: 0.001,
//         key: "rotation.angleX",
//         name: "旋转X",
//         // onChange: (value) => {},
//         onFinishChange: (value) => {
//           // 完全修改停下来的时候触发这个事件
//           console.log("onFinishChange value==", value);
//         }
//       },
//       {
//         min: -1,
//         max: 360,
//         step: 0.01,
//         key: "rotation.angleY",
//         name: "旋转Y",
//         onChange: (value) => {},
//         onFinishChange: (value) => {
//           // 完全修改停下来的时候触发这个事件
//           console.log("onFinishChange value==", value);
//         }
//       },
//       {
//         min: -1,
//         max: 360,
//         step: 0.01,
//         key: "rotation.angleZ",
//         name: "旋转Z",
//         onChange: (value) => {},
//         onFinishChange: (value) => {
//           // 完全修改停下来的时候触发这个事件
//           console.log("onFinishChange value==", value);
//         }
//       },



// /*
//     eye:{
//       x:0,
//       y:0,
//       z:0,
//     },
//     at:{
//       x:0,
//       y:0,
//       z:-1,
//     },
//     up:{
//       x:0,
//       y:1,
//       z:0,
//     },
// */

// {
//   min: -1,
//   max: 1,
//   step: 0.01,
//   key: "eye.x",
//   name: "eye.x",
//   onChange: (value) => {},
//   onFinishChange: (value) => {
//     // 完全修改停下来的时候触发这个事件
//     console.log("onFinishChange value==", value);
//   }
// },
// {
//   min: -1,
//   max: 1,
//   step: 0.01,
//   key: "eye.y",
//   name: "eye.y",
//   onChange: (value) => {},
//   onFinishChange: (value) => {
//     // 完全修改停下来的时候触发这个事件
//     console.log("onFinishChange value==", value);
//   }
// },
// {
//   min: -1,
//   max: 1,
//   step: 0.01,
//   key: "eye.z",
//   name: "eye.z",
//   onChange: (value) => {},
//   onFinishChange: (value) => {
//     // 完全修改停下来的时候触发这个事件
//     console.log("onFinishChange value==", value);
//   }
// },



// {
//   min: -1,
//   max: 1,
//   step: 0.01,
//   key: "at.x",
//   name: "at.x",
//   onChange: (value) => {},
//   onFinishChange: (value) => {
//     // 完全修改停下来的时候触发这个事件
//     console.log("onFinishChange value==", value);
//   }
// },
// {
//   min: -1,
//   max: 1,
//   step: 0.01,
//   key: "at.y",
//   name: "at.y",
//   onChange: (value) => {},
//   onFinishChange: (value) => {
//     // 完全修改停下来的时候触发这个事件
//     console.log("onFinishChange value==", value);
//   }
// },
// {
//   min: -1,
//   max: 1,
//   step: 0.01,
//   key: "at.z",
//   name: "at.z",
//   onChange: (value) => {},
//   onFinishChange: (value) => {
//     // 完全修改停下来的时候触发这个事件
//     console.log("onFinishChange value==", value);
//   }
// },


// {
//   min: -1,
//   max: 1,
//   step: 0.01,
//   key: "up.x",
//   name: "up.x",
//   onChange: (value) => {},
//   onFinishChange: (value) => {
//     // 完全修改停下来的时候触发这个事件
//     console.log("onFinishChange value==", value);
//   }
// },
// {
//   min: -1,
//   max: 1,
//   step: 0.01,
//   key: "up.y",
//   name: "up.y",
//   onChange: (value) => {},
//   onFinishChange: (value) => {
//     // 完全修改停下来的时候触发这个事件
//     console.log("onFinishChange value==", value);
//   }
// },
// {
//   min: -1,
//   max: 1,
//   step: 0.01,
//   key: "up.z",
//   name: "up.z",
//   onChange: (value) => {},
//   onFinishChange: (value) => {
//     // 完全修改停下来的时候触发这个事件
//     console.log("onFinishChange value==", value);
//   }
// },


//     ]
//   });

 
function main() {
  // Retrieve <canvas> element
  
 

  // Set the vertex coordinates and color (the blue triangle is in the front)
  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to specify the vertex infromation');
    return;
  }

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Get the storage locations of u_ViewMatrix and u_ProjMatrix variables
  var u_ViewMatrix = gl.getUniformLocation(program, 'u_ViewMatrix');
  var u_ProjMatrix = gl.getUniformLocation(program, 'u_ProjMatrix');
  if (!u_ViewMatrix || !u_ProjMatrix) { 
    console.log('Failed to get u_ViewMatrix or u_ProjMatrix');
    return;
  }

  // Create the matrix to specify the view matrix
  // var viewMatrix = new Matrix4();
  var viewMatrix = glMatrix.mat4.create();

  // Register the event handler to be called on key press
 document.onkeydown = function(ev){
   keydown(ev, gl, n, u_ViewMatrix, viewMatrix);
  };

  // Create the matrix to specify the viewing volume and pass it to u_ProjMatrix
  var projMatrix = glMatrix.mat4.create();   //  Matrix4();
   
  /*
  left 左边 
  right 右边， 
  bottom 下边， 
  top 上边
  near 近截面
  far  远截面
  */
  let [
    left, right, bottom, top, g_near, g_far
  ]=[
    -1.0, 1.0, -1.0, 1.0, 0.0, 2.0
  ];


  glMatrix.mat4.ortho(projMatrix, left, right, bottom, top, g_near, g_far);
  // projMatrix.setOrtho(-1.0, 1.0, -1.0, 1.0, 0.0, 2.0);
  gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix);

  draw(gl, n, u_ViewMatrix, viewMatrix);   // Draw the triangles
}

function initVertexBuffers(gl) {
  var verticesColors = new Float32Array([
    // Vertex coordinates and color
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

  // Write vertex information to buffer object
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

  return n;
}

var g_EyeX = 0.20, g_EyeY = 0.25, g_EyeZ = 0.25; // Eye position
function keydown(ev, gl, n, u_ViewMatrix, viewMatrix) {
    if(ev.keyCode === 39) { // The right arrow key was pressed
      g_EyeX += 0.01;
    } else 
    if (ev.keyCode === 37) { // The left arrow key was pressed
      g_EyeX -= 0.01;
    } else { return; } // Prevent the unnecessary drawing
    draw(gl, n, u_ViewMatrix, viewMatrix);    
}

function draw(gl, n, u_ViewMatrix, viewMatrix) {

  // Set the matrix to be used for to set the camera view


  let {
    eye,at,
    up
  }={
    eye:{
      x:g_EyeX,
      y:g_EyeY,
      z:g_EyeZ
    },
    at:{
      x:0,
      y:0,
      z:0
    },
    up:{
      x:0,
      y:1,
      z:0
    }
  };

  glMatrix.mat4.lookAt(
    viewMatrix,
    [eye.x, eye.y, eye.z],
    [at.x, at.y, at.z],
    [up.x, up.y, up.z]
  );

  // viewMatrix.setLookAt(g_EyeX, g_EyeY, g_EyeZ, 0, 0, 0, 0, 1, 0);

  // Pass the view projection matrix
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw the rectangle
  gl.drawArrays(gl.TRIANGLES, 0, n);
}

main(); 
};
