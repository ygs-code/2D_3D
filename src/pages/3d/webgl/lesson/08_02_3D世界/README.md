

文档 ： https://www.cnblogs.com/ZenleTim/articles/13278649.html



将讲解视图矩阵、投影矩阵；学习如何控制三维可视空间，处理物体的前后关系，以及绘制三维的立方体。

## 视图矩阵

**立方体由三角形构成。**绘制三维物体时，需要考虑它们的深度信息。

视图矩阵(view matrix)由以下三个矢量构成：

**视点**：观察者所处的位置。视线的起点，坐标(eyeX, eyeY, eyeZ)表示。

**观察目标点**：被观察目标所在的点。视线从视点出发，穿过观察目标点并继续延伸。观察目标点是一个点，而不是视线方向，只有同时知道观察目标点和视点，才能算出视线方向。坐标用(atX, atY, atZ)表示。

**上方向**：最终绘制在屏幕上的影像中的向上的方向。这个方向将观察者固定住了。用坐标(upX, upY, upZ)表示。

使用以下方法设置视图矩阵：

```js
Matrix4.setLookAt(eyeX, eyeY, eyeZ, atX, atY, atZ, upX, upY, upZ)
// 观察者的默认状态是：视点为系统原点(0,0,0)；视线为Z轴负方向，观察点为(0,0,-1)；上方向为Y轴负方向(0,1,0)
```

