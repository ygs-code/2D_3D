# WebGL模型矩阵

  多矩阵矩阵事件合并

我们上一个08_08_3DMVP矩阵之Model矩阵 有 一个问题是 当我改变x轴，再改变y轴的时候，x轴的坐标，并没有和y轴坐标相加在一起，这个不是我们想要的，所以我们要建立多个矩阵 translatrMatrixX ，改变x轴的矩阵,

```
  let translatrMatrixX = glMatrix.mat4.create();
       translatrMatrixX = glMatrix.mat4.fromTranslation(translatrMatrixX, [
          value,
          0,
          0
        ]);
```

这个矩阵只做x轴位移矩阵，然后我们通过translatrMatrixX的x轴位移矩阵乘以我们的translatrMatrix旋转矩阵，然后得到一个x轴位移矩阵，因为translatrMatrix矩阵记录有 x y z 轴矩阵，这样就可以记录他们 x 轴 y轴 z轴的记录了，当然有个问题是translatrMatrix轴的矩阵和translatrMatrixX矩阵相乘，得到一个我们不想要的数据，此时我们要把translatrMatrix的x轴位移位置坐标先清零，所以得

```

     translatrMatrix[12]=0;
        translatrMatrix = glMatrix.mat4.multiply(
          [],
          translatrMatrix,
          translatrMatrixX
        );

```
