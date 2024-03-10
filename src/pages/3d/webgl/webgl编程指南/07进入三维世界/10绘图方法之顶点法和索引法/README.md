# 【愚公系列】2023年08月 WEBGL专题-绘图方法之顶点法和索引法

前言
WEBGL的绘图方法主要有以下几种：

gl.drawArrays：使用顶点数组直接绘制图形。该方法需要传入一个枚举类型表示绘制的基本图形类型，例如gl.TRIANGLES表示使用三角形绘制，gl.POINTS表示使用点绘制，gl.LINES表示使用线段绘制等。该方法可以通过修改顶点数组中的顶点数据来修改绘制的图形。

gl.drawElements：使用索引数组绘制图形。该方法与gl.drawArrays类似，但需要传入一个索引数组来表示绘制图形时顶点的顺序。使用索引数组可以有效减少重复顶点的数量，提高绘制性能。

gl.drawArraysInstanced：使用顶点数组和实例化数组绘制多个相似的图形。该方法需要传入一个实例化数组来表示多个实例的属性，例如颜色、位置等。该方法可以用于绘制大量相似的图形，从而提高绘制性能。

gl.drawElementsInstanced：使用索引数组和实例化数组绘制多个相似的图形。该方法与gl.drawArraysInstanced类似，但需要传入一个索引数组来表示顶点的顺序。使用索引数组可以有效减少重复顶点的数量，提高绘制性能。

gl.drawRangeElements：使用索引数组绘制部分图形。该方法可以指定绘制的起始索引和终止索引，从而可以只绘制部分图形。该方法可以用于绘制复杂的图形，例如模型的不同部位。

这些绘图方法可以根据实际需求和场景选择使用。在实际应用中，也可以通过组合多个绘图方法来实现更复杂的图形和效果。

一、顶点法
1.顶点法的概念
WebGL的顶点法是指在WebGL中使用顶点数据来描述3D对象。每个3D对象都由一系列顶点组成，这些顶点会被组织成三角形网格，形成表面。

使用顶点数据的好处是可以大大减少需要传输的数据量。通常情况下，3D对象包含大量的顶点数据，但是这些数据中有很多是冗余的，可以通过让多个三角形共用同一个顶点来减少数据量。

在WebGL中，顶点数据通常由以下信息组成：

3D空间中的位置信息：用三个浮点数（x、y、z）来表示。

顶点的纹理坐标：用二个浮点数（u、v）来表示。

顶点的法向量：用三个浮点数（x、y、z）来表示，用于计算光照。

其他属性：比如顶点颜色、透明度等。

在WebGL中，使用顶点法的一般步骤如下：

创建一个顶点着色器程序，用于处理顶点数据。

创建一个片段着色器程序，用于处理像素颜色。

加载3D模型数据，并将其转换为WebGL可以使用的格式。通常情况下，模型数据是从外部文件中加载的，如OBJ、PLY等格式。

将顶点数据传递给顶点着色器程序，用于渲染3D模型。

在片段着色器程序中计算像素颜色，并将其输出到屏幕上。

最后，使用WebGL的上下文将渲染结果显示在屏幕上。

