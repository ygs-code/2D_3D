
# WebGL 三维正射投影

此文上接一系列相关文章，首先是[基础概念](https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-fundamentals.html)，上一篇是 [二维矩阵运算](https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-2d-matrices.html)，如果没读过请从那里开始。

上一篇文章概述了二维矩阵的工作原理，我们讲到了如何平移， 旋转，缩放甚至从像素空间投影到裁剪空间，并且将这些操作通过一个矩阵实现， 做三维只需要再迈出一小步。

二维例子中的二维点 (x, y) 与 3x3 的矩阵相乘， 在三维中我们需要三维点 (x, y, z) 与 4x4 的矩阵相乘。

让我们将上个例子改成三维的，这里会继续使用 F ，但是这次是三维的 'F' 。

首先需要修改顶点着色器以支持三维处理，这是原顶点着色器，

```
<script id="vertex-shader-2d" type="x-shader/x-vertex">
attribute vec2 a_position;
 
uniform mat3 u_matrix;
 
void main() {
  // 将位置和矩阵相乘
  gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);
}
</script>
```

这是新着色器

```

<script id="vertex-shader-3d" type="x-shader/x-vertex">
attribute vec4 a_position;
 
uniform mat4 u_matrix;
 
void main() {
  // 将位置和矩阵相乘
  gl_Position = u_matrix * a_position;
}
</script>
```

它甚至变简单了！在二维中我们提供 `x`和 `y`并设置 `z`为1， 在三维中我们将提供 `x`，`y`和 `z`，然后将 `w`设置为1, 而在属性中 `w`的默认值就是1，我们可以利用这点不用再次设置。

然后提供三维数据。

```

...
 
  // 告诉属性怎么从 positionBuffer (ARRAY_BUFFER) 中读取位置
  var size = 3;          // 每次迭代使用 3 个单位的数据
  var type = gl.FLOAT;   // 单位数据类型是32位的浮点型
  var normalize = false; // 不需要归一化数据
  var stride = 0;        // 0 = 移动距离 * 单位距离长度sizeof(type)  每次迭代跳多少距离到下一个数据
  var offset = 0;        // 从绑定缓冲的起始处开始
  gl.vertexAttribPointer(
      positionAttributeLocation, size, type, normalize, stride, offset);
 
  ...
 
// 填充当前 ARRAY_BUFFER 缓冲
// 使用组成 'F' 的数据填充缓冲.
function setGeometry(gl) {
  gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
           // 左竖
            0,   0,  0,
           30,   0,  0,
            0, 150,  0,
            0, 150,  0,
           30,   0,  0,
           30, 150,  0,
 
           // 上横
           30,   0,  0,
          100,   0,  0,
           30,  30,  0,
           30,  30,  0,
          100,   0,  0,
          100,  30,  0,
 
           // 下横
           30,  60,  0,
           67,  60,  0,
           30,  90,  0,
           30,  90,  0,
           67,  60,  0,
           67,  90,  0]),
      gl.STATIC_DRAW);
}
```

接下来把二维矩阵方法改成三维的

这是二维（之前的）版本的 m3.translation, m3.rotation, 和 m3.scaling 方法

```

var m3 = {
  translation: function translation(tx, ty) {
    return [
      1, 0, 0,
      0, 1, 0,
      tx, ty, 1
    ];
  },
 
  rotation: function rotation(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);
    return [
      c,-s, 0,
      s, c, 0,
      0, 0, 1
    ];
  },
 
  scaling: function scaling(sx, sy) {
    return [
      sx, 0, 0,
      0, sy, 0,
      0, 0, 1
    ];
  },
};
```

这是升级到三维的版本。

