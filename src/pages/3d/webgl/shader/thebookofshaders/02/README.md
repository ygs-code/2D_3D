## Uniforms

现在我们知道了 GPU 如何处理并行线程，每个线程负责给完整图像的一部分配置颜色。尽管每个线程和其他线程之间不能有数据交换，但我们能从 CPU 给每个线程输入数据。因为显卡的架构，所有线程的输入值必须 **统一** （uniform），而且必须设为 **只读** 。也就是说，每条线程接收相同的数据，并且是不可改变的数据。

这些输入值叫做 `uniform` （统一值），它们的数据类型通常为：`float`, `vec2`, `vec3`, `vec4`, `mat2`, `mat3`, `mat4`, `sampler2D` and `samplerCube`。uniform 值需要数值类型前后一致。且在 shader 的开头，在设定精度之后，就对其进行定义。



```
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution; // 画布尺寸（宽，高）
uniform vec2 u_mouse;      // 鼠标位置（在屏幕上哪个像素）
uniform float u_time;     // 时间（加载后的秒数）
```

你可以把 uniforms 想象成连通 GPU 和 CPU 的许多小的桥梁。虽然这些 uniforms 的名字千奇百怪，但是在这一系列的例子中我一直有用到：`u_time` （时间）, `u_resolution` （画布尺寸）和 `u_mouse` （鼠标位置）。按业界传统应在 uniform 值的名字前加 `u_` ，这样一看即知是 uniform。尽管如此你也还会见到各种各样的名字。比如[ShaderToy.com](https://www.shadertoy.com/)就用了如下的名字：

```
uniform vec3 iResolution;   // 视口分辨率（以像素计）
uniform vec4 iMouse;        // 鼠标坐标 xy： 当前位置, zw： 点击位置
uniform float iTime;        // shader 运行时间（以秒计）
```







好了说的足够多了，我们来看看实际操作中的 uniform 吧。在下面的代码中我们使用 `u_time` 加上一个 sin 函数，来展示图中红色的动态变化。

```
#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;

void main() {
	gl_FragColor = vec4(abs(sin(u_time)),0.0,0.0,1.0);
}
```

GLSL 还有更多惊喜。GPU 的硬件加速支持我们使用角度，三角函数和指数函数。这里有一些这些函数的介绍：[`sin()`](https://thebookofshaders.com/glossary/?search=sin), [`cos()`](https://thebookofshaders.com/glossary/?search=cos), [`tan()`](https://thebookofshaders.com/glossary/?search=tan), [`asin()`](https://thebookofshaders.com/glossary/?search=asin), [`acos()`](https://thebookofshaders.com/glossary/?search=acos), [`atan()`](https://thebookofshaders.com/glossary/?search=atan), [`pow()`](https://thebookofshaders.com/glossary/?search=pow), [`exp()`](https://thebookofshaders.com/glossary/?search=exp), [`log()`](https://thebookofshaders.com/glossary/?search=log), [`sqrt()`](https://thebookofshaders.com/glossary/?search=sqrt), [`abs()`](https://thebookofshaders.com/glossary/?search=abs), [`sign()`](https://thebookofshaders.com/glossary/?search=sign), [`floor()`](https://thebookofshaders.com/glossary/?search=floor), [`ceil()`](https://thebookofshaders.com/glossary/?search=ceil), [`fract()`](https://thebookofshaders.com/glossary/?search=fract), [`mod()`](https://thebookofshaders.com/glossary/?search=mod), [`min()`](https://thebookofshaders.com/glossary/?search=min), [`max()`](https://thebookofshaders.com/glossary/?search=max) 和 [`clamp()`](https://thebookofshaders.com/glossary/?search=clamp)。
