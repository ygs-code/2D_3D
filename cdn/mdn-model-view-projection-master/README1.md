欧氏平面 ，笛卡儿坐标 ，变换坐标，齐次坐标，数学投影，投影几何，对偶性  https://zh.wikipedia.org/wiki/%E9%BD%90%E6%AC%A1%E5%9D%90%E6%A0%87#%E9%BD%8A%E6%AC%A1%E6%80%A7

学习文档 ： https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL_API/WebGL_model_view_projection

[在]()[OpenGL](https://so.csdn.net/so/search?q=OpenGL&spm=1001.2101.3001.7020)和WebGL中，默认情况下，正面是指逆时针绘制的面，背面是指顺时针绘制的面。通过开启多边形面剔除，我们可以剔除掉背面多边形，只绘制正面多边形，从而减少不必要的绘制开销。

WebGL中的三角形有正反面的概念，正面三角形的顶点顺序是逆时针方向， 反面三角形是顺时针方向。

# WebGL model view projection

本文探讨如何在 WebGL 项目中获取数据，并将其投影到适当的空间以在屏幕上显示。它假定了你具备用于平移，缩放和旋转的基本矩阵数学知识。它解释了组成 3D 场景时通常使用的三个核心矩阵：模型，视图和投影矩阵。

**备注：** 本文还可作为 [MDN 内容套件](https://github.com/TatumCreative/mdn-model-view-projection) 提供。它还使用 `MDN`全局对象下可用的 [实用函数](https://github.com/TatumCreative/mdn-webgl) 集合。

## [模型、视图、投影矩阵](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL_API/WebGL_model_view_projection#%E6%A8%A1%E5%9E%8B%E3%80%81%E8%A7%86%E5%9B%BE%E3%80%81%E6%8A%95%E5%BD%B1%E7%9F%A9%E9%98%B5)

WebGL 空间中的点和多边形的个体转化由基本的转换矩阵（例如平移，缩放和旋转）处理。可以将这些矩阵组合在一起并以特殊方式分组，以使其用于渲染复杂的 3D 场景。这些组合成的矩阵最终将原始数据类型移动到一个称为裁剪空间的特殊坐标空间中。这是一个中心点位于 (0, 0, 0)，角落范围在 (-1, -1, -1) 到 (1, 1, 1) 之间，2 个单位宽的立方体。该剪裁空间被压缩到一个二维空间并栅格化为图像。

下面讨论的第一个矩阵是 **模型矩阵** ，它定义了如何获取原始模型数据并将其在 3D 世界空间中移动。**投影矩阵**用于将世界空间坐标转换为剪裁空间坐标。常用的投影矩阵（ **透视矩阵** ）用于模拟充当 3D 虚拟世界中观看者的替身的典型相机的效果。**视图矩阵**负责移动场景中的对象以模拟相机位置的变化，改变观察者当前能够看到的内容。

以下的几个部分提供了对模型，视图和投影矩阵背后的思想及实现的深入理解。这些矩阵是在屏幕上移动数据的核心，是胜过各个框架和引擎的概念。

## [裁剪空间](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL_API/WebGL_model_view_projection#%E8%A3%81%E5%89%AA%E7%A9%BA%E9%97%B4)

在 WebGL 程序中，数据通常上传到具有自己的坐标系统的 GPU 上，然后顶点着色器将这些点转换到一个称为**裁剪空间**的特殊坐标系上。延展到裁剪空间之外的任何数据都会被剪裁并且不会被渲染。如果一个三角形超出了该空间的边界，则将其裁切成新的三角形，并且仅保留新三角形在裁剪空间中的部分。

![A 3d graph showing clip space in WebGL.](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL_API/WebGL_model_view_projection/clip_space_graph.svg)

上面的图像裁剪空间的可视化，所有点都必须被包含在其中。它是一个角在 (-1, -1, -1)，对角在 (1, 1, 1)，中心点在 (0, 0, 0) 的每边 2 个单位的立方体。裁剪空间使用的这个两个立方米坐标系称为归一化设备坐标（NDC）。在研究和使用 WebGL 代码时，你可能时不时的会使用这个术语。

在本节中，我们将直接将数据放入裁剪空间坐标系中。通常使用位于任意坐标系中的模型数据，然后使用矩阵进行转换，将模型坐标转换为裁剪空间系下的坐标。这个例子，通过简单地使用从 (-1，-1，-1) 到 (1,1,1) 的模型坐标值来说明剪辑空间的工作方式是最简单的。下面的代码将创建 2 个三角形，这些三角形将在屏幕上绘制一个正方形。正方形中的 Z 深度确定当前正方形共享同一个空间时在顶部绘制的内容，较小的 Z 值将呈现在较大的 Z 值之上。

### [WebGLBox 例子](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL_API/WebGL_model_view_projection#webglbox_%E4%BE%8B%E5%AD%90)

本示例将创建一个自定义 WebGL 对象，该对象将在屏幕上绘制一个 2D 框。

**备注：** 每一个 WebGL 示例代码在此 [github repo](https://github.com/TatumCreative/mdn-model-view-projection/tree/master/lessons) 中可找到，并按章节组织。此外，每个章节底部都有一个 JSFiddle 链接。

#### WebGLBox Constructor

构造函数看起来像这样：
