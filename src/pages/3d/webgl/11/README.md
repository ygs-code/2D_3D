# 绘制一个三角形

## 使用缓冲区对象

缓冲区对象是webgl系统中的一个块存储区，可以在缓冲区对象中存储想要绘制的所有顶点数据。

向缓冲对象写入数据(顶点坐标)是一种特殊的JavaScript数据组，现在姑且可以把它看做是普通的数组。

var vertices = new Float32Array([

  0.0, 0.5, -0.5,

  0.0, 0.5, -0.5,

  0.0, 0.5, -0.5,

])

使用缓冲区对象向顶点着色器传入多个顶点的数据，需要遵循以下五个步骤，处理其他对象，如纹理，对象，

帧缓冲区对象，时的步骤比较类似。我们来研究下

 1.创建缓冲区对象  gl.createBuffer()

2.绑定缓冲区对象 gl.bindBuffer()

3.将数据写入缓冲区对象gl.bufferData

4.将缓冲区对象分配给一个attribute变量 gl.vertexAttribPointer()

5.开启attribute变量 gl.enableVertexAttribArray()



并且添加颜色