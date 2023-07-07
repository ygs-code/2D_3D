学习文档
 https://blog.csdn.net/qq_45562973/article/details/124169184
// 官网文档
https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas





# CanvasRenderingContext2D

**`CanvasRenderingContext2D`**接口是 Canvas API 的一部分，可为[``](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/canvas)元素的绘图表面提供 2D 渲染上下文。它用于绘制形状，文本，图像和其他对象。

请参阅侧边栏和下方的界面属性和方法。 [Canvas 教程](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial)提供了更多的信息，例子和资源。

## [基础示例](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D#%E5%9F%BA%E7%A1%80%E7%A4%BA%E4%BE%8B)

要获得`CanvasRenderingContext2D` 实例，您必须首先具有 HTML `<canvas>`元素才能使用：

HTMLPlayCopy to Clipboard

```
<canvas id="my-house" width="300" height="300"></canvas>

```

要获取画布的 2D 渲染上下文，请在`<canvas>`元素上调用[`getContext()`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLCanvasElement/getContext)，并提供`'2d'`作为参数：

JSPlayCopy to Clipboard

```
const canvas = document.getElementById("my-house");
const ctx = canvas.getContext("2d");

```

有了上下文，您就可以绘制任何喜欢的东西。此代码绘制了一个房子：

JSPlayCopy to Clipboard

```
// Set line width
ctx.lineWidth = 10;

// Wall
ctx.strokeRect(75, 140, 150, 110);

// Door
ctx.fillRect(130, 190, 40, 60);

// Roof
ctx.beginPath();
ctx.moveTo(50, 140);
ctx.lineTo(150, 60);
ctx.lineTo(250, 140);
ctx.closePath();
ctx.stroke();

```

生成的图形如下所示：

Play

## [绘制矩形](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D#%E7%BB%98%E5%88%B6%E7%9F%A9%E5%BD%A2)

以下是 3 个绘制矩形位图的方法。

- [`CanvasRenderingContext2D.clearRect()`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/clearRect)

  设置指定矩形区域内（以 点 *(x, y)* 为起点，范围是*(width, height)* ）所有像素变成透明，并擦除之前绘制的所有内容。

- [`CanvasRenderingContext2D.fillRect()`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/fillRect)

  绘制填充矩形，矩形的起点在 *(x, y)* 位置，矩形的尺寸是 *width* 和 *height*。

- [`CanvasRenderingContext2D.strokeRect()`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/strokeRect)

  在 canvas 中，使用当前的笔触样式，描绘一个起点在 *(x, y)*、宽度为 *w*、高度为 *h* 的矩形。

## [绘制文本](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D#%E7%BB%98%E5%88%B6%E6%96%87%E6%9C%AC)