![img](https://pic2.zhimg.com/80/v2-4b2ddd0b8236385d7a095a9d3dcb714d_1440w.webp)

```js
// 视图矩阵为：
viewMatrix.setLookAt(0.20, 0.25, 0.25, 0, 0, 0, 0, 1.0, 0)

// 点坐标与颜色值
const datas = new Float32Array([
    0.0, 0.5, -0.4, 0.4, 1.0, 0.4,
    -0.5, -0.5, -0.4, 0.4, 1.0, 0.4,
    0.5, -0.5, -0.4, 1.0, 0.4, 0.4,

    0.5, 0.4, -0.2, 1.0, 0.4, 0.4,
    -0.5, 0.4, -0.2, 1.0, 1.0, 0.4,
    0.0, -0.6, -0.2, 1.0, 1.0, 0.4,

    0.0, 0.5, 0.0, 0.4, 0.4, 1.0,
    -0.5, -0.5, 0.0, 0.4, 0.4, 1.0,
    0.5, -0.5, 0.0, 1.0, 0.4, 0.4
])

// 顶点着色器
const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec4 a_Color;
    uniform mat4 u_ViewMatrix;
    varying vec4 v_Color;
    void main() {
        gl_Position = u_ViewMatrix * a_Position;
        v_Color = a_Color;
    }
`

// 片元着色器
const FSHADER_SOURCE = `
    precision mediump float;
    varying vec4 v_Color;
    void main() {
        gl_FragColor = v_Color;
    }
`
......
// 设置视图矩阵
const uViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix')
gl.uniformMatrix4fv(uViewMatrix, false, viewMatrix)

gl.clearColor(0.0, 0.0, 0.0, 1.0)
gl.clear(gl.COLOR_BUFFER_BIT)
gl.drawArrays(gl.TRIANGLES, 0, n)
```

视图矩阵被传给了顶点着色器，并与顶点坐标相乘。**“根据自定义的观察者状态，绘制观察者看到的景象”与“使用默认的观察状态，但对三维对象进行平移、旋转等变换，再绘制观察者看到的景象”，这两者行为是等价的。**

```js
"从视点看上去"的旋转顶点坐标 = 视图矩阵 * 旋转矩阵 * 原始顶点坐标 = 模型视图矩阵 * 原始顶点坐标
模型视图矩阵 = 视图矩阵 * 模型矩阵
```

模型视图矩阵的应用——旋转变换：

[20210611-13452411 播放 · 0 赞同视频![点击可播放视频](https://pic1.zhimg.com/v2-96d697afddead4011d87b541f0b6423a_r.jpg?source=2231c908)](https://www.zhihu.com/zvideo/1386680404838039552)

```js
const viewMatrix = new Matrix4()
viewMatrix.setLookAt(0.20, 0.25, 0.25, 0, 0, 0, 0, 1.0, 0)
const modelMatrix = new CuonMatrix4()
modelMatrix.setRotate(-20, 0, 0, 1) // 旋转矩阵
const modelViewMatrix = viewMatrix.multiply(modelMatrix)
```

简写成以下形式也可以：

```js
const modelViewMatrix = new Matrix4()
modelViewMatrix.setLookAt(0.20, 0.25, 0.25, 0, 0, 0, 0, 1.0, 0).rotate(-20, 0, 0, 1)
```

## 可视范围

当以上三角形旋转至某个位置时，会缺少一部分没显示出来。原因是没有指定**可视范围**，即实际观察得到的区域边界。WebGL只显示可视范围之内的区域。不绘制可视范围之外的对象，是降低程序开销的基本手段。人类能看到眼前范围的东西，水平视角大约200度左右。

水平视角、重置视角和可视深度，定义了**可视空间**。有两类可视空间，长方体可视空间（盒状空间，由**正射投影**产生）和四棱锥/金字塔可视空间（由**透视投影**产生）。

盒状可视空间由前后两个矩形表面确定，分别称为**近裁剪面**和**远裁剪面**，前者的四个顶点为(right, top, near)、(left, top, near)、(left, bottom, near)、(right, bottom, near)，而后者的四个顶点为(right, top, far)、(left, top, far)、(left, bottom, far)、(right, bottom, far)。canvas上显示的就是可视空间中物体在近裁剪面的投影。如果裁剪面的宽高比和canvas不一样，那么画面会被按照canvas的宽高比进行压缩，物体会被扭曲显示。

Matrix4.setOrtho()方法可以用来设置投影矩阵，定义盒状可视空间：

```js
Matrix4.setOrtho(left, right, bottom, top, near, far)
```

![img](https://pic4.zhimg.com/80/v2-84cdaf0d189e90fccbd6eacaa201f35f_1440w.webp)

```js
const projectMatrix = new Matrix4()
projectMatrix.setOrtho(-1, 1, -1, 1, -1.0, 2.0)
```

可视空间设置的足够大，没有再出现未能完整显示的情况：

```js
最终顶点坐标 = 投影矩阵 * 视图模型矩阵
```

使用透视投影矩阵，WebGL会自动将距离远的物体缩小显示，从而产生深度感。使用Matrix4对象的setPerspective()方法来定义透视投影可视空间。

```js
Matrix4.setPerspective(fov, aspect, near, far)
// fov：垂直视角，可视空间顶面和底面间的夹角，必须大于0
// aspect：近裁剪面的宽高比
// near，far：近裁剪面和远裁剪面的位置，near和far必须大于0
```

![img](https://pic3.zhimg.com/80/v2-14226348075dbad651c16f6759e6b3ae_1440w.webp)

```js
// 视图矩阵
const viewMatrix = new Matrix4()
viewMatrix.setLookAt(0, 0, 5, 0, 0, -100, 0, 1.0, 0)
const projectMatrix = new Matrix4()
const size = window.getComputedStyle(canvasRef.value, null)
// 投影矩阵
projectMatrix.setPerspective(30, parseInt(size.width) / parseInt(size.height), 1, 100)
const matrix = projectMatrix.multiply(viewMatrix)
```

顶点坐标的计算公式：

```js
投影矩阵 * 视图矩阵 * 模型矩阵 * 顶点坐标
```

## 隐藏面消除

在默认情况下，WebGL为了加速绘图操作，是按照顶点在缓冲区中的顺序来处理的。后绘制的图形将覆盖已经绘制好的图形。

![img](https://pic1.zhimg.com/80/v2-e96d8ea172b967b2cc76271f67b93da4_1440w.webp)

调整三角形顶点的位置，本该出现在最远处的绿色三角形，挡住了近处的黄色和蓝色三角形。WebGL提供了隐藏面消除功能，这个功能可以消除那些被遮挡的表面，可以放心地绘制场景而不必顾及各物体在缓冲区中的顺序：

```js
// 1.开启隐藏面消除功能
gl.enable(gl.DEPTH_TEST); // gl.DEPTH_TEST、gl.BLEND(混合)、gl.POLYGON_OFFSET_FILL(多边形位移)
// 2.在绘制前，清除深度缓冲区
gl.clear(gl.DEPTH_BUFFER_BIT)
```

深度缓冲区是一个中间对象，用来存储深度信息，其作用是帮助WebGL进行隐藏面消除，也称为Z缓存区。

```js
const gl = el.getContext('webgl2')
gl.enable(gl.DEPTH_TEST)
......
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT) // 清空颜色和深度缓冲区，每一帧绘制之前，都需要清空深度缓存区。
gl.drawArrays(gl.TRIANGLES, 0, n)
```

启用隐藏面消除：

![img](https://pic3.zhimg.com/80/v2-14226348075dbad651c16f6759e6b3ae_1440w.webp)

## 深度冲突

当物体表面过于接近时，深度缓冲区有限的精度已经不能区分哪个在前，哪个在后了。使用多边形偏移机制可以解决该问题，该机制将自动在Z值加上一个偏移量，偏移量的值由物体表面相对于观察者视线的角度来确定。

将6个三角形的Z值改成一样：

![img](https://pic3.zhimg.com/80/v2-ebbfea872ee1983ca803a6359d53e5c6_1440w.webp)

```js
// 1.启用多边形偏移
gl.enable(gl.POLYGON_OFFSET_FILL);
// 2.指定用来计算偏移量的参数
gl.polygonOffset(factor, units);
```

启用之后，效果好像不太明显：

![img](https://pic3.zhimg.com/80/v2-ebbfea872ee1983ca803a6359d53e5c6_1440w.webp)

## 立方体的绘制

使用gl.drawElements()代替gl.drawArrays()进行绘制，能够避免重复定义顶点，保持顶点数量最小。

```js
gl.drawElements(mode, count, type, offset) // 执行着色器，按照mode参数指定的方式，根据绑定到gl.ELEMENT_ARRAY_BUFFER的缓冲区中的顶点索引值绘制图形。
// mode：指定绘制方式，gl.POINTS、gl.LINES、gl.LINE_STRIP、gl.LINE_LOOP、gl.TRIANGLES、gl.TRIANGLE_STRIP、gl.TRIANGLE_FAN
// count：指定绘制顶点的个数
// type：指定索引值数据类型，gl.UNSIGNED_BYTE或者gl.UNSIGNED_SHORT
// offset：指定索引数组中开始绘制的位置，以字节为单位
```

实现代码如下：

```js
const initVertexBuffers = (gl) => {
    // 创建缓冲区
    const verticeColorBuffer = gl.createBuffer()
    const indexBuffer = gl.createBuffer()
    if (!verticeColorBuffer || !indexBuffer) {
        return -1
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, verticeColorBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, datas, gl.STATIC_DRAW)
    const eleSize = datas.BYTES_PER_ELEMENT

    const aPosition = gl.getAttribLocation(gl.program, 'a_Position')
    gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 6 * eleSize, 0)
    gl.enableVertexAttribArray(aPosition)

    const aColor = gl.getAttribLocation(gl.program, 'a_Color')
    gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 6 * eleSize, 3 * eleSize)
    gl.enableVertexAttribArray(aColor)

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)
    return indices.length
}

