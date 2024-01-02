# 07章进入三维世界

视点和视线

观察方向：即观察者自己在什么位置。

可视距离：即观察者能看多远



我们将观察者的位置称为视点，从视点除法沿用观察者方向的射线称作为视线，



比如我们眼睛看屏的视角

<img src="K:/webgl/2D_3D/src/pages/3d/webgl/lesson/04%E7%9F%A9%E9%98%B5%E5%8F%98%E6%8D%A2/10_01_3DMVP%E7%9F%A9%E9%98%B5%E4%B9%8BView%E7%9F%A9%E9%98%B5%E7%9B%B8%E6%9C%BA/images/2.png"  style="width:500px"/>

<img src="K:/webgl/2D_3D/src/pages/3d/webgl/lesson/04%E7%9F%A9%E9%98%B5%E5%8F%98%E6%8D%A2/10_01_3DMVP%E7%9F%A9%E9%98%B5%E4%B9%8BView%E7%9F%A9%E9%98%B5%E7%9B%B8%E6%9C%BA/images/6.png"  style="width:700px"/>



WEBGL 在屏幕的可视空间



<img src="K:/webgl/2D_3D/src/pages/3d/webgl/lesson/04%E7%9F%A9%E9%98%B5%E5%8F%98%E6%8D%A2/10_01_3DMVP%E7%9F%A9%E9%98%B5%E4%B9%8BView%E7%9F%A9%E9%98%B5%E7%9B%B8%E6%9C%BA/images/1.png" style="width:500px" />



# 视点与视线 

# 摄像机视角、视线、上方向概念

2.视点，视线，观察点，上方向
视点 指的是摄像机所处位置
视线 指的是摄像机观察的方向
观察点 指的是被观察目标所在的点
上方向 由于在视点与视线确定的情况下，摄像机还是可以沿着视线旋转的，所以还缺少一种信息描述摄像机的状态，那就是像上的方向(上方向)

3.视图矩阵
我们可以用视点、观察点、上方向者三个矢量创建一个 视图矩阵 ，这个视图矩阵会影响显示在屏幕上的视图，也就是会影响观察者观察到的场景，接下来我们看一下cuon-matrix.js 提供的 Matrix4.setLookAt() 函数
 视点：观察者所处的位置称为视点。从视点出发沿着观察方向的射线称作视线。坐标用(eyeX,eyeY,eyeZ)表示。

观察目标点：被观察目标所在的点，它可以用来确定视线。坐标用(atX,atY,atZ)表示。

上方向：最终绘制在屏幕上的影像中的向上的方向。坐标用(upX,upY,upZ)表示。

<img src="K:/webgl/2D_3D/src/pages/3d/webgl/lesson/04%E7%9F%A9%E9%98%B5%E5%8F%98%E6%8D%A2/10_01_3DMVP%E7%9F%A9%E9%98%B5%E4%B9%8BView%E7%9F%A9%E9%98%B5%E7%9B%B8%E6%9C%BA/images/3.png" style="width:500px" />

<img src="K:/webgl/2D_3D/src/pages/3d/webgl/lesson/04%E7%9F%A9%E9%98%B5%E5%8F%98%E6%8D%A2/10_01_3DMVP%E7%9F%A9%E9%98%B5%E4%B9%8BView%E7%9F%A9%E9%98%B5%E7%9B%B8%E6%9C%BA/images/4.png" style="width:500px" />

<img src="K:/webgl/2D_3D/src/pages/3d/webgl/lesson/04%E7%9F%A9%E9%98%B5%E5%8F%98%E6%8D%A2/10_01_3DMVP%E7%9F%A9%E9%98%B5%E4%B9%8BView%E7%9F%A9%E9%98%B5%E7%9B%B8%E6%9C%BA/images/5.png" style="width:500px" />





webgl 中，观察者默认状态是 

视点位于坐标系统原点的(0,0,0).

视线为Z轴负方向，观察点为(0,0,-1) 上方向为(0,1,0).

如果将上方向改为X轴正半轴方向(1,0,0) 你将看到场景旋转啦90度。



```
 let {
      eye,
      at,
      up
    }={
      eye:{
        x:0,
        y:0,
        z:0,
      },
      at:{
        x:0,
        y:0,
        z:-1,
      },
      up:{
        x:0,
        y:1,
        z:0,
      }
    };

        //初始化视图矩阵
        var viewMatrix = glMatrix.mat4.create();

  // let eye = [0.0, 0.0, 0.0]; //  eyeX, eyeY, eyeZ  观察者的默认状态是：视点为系统原点(0,0,0) eyeX, eyeY, eyeZ
        // let center = [0.0, 0.0, -1.0]; // atX, atY, atZ  视线为Z轴负方向，观察点为(0,0,-1)   atX, atY, atZ
        // let up = [0.0, 1.0, 0.0]; // upX, upY, upZ 上方向为Y轴负方向(0,1,0) upX, upY, upZ
        glMatrix.mat4.lookAt(
          viewMatrix,
          [eye.x, eye.y, eye.z],
          [at.x, at.y, at.z],
          [up.x, up.y, up.z]
        );
        
```





# 关于数学：如何将世界坐标转换为相机坐标？

我有一个输入的3D矢量，以及摄像机的俯仰和偏航。 谁能描述或提供资源链接，以帮助我理解和实现所需的转换和矩阵映射？

相机到世界的转换矩阵是相机到世界的矩阵的逆矩阵。

相机到世界的矩阵是相机位置平移和相机方向旋转的组合。

因此，如果M是与摄影机方向相对应的3x3旋转矩阵，而t是摄影机位置，则4x4摄影机与世界的矩阵为：





http://www.taodudu.cc/news/show-6058624.html?action=onClick

https://blog.csdn.net/colorsky100/article/details/105599246/

https://www.jianshu.com/p/2341da36aa8e?ivk_sa=1024609v

https://download.csdn.net/blog/column/11720857/126894504

https://www.jianshu.com/p/2341da36aa8e

https://zhuanlan.zhihu.com/p/642715876

https://blog.csdn.net/m0_50910915/article/details/129695132

https://zhuanlan.zhihu.com/p/593204605/

https://ethanli.blog.csdn.net/article/details/113248118

https://blog.51cto.com/u_12485075/4801140

http://ddrv.cn/a/782590

https://blog.51cto.com/u_12485075/4801140

https://zhuanlan.zhihu.com/p/561394626





- 移动相机到拍摄位置，镜头对准某个方向(**视图变换**,view transform)
- 将拍摄对象，移到场景中的某个位置(**模型变换**,model transform)
- 设置相机焦距，或调整缩放比例(**投影变换**,projection transform)
- 对结果图像拉伸或者压缩，变换为需要的图片大小(**视口变换**,viewpoint transform)；视口变换对应于选择被冲洗相片的大小这个阶段。我们希望照片像钱包一样大还是像海报一样大？在计算机图形中，视口是一个矩形的窗口区域，图像就是在这个区域中绘制的。

**透视投影(perspective projection) :** 棱台模型， 透视投影属于中心投影。透视投影图简称为透视图或透视，它是从某个投射中心将物体投射到单一投影面上所得到的图形。

**正交投影(orthographic projection)：**长方体模型**，**投影线垂直于投影面的投影属于正交投影 ，也称为平行投影。