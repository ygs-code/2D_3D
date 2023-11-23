
# WebGL 三维透视投影

此文上接WebGL系列文章，从[基础概念](https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-fundamentals.html)开始， 上一篇是[三维的基础内容](https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-3d-orthographic.html)，如果没读过请从那里开始。

上一篇文章讲述了如何实现三维，那个三维用的不是透视投影， 而是的所谓的“正射”投影，但那不是我们日常观看三维的方式。

我们应使用透视投影代替它，但什么是透视投影？ 它的基础特性就是离得越远显得越小。

![](https://webglfundamentals.org/webgl/lessons/resources/perspective-example.svg)

在上方的示例中，远处的物体会变小，想要实现例子中近大远小的效果， 简单的做法就是将裁减空间中的 X 和 Y 值除以 Z 值。

你可以这么想：如果一个线段是 (10, 15) 到 (20,15)， 它长度为十个单位，在当前的代码中它就是 10 个像素长， 但是如果我们将它除以 Z ，且 Z 值 为 1

```
10 / 1 = 10
20 / 1 = 20
abs(10-20) = 10
```

它将是 10 个像素长，如果 Z 值为 2

```
10 / 2 = 5
20 / 2 = 10
abs(5 - 10) = 5
```

就是 5 像素了，当 Z 值为 3 时

```
10 / 3 = 3.333
20 / 3 = 6.666
abs(3.333 - 6.666) = 3.333
```

你可以看出随着 Z 变大距离就变远了，画的也会小一点。 如果我们除以裁剪空间中的 Z ，值可能会变大，因为 Z 是一个较小的值(-1 到 +1)。但是我们可以提供一个 fudgeFactor 因子和 Z 相乘，这样就可以调整缩放的程度。

让我们来试试，首先修改顶点着色器，除以 Z 再乘以我们的 "fudgeFactor" 因子。

```

<script id="vertex-shader-3d" type="x-shader/x-vertex">
...
uniform float u_fudgeFactor;
...
void main() {
  // 将位置和矩阵相乘
  vec4 position = u_matrix * a_position;
 
  // 调整除数
  float zToDivideBy = 1.0 + position.z * u_fudgeFactor;
 
  // x 和 y 除以调整后的除数
  gl_Position = vec4(position.xy / zToDivideBy, position.zw);
}
</script>
```

注意，由于裁减空间中的 Z 值是 -1 到 +1 的，所以 +1 是为了让 `zToDivideBy` 变成 0 到 +2 * fudgeFactor

还需要更新代码以设置 fudgeFactor。

```
 ...
  var fudgeLocation = gl.getUniformLocation(program, "u_fudgeFactor");
 
  ...
  var fudgeFactor = 1;
  ...
  function drawScene() {
    ...
    // 设置 fudgeFactor
    gl.uniform1f(fudgeLocation, fudgeFactor);
 
    // 绘制几何体
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 16 * 6;
    gl.drawArrays(primitiveType, offset, count);
```

这是结果。

<iframe src="https://webglfundamentals.org/webgl/webgl-3d-perspective.html?cid=8B504C1595CD3973&resid=8B504C1595CD3973%2126382&authkey=AJzDcN30q6g4W0Y&em=2" width="100%" height="400px" frameborder="0" scrolling="no"> </iframe>

如果效果不明显，可以将 "fudgeFactor" 滑块从 1.0 拖到 0.0 来对比没添加这些代码之前的样子。

![](https://webglfundamentals.org/webgl/lessons/resources/orthographic-vs-perspective.png)

orthographic vs perspective

正交视觉物体大小不会变，透视有近大远小感觉

事实上WebGL会将我们提供给 `gl_Position` 的 x,y,z,w 值自动除以 w 。

我们可以通过修改着色器来证明，用 `zToDivideBy` 代替 `gl_Position.w`

```

<script id="vertex-shader-2d" type="x-shader/x-vertex">
...
uniform float u_fudgeFactor;
...
void main() {
  // 将位置和矩阵相乘
  vec4 position = u_matrix * a_position;
 
  // 调整除数
  float zToDivideBy = 1.0 + position.z * u_fudgeFactor;
 
  // 将 x y z 除以 zToDivideBy
  gl_Position = vec4(position.xyz, zToDivideBy);
 
  // 传递颜色到给片段着色器
  v_color = a_color;
}
</script>
```

看他们多像。

当然可以这样写

```


attribute vec4 a_position;
attribute vec4 a_colors;

uniform mat4 u_matrix;
uniform float u_fudgeFactor;

varying vec4 v_colors;

void main(){
  // Multiply the position by the matrix.  //将位置乘以矩阵。
  vec4 position=u_matrix*a_position;
  
  // Adjust the z to divide by 调整z来除以
  float zToDivideBy=1.+position.z*u_fudgeFactor;
  
  // 展开x y z
  gl_Position=vec4(
    position.x,
    position.y,
    position.z,
    zToDivideBy
    );
  
  // Pass the color to the fragment shader.
  v_colors=a_colors;
}
```

<iframe src="https://webglfundamentals.org/webgl/webgl-3d-perspective-w.html?cid=8B504C1595CD3973&resid=8B504C1595CD3973%2126382&authkey=AJzDcN30q6g4W0Y&em=2" width="100%" height="400px" frameborder="0" scrolling="no"> </iframe>
