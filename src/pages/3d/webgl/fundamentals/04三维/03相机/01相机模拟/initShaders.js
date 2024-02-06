/*
function loadShader(gl, type, source) {
  console.log("loadShader");
  // Create shader object
  // 创建着色器对象
  var shader = gl.createShader(type);
  if (shader === null) {
    console.error("unable to create shader");

    throw "unable to create shader";
    // return null;
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
    console.error("Failed to compile shader: " + error);

    // 删除shader 防止内存溢出
    gl.deleteShader(shader);
    throw "Failed to compile shader: " + error;
  }

  return shader;
}

function createVertexShader(gl, program, vshader) {
  // 创建vertexShader
  var vertexShader = loadShader(gl, gl.VERTEX_SHADER, vshader);
  // 为程序对象分配着色器
  gl.attachShader(program, vertexShader);
  return vertexShader;
}

function createFragmentShader(gl, program, fshader) {
  // 创建fragmentShader
  var fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fshader);
  // 为程序对象分配着色器
  gl.attachShader(program, fragmentShader);
  return fragmentShader;
}

function createProgram(gl, vshader, fshader) {
  // Create shader object
  // 创建vertexShader
  // var vertexShader = loadShader(gl, gl.VERTEX_SHADER, vshader);
  // // 创建fragmentShader
  // var fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fshader);
  // if (!vertexShader || !fragmentShader) {
  //   return null;
  // }

  // Create a program object
  // 将两个Shader连接合在一起
  // 创建程序对象
  var program = gl.createProgram();
  if (!program) {
    return null;
  }
  // 创建vertexShader
  var vertexShader = createVertexShader(gl, program, vshader);
  // 创建fragmentShader
  var fragmentShader = createFragmentShader(gl, program, fshader);
  if (!vertexShader || !fragmentShader) {
    return null;
  }

  // Attach the shader objects
  // 为程序对象分配着色器
  // gl.attachShader(program, vertexShader);
  // gl.attachShader(program, fragmentShader);

  // Link the program object
  // 链接程序对象
  gl.linkProgram(program);

  // Check the result of linking
  // 检查链接结果
  var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!linked) {
    // 如果有编译错误
    var error = gl.getProgramInfoLog(program);
    console.error("Failed to link program: " + error);

    // 删除program
    gl.deleteProgram(program);
    // 删除 fragmentShader
    gl.deleteShader(fragmentShader);
    // 删除 vertexShader
    gl.deleteShader(vertexShader);
    throw "Failed to link program: " + error;
    // return null;
  }
  return program;
}
function initShaders(gl, vshader, fshader) {
  // gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  // 创建Program

  var program = createProgram(gl, vshader, fshader);
  if (!program) {
    console.error("Failed to create program");

    throw "Failed to create program";
  }
  // 使用程序对象
  gl.useProgram(program);
  // 挂着对象属性
  gl.program = program;

  return program;
}

export default initShaders;

*/

const defaultShaderType = ["VERTEX_SHADER", "FRAGMENT_SHADER"];

/**
 * Wrapped logging function.
 * @param {string} msg The message to log.
 */
function error(msg) {
  if (window.console) {
    if (window.console.error) {
      window.console.error(msg);
    } else if (window.console.log) {
      window.console.log(msg);
    }
  }
}

/**
 * Loads a shader.
 * @param {WebGLRenderingContext} gl The WebGLRenderingContext to use.
 * @param {string} shaderSource The shader source.
 * @param {number} shaderType The type of shader.
 * @param {module:webgl-utils.ErrorCallback} opt_errorCallback callback for errors.
 * @return {WebGLShader} The created shader.
 */
