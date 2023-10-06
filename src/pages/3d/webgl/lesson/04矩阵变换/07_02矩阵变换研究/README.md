# 矩阵与webgl

## **坐标轴的旋转**

不改变坐标原点的位置和单位长度，只改变坐标轴方向的坐标系的变换，叫做**坐标轴的旋转**．

![img](https://img-blog.csdnimg.cn/img_convert/cbe167ccf92918242b8be36c16b511d4.png)

设点*M*在原坐标系中的坐标为(x,y)*，对应向量的模为*r*，幅角为α．将坐标轴绕坐标原点，按照逆时针方向旋转角θ形成新坐标系，点*M*在新坐标系中的坐标为（如图2-4），则

两角和公式：

sin(A + B) = sinA * cosB + sinB * cosA

sin(A - B) = sinA * cosB - sinB * cosA

cos(A + B) = cosA * cosB - sinA * sinB

cos(A - B) = cosA * cosB + sinA * sinB



![img](https://img-blog.csdnimg.cn/img_convert/47ce23bce4983d8f31321edc1b514fc6.png)

由此得到坐标轴的旋转的坐标变换公式

![img](https://img-blog.csdnimg.cn/img_convert/d6634c43399b70c313836e03858b7ab7.png)





矩阵旋转：

先聊聊矩阵的线性空间

在缩放矩阵中，其实就是矩阵的点乘法

```
 [a，b,
 c, d].[x,
         y] = [
         a*x+b*y,
         c*x+d*y 
         ]=[
           x1,
           y1
         ]  


```



在三角函数角度坐标旋转中

```
x1=x*cosθ +  y * sinθ

y1= - x * sinθ + y*cosθ 
```





我们将两个公式结合在一起得到矩阵

[
         a * x+b * y,
         c * x+d * y 
         ] 和 x1=x*cosθ +  y * sinθ ，y1= - x * sinθ + y*cosθ  结合

约掉x和y得到一个新的矩阵

```
[
cosθ,sinθ,
-sinθ,cosθ 
]
```