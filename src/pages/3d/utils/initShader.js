function loadShader(gl, type, source) {
  // Create shader object
  // 创建着色器对象
  var shader = gl.createShader(type);
  if (shader === null) {
    console.log("unable to create shader");
    return null;
  }

  // Set the shader program
  // 向着色器对象中填充着色器程序的源代码
  gl.shaderSource(shader, source);

  // Compile the shader
  //编译着色器
  gl.compileShader(shader);

  // Check the result of compilation
  //检查编译结果
  var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!compiled) {
    // 检查如果有报错
    var error = gl.getShaderInfoLog(shader);
    // 输出报错日志
    console.log("Failed to compile shader: " + error);
    // 删除shader 防止内存溢出
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}
function createProgram(gl, vshader, fshader) {
  // Create shader object
  // 创建vertexShader
  var vertexShader = loadShader(gl, gl.VERTEX_SHADER, vshader);
  // 创建fragmentShader
  var fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fshader);
  if (!vertexShader || !fragmentShader) {
    return null;
  }

  // Create a program object
  // 将两个Shader连接合在一起
  // 创建程序对象
  var program = gl.createProgram();
  if (!program) {
    return null;
  }

  // Attach the shader objects
  // 为程序对象分配着色器
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  // Link the program object
  // 链接程序对象
  gl.linkProgram(program);

  // Check the result of linking
  // 检查链接结果
  var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!linked) {
    // 如果有编译错误
    var error = gl.getProgramInfoLog(program);
    console.log("Failed to link program: " + error);
    // 删除program
    gl.deleteProgram(program);
    // 删除 fragmentShader
    gl.deleteShader(fragmentShader);
    // 删除 vertexShader
    gl.deleteShader(vertexShader);
    return null;
  }
  return program;
}
function initShaders(gl, vshader, fshader) {
  // 创建Program
  var program = createProgram(gl, vshader, fshader);
  if (!program) {
    console.log("Failed to create program");
    return false;
  }
  // 使用程序对象
  gl.useProgram(program);
  // 挂着对象属性
  gl.program = program;

  return true;
}

export default initShaders;
