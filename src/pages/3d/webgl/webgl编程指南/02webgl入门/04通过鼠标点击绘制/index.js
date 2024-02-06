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
import {Matrix4} from "@/pages/3d/utils/lib/cuon-matrix";
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
    // Retrieve <canvas> element
    // var canvas = document.getElementById("webgl");

    // // Get the rendering context for WebGL
    // var gl = getWebGLContext(canvas);
    // if (!gl) {
    //   console.log("Failed to get the rendering context for WebGL");
    //   return;
    // }

    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
      console.log("Failed to intialize shaders.");
      return;
    }

    // // Get the storage location of a_Position
    var a_Position = gl.getAttribLocation(program, "a_Position");
    if (a_Position < 0) {
      console.log("Failed to get the storage location of a_Position");
      return;
    }

    // Register function (event handler) to be called on a mouse press
    canvas.onmousedown = function (ev) {
      click(ev, gl, canvas, a_Position);
    };

    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
  }

  var g_points = []; // The array for the position of a mouse press
  // 点击 时候 添加点。 用户坐标转世界坐标
  function click(ev, gl, canvas, a_Position) {
    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer

    var rect = ev.target.getBoundingClientRect();
    /*
  
  clientX： 设置或获取鼠标指针位置相对于窗口客户区域的 x 坐标，其中客户区域不包括窗口自身的控件和滚动条。

clientY： 设置或获取鼠标指针位置相对于窗口客户区域的 y 坐标，其中客户区域不包括窗口自身的控件和滚动条。

offsetX： 设置或获取鼠标指针位置相对于触发事件的（this）对象的 x 坐标。

offsetY ：设置或获取鼠标指针位置相对于触发事件的（this）对象的 y 坐标。

screenX： 设置或获取获取鼠标指针位置相对于用户屏幕的 x 坐标。

screenY： 设置或获取鼠标指针位置相对于用户屏幕的 y 坐标。

x： 设置或获取鼠标指针位置相对于父文档的 x 像素坐标。

y ：设置或获取鼠标指针位置相对于父文档的 y 像素坐标。
 



  rectObject.top：元素上边到视窗上边的距离;

	rectObject.right：元素右边到视窗左边的距离;

	rectObject.bottom：元素下边到视窗上边的距离;

	rectObject.left：元素左边到视窗左边的距离;

	rectObject.width：是元素自身的宽
	rectObject.height是元素自身的高
  */

    console.log('x',x );
    console.log(' rect.left==',rect.left);
    /*


     x = (2x-canvas.width)/canvas.width
     y=  (canvas.height-2y)/canvas.height

     // 再减去边距
     x = (2(x-rect.left)-canvas.width)/canvas.width
     y=  (canvas.height-2(y-rect.top))/canvas.height

     
 
    */
    x =  (2*(x- rect.left)-canvas.width)/canvas.width;     // (x - rect.left - canvas.width / 2) / (canvas.width / 2);

    y =  (canvas.height-2*(y-rect.top))/canvas.height;  // (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);

    // Store the coordinates to g_points array
    g_points.push(x);
    g_points.push(y);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    var len = g_points.length;
    for (var i = 0; i < len; i += 2) {
      // Pass the position of a point to a_Position variable
      gl.vertexAttrib3f(a_Position, g_points[i], g_points[i + 1], 0.0);

      // Draw
      gl.drawArrays(gl.POINTS, 0, 1);
    }
  }

  main();
};
