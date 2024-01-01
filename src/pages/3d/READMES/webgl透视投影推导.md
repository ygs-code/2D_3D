https://www.songho.ca/opengl/gl_projectionmatrix.html

https://www.nshen.net/stage3d-projection-matrix

https://zhuanlan.zhihu.com/p/645709339

https://zhuanlan.zhihu.com/p/515968481?utm_id=0

https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL_API/WebGL_model_view_projection

https://zhuanlan.zhihu.com/p/362713511

https://www.codenong.com/28286057/

https://www.songho.ca/opengl/gl_projectionmatrix.html


https://blog.csdn.net/cj9551/article/details/114592113

如果将观察者视为一个模型，那么视图矩阵就是观察者的 模型矩阵 的 逆矩阵。

相关主题:OpenGL变换，OpenGL矩阵

概述
透视投影
正射投影

更新:MathML版本在这里可用。

概述
计算机显示器是一个二维表面。由OpenGL渲染的3D场景必须作为2D图像投影到计算机屏幕上。GL_PROJECTION矩阵用于这个投影变换。首先，它将所有顶点数据从眼睛坐标转换为剪辑坐标。然后，将这些剪辑坐标与剪辑坐标的w分量相除，转换为归一化设备坐标(NDC)。

由截锥体夹住的三角形
由截锥体夹住的三角形
因此，我们必须记住，裁剪(截锥体剔除)和NDC变换都集成到GL_PROJECTION矩阵中。下面介绍如何从6个参数构建投影矩阵;左，右，下，上，近，远边界值。

注意，截锥体剔除(裁剪)是在剪辑坐标中执行的，就在除以wc之前。通过与wc的比较，测试了clip坐标xc, yc和zc。如果任何剪辑坐标小于-wc或大于wc，则该顶点将被丢弃。

然后，OpenGL将重建发生剪切的多边形的边缘

![A triangle clipped by frustum](https://www.songho.ca/opengl/files/gl_frustumclip.png)

在透视投影中，截断金字塔截锥(眼坐标)中的一个3D点被映射到一个立方体(NDC);x坐标从[l, r]到[- 1,1]，y坐标从[b, t]到[- 1,1]，z坐标从[-n， -f]到[- 1,1]。

注意，眼睛坐标是在右手坐标系中定义的，但NDC使用左手坐标系。也就是说，原点上的相机在眼空间上是沿-Z轴看的，但在NDC上是沿+Z轴看的。由于glFrustum()只接受远近距离的正值，因此我们需要在构造GL_PROJECTION矩阵时将它们取为负值。

在OpenGL中，眼空间中的3D点被投影到近平面(投影平面)上。下图显示了眼空间中的点(xe, ye, ze)如何投影到近平面上的点(xp, yp, zp)。

![OpenGL Perspective Frustum and NDC](https://www.songho.ca/opengl/files/gl_projectionmatrix01.png)

![Top View of Frustum](https://www.songho.ca/opengl/files/gl_projectionmatrix03.png)

![Side View of Frustum](https://www.songho.ca/opengl/files/gl_projectionmatrix04.png)

在视锥体的顶视图上，将眼空间的x坐标xe映射到使用相似三角形的比值计算的xp;

![img](https://www.songho.ca/opengl/files/gl_projectionmatrix_eq01.png)

从截锥体的侧面看，yp也以类似的方式计算;

![img](https://www.songho.ca/opengl/files/gl_projectionmatrix_eq02.png)

注意xp和yp都依赖于ze;它们与-ze成反比。换句话说，它们都除以-ze。这是构造GL_PROJECTION矩阵的第一个线索。通过乘以GL_PROJECTION矩阵变换眼睛坐标后，剪辑坐标仍然是齐次坐标。最后得到归一化设备坐标(NDC)，除以剪辑坐标的w分量。(查看更多关于OpenGL Transformation的细节。)

![Clip Coordinates](https://www.songho.ca/opengl/files/gl_transform08.png) ,  ![Normalized Device Coordinates](https://www.songho.ca/opengl/files/gl_transform12.png)

因此，我们可以将剪辑坐标的w分量设置为-ze。并且，GL_PROJECTION矩阵的第4次方变成(0,0，- 1,0)。

![img](https://www.songho.ca/opengl/files/gl_projectionmatrix_eq03.png)

接下来，我们将xp和yp映射到线性关系NDC的xn和yn;[l, r]⇒[- 1,1]和[b, t]⇒[- 1,1]。

![img](https://www.songho.ca/opengl/files/gl_projectionmatrix05.png)

   从xp到xn的映射

![img](https://www.songho.ca/opengl/files/gl_projectionmatrix_eq04.png)
