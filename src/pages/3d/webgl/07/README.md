# 源码解析



#  vertexShader, fragmentShader 解释

```
  // 顶点着色器程序
  let vertexShader = `
      void main(){
        gl_Position = vec4(0.0, 0.5, 0.0, 1.0);
        gl_PointSize = 10.0;
      }
    `; 

```

gl_Position 顶点着色器将指定顶点的位置，在这个示例中，点的位置是(0.0, 0.0, 0.0) 代表的是x，y，z ，w如果是(0.0, 0.0, 0.0) 代表是他在中心点的位置。 w参数 1.0是顶点偏移量一个缩放。 尺寸和x,y,z 轴偏移量有着一定关系，w越大，x轴固定的时候 x轴偏移量就越小，w参数越小, x轴如果是固定，偏移量就越大。w就像一个缩放偏移量的一个东西。最小值不能小于0 一般设置为 1.0

gl_PointSize 顶点颜色的 在画布中显示大小的一个尺寸

```
  // 片元着色器程序
  let fragmentShader = `
      void main(){
          gl_FragColor = vec4(1.0, 1.0, 0.0 , 1.0);   
      }
    `;
```

片元着色器将指定顶点的颜色。他的颜色构成是 rgba颜色

 vec4 表示是由4位float小数组成 



```
  // 第一步清空这个画布
  gl.clearColor(0.5, 0.5, 0.5, 1.0); // rgba()
  // 真正清空颜色 并填充为黑色

  //gl.COLOR_BUFFER_BIT  webgl 常量api
  gl.clear(
    // 指定颜色缓存
    gl.COLOR_BUFFER_BIT
  );
```



```
// 画一个点
  gl.drawArrays(
  gl.POINTS,  // 点
  0,
  1
  );
```

gl.drawArrays 是一个强大的函数，它可以绘制各种图形，该函数规范如下，

参数 mode 指定绘制的方式，可以接以下常量，

 gl.POINTS 点

gl.LINES   线

gl.LINE_STRIP,

gl.LINE_LOOP,

gl.TRIANGLES,

gl.TRIANGLE_STRIP,

gl.TRIANGLE_FAN,



第一个参数设置为 gl.POINTS 是因为要画一个点，第二个参数为0，表示从第1个顶点，虽然只有一个顶点，开始画起的，第三个参数count为1 表示这个程序只绘制了1个点。 

现在程序调用gl.drawArrays 顶点着色器会将被执行count次，每次处理一个顶点，在这个示例程序中，着色器 count被设置1 我们只绘制1个点，在着色器执行这个时候，将调用逐行执行内部main函数，将值(0.0, 0.0, 0.0, 1.0)赋给gl_Position ，将值10.0赋值给 gl_PointSize 





