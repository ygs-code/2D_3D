# WebGL 三维纹理

此文上接一系列WebGL文章，从[基础概念](https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-fundamentals.html)开始， 上一篇讲的是[动画](https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-animation.html)。

在WebGL中如何使用纹理？你可能会从[二维图像处理的文章](https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-image-processing.html) 中得到启发，如果我们讲的再深入一点可能更好理解。

首先需要调整着色器以便使用纹理，这里是顶点着色器的修改部分， 我们需要传递纹理坐标，在这个例子中直接将它们传到片段着色器中。

```
attribute vec4 a_position;
attribute vec2 a_texcoord;
 
uniform mat4 u_matrix;
 
varying vec2 v_texcoord;
 
void main() {
  // 将位置和矩阵相乘
  gl_Position = u_matrix * a_position;
 
  // 传递纹理坐标到片段着色器
  v_texcoord = a_texcoord;
}
```

在片段着色器中声明一个 sampler2D 类型的全局变量，可以让我们引用一个纹理， 然后使用从顶点着色器传入的纹理坐标调用 `texture2D` 方法， 在纹理上找到对应的颜色。

```
precision mediump float;
 
// 从顶点着色器中传入的值
varying vec2 v_texcoord;
 
// 纹理
uniform sampler2D u_texture;
 
void main() {
   gl_FragColor = texture2D(u_texture, v_texcoord);
}
```

我们需要设置纹理坐标

```
// 找到顶点坐标中的属性
var positionLocation = gl.getAttribLocation(program, "a_position");
var texcoordLocation = gl.getAttribLocation(program, "a_texcoord");
 
...
 
// 为纹理坐标创建一个缓冲
var buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.enableVertexAttribArray(texcoordLocation);
 
// 以浮点型格式传递纹理坐标
gl.vertexAttribPointer(texcoordLocation, 2, gl.FLOAT, false, 0, 0);
 
// 设置纹理坐标
setTexcoords(gl);
```

如你所见，我们将图像映射到 'F' 中的每个矩形面上。

```
// 为 F 设置纹理坐标缓冲
function setTexcoords(gl) {
  gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        // 正面左竖
        0, 0,
        0, 1,
        1, 0,
        0, 1,
        1, 1,
        1, 0,
 
        // 正面上横
        0, 0,
        0, 1,
        1, 0,
        0, 1,
        1, 1,
        1, 0,
 ...
       ]),
       gl.STATIC_DRAW);
```

我们还需要一个纹理，我们可以从头做一个但在这个例子中就直接加载一个图像把， 因为那可能是常用的做法。

这是我们将要使用的图像

