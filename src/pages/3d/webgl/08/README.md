# 使用attribute变量

上一节我们写了一个最基础的Shader代码。如果我们要动态控制Shader里面的坐标和颜色，那要怎么做呢？

在OpenGL GLSL ES 变量中提供了一个attribute变量，他可以被用来从javaScript中向顶点着色器内传输数据，只有顶点着色器使用它。

1.为了使用attribute变量，声明attribute变量

2.将attribute变量赋值给gl_Position变量

3.向attribute变量传输数据



4.attribute变量

注意

attribute变量是只能在vertex shader中使用的变量。（它不能在fragment shader中声明attribute变量，也不能被fragment shader中使用）

一般用attribute变量来表示一些顶点的数据，如：顶点坐标，法线，纹理坐标，顶点颜色等。

在application中，一般用函数glBindAttribLocation（）来绑定每个attribute变量的位置，然后用函数glVertexAttribPointer（）为每个attribute变量赋值。



声明

存储限定符              类型             变量名称

  attribute                vec4           a_Position;  // 声明a_Position变量 



uniform变量在vertex和fragment两者之间声明方式完全一样，则它可以在vertex和fragment共享使用。（相当于一个被vertex和fragment shader共享的全局变量）

uniform变量一般用来表示：变换矩阵，材质，光照参数和颜色等信息。

以下是例子：

uniform mat4 viewProjMatrix; //投影+视图矩阵
uniform mat4 viewMatrix; //视图矩阵
uniform vec3 lightPosition; //光源位置
 