通过使用顶点法，WebGL可以非常高效地渲染大量的复杂3D对象，实现更加逼真的3D场景。
![在这里插入图片描述](https://img-blog.csdnimg.cn/a09c6a0457154c5ba799e5dbb463fb85.png)

### 2.案例

```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Title</title>
  <script src="../lib/index.js"></script>
  <style>
    * {
      margin: 0;
      padding: 0;
    }

    canvas{
      margin: 50px auto 0;
      display: block;
      background: yellow;
    }
  </style>
</head>
<body>
  <canvas id="canvas" width="400" height="400">
    此浏览器不支持canvas
  </canvas>
</body>
</html>
<script>

  const ctx = document.getElementById('canvas')

  const gl = ctx.getContext('webgl')

  // 创建着色器源码
  const VERTEX_SHADER_SOURCE = `
    attribute vec4 aPosition;
    attribute vec4 aColor;
    varying vec4 vColor;

    uniform mat4 mat;
    void main() {
      gl_Position = mat * aPosition;
      vColor = aColor;
    }
  `; // 顶点着色器

  const FRAGMENT_SHADER_SOURCE = `
    precision lowp float;
    varying vec4 vColor;

    void main() {
      gl_FragColor = vColor;
    }
  `; // 片元着色器

  const program = initShader(gl, VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_SOURCE)

  const aPosition = gl.getAttribLocation(program, 'aPosition');
  const aColor = gl.getAttribLocation(program, 'aColor');
  const mat = gl.getUniformLocation(program, 'mat');

  // 顶点
  const v0 = [1,1,1];
  const v1 = [-1,1,1];
  const v2 = [-1,-1,1];
  const v3 = [1,-1,1];
  const v4 = [1,-1,-1];
  const v5 = [1,1,-1];
  const v6 = [-1,1,-1];
  const v7 = [-1,-1,-1];
  const points = new Float32Array([
    ...v0,...v1,...v2, ...v0,...v2, ...v3, // 前
    ...v0,...v3,...v4, ...v0,...v4, ...v5, // 右
    ...v0,...v5,...v6, ...v0,...v6, ...v1, // 上面
    ...v1,...v6,...v7, ...v1,...v7, ...v2, // 左
    ...v7,...v4,...v3, ...v7,...v3, ...v2, // 底
    ...v4,...v7,...v6, ...v4,...v6, ...v5, // 后
  ])

  const buffer = gl.createBuffer();

  const BYTES = points.BYTES_PER_ELEMENT;

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

  gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW);

  gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);

  gl.enableVertexAttribArray(aPosition)

  const colorData = new Float32Array([
    1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,
    0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,
    0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,
    1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,
  ])
  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, colorData, gl.STATIC_DRAW);
  gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(aColor)


  let eyex = 3;
  let eyey = 3;
  let eyez = 5;

  let deg = 0;
  function draw() {
    deg += 0.01;
    const rotate = getRotateMatrix(deg);
    const vm = getViewMatrix(eyex,eyey,eyez,0.0,0.0,0.0,0.0,0.6,0.0);
    const perspective = getPerspective(30, ctx.width / ctx.height, 100, 1);
    gl.enable(gl.DEPTH_TEST);
    gl.uniformMatrix4fv(mat, false, mixMatrix(mixMatrix(perspective, vm), rotate));
    gl.drawArrays(gl.TRIANGLES, 0, points.length / 3);

    requestAnimationFrame(draw)
  }

  draw()
</script>


```





1.索引法的概念
WEBGL中的索引法（Indexing）是一种优化渲染性能的技术，可以减少重复计算顶点的数量，同时可以减小传输数据量，提高渲染效率。

索引法可以通过一个索引数组（Index Array）来访问顶点数组（Vertex Array）中的数据，其中索引数组中的每一个元素都是一个指向顶点数组中一个顶点的指针。使用索引数组的好处在于，可以通过利用相同的顶点数据重复使用来减少重复计算顶点数据的次数，从而提高性能。

在WEBGL中，使用索引法需要使用两个缓冲区：一个用于存储顶点数据，另一个用于存储索引数据。在渲染过程中，WEBGL会从顶点缓冲区中读取顶点数据，然后根据索引缓冲区中的索引数组来访问顶点数据。

下面是一个使用索引法的WEBGL渲染流程：

1.创建并绑定顶点缓冲区和索引缓冲区；

2.向顶点缓冲区中写入顶点数据；

3.向索引缓冲区中写入索引数组；

4.使用gl.drawElements函数来进行渲染，该函数会读取顶点缓冲区中的顶点数据以及索引缓冲区中的索引数组，然后进行三角形绘制。

索引法在三维模型渲染中非常常用，既可以提高渲染效率，也可以减小传输数据量，减少网络带宽的占用。

2.案例
gl.drawElements（mode, count, type, offset）

mode同gldrawArrays0
count要绘制的顶点数量
type顶点数据类型
offset索引数组开始绘制的位置

![在这里插入图片描述](https://img-blog.csdnimg.cn/f5ee71d063cb46ca959202e6fbdef6ea.png)

```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Title</title>
  <script src="../lib/index.js"></script>
  <style>
    * {
      margin: 0;
      padding: 0;
    }

    canvas{
      margin: 50px auto 0;
      display: block;
      background: yellow;
    }
  </style>
</head>
<body>
<canvas id="canvas" width="400" height="400">
  此浏览器不支持canvas
</canvas>
</body>
</html>
<script>

  const ctx = document.getElementById('canvas')

  const gl = ctx.getContext('webgl')

  // 创建着色器源码
  const VERTEX_SHADER_SOURCE = `
    attribute vec4 aPosition;
    attribute vec4 aColor;
    varying vec4 vColor;

    uniform mat4 mat;
    void main() {
      gl_Position = mat * aPosition;
      vColor = aPosition;
    }
  `; // 顶点着色器

  const FRAGMENT_SHADER_SOURCE = `
    precision lowp float;
    varying vec4 vColor;

    void main() {
      gl_FragColor = vColor;
    }
  `; // 片元着色器

  const program = initShader(gl, VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_SOURCE)

  const aPosition = gl.getAttribLocation(program, 'aPosition');
  const aColor = gl.getAttribLocation(program, 'aColor');
  const mat = gl.getUniformLocation(program, 'mat');

  const vertices = new Float32Array([
     1, 1, 1,
    -1, 1, 1,
    -1,-1, 1,
     1,-1, 1,
     1,-1,-1,
     1, 1,-1,
    -1, 1,-1,
    -1,-1,-1,
  ])

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(aPosition)

  const indeces = new Uint8Array([
    0,1,2,0,2,3,
    0,3,4,0,4,5,
    0,5,6,0,6,1,
    1,6,7,1,7,2,
    7,4,3,7,3,2,
    4,6,7,4,6,5,
  ])
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indeces, gl.STATIC_DRAW);

  let eyex = 3;
  let eyey = 3;
  let eyez = 5;

  let deg = 0;
  function draw() {
    deg += 0.01;
    const rotate = getRotateMatrix(deg);
    const vm = getViewMatrix(eyex,eyey,eyez,0.0,0.0,0.0,0.0,0.6,0.0);
    const perspective = getPerspective(30, ctx.width / ctx.height, 100, 1);
    gl.enable(gl.DEPTH_TEST);
    gl.uniformMatrix4fv(mat, false, mixMatrix(mixMatrix(perspective, vm), rotate));
    gl.drawElements(gl.TRIANGLES, indeces.length, gl.UNSIGNED_BYTE, 0);

    requestAnimationFrame(draw)
  }

  draw()
</script>


```

![在这里插入图片描述](https://img-blog.csdnimg.cn/172c4db0360c44d788defb9df2f9b8e6.png)





```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Title</title>
  <script src="../lib/index.js"></script>
  <style>
    * {
      margin: 0;
      padding: 0;
    }

    canvas{
      margin: 50px auto 0;
      display: block;
      background: yellow;
    }
  </style>
</head>
<body>
<canvas id="canvas" width="400" height="400">
  此浏览器不支持canvas
</canvas>
</body>
</html>
<script>

  const ctx = document.getElementById('canvas')

  const gl = ctx.getContext('webgl')

  // 创建着色器源码
  const VERTEX_SHADER_SOURCE = `
    attribute vec4 aPosition;
    attribute vec4 aColor;
    varying vec4 vColor;

    uniform mat4 mat;
    void main() {
      gl_Position = mat * aPosition;
      vColor = aColor;
    }
  `; // 顶点着色器

  const FRAGMENT_SHADER_SOURCE = `
    precision lowp float;
    varying vec4 vColor;

    void main() {
      gl_FragColor = vColor;
    }
  `; // 片元着色器

  const program = initShader(gl, VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_SOURCE)

  const aPosition = gl.getAttribLocation(program, 'aPosition');
  const aColor = gl.getAttribLocation(program, 'aColor');
  const mat = gl.getUniformLocation(program, 'mat');

  const vertices = new Float32Array([
    // 0123
    1, 1, 1,
    -1, 1, 1,
    -1,-1, 1,
    1,-1, 1,
    // 0345
    1, 1, 1,
    1,-1, 1,
    1,-1,-1,
    1, 1,-1,
    // 0156
    1, 1, 1,
    1, 1, -1,
    -1, 1,-1,
    -1, 1,1,
    // 1267
    -1, 1, 1,
    -1,1, -1,
    -1, -1,-1,
    -1,-1,1,
    // 2347
    -1,-1, 1,
    1,-1, 1,
    1,-1,-1,
    -1,-1,-1,
    // 4567
    1,-1,-1,
    1, 1,-1,
    -1, 1,-1,
    -1,-1,-1,
  ])

  /*
     1, 1, 1,   0
    -1, 1, 1,   1
    -1,-1, 1,   2
     1,-1, 1,   3
     1,-1,-1,   4
     1, 1,-1,   5
    -1, 1,-1,   6
    -1,-1,-1,   7
  * */
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(aPosition)

  const colors = new Float32Array([
    0.4,0.4,1.0,0.4,0.4,1.0,0.4,0.4,1.0,0.4,0.4,1.0,
    0.4,1.0,0.4,0.4,1.0,0.4,0.4,1.0,0.4,0.4,1.0,0.4,
    1.0,0.4,0.4,1.0,0.4,0.4,1.0,0.4,0.4,1.0,0.4,0.4,
    1.0,1.0,0.4,1.0,1.0,0.4,1.0,1.0,0.4,1.0,1.0,0.4,
    1.0,0.0,1.0,1.0,0.0,1.0,1.0,0.0,1.0,1.0,0.0,1.0,
    0.0,1.0,1.0,0.0,1.0,1.0,0.0,1.0,1.0,0.0,1.0,1.0,
  ])

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
  gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(aColor)

  const indeces = new Uint8Array([
    0,1,2,0,2,3,
    4,5,6,4,6,7,
    8,9,10,8,10,11,
    12,13,14,12,14,15,
    16,17,18,16,18,19,
    20,21,22,20,22,23,
  ])
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indeces, gl.STATIC_DRAW);

  let eyex = 3;
  let eyey = 3;
  let eyez = 5;

  let deg = 0;
  function draw() {
    deg += 0.01;
    const rotate = getRotateMatrix(deg);
    const vm = getViewMatrix(eyex,eyey,eyez,0.0,0.0,0.0,0.0,0.6,0.0);
    const perspective = getPerspective(30, ctx.width / ctx.height, 100, 1);
    gl.enable(gl.DEPTH_TEST);
    gl.uniformMatrix4fv(mat, false, mixMatrix(mixMatrix(perspective, vm), rotate));
    gl.drawElements(gl.TRIANGLES, indeces.length, gl.UNSIGNED_BYTE, 0);

    requestAnimationFrame(draw)
  }

  draw()
</script>


```

![在这里插入图片描述](https://img-blog.csdnimg.cn/6aed23d257d14118a7de1b3b3743782a.png)

总结
WEBGL索引法是一种优化WEBGL绘制过程的技术，相比于顶点法有以下几个方面：

优化三角形绘制性能：使用索引法可以减少不必要的重复顶点处理，从而减少绘制三角形时的处理时间和内存消耗。

绘制大规模模型：在绘制大规模模型时，使用索引法可以显著地提高绘制效率，减少内存消耗，并且可以降低GPU的负载。

动态模型变形：在模型变形时，例如角色动画等，使用索引法能够避免重新计算和传递顶点数据，节省内存和处理时间，使动画更加流畅。

多个网格组合绘制：当需要绘制多个网格组合的模型时，使用索引法可以更容易地管理和组合数据。

WEBGL索引法可以帮助我们优化WEBGL绘制过程中的性能和效率，提高网页的用户体验和性能表现。
 
