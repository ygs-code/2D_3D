现在又到你来玩的时候了。

- 降低颜色变化的速率，直到肉眼都看不出来。
- 加速变化，直到颜色静止不动。
- 玩一玩 RGB 三个通道，分别给三个颜色不同的变化速度，看看能不能做出有趣的效果。

## gl_FragCoord

就像 GLSL 有个默认输出值 `vec4 gl_FragColor` 一样，它也有一个默认输入值（ `vec4 gl_FragCoord` ）。`gl_FragCoord`存储了活动线程正在处理的**像素**或**屏幕碎片**的坐标。有了它我们就知道了屏幕上的哪一个线程正在运转。为什么我们不叫 `gl_FragCoord` uniform （统一值）呢？因为每个像素的坐标都不同，所以我们把它叫做 **varying**（变化值）。

```
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	gl_FragColor = vec4(st.x,st.y,0.0,1.0);
}
```

上述代码中我们用 `gl_FragCoord.xy` 除以 `u_resolution`，对坐标进行了**规范化**。这样做是为了使所有的值落在 `0.0` 到 `1.0` 之间，这样就可以轻松把 X 或 Y 的值映射到红色或者绿色通道。

在 shader 的领域我们没有太多要 debug 的，更多地是试着给变量赋一些很炫的颜色，试图做出一些效果。有时你会觉得用 GLSL 编程就像是把一搜船放到了瓶子里。它同等地困难、美丽而令人满足。

![img](https://thebookofshaders.com/03/08.png)

现在我们来检验一下我们对上面代码的理解程度。

- 你明白 `(0.0,0.0)` 坐标在画布上的哪里吗？
- 那 `(1.0,0.0)`, `(0.0,1.0)`, `(0.5,0.5)` 和 `(1.0,1.0)` 呢？
- 你知道如何用**未**规范化（normalized）的 `u_mouse` 吗？你可以用它来移动颜色吗？
- 你可以用 `u_time` 和 `u_mouse` 来改变颜色的图案吗？不妨琢磨一些有趣的途径。

经过这些小练习后，你可能会好奇还能用强大的 shader 做什么。接下来的章节你会知道如何把你的 shader 和 three.js，Processing，和 openFrameworks 结合起来。