下面是绘制文本的方法。参见 [`TextMetrics`](https://developer.mozilla.org/zh-CN/docs/Web/API/TextMetrics) 对象获取文本属性。

- [`CanvasRenderingContext2D.fillText()`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/fillText)

  在 (x,y) 位置绘制（填充）文本。

- [`CanvasRenderingContext2D.strokeText()`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/strokeText)

  在 (x,y) 位置绘制（描边）文本。

- [`CanvasRenderingContext2D.measureText()`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/measureText)

  返回 [`TextMetrics`](https://developer.mozilla.org/zh-CN/docs/Web/API/TextMetrics) 对象。

## [线型](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D#%E7%BA%BF%E5%9E%8B)

下面的方法和属性控制如何绘制线。

- [`CanvasRenderingContext2D.lineWidth`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/lineWidth)

  线的宽度。默认 `1.0`

- [`CanvasRenderingContext2D.lineCap`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/lineCap)

  线末端的类型。允许的值： `butt` (默认), `round`, `square`.

- [`CanvasRenderingContext2D.lineJoin`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/lineJoin)

  定义两线相交拐点的类型。允许的值：`round`, `bevel`, `miter`(默认)。

- [`CanvasRenderingContext2D.miterLimit`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/miterLimit)

  斜接面限制比例。默认 `10`。

- [`CanvasRenderingContext2D.getLineDash()`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/getLineDash)

  返回当前线段样式的数组，数组包含一组数量为偶数的非负数数字。

- [`CanvasRenderingContext2D.setLineDash()`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/setLineDash)

  设置当前的线段样式。

- [`CanvasRenderingContext2D.lineDashOffset`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/lineDashOffset)

  描述在哪里开始绘制线段。

## [文本样式](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D#%E6%96%87%E6%9C%AC%E6%A0%B7%E5%BC%8F)

下面的属性控制如何设计文本。

- [`CanvasRenderingContext2D.font`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/font)

  字体设置。默认值 `10px sans-serif`。

- [`CanvasRenderingContext2D.textAlign`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/textAlign)

  文本对齐设置。允许的值： `start` (默认), `end`, `left`, `right` 或 `center`.

- [`CanvasRenderingContext2D.textBaseline`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/textBaseline)

  基线对齐设置。允许的值： `top`, `hanging`, `middle`, `alphabetic` (默认), `ideographic`, `bottom`.

- [`CanvasRenderingContext2D.direction`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/direction)

  文本的方向。允许的值： `ltr`, `rtl`, `inherit` (默认).

## [填充和描边样式](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D#%E5%A1%AB%E5%85%85%E5%92%8C%E6%8F%8F%E8%BE%B9%E6%A0%B7%E5%BC%8F)

填充设计用于图形内部的颜色和样式，描边设计用于图形的边线。

- [`CanvasRenderingContext2D.fillStyle`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/fillStyle)

  图形内部的颜色和样式。默认 `#000` (黑色).

- [`CanvasRenderingContext2D.strokeStyle`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/strokeStyle)

  图形边线的颜色和样式。默认 `#000` (黑色).

## [渐变和图案](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D#%E6%B8%90%E5%8F%98%E5%92%8C%E5%9B%BE%E6%A1%88)

- [`CanvasRenderingContext2D.createLinearGradient()`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/createLinearGradient)

  创建一个沿着参数坐标指定的线的线性渐变。

- [`CanvasRenderingContext2D.createRadialGradient()`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/createRadialGradient)

  创建一个沿着参数坐标指定的线的放射性性渐变。

- [`CanvasRenderingContext2D.createPattern()`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/createPattern)

  使用指定的图片 (a [`CanvasImageSource`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D)) 创建图案。通过 repetition 变量指定的方向上重复源图片。此方法返回 [`CanvasPattern`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasPattern)对象。

## [阴影](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D#%E9%98%B4%E5%BD%B1)

- [`CanvasRenderingContext2D.shadowBlur`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/shadowBlur)

  描述模糊效果。默认 `0`

- [`CanvasRenderingContext2D.shadowColor`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/shadowColor)

  阴影的颜色。默认 fully-transparent black.

- [`CanvasRenderingContext2D.shadowOffsetX`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/shadowOffsetX)

  阴影水平方向的偏移量。默认 0.

- [`CanvasRenderingContext2D.shadowOffsetY`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/shadowOffsetY)

  阴影垂直方向的偏移量。默认 0.

## [路径](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D#%E8%B7%AF%E5%BE%84)

下面的方法用来操作对象的路径。

- [`CanvasRenderingContext2D.beginPath()`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/beginPath)

  清空子路径列表开始一个新的路径。当你想创建一个新的路径时，调用此方法。

- [`CanvasRenderingContext2D.closePath()`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/closePath)

  使笔点返回到当前子路径的起始点。它尝试从当前点到起始点绘制一条直线。如果图形已经是封闭的或者只有一个点，那么此方法不会做任何操作。

- [`CanvasRenderingContext2D.moveTo()`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/moveTo)

  将一个新的子路径的起始点移动到 (x，y) 坐标。

- [`CanvasRenderingContext2D.lineTo()`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/lineTo)

  使用直线连接子路径的最后的点到 x,y 坐标。

- [`CanvasRenderingContext2D.bezierCurveTo()`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/bezierCurveTo)

  添加一个 3 次贝赛尔曲线路径。该方法需要三个点。第一、第二个点是控制点，第三个点是结束点。起始点是当前路径的最后一个点，绘制贝赛尔曲线前，可以通过调用 `moveTo()` 进行修改。

- [`CanvasRenderingContext2D.quadraticCurveTo()`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/quadraticCurveTo)

  添加一个 2 次贝赛尔曲线路径。

- [`CanvasRenderingContext2D.arc()`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/arc)

  绘制一段圆弧路径，圆弧路径的圆心在 *(x, y)* 位置，半径为 *r*，根据*anticlockwise* （默认为顺时针）指定的方向从 *startAngle* 开始绘制，到 *endAngle* 结束。

- [`CanvasRenderingContext2D.arcTo()`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/arcTo)

  根据控制点和半径绘制圆弧路径，使用当前的描点 (前一个 moveTo 或 lineTo 等函数的止点)。根据当前描点与给定的控制点 1 连接的直线，和控制点 1 与控制点 2 连接的直线，作为使用指定半径的圆的**切线**，画出两条切线之间的弧线路径。

- [`CanvasRenderingContext2D.ellipse()`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/ellipse) 实验性

  添加一个椭圆路径，椭圆的圆心在（x,y）位置，半径分别是*radiusX* 和 *radiusY*，按照*anticlockwise* （默认顺时针）指定的方向，从 *startAngle* 开始绘制，到 *endAngle* 结束。

- [`CanvasRenderingContext2D.rect()`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/rect)

  创建一个矩形路径，矩形的起点位置是 *(x, y)*，尺寸为 *width* 和 *height*。

## [绘制路径](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D#%E7%BB%98%E5%88%B6%E8%B7%AF%E5%BE%84)

- [`CanvasRenderingContext2D.fill()`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/fill)

  使用当前的样式填充子路径。

- [`CanvasRenderingContext2D.stroke()`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/stroke)

  使用当前的样式描边子路径。

- [`CanvasRenderingContext2D.drawFocusIfNeeded()`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/drawFocusIfNeeded)

  如果给定的元素获取了焦点，那么此方法会在当前的路径绘制一个焦点。

- [`CanvasRenderingContext2D.scrollPathIntoView()`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/scrollPathIntoView)

  将当前或给定的路径滚动到窗口。

- [`CanvasRenderingContext2D.clip()`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/clip)

  从当前路径创建一个剪切路径。在 **clip()** 调用之后，绘制的所有信息只会出现在剪切路径内部。例如：参见 Canvas 教程中的 [剪切路径](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial/Compositing) 。

- [`CanvasRenderingContext2D.isPointInPath()`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/isPointInPath)

  判断当前路径是否包含检测点。

- [`CanvasRenderingContext2D.isPointInStroke()`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/isPointInStroke)

  判断检测点是否在路径的描边线上。

## [变换](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D#%E5%8F%98%E6%8D%A2)

在 `CanvasRenderingContext2D` 渲染背景中的对象会有一个当前的变换矩阵，一些方法可以对其进行控制。当创建当前的默认路径，绘制文本、图形和 [`Path2D`](https://developer.mozilla.org/zh-CN/docs/Web/API/Path2D) 对象的时候，会应用此变换矩阵。下面列出的方法保持历史和兼容性的原因，是为了 [`DOMMatrix`](https://developer.mozilla.org/zh-CN/docs/Web/API/DOMMatrix) 对象现在能够应用于大部分 API，将来会被替换。

- [`CanvasRenderingContext2D.rotate()`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/rotate)

  在变换矩阵中增加旋转，角度变量表示一个顺时针旋转角度并且用弧度表示。

- [`CanvasRenderingContext2D.scale()`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/scale)

  根据 x 水平方向和 y 垂直方向，为 canvas 单位添加缩放变换。

- [`CanvasRenderingContext2D.translate()`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/translate)

  通过在网格中移动 canvas 和 canvas 原点 x 水平方向、原点 y 垂直方向，添加平移变换

- [`CanvasRenderingContext2D.transform()`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/transform)

  使用方法参数描述的矩阵多次叠加当前的变换矩阵。

- [`CanvasRenderingContext2D.setTransform()`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/setTransform)

  重新设置当前的变换为单位矩阵，并使用同样的变量调用 **transform()** 方法。

- [`CanvasRenderingContext2D.resetTransform()`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/resetTransform) 实验性

  使用单位矩阵重新设置当前的变换。

## [合成](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D#%E5%90%88%E6%88%90)

- [`CanvasRenderingContext2D.globalAlpha`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/globalAlpha)

  在合成到 canvas 之前，设置图形和图像透明度的值。默认 `1.0` (不透明)。

- [`CanvasRenderingContext2D.globalCompositeOperation`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation)

  通过 `globalAlpha` 应用，设置如何在已经存在的位图上绘制图形和图像。

## [绘制图像](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D#%E7%BB%98%E5%88%B6%E5%9B%BE%E5%83%8F)

- [`CanvasRenderingContext2D.drawImage()`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/drawImage)

  绘制指定的图片。该方法有多种格式，提供了很大的使用灵活性。

## [像素控制](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D#%E5%83%8F%E7%B4%A0%E6%8E%A7%E5%88%B6)

参见 [`ImageData`](https://developer.mozilla.org/zh-CN/docs/Web/API/ImageData) 对象。

- [`CanvasRenderingContext2D.createImageData()`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/createImageData)

  使用指定的尺寸，创建一个新的、空白的 [`ImageData`](https://developer.mozilla.org/zh-CN/docs/Web/API/ImageData) 对象。所有的像素在新对象中都是透明的。

- [`CanvasRenderingContext2D.getImageData()`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/getImageData)

  返回一个 [`ImageData`](https://developer.mozilla.org/zh-CN/docs/Web/API/ImageData) 对象，用来描述 canvas 区域隐含的像素数据，这个区域通过矩形表示，起始点为*(sx, sy)、*宽为*sw、*高为*sh*。

- [`CanvasRenderingContext2D.putImageData()`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/putImageData)

  将数据从已有的 [`ImageData`](https://developer.mozilla.org/zh-CN/docs/Web/API/ImageData) 绘制到位图上。如果提供了脏矩形，只能绘制矩形的像素。

## [图像平滑](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D#%E5%9B%BE%E5%83%8F%E5%B9%B3%E6%BB%91)

- [`CanvasRenderingContext2D.imageSmoothingEnabled`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/imageSmoothingEnabled) 实验性

  图像平滑的方式；如果禁用，缩放时，图像不会被平滑处理。

## [canvas 状态](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D#canvas_%E7%8A%B6%E6%80%81)

**CanvasRenderingContext2D** 渲染环境包含了多种绘图的样式状态（属性有线的样式、填充样式、阴影样式、文本样式）。下面的方法会帮助你使用这些状态：

- [`CanvasRenderingContext2D.save()`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/save)

  使用栈保存当前的绘画样式状态，你可以使用 **restore()** 恢复任何改变。

- [`CanvasRenderingContext2D.restore()`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/restore)

  恢复到最近的绘制样式状态，此状态是通过 **save()** 保存到”状态栈“中最新的元素。

- [`CanvasRenderingContext2D.canvas`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/canvas)

  对 [`HTMLCanvasElement`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLCanvasElement) 只读的反向引用。如果和 [``](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/canvas) 元素没有联系，可能为[`null`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/null)。

## [点击区域](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D#%E7%82%B9%E5%87%BB%E5%8C%BA%E5%9F%9F)

- [`CanvasRenderingContext2D.addHitRegion()`]() 实验性

  给 canvas 添加点击区域。

- [`CanvasRenderingContext2D.removeHitRegion()`]() 实验性

  从 canvas 中删除指定 `id` 的点击区域。

- [`CanvasRenderingContext2D.clearHitRegions()`]() 实验性

  从 canvas 中删除所有的点击区域。

## [不标准的 APIs](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D#%E4%B8%8D%E6%A0%87%E5%87%86%E7%9A%84_apis)

### [临时的和 WebKit 内核](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D#%E4%B8%B4%E6%97%B6%E7%9A%84%E5%92%8C_webkit_%E5%86%85%E6%A0%B8)

很多 APIs [不赞成使用并且将来会被删除](https://code.google.com/p/chromium/issues/detail?id=363198)。

- 非标准 `CanvasRenderingContext2D.clearShadow()`

  删除所有的阴影设置，例如 [`CanvasRenderingContext2D.shadowColor`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/shadowColor) 和[`CanvasRenderingContext2D.shadowBlur`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/shadowBlur)。

- 非标准 `CanvasRenderingContext2D.drawImageFromRect()`

  这是一个和 `drawImage` 相等的多余的方法。

- 非标准 `CanvasRenderingContext2D.setAlpha()`

  使用[`CanvasRenderingContext2D.globalAlpha`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/globalAlpha) 替代。

- 非标准 `CanvasRenderingContext2D.setCompositeOperation()`

  使用[`CanvasRenderingContext2D.globalCompositeOperation`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation) 替代。

- 非标准 `CanvasRenderingContext2D.setLineWidth()`

  使用[`CanvasRenderingContext2D.lineWidth`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/lineWidth) 替代。




- 非标准 `CanvasRenderingContext2D.setLineJoin()`

  使用[`CanvasRenderingContext2D.lineJoin`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/lineJoin) 替代。

- 非标准 `CanvasRenderingContext2D.setLineCap()`

  使用[`CanvasRenderingContext2D.lineCap`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/lineCap)替代。

- 非标准 `CanvasRenderingContext2D.setMiterLimit()`

  使用[`CanvasRenderingContext2D.miterLimit`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/miterLimit) 替代。

- 非标准 `CanvasRenderingContext2D.setStrokeColor()`

  使用[`CanvasRenderingContext2D.strokeStyle`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/strokeStyle) 替代。

- 非标准 `CanvasRenderingContext2D.setFillColor()`

  使用[`CanvasRenderingContext2D.fillStyle`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/fillStyle)替代。

- 非标准 `CanvasRenderingContext2D.setShadow()`

  私用[`CanvasRenderingContext2D.shadowColor`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/shadowColor) 和[`CanvasRenderingContext2D.shadowBlur`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/shadowBlur) 替代。

- 非标准 `CanvasRenderingContext2D.webkitLineDash`

  使用[`CanvasRenderingContext2D.getLineDash()`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/getLineDash) 和[`CanvasRenderingContext2D.setLineDash()`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/setLineDash)替代。

- 非标准 `CanvasRenderingContext2D.webkitLineDashOffset`

  使用[`CanvasRenderingContext2D.lineDashOffset`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/lineDashOffset)替代。

- 非标准 `CanvasRenderingContext2D.webkitImageSmoothingEnabled`

  使用[`CanvasRenderingContext2D.imageSmoothingEnabled`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/imageSmoothingEnabled) 替代。

### [仅是临时的](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D#%E4%BB%85%E6%98%AF%E4%B8%B4%E6%97%B6%E7%9A%84)

- 非标准 `CanvasRenderingContext2D.getContextAttributes()`

  受 `WebGLRenderingContext` 方法的启发，该方法会返回一个 `Canvas2DContextAttributes` 对象。在 canvas 中，这个对象包含属性”storage“，表示存储器的应用（默认”persistent“）；属性”alpha“，表示透明度的应用（默认 true）。

- 非标准 `CanvasRenderingContext2D.isContextLost()`

  受 `WebGLRenderingContext` 方法的启发，如果 Canvas 上下文丢失了，会返回 `true` ，否则返回 `false` 。

### [WebKit 特有的](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D#webkit_%E7%89%B9%E6%9C%89%E7%9A%84)

- 非标准 `CanvasRenderingContext2D.webkitBackingStorePixelRatio`

  关于 canvas 元素可支持存储的大小。参见 [High DPI Canvas](https://www.html5rocks.com/en/tutorials/canvas/hidpi/)。

- 非标准 `CanvasRenderingContext2D.webkitGetImageDataHD`

  原本打算支持存储 HD，但是从 canvas 规范中删除了。

- 非标准 `CanvasRenderingContext2D.webkitPutImageDataHD`

  原本打算支持存储 HD，但是从 canvas 规范中删除了。

### [Gecko 特有的](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D#gecko_%E7%89%B9%E6%9C%89%E7%9A%84)

- 非标准 [`CanvasRenderingContext2D.filter`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/filter)

  CSS 和 SVG 滤镜 作为 Canvas APIs。可能在新版本的规范中会标准化。

#### 有前缀的 APIs

- 非标准 `CanvasRenderingContext2D.mozCurrentTransform`

  设置或获取当前的变换矩阵，参见[`CanvasRenderingContext2D.currentTransform`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D).

- 非标准 `CanvasRenderingContext2D.mozCurrentTransformInverse`

  设置或获取当前翻转的变换矩阵。

- 非标准 `CanvasRenderingContext2D.mozFillRule`

  应用的 [填充规则](http://cairographics.org/manual/cairo-cairo-t.html#cairo-fill-rule-t) 。必须是 `evenodd` 或者 `nonzero` (默认)。

- 非标准 `CanvasRenderingContext2D.mozImageSmoothingEnabled`

  参见 [`CanvasRenderingContext2D.imageSmoothingEnabled`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/imageSmoothingEnabled).

- 非标准 已弃用 `CanvasRenderingContext2D.mozDash`

  描述相互交替的线段和间距长度的数组。使用 [`CanvasRenderingContext2D.getLineDash()`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/getLineDash) 和 [`CanvasRenderingContext2D.setLineDash()`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/setLineDash) 替代。

- 非标准 已弃用 `CanvasRenderingContext2D.mozDashOffset`

  描述线段数组在线上从哪里开始。使用 [`CanvasRenderingContext2D.lineDashOffset`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/lineDashOffset) 替代。

- 非标准 已弃用 `CanvasRenderingContext2D.mozTextStyle`

  在 Gecko 1.9 中引入，不赞成使用的 [`CanvasRenderingContext2D.font`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/font) 属性。

- 非标准 已弃用 `CanvasRenderingContext2D.mozDrawText()`

  这个方法在 Gecko 1.9 中引入，从 Gecko 7.0. 开始删除。使用 [`CanvasRenderingContext2D.strokeText()`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/strokeText) 或者 [`CanvasRenderingContext2D.fillText()`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/fillText) 替代。

- 非标准 已弃用 `CanvasRenderingContext2D.mozMeasureText()`

  这个方法在 Gecko 1.9 中引入，从 Gecko 7.0. 开始未实现。使用 [`CanvasRenderingContext2D.measureText()`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/measureText) 替代。

- 非标准 已弃用 `CanvasRenderingContext2D.mozPathText()`

  这个方法在 Gecko 1.9 中引入，从 Gecko 7.0. 开始删除。

- 非标准 已弃用`CanvasRenderingContext2D.mozTextAlongPath()`

  这个方法在 Gecko 1.9 中引入，从 Gecko 7.0. 开始删除。

#### 内部的 APIs (chrome-context 特有的)

- 非标准 [`CanvasRenderingContext2D.asyncDrawXULElement()`]()

  在 **canvas** 内渲染一个 XUL 元素的区域。

- 非标准 [`CanvasRenderingContext2D.drawWindow()`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/drawImage)

  在 **canvas** 内渲染一个窗口的区域。窗口可视区的内容被渲染，忽略窗口的剪切和滚动。

- 非标准 `CanvasRenderingContext2D.demote()`

  这个方法会引起当前的上下文使用后端的硬件加速作为软件的备选方案。所有的状态都会被保留。

### [IE 浏览器](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D#ie_%E6%B5%8F%E8%A7%88%E5%99%A8)

- 非标准 `CanvasRenderingContext2D.msFillRule`

  应用的[填充规则](http://cairographics.org/manual/cairo-cairo-t.html#cairo-fill-rule-t) 。必须是 `evenodd` 或者 `nonzero` (默认)。