// 设置视图/变换矩阵
const uMatrix = gl.getUniformLocation(gl.program, 'u_Matrix')
gl.uniformMatrix4fv(uMatrix, false, matrix)

gl.clearColor(0.0, 0.0, 0.0, 1.0)
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0)
```

顶点颜色已经索引值数据：

```js
viewMatrix8.setPerspective(30, parseInt(size8.width) / parseInt(size8.height), 1, 100)
viewMatrix8.lookAt(3, 3, 7, 0, 0, 0, 0, 1.0, 0)
const datas4 = new Float32Array([
    1.0, 1.0, 1.0, 1.0, 1.0, 1.0, // v0 White
    -1.0, 1.0, 1.0, 1.0, 0.0, 1.0, // v1 Magenta
    -1.0, -1.0, 1.0, 1.0, 0.0, 0.0, // v2 Red
    1.0, -1.0, 1.0, 1.0, 1.0, 0.0, // v3 Yellow
    1.0, -1.0, -1.0, 0.0, 1.0, 0.0, // v4 Green
    1.0, 1.0, -1.0, 0.0, 1.0, 1.0, // v5 Cyan
    -1.0, 1.0, -1.0, 0.0, 0.0, 1.0, // v6 Blue
    -1.0, -1.0, -1.0, 0.0, 0.0, 0.0 // v7 Black
])
const indices = new Uint8Array([
    0, 1, 2, 0, 2, 3,
    0, 3, 4, 0, 4, 5,
    0, 5, 6, 0, 6, 1,
    1, 6, 7, 1, 7, 2,
    7, 4, 3, 7, 3, 2,
    4, 7, 6, 4, 6, 5
])
```

[20210611-13551449 播放 · 0 赞同视频![点击可播放视频](https://pic1.zhimg.com/v2-6c26172bd6071634d45d9b905b18244f_r.jpg?source=2231c908)](https://www.zhihu.com/zvideo/1386682764893224960)

在调用gl.drawElements()时，WebGL首先从绑定到gl.ELEMENT_ARRAY_BUFFER的缓冲区中获取顶点的索引值，然后根据该索引值，从绑定到gl.ARRAY_BUFFER的缓冲区中获取顶点的坐标、颜色等信息，然后传递给attribute变量执行顶点着色器。这种方式通过索引来访问数据，从而循环利用顶点信息，控制内存开销。

每个面单一颜色的立方体：

[20210611-13570614 播放 · 0 赞同视频![点击可播放视频](https://pic1.zhimg.com/v2-37823e2bf3fcbf556e7955ecc2f5e540_r.jpg?source=2231c908)](https://www.zhihu.com/zvideo/1386683209812344832)

需要使用24个顶点，每个面四个顶点设置成一致的颜色值：

```js
const datas = new Float32Array([
    1.0, 1.0, 1.0, 0.4, 0.4, 1.0, // front
    -1.0, 1.0, 1.0, 0.4, 0.4, 1.0,
    -1.0, -1.0, 1.0, 0.4, 0.4, 1.0,
    1.0, -1.0, 1.0, 0.4, 0.4, 1.0,

    1.0, 1.0, 1.0, 0.4, 1.0, 0.4, // right
    1.0, -1.0, 1.0, 0.4, 1.0, 0.4,
    1.0, -1.0, -1.0, 0.4, 1.0, 0.4,
    1.0, 1.0, -1.0, 0.4, 1.0, 0.4,

    1.0, 1.0, 1.0, 1.0, 0.4, 0.4, // up
    1.0, 1.0, -1.0, 1.0, 0.4, 0.4,
    -1.0, 1.0, -1.0, 1.0, 0.4, 0.4,
    -1.0, 1.0, 1.0, 1.0, 0.4, 0.4,

    -1.0, 1.0, 1.0, 1.0, 1.0, 0.4, // left
    -1.0, 1.0, -1.0, 1.0, 1.0, 0.4,
    -1.0, -1.0, -1.0, 1.0, 1.0, 0.4,
    -1.0, -1.0, 1.0, 1.0, 1.0, 0.4,

    -1.0, -1.0, -1.0, 1.0, 1.0, 1.0, // down
    1.0, -1.0, -1.0, 1.0, 1.0, 1.0,
    1.0, -1.0, 1.0, 1.0, 1.0, 1.0,
    -1.0, -1.0, 1.0, 1.0, 1.0, 1.0,

    1.0, -1.0, -1.0, 0.4, 1.0, 1.0, // back
    -1.0, -1.0, -1.0, 0.4, 1.0, 1.0,
    -1.0, 1.0, -1.0, 0.4, 1.0, 1.0,
    1.0, 1.0, -1.0, 0.4, 1.0, 1.0
])
const indices = new Uint8Array([
    0, 1, 2, 0, 2, 3,
    4, 5, 6, 4, 6, 7,
    8, 9, 10, 8, 10, 11,
    12, 13, 14, 12, 14, 15,
    16, 17, 18, 16, 18, 19,
    20, 21, 22, 20, 22, 23
])
```