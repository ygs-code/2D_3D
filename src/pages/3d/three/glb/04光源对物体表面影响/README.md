# Three.js中网格对象MESH的属性与方法详解

三维开发渲染最多的对象大概是网格mesh了，Webgl开发三维也不例外，下面这篇文章主要给大家介绍了关于Three.js中网格对象MESH的属性与方法，文中通过示例代码介绍的非常详细，需要的朋友可以参考借鉴，下面来一起看看吧。

**前言**

本文主要给大家介绍了关于Three.js网格对象MESH的属性与方法，分享出来供大家参考学习，下面话不多说了，来一起看看详细的介绍：

创建一个网格需要一个几何体，以及一个或多个材质。当网格创建好之后，我们就可以将它添加到场景中并进行渲染。网格对象提供了几个属性和方法用于改变它在场景中的位置和显示效果。

**如下：**

![img](https://img.jbzj.com/file_images/article/201709/2017927102810198.jpg?201782710296)

还有一个属性就是visible属性，默认为true，如果设置为false，THREE.Mesh将不渲染到场景中。

**mesh对象的前三个属性position，rotation和scale有三种设置方法。**

第一种，直接设置相关坐标轴

```
`cube.position.x = 5;``cube.position.y = 6;``cube.position.z = 7;`
```

第二种，一次性设置x，y和z坐标的值

```
`cube.position.set(5,6,7); ``//效果同第一种`
```

第三种，因为它们都是一个THREE.Vector3对象，所以我们可以直接赋值一个新的对象给它

```
`cube.position = ``new` `THREE.Vector3(5,6,7); ``//效果同上`
```