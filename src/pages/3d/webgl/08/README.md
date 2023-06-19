# 使用attribute变量

上一节我们写了一个最基础的Shader代码。如果我们要动态控制Shader里面的坐标和颜色，那要怎么做呢？

在OpenGL GLSL ES 变量中提供了一个attribute变量，他可以被用来从javaScript中向顶点着色器内传输数据，只有顶点着色器使用它。

1.为了使用attribute变量，声明attribute变量

2.将attribute变量赋值给gl_Position变量

3.向attribute变量传输数据



### 4.attribute变量

注意

attribute变量是只能在vertex shader中使用的变量。（它不能在fragment shader中声明attribute变量，也不能被fragment shader中使用）

一般用attribute变量来表示一些顶点的数据，如：顶点坐标，法线，纹理坐标，顶点颜色等。

在application中，一般用函数glBindAttribLocation（）来绑定每个attribute变量的位置，然后用函数glVertexAttribPointer（）为每个attribute变量赋值。

gl.getAttribLocation 函数规范如下

获取 由 name 参数指定的attribute变量的存储地址

参数   program   指定包含顶点这色器和片元着色器的着色器程序对象，

​           name        指定想要获取其存储地址的arrtibute变量的名称

返回值  大于等于0 或者 -1



### 设置值

  一旦将 attribute的变量的存储地址保存在JavaScript变量a_Position中，下面就需要使用该变了的着色器传入值，我们使用gl.vertexAttrib3f() 函数来完成这一步

```
   let Position = [
   0.0, // x
   0.0,  //y
   0.0,  // x
   1.0  // w
   ];
 // 将顶点位置输入给 attribute变量
  gl.vertexAttrib3f(a_Position,...Position);
```

gl.vertexAttrib3f() 的同族函数

gl.vertexAttrib1f(location,v0) 

gl.vertexAttrib2f(location, v0, v1,) 

gl.vertexAttrib3f(location, v0. v1, v2) 

gl.vertexAttrib4f(location,v0, v1, v2, v3) 

location 指定的attribute的变量存储位置 

v0, v1, v2, v3 指定给attribute变量的四个分量值

  gl.vertexAttrib3f  参数 有f和 i  如果是vertexAttrib3f 表示的是f使用浮点数据，i表示是整型数据

声明

存储限定符              类型             变量名称

  attribute                vec4           a_Position;  // 声明a_Position变量 



如果后面跟着v那么参数就可以使用数组传递

```

    let Position = [0.0, 0.0, 0.0, 1.0];
    // 将顶点位置输入给 attribute变量
    // 数组传递
    gl.vertexAttrib3fv(
        a_Position,
        new Float32Array(Position)
    );
```



a_PointSize 定义   a_PointSize  的类型是 float

```
    // 顶点着色器程序
    let vertexShader = `
      attribute vec4  a_Position;  // 声明a_Position变量
      attribute float a_PointSize; // 声明a_PointSize变量
      void main(){
        // vec4 表示是由4位float小数组成
        gl_Position = a_Position;
        // vec4(
        //   0.0,  // x 轴
        //   0.0,  // y轴
        //   0.0,   // z 轴
        //   1.0  // 偏移量缩放参数 但这个值最小值不能小于0
        //   );  // 表示顶点颜色的位置
        gl_PointSize = a_PointSize;   //w 表示顶点颜色的尺寸，设置越大，这个像素就会越大
      }
    `; 
    
    
    // ... 省略部分代码
    
        // 设置动态变量
    //获取arrtibute变量
    const a_Position = gl.getAttribLocation(gl.program, 'a_Position');

    if (a_Position < 0) {
        console.log('Failed to get the storage loacation of a_Position');
        return false;
    }

    const a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
    if (a_PointSize < 0) {
        console.log('Failed to get the storage loacation of a_PointSize');
        return false;
    }

    let PointSize = 10.0;
    let Position = [0.0, 0.0, 0.0, 1.0];
    // 将顶点位置输入给 attribute变量
    gl.vertexAttrib1f(a_PointSize,PointSize);
    // // 数组传递
    gl.vertexAttrib3fv(a_Position, new Float32Array(Position));
    
```









uniform变量在vertex和fragment两者之间声明方式完全一样，则它可以在vertex和fragment共享使用。（相当于一个被vertex和fragment shader共享的全局变量）

uniform变量一般用来表示：变换矩阵，材质，光照参数和颜色等信息。

以下是例子：

uniform mat4 viewProjMatrix; //投影+视图矩阵
uniform mat4 viewMatrix; //视图矩阵
uniform vec3 lightPosition; //光源位置
