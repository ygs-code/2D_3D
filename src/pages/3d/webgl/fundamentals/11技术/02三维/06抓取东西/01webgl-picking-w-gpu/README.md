# WebGL 抓取

这篇文章是关于如何使用 WebGL 来让用户抓取或选择对象。

如果你读过本网站的其他文章，你可能已经意识到 WebGL 本身只是一个栅格化库。它在画布上绘制三角形、直线和点。 它在画布上绘制三角形、线和点，所以它没有"选择对象"的概念，它只是通过你提供的着色器输出像素。 这意味着任何"抓取"对象的概念都必须来自你的代码，你需要自行定义你让用户选择对象的形式。 这也意味着虽然这篇文章可以覆盖(WebGL抓取的)常用概念，但你需要自己决定如何将你在这里看到的东西转化为你自己应用中可用的程序。

## 点击一个物体

关于找到用户点击的物体，一个最简单的方法是：为每一个对象赋予一个数字id，我们可以在关闭光照和纹理的情况下将数字id当作颜色绘制所有对象。 随后我们将得到一帧图片，上面绘制了所有物体的剪影，而深度缓冲会自动帮我们排序。 我们可以读取鼠标坐标下的像素颜色为数字id，就能得到这个位置上渲染的对应物体。

为了实现这一技术，我们需要结合以前的几篇文章。 第一篇是关于[绘制多个物体](https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-drawing-multiple-things.html), 参考它的内容，我们可以绘制多个物体并尝试抓取。

此外，我们需要在屏幕外渲染这些id，[渲染到纹理](https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-render-to-texture.html) 中的代码也将添加进来。

那么，让我们参考上个案例，在[多物体绘制](https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-drawing-multiple-things.html)中绘制了200个物体。

同时，让我们为它添加一个带有纹理和深度缓冲器的帧缓冲器，参考[渲染到纹理](https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-render-to-texture.html).