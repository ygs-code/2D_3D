
# WebGL 图像处理

在WebGL中图像处理是比较简单的。到底有多简单，接着看。 此文上接 [WebGL 基础概念](https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-fundamentals.html)，如果没有读过我建议你 [先看这里](https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-fundamentals.html)。

在WebGL中绘制图片需要使用纹理。和WebGL渲染时需要裁剪空间坐标相似， 渲染纹理时需要纹理坐标，而不是像素坐标。无论纹理是什么尺寸，纹理坐标范围始终是 0.0 到 1.0 。

因为我们只用画一个矩形（其实是两个三角形），所以需要告诉WebGL矩形中每个顶点对应的纹理坐标。 我们将使用一种特殊的叫做'varying'的变量将纹理坐标从顶点着色器传到片段着色器，它叫做“可变量” 是因为它的值有很多个，WebGL会用顶点着色器中值的进行插值，然后传给对应像素执行的片段着色器。

接着用[上篇文章中最后一个顶点着色器](https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-fundamentals.html)， 我们需要添加一个属性，用它接收纹理坐标然后传给片段着色器。

```
attribute vec2 a_texCoord;...varying vec2 v_texCoord; void main() {   ...   // 将纹理坐标传给片段着色器   // GPU会在点之间进行插值   v_texCoord = a_texCoord;}
```

然后用片段着色器寻找纹理上对应的颜色

```
<script id="fragment-shader-2d" type="x-shader/x-fragment">
precision mediump float; // 纹理
uniform sampler2D u_image; // 从顶点着色器传入的纹理坐标
varying vec2 v_texCoord;
void main() {   // 在纹理上寻找对应颜色值 
gl_FragColor = texture2D(u_image, v_texCoord);
}
</script>
```

最后我们需要加载一个图像，创建一个纹理然后将图像复制到纹理中。 由于浏览器中的图片是异步加载的，所以我们需要重新组织一下代码， 等待纹理加载，一旦加载完成就开始绘制。

```
function main() {
  var image = new Image();
  image.src = "http://someimage/on/our/server";  // 必须在同一域名下
  image.onload = function() {
    render(image);
  }
}
 
function render(image) {
  ...
  // 之前的代码
  ...
  // 找到纹理的地址
  var texCoordLocation = gl.getAttribLocation(program, "a_texCoord");
 
  // 给矩形提供纹理坐标
  var texCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      0.0,  0.0,
      1.0,  0.0,
      0.0,  1.0,
      0.0,  1.0,
      1.0,  0.0,
      1.0,  1.0]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(texCoordLocation);
  gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);
 
  // 创建纹理
  var texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
 
  // 设置参数，让我们可以绘制任何尺寸的图像
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
 
  // 将图像上传到纹理
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  ...
}
```

这是WebGL绘制的图像。注意：如果你想在本地运行，需要使用一个简单的web服务， 使得WebGL可以加载本地图片。[在这里教你如何架设一个简单的web服务](https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-setup-and-installation.html)。