// 加载 和创建 Shader
function loadShader(gl, shaderSource, shaderType, opt_errorCallback) {
  const errFn = opt_errorCallback || error;
  // Create the shader object
  // 创建 Shader
  const shader = gl.createShader(shaderType);

  // Load the shader source
  // 向着色器对象中填充着色器程序的源代码 //加载着色器源
  gl.shaderSource(shader, shaderSource);

  // Compile the shader
  //编译着色器
  gl.compileShader(shader);

  // Check the compile status
  // Check the result of compilation
  //检查编译结果
  const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!compiled) {
    // Something went wrong during compilation; get the error
    // 编译过程中出错;获取错误
    // 检查如果有报错
    const lastError = gl.getShaderInfoLog(shader);
    errFn(
      "*** Error compiling shader '" +
        shader +
        "':" +
        lastError +
        `\n` +
        shaderSource
          .split("\n")
          .map((l, i) => `${i + 1}: ${l}`)
          .join("\n")
    );
    // 删除shader 防止内存溢出
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

/**
 * Creates a program, attaches shaders, binds attrib locations, links the
 * program and calls useProgram.
 * @param {WebGLShader[]} shaders The shaders to attach
 * @param {string[]} [opt_attribs] An array of attribs names. Locations will be assigned by index if not passed in
 * @param {number[]} [opt_locations] The locations for the. A parallel array to opt_attribs letting you assign locations.
 * @param {module:webgl-utils.ErrorCallback} opt_errorCallback callback for errors. By default it just prints an error to the console
 *        on error. If you want something else pass an callback. It's passed an error message.
 * @memberOf module:webgl-utils
 */

// 创建 Program
function createProgram(
  gl,
  shaders, //  shaders
  opt_attribs,
  opt_locations,
  opt_errorCallback
) {
  const errFn = opt_errorCallback || error;
  // 将两个Shader连接合在一起
  // 创建程序对象
  const program = gl.createProgram();

  // 为程序对象分配着色器
  shaders.forEach(function (shader) {
    gl.attachShader(program, shader);
  });

  if (opt_attribs) {
    opt_attribs.forEach(function (attrib, ndx) {
      // 绑定 Attrib
      // gl.bindAttribLocation(
      //   program,
      //   opt_locations ? opt_locations[ndx] : ndx,
      //   attrib
      // );
    });
  }
  // Link the program object
  // 链接程序对象
  gl.linkProgram(program);

  // Check the link status
  //检查链路状态
  const linked = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!linked) {
    // something went wrong with the link
    const lastError = gl.getProgramInfoLog(program);
    errFn("Error in program linking:" + lastError);
    // 删除program
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

/**
 * Loads a shader from a script tag.
 * @param {WebGLRenderingContext} gl The WebGLRenderingContext to use.
 * @param {string} scriptId The id of the script tag.
 * @param {number} opt_shaderType The type of shader. If not passed in it will
 *     be derived from the type of the script tag.
 * @param {module:webgl-utils.ErrorCallback} opt_errorCallback callback for errors.
 * @return {WebGLShader} The created shader.
 */
// 创建 ShaderFrom
function createShaderFromScript(
  gl,
  scriptId,
  opt_shaderType,
  opt_errorCallback
) {
  let shaderSource = "";
  let shaderType;
  // 获取 文本内容
  const shaderScript = document.getElementById(scriptId);

  if (!shaderScript) {
    shaderSource = scriptId;
    //  throw "*** Error: unknown script element" + scriptId;
  } else {
    shaderSource = shaderScript.text;
  }

  if (!opt_shaderType) {
    if (shaderScript.type === "x-shader/x-vertex") {
      shaderType = gl.VERTEX_SHADER;
    } else if (shaderScript.type === "x-shader/x-fragment") {
      shaderType = gl.FRAGMENT_SHADER;
    } else if (
      shaderType !== gl.VERTEX_SHADER &&
      shaderType !== gl.FRAGMENT_SHADER
    ) {
      throw "*** Error: unknown shader type";
    }
  }
  // 加载 和创建 Shader
  return loadShader(
    gl,
    shaderSource, //
    opt_shaderType ? opt_shaderType : shaderType,
    opt_errorCallback
  );
}

/**
 * Creates a program from 2 script tags.
 *
 * @param {WebGLRenderingContext} gl The WebGLRenderingContext
 *        to use.
 * @param {string[]} shaderScriptIds Array of ids of the script
 *        tags for the shaders. The first is assumed to be the
 *        vertex shader, the second the fragment shader.
 * @param {string[]} [opt_attribs] An array of attribs names. Locations will be assigned by index if not passed in
 * @param {number[]} [opt_locations] The locations for the. A parallel array to opt_attribs letting you assign locations.
 * @param {module:webgl-utils.ErrorCallback} opt_errorCallback callback for errors. By default it just prints an error to the console
 *        on error. If you want something else pass an callback. It's passed an error message.
 * @return {WebGLProgram} The created program.
 * @memberOf module:webgl-utils
 */
function createProgramFromScripts(
  gl, // gl 对象
  shaderScriptIds, // 脚本id
  opt_attribs,
  opt_locations,
  opt_errorCallback
) {
  const shaders = [];
  for (let ii = 0; ii < shaderScriptIds.length; ++ii) {
    shaders.push(
      createShaderFromScript(
        gl,
        shaderScriptIds[ii],
        gl[defaultShaderType[ii]],
        opt_errorCallback
      )
    );
  }
  // 创建 Program
  return createProgram(
    gl, // gl
    shaders, // 获取到 shaders
    opt_attribs,
    opt_locations,
    opt_errorCallback
  );
}

export default createProgramFromScripts;
