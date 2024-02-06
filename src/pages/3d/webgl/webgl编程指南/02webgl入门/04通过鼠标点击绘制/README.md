##  屏幕坐标转换世界坐标

 clientX： 设置或获取鼠标指针位置相对于窗口客户区域的 x 坐标，其中客户区域不包括窗口自身的控件和滚动条。

clientY： 设置或获取鼠标指针位置相对于窗口客户区域的 y 坐标，其中客户区域不包括窗口自身的控件和滚动条。

offsetX： 设置或获取鼠标指针位置相对于触发事件的（this）对象的 x 坐标。

offsetY ：设置或获取鼠标指针位置相对于触发事件的（this）对象的 y 坐标。

screenX： 设置或获取获取鼠标指针位置相对于用户屏幕的 x 坐标。

screenY： 设置或获取鼠标指针位置相对于用户屏幕的 y 坐标。

x： 设置或获取鼠标指针位置相对于父文档的 x 像素坐标。

y ：设置或获取鼠标指针位置相对于父文档的 y 像素坐标。

 

  rectObject.top：元素上边到视窗上边的距离;

  rectObject.right：元素右边到视窗左边的距离;

  rectObject.bottom：元素下边到视窗上边的距离;

  rectObject.left：元素左边到视窗左边的距离;

  rectObject.width：是元素自身的宽

  rectObject.height是元素自身的高



核心算法  

x 等于2倍x减去 canvas宽度  然后在除以 canvas宽度

y 等于 canvas高度 减去 2倍y高度   然后在除以 canvas宽度

```


     x = (2x-canvas.width)/canvas.width
     y=  (canvas.height-2y)/canvas.height

     // 再减去边距
     x = (2(x-rect.left)-canvas.width)/canvas.width
     y=  (canvas.height-2(y-rect.top))/canvas.height
```

