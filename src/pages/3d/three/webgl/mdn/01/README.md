# WebGL 教程

[WebGL](https://www.khronos.org/webgl/) 使得网页在支持 HTML [``](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/canvas) 标签的浏览器中，不需要使用任何插件，便可以使用基于 [OpenGL ES](https://www.khronos.org/opengles/) 2.0 的 API 在 canvas 中进行 3D 渲染。WebGL 程序由 javascript 的控制代码，和在计算机的图形处理单元（GPU, Graphics Processing Unit）中执行的特效代码 (shader code，渲染代码) 组成。WebGL 元素可以和其他 HTML 元素混合，并且会和页面的其他部分或页面背景相合成。

此教程从基础开始讲解如何使用`<canvas>` 元素来画 WebGL 图形。提供的例子会让你对 WebGL 有更清晰的认识，并且会提供代码片段方便你构建自己的内容。

## [开始之前](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL_API/Tutorial#%E5%BC%80%E5%A7%8B%E4%B9%8B%E5%89%8D)

使用 `<canvas>` 元素并不困难，但你需要基本的 [HTML](https://developer.mozilla.org/zh-CN/docs/Web/HTML) 和 [JavaScript](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript) 知识。一些老浏览器不支持`<canvas>` 元素和 WebGL，但所有最近的主流浏览器都支持它们.。为了能在 canvas 中绘制图形，我们使用 Javascript 的上下文环境（context）对象，此对象可以动态创建图形。

## [在本教程中](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL_API/Tutorial#%E5%9C%A8%E6%9C%AC%E6%95%99%E7%A8%8B%E4%B8%AD)

- [开始 WebGL](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL_API/Tutorial/Getting_started_with_WebGL)

  如何设置 WebGL 上下文环境。

- [给 WebGL 的上下文环境添加 2D 内容](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL_API/Tutorial/Adding_2D_content_to_a_WebGL_context)

  如何用 WebGl 渲染简单的平面化图形。

- [在 WebGL 中使用着色器 (shader) 去赋予颜色](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL_API/Tutorial/Using_shaders_to_apply_color_in_WebGL)

  演示如何使用着色器给图形添加颜色。

- [用 WebGL 让对象动起来](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL_API/Tutorial/Animating_objects_with_WebGL)

  展示如何旋转移动物体来实现简单动画效果。

- [使用 WebGL 创建 3D 物体](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL_API/Tutorial/Creating_3D_objects_using_WebGL)

  展示如何创建并设置一个 3D 物体动画 (这里使用立方体).

- [在 WebGL 中使用纹理贴图 (texture)](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL_API/Tutorial/Using_textures_in_WebGL)

  展示如何投射纹理贴图到物体的各个面。

- [WebGL 中的灯光](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL_API/Tutorial/Lighting_in_WebGL)

  如何在 WebGL 上下文环境中模拟灯光效果。

- [WebGL 中的动画纹理贴图](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL_API/Tutorial/Animating_textures_in_WebGL)

  展示如何让纹理贴图动起来; 在此例中，会投射一个 Ogg 格式的视频在一个旋转立方体的各个面上。



  # 初识 WebGL

  - [下一页 »](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL_API/Tutorial/Adding_2D_content_to_a_WebGL_context)

  [WebGL](https://www.khronos.org/webgl/) 使得在支持 HTML 的 [`canvas`](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API) 标签的浏览器中，不需要安装任何插件，便可以使用基于 [OpenGL ES](https://www.khronos.org/opengles/) 2.0 的 API 在 canvas 中进行 2D 和 3D 渲染。WebGL 程序包括用 JavaScript 写的控制代码，以及在图形处理单元（GPU, Graphics Processing Unit）中执行的着色代码（GLSL，注：GLSL 为 OpenGL 着色语言）。WebGL 元素可以和其他 HTML 元素混合使用，并且可以和网页其他部分或者网页背景结合起来。

  本文将向您介绍 WebGL 的基本用法。此处假定您对三维图形方面的数学知识已经有一定的理解，本文也不会试图向您教授 3D 图像概念本身。

  本文的代码也可以在这里下载 [GitHub 上的 webgl-examples 文件夹](https://github.com/mdn/dom-examples/tree/main/webgl-examples/tutorial)。

  [THREE.js](https://threejs.org/)和[BABYLON.js](https://www.babylonjs.com/)等很多框架封装了 WebGL，提供了各个平台之间的兼容性。使用这些框架而非原生的 WebGL 可以更容易地开发 3D 应用和游戏。

  ## [准备 3D 渲染](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL_API/Tutorial/Getting_started_with_WebGL#%E5%87%86%E5%A4%87_3d_%E6%B8%B2%E6%9F%93)

  为了使用 WebGL 进行 3D 渲染，你首先需要一个 canvas 元素。下面的 HTML 片段用来建立一个 canvas 元素并设置一个 onload 事件处理程序来初始化我们的 WebGL 上下文。

  ```
  <body onload="main()">
    <canvas id="glcanvas" width="640" height="480">
      你的浏览器似乎不支持或者禁用了 HTML5 <code>&lt;canvas&gt;</code> 元素。
    </canvas>
  </body>

  ```

  ### [准备 WebGL 上下文](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL_API/Tutorial/Getting_started_with_WebGL#%E5%87%86%E5%A4%87_webgl_%E4%B8%8A%E4%B8%8B%E6%96%87)

  我们的 JavaScript 代码中的 `main()` 函数将会在文档加载完成之后被调用。它的任务是设置 WebGL 上下文并开始渲染内容。

  ```
  // 从这里开始
  function main() {
    const canvas = document.querySelector("#glcanvas");
    // 初始化 WebGL 上下文
    const gl = canvas.getContext("webgl");

    // 确认 WebGL 支持性
    if (!gl) {
      alert("无法初始化 WebGL，你的浏览器、操作系统或硬件等可能不支持 WebGL。");
      return;
    }

    // 使用完全不透明的黑色清除所有图像
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // 用上面指定的颜色清除缓冲区
    gl.clear(gl.COLOR_BUFFER_BIT);
  }

  ```

  我们所要做的第一件事就是是获取 canvas 的引用，把它保存在‘canvas’变量里。

  当我们获取到 canvas 之后，我们会调用[getContext](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLCanvasElement/getContext) 函数并向它传递 `"webgl"` 参数，来尝试获取[WebGLRenderingContext](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGLRenderingContext)。如果浏览器不支持 webgl, `getContext` 将会返回 `null`，我们就可以显示一条消息给用户然后退出。

  如果 WebGL 上下文成功初始化，变量‘gl’会用来引用该上下文。在这个例子里，我们用黑色清除上下文内已有的元素。（用背景颜色重绘 canvas）。

  [查看完整的源码](https://github.com/mdn/dom-examples/tree/main/webgl-examples/tutorial/sample1) | [在新标签页中查看演示](https://mdn.github.io/dom-examples/webgl-examples/tutorial/sample1/)

  ## [参见](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL_API/Tutorial/Getting_started_with_WebGL#%E5%8F%82%E8%A7%81)

  - [WebGL 介绍](https://dev.opera.com/articles/introduction-to-webgl-part-1/): 由 Luz Caballero 所著，发布在 dev.opera.com。这篇文章说明 WebGL 是什么，解释了 WebGL 是如何工作的 (介绍了渲染管线的概念)，并且介绍了一些 WebGL 库。
  - [WebGL 基础](https://webglfundamentals.org/)
  - [现代 OpenGL 介绍：](https://duriansoftware.com/joe/An-intro-to-modern-OpenGL.-Table-of-Contents.html) 由 Joe Groff 写的一系列关于 OpenGL 的不错的文章，提供了一个清晰的介绍，从 OpenGL 的历史到图形管线概念，也包括一些说明 OpenGL 如何工作的例子，如果你对 OpenGL 没有任何概念的话，这是不错的出发点。


  - 
