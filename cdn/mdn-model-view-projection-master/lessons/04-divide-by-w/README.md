## [除以 W](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL_API/WebGL_model_view_projection#%E9%99%A4%E4%BB%A5_w)

一个开始了解立方体模型透视的简单方法是获取 Z 坐标并将其复制到 w 坐标。通常，将笛卡尔点转换为齐次坐标时，它变为 `(x,y,z,1)` ，但我们将其设置为 `(x,y,z,z)` 。实际上，我们希望确保视图中的点的 z 值大于 0，因此我们将其值改为 `((1.0 + z) * scaleFactor)` 对其进行轻微的修改。这将需要一个通常位于裁剪空间（-1 到 1）中的点，并将其移到更像（0 到 1）的空间中，具体取决于比例因子设置为什么。比例因子将最终 w 值更改为总体上更高或更低。

着色器代码如下：

```

// 首先转换点
vec4 transformedPosition = model * vec4(position, 1.0);

// 透视有多大的影响？
float scaleFactor = 0.5;

// 通过采用介于 -1 到 1 之间的 z 值来设置 w
// 然后进行缩放为 0 到某个数，在这种情况下为 0 到 1
float w = (1.0 + transformedPosition.z) * scaleFactor;

// 使用自定义 w 分量保存新的 gl_Position
gl_Position = vec4(transformedPosition.xyz, w);

```
