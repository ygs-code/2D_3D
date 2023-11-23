/**
 * Utility functions for:
 * 
 * https://developer.mozilla.org/en-US/docs/Web/API/WebGLProgram
 * https://developer.mozilla.org/en-US/docs/Web/API/WebGLShader
 * 
 **/

// Define the MDN global if it doesn't already exist
var MDN = window.MDN || {};


// 创建 Shader
MDN.createShader = function (gl, source, type) {

  // Compiles either a shader of type gl.VERTEX_SHADER or gl.FRAGMENT_SHADER

  // 创建 Shader
  var shader = gl.createShader(type);

  // Set the shader program
  // 向着色器对象中填充着色器程序的源代码
  gl.shaderSource(shader, source);

  // Compile the shader
  //编译着色器
  gl.compileShader(shader);
  // Check the result of compilation
  //检查编译结果
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {

    // 如果 有错
    var info = gl.getShaderInfoLog(shader);
    throw "Could not compile WebGL program. \n\n" + info;
  }

  return shader
}


// 创建 Program 并且连接 Program
MDN.linkProgram = function (gl, vertexShader, fragmentShader) {
  //创建Program
  var program = gl.createProgram();
  // 为程序对象分配着色器
  gl.attachShader(program, vertexShader);
  // 为程序对象分配着色器
  gl.attachShader(program, fragmentShader);
  // 连接 Program
  gl.linkProgram(program);

  // 检验 shader 
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    var info = gl.getProgramInfoLog(program);
    throw "Could not compile WebGL program. \n\n" + info;
  }


  return program;
}

// 创建 Program 并且连接 Program
MDN.createWebGLProgram = function (gl, vertexSource, fragmentSource) {

  // Combines MDN.createShader() and MDN.linkProgram()
// 创建 Shader
  var vertexShader = MDN.createShader(gl, vertexSource, gl.VERTEX_SHADER);
// 创建 Shader
  var fragmentShader = MDN.createShader(gl, fragmentSource, gl.FRAGMENT_SHADER);
// 创建 Program 并且连接 Program
  return MDN.linkProgram(gl, vertexShader, fragmentShader);
}

MDN.createWebGLProgramFromIds = function (gl, vertexSourceId, fragmentSourceId) {

  // 获取 html中的shader
  var vertexSourceEl = document.getElementById(vertexSourceId);
  var fragmentSourceEl = document.getElementById(fragmentSourceId);
// 创建 Program 并且连接 Program
  return MDN.createWebGLProgram(
    gl,
    vertexSourceEl.innerHTML,
    fragmentSourceEl.innerHTML
  );
}

// 创建 webgl Context
MDN.createContext = function (canvas) {

  var gl;

  try {
    // Try to grab the standard context. If it fails, fallback to experimental.
    gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  }
  catch (e) { }

  // If we don't have a GL context, give up now
  if (!gl) {
    var message = "Unable to initialize WebGL. Your browser may not support it.";
    alert(message);
    throw new Error(message);
    gl = null;
  }

  return gl;
}