![img](https://webglfundamentals.org/webgl/resources/f-texture.png)

一颗赛艇的图像！事实上使用一个带有 'F' 的图像能够在结果中清楚的分辨出纹理的方向。

加载图像的过程是异步的，我们请求图像资源后浏览器需要一段时间去下载。 通常有两种处理方法，一种是等纹理下载完成后再开始绘制，另一种是在图像加载前使用生成的纹理， 这种方式可以立即启动渲染，一旦图像下载完成就拷贝到纹理。我们将使用下方的方法。

```
// 创建一个纹理
var texture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, texture);
 
// 用 1x1 个蓝色像素填充纹理
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
              new Uint8Array([0, 0, 255, 255]));
 
// 异步加载图像
var image = new Image();
image.src = "resources/f-texture.png";
image.addEventListener('load', function() {
  // 现在图像加载完成，拷贝到纹理中
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
  gl.generateMipmap(gl.TEXTURE_2D);
});
```

这是结果

<iframe src="https://webglfundamentals.org/webgl/webgl-3d-textures.html?cid=8B504C1595CD3973&resid=8B504C1595CD3973%2126382&authkey=AJzDcN30q6g4W0Y&em=2" width="700px" height="400px" frameborder="0" scrolling="no"> </iframe>



WebGL限制了纹理的维度必须是2的整数次幂， 2 的幂有 1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 等等。 'F' 纹理是 256 × 256，256 是 2 的幂。键盘纹理是 320x240，都不是 2 的幂， 所以显示纹理失败，在着色器中当 `texture2D` 被调用的时候由于纹理没有正确设置， 就会使用颜色 (0, 0, 0, 1) 也就是黑色。如果打开 JavaScript 控制台或者浏览器控制台， 根据浏览器不同可能会显示不同的错误信息，像这样

```
WebGL: INVALID_OPERATION: generateMipmap: level 0 not power of 2
   or not all the same size
WebGL: drawArrays: texture bound to texture unit 0 is not renderable.
   It maybe non-power-of-2 and have incompatible texture filtering or
   is not 'texture complete'.
```

解决这个问题只需要将包裹模式设置为 `CLAMP_TO_EDGE` 并且通过设置过滤器为 `LINEAR` or `NEAREST` 来关闭贴图映射。

让我们来更新图像加载的代码解决这个问题，首先需要一个方法判断一个数是不是 2 的幂。

```
function isPowerOf2(value) {
  return (value & (value - 1)) == 0;
}
```

我不准备深入讲解二进制运算，以及它的的原理。有了它后，就可以这样使用。

```
// 异步加载图像
var image = new Image();
image.src = "resources/keyboard.jpg";
image.addEventListener('load', function() {
  // 现在有了图像，拷贝到纹理
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
 
  // 检查每个维度是否是 2 的幂
  if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
     // 是 2 的幂，一般用贴图
     gl.generateMipmap(gl.TEXTURE_2D);
  } else {
     // 不是 2 的幂，关闭贴图并设置包裹模式为到边缘
     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  }
}
```

一个常见的问题是“如何为立方体的每个面设置不同的图像？”，假设我们有 6 个这样的图片。

| ![img](https://webglfundamentals.org/webgl/lessons/resources/noodles-01.jpg) | ![img](https://webglfundamentals.org/webgl/lessons/resources/noodles-02.jpg) | ![img](https://webglfundamentals.org/webgl/lessons/resources/noodles-03.jpg) |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| ![img](https://webglfundamentals.org/webgl/lessons/resources/noodles-04.jpg) | ![img](https://webglfundamentals.org/webgl/lessons/resources/noodles-05.jpg) | ![img](https://webglfundamentals.org/webgl/lessons/resources/noodles-06.jpg) |

脑中出现了 3 个答案

\1) 制作一个复杂的着色器，引用 6 个纹理，传入一些额外的顶点信息表明使用的纹理是什么。**不要这样做！** 稍微一想就知道你要写一大堆不同的着色器应用于不同面数量的图形之类。

\2) 绘制 6 个面代替立方体，这是常用的解决办法，不错但是只能用在简单的图形例如立方体。 如果有一个包含 1000 个方形的图形就要绘制 1000 个面，会非常慢。

\3) 我敢说，**最好的方法**就是将图像放在一个纹理中，然后利用纹理坐标映射不同的图像到每个面， 这是很多高性能应用（读作**游戏**）使用的技术。例如我们将所有的图像放入这样一个纹理中

![img](https://webglfundamentals.org/webgl/resources/noodles.jpg)

然后为立方体的每个面设置不同的纹理坐标。



```
  // 选择左下图
    0   , 0  ,
    0   , 0.5,
    0.25, 0  ,
    0   , 0.5,
    0.25, 0.5,
    0.25, 0  ,
    // 选择中下图
    0.25, 0  ,
    0.5 , 0  ,
    0.25, 0.5,
    0.25, 0.5,
    0.5 , 0  ,
    0.5 , 0.5,
    // 选择中右图
    0.5 , 0  ,
    0.5 , 0.5,
    0.75, 0  ,
    0.5 , 0.5,
    0.75, 0.5,
    0.75, 0  ,
    // 选择左上图
    0   , 0.5,
    0.25, 0.5,
    0   , 1  ,
    0   , 1  ,
    0.25, 0.5,
    0.25, 1  ,
    // 选择中上图
    0.25, 0.5,
    0.25, 1  ,
    0.5 , 0.5,
    0.25, 1  ,
    0.5 , 1  ,
    0.5 , 0.5,
    // 选择右上图
    0.5 , 0.5,
    0.75, 0.5,
    0.5 , 1  ,
    0.5 , 1  ,
    0.75, 0.5,
    0.75, 1  ,
```

然后得到