```

var m4 = {
  translation: function(tx, ty, tz) {
    return [
       1,  0,  0,  0,
       0,  1,  0,  0,
       0,  0,  1,  0,
       tx, ty, tz, 1,
    ];
  },
 
  xRotation: function(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);
 
    return [
      1, 0, 0, 0,
      0, c, s, 0,
      0, -s, c, 0,
      0, 0, 0, 1,
    ];
  },
 
  yRotation: function(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);
 
    return [
      c, 0, -s, 0,
      0, 1, 0, 0,
      s, 0, c, 0,
      0, 0, 0, 1,
    ];
  },
 
  zRotation: function(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);
 
    return [
       c, s, 0, 0,
      -s, c, 0, 0,
       0, 0, 1, 0,
       0, 0, 0, 1,
    ];
  },
 
  scaling: function(sx, sy, sz) {
    return [
      sx, 0,  0,  0,
      0, sy,  0,  0,
      0,  0, sz,  0,
      0,  0,  0,  1,
    ];
  },
};
```

注意到我们现在有三个旋转方法，在二维中只需要一个是因为我们只需要绕 Z 轴旋转，现在在三维中还可以绕 X 轴和 Y 轴旋转。它们看起来还是很简单， 如果使用它们后你会发现和之前一样

绕 Z 轴旋转

newX = x * c + y * s;

newY = x * -s + y * c;

绕 Y 轴旋转

newX = x * c + z * s;

newZ = x * -s + z * c;

绕 X 轴旋转

newY = y * c + z * s;

newZ = y * -s + z * c;

它们提供这些旋转方式。

<iframe src="https://webglfundamentals.org/webgl/lessons/resources/axis-diagram.html?cid=8B504C1595CD3973&resid=8B504C1595CD3973%2126382&authkey=AJzDcN30q6g4W0Y&em=2" width="700px" height="250px" frameborder="0" scrolling="no"> </iframe>

同样的我们将实现一些简单的方法

```

 translate: function(m, tx, ty, tz) {
    return m4.multiply(m, m4.translation(tx, ty, tz));
  },
 
  xRotate: function(m, angleInRadians) {
    return m4.multiply(m, m4.xRotation(angleInRadians));
  },
 
  yRotate: function(m, angleInRadians) {
    return m4.multiply(m, m4.yRotation(angleInRadians));
  },
 
  zRotate: function(m, angleInRadians) {
    return m4.multiply(m, m4.zRotation(angleInRadians));
  },
 
  scale: function(m, sx, sy, sz) {
    return m4.multiply(m, m4.scaling(sx, sy, sz));
  },
```

我们还需要更新投影方法，这是原代码

```

projection: function (width, height) {
    // 注意：这个矩阵翻转了 Y 轴，所以 0 在上方
    return [
      2 / width, 0, 0,
      0, -2 / height, 0,
      -1, 1, 1
    ];
  },
}
```

它将像素坐标转换到裁剪空间，在初次尝试三维时我们将这样做

```

 projection: function(width, height, depth) {
    // 注意：这个矩阵翻转了 Y 轴，所以 0 在上方
    return [
       2 / width, 0, 0, 0,
       0, -2 / height, 0, 0,
       0, 0, 2 / depth, 0,
      -1, 1, 0, 1,
    ];
  },
```

就像 X 和 Y 需要从像素空间转换到裁剪空间一样，Z 也需要。 在这个例子中我也将 Z 单位化了，我会传递一些和 `width` 相似的值给 `depth` ，所以我们的空间将会是 0 到 `width` 像素宽，0 到 `height` 像素高， 但是对于 `depth`将会是 `-depth / 2` 到 `+depth / 2` 。

最后需要更新计算矩阵的代码

```

 // 计算矩阵
  var matrix = m4.projection(gl.canvas.clientWidth, gl.canvas.clientHeight, 400);
  matrix = m4.translate(matrix, translation[0], translation[1], translation[2]);
  matrix = m4.xRotate(matrix, rotation[0]);
  matrix = m4.yRotate(matrix, rotation[1]);
  matrix = m4.zRotate(matrix, rotation[2]);
  matrix = m4.scale(matrix, scale[0], scale[1], scale[2]);
 
  // 设置矩阵
  gl.uniformMatrix4fv(matrixLocation, false, matrix);
```

这是结果
