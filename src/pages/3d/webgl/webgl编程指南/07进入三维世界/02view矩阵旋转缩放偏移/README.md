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

