

https://learn.microsoft.com/zh-cn/dotnet/desktop/winforms/advanced/why-transformation-order-is-significant?view=netframeworkdesktop-4.8&redirectedfrom=MSDN

https://blog.sina.com.cn/s/blog_6471e1bb0102vwp8.html

# WebGL模型矩阵

   modelMatrix:模型矩阵包含平移、缩放、旋转

   modelMatrix = [平移矩阵] * [缩放矩阵 ]* [旋转矩阵] * [原始矩阵]

注意：

矩阵不支持交换律，只支持结合律。 平移矩阵 、缩放矩阵 、旋转矩阵 三者顺序不同，可能会导致结果不同

如平移矩阵 * 缩放矩阵 * 旋转矩阵 ≠ 缩放矩阵 * 平移矩阵 * 旋转矩阵

平移矩阵 * 缩放矩阵 * 旋转矩阵： 先平移，再缩放，最后旋转



拆开可以理解 三步：

1.  [平移缩放后的矩阵] =  [平移矩阵] * [缩放矩阵] 

2.  [平移缩放旋转后的矩阵]=  [平移缩放后的矩阵]*[旋转矩阵]

3. [模型矩阵] = [平移缩放旋转后的矩阵] * [原始坐标]

   



结合  复合转换的顺序是“先缩放再旋转后平移”。