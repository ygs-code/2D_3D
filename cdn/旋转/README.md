## [JavaScript图形实例：图形的旋转变换](https://www.cnblogs.com/cs-whut/p/12080773.html)

​        旋转变换：图形上的各点绕一固定点沿圆周路径作转动称为旋转变换。可用旋转角表示旋转量的大小。

​        旋转变换通常约定以逆时针方向为正方向。最简单的旋转变换是以坐标原点(0,0)为旋转中心，这时，平面上一点P(x,y) 旋转了θ之后，变成点P’(x,y) ，如图1所示。

 ![img](https://img2018.cnblogs.com/common/1485495/201912/1485495-20191222193736446-1111432929.jpg)

图1 点P逆时针旋转

​        由三角关系可得：

​         ![img](https://img2018.cnblogs.com/i-beta/1485495/201912/1485495-20191222193753588-315681542.png) 

​         平面上一点P(x,y)若按顺时针方向旋转了θ之后，变成点P’(x,y) ，如图2所示。

![img](https://img2018.cnblogs.com/common/1485495/201912/1485495-20191222193818966-1336612501.jpg) 

图2 点P顺时针旋转

​        由三角关系可得：

 ![img](https://img2018.cnblogs.com/i-beta/1485495/201912/1485495-20191222193850405-1431756304.png) 

### 1．三角形旋转

​        先绘制一个三角形，然后将该三角形依次顺时针旋转45°，90°，135°，180°，225°，270°，315°，可以绘制出一个三角形旋转图案。

​        编写如下的HTML代码。

```
<!DOCTYPE html>

<head>

<title>三角形旋转</title>

<script type="text/javascript">

  function draw(id)

  {

     var canvas=document.getElementById(id);

     if (canvas==null)

        return false;

     var context=canvas.getContext('2d');

     context.fillStyle="#EEEEDD";

     context.fillRect(0,0,300,300);

     context.strokeStyle="red";

     context.lineWidth=1;

     context.fillStyle="yellow";

     context.beginPath();

     px1=150;  py1=150;

     px2=250;  py2=150;

     px3=200;  py3=120;

     context.moveTo(px1,py1);

     context.lineTo(px2,py2);

     context.lineTo(px3,py3);

     context.lineTo(px1,py1);

     x0=150;  y0=150;        // 旋转中心

a=Math.PI/4;            // 旋转角度

     for (i=1;i<=7;i++){

        tx=px1;  px1=x0+(px1-x0)*Math.cos(a)+(py1-y0)*Math.sin(a); 

        py1=y0-(tx-x0)*Math.sin(a)+(py1-y0)*Math.cos(a);

        tx=px2;  px2=x0+(px2-x0)*Math.cos(a)+(py2-y0)*Math.sin(a); 

        py2=y0-(tx-x0)*Math.sin(a)+(py2-y0)*Math.cos(a);

        tx=px3;  px3=x0+(px3-x0)*Math.cos(a)+(py3-y0)*Math.sin(a); 

        py3=y0-(tx-x0)*Math.sin(a)+(py3-y0)*Math.cos(a);

        context.moveTo(px1,py1);

        context.lineTo(px2,py2);

        context.lineTo(px3,py3);

        context.lineTo(px1,py1);

     }

     context.closePath();

     context.stroke();

     context.fill();

  }

</script>

</head>

<body onload="draw('myCanvas');">

<canvas id="myCanvas" width="300" height="300">您的浏览器不支持canvas！

</canvas>

</body>

</html>
```



​        将上述HTML代码保存到一个html文本文件中，再在浏览器中打开包含这段HTML代码的html文件，可以看到在浏览器窗口中绘制出三角形旋转图案，如图1所示。

 ![img](https://img2018.cnblogs.com/common/1485495/201912/1485495-20191222193932351-131299769.png)

图1  三角形旋转图案

### 2．旋转小正方形

​        在Canvas画布中绘制18行18列共324个小正方形（每个小正方形的四个顶点取自半径为10的圆周上的4等分点），每个正方形按计算的旋转角度进行逆时针旋转。

​        编写的HTML文件的内容如下。

 ```
<!DOCTYPE html>

<head>

<title>旋转小正方形</title>

<script type="text/javascript">

  function draw(id)

  {

     var canvas=document.getElementById(id);

     if (canvas==null)

        return false;

     var context=canvas.getContext('2d');

     context.fillStyle="#EEEEFF";

     context.fillRect(0,0,500,400);

     context.fillStyle="yellow";

     context.strokeStyle="red";

     context.lineWidth=1;

     context.beginPath();

     for (px=-170;px<=170;px+=20)

       for (py=-170;py<=170;py+=20)

       {

          a=Math.abs(px)/170*Math.PI/2;

          for (i=0;i<=4;i++)

          {

             x1=10*Math.cos(i*Math.PI/2);

             y1=10*Math.sin(i*Math.PI/2);

             x2=x1*Math.cos(a)-y1*Math.sin(a);

             y2=x1*Math.sin(a)+y1*Math.cos(a);

             x=px+200+x2;

             y=py+200-y2;

             if (i==0)

                context.moveTo(x,y);

             else

                context.lineTo(x,y);

          }

       }

     context.closePath();

     context.fill();

     context.stroke();

  }

</script>

</head>

<body onload="draw('myCanvas');">

<canvas id="myCanvas" width="500" height="400">您的浏览器不支持canvas！

</canvas>

</body>

</html>
 ```



​        将上述HTML代码保存到一个html文本文件中，再在浏览器中打开包含这段HTML代码的html文件，可以看到在浏览器窗口中绘制出旋转小正方形图案1，如图2所示。

 ![img](https://img2018.cnblogs.com/common/1485495/201912/1485495-20191222194007146-1277007329.png)

图2  小正方形图案1

​        若将上述代码中的旋转角度计算式“a=Math.abs(px)/170*Math.PI/2;”改写为

“a=Math.sqrt(px*px+py*py)/Math.sqrt(170*170*2)*Math.PI/2+Math.PI/4;”。再在浏览器中打开包含这段HTML代码的html文件，可以看到在浏览器窗口中绘制出旋转小正方形图案2，如图3所示。

![img](https://img2018.cnblogs.com/common/1485495/201912/1485495-20191222194031773-1358186327.png) 

图3  小正方形图案2

### 3．六瓣花朵旋转一周

​        先生成六瓣花朵绘制的基础数据。然后按逆时针旋转60°的方式绘制6朵六瓣花，正好构成一个圆周。编写的HTML代码如下。

```
<!DOCTYPE html>

<head>

<title>六瓣花朵旋转一周</title>

<script type="text/javascript">

  function draw(id)

  {

     var canvas=document.getElementById(id);

     if (canvas==null)

        return false;

     var context=canvas.getContext('2d');

     context.fillStyle="#EEEEFF";

     context.fillRect(0,0,320,320);

     context.fillStyle="red";

     context.strokeStyle="blue";

     context.lineWidth=1;

     var dig=Math.PI/64;

     var x=new Array(129);

     var y=new Array(129);

     for (var i=0;i<=128;i++)      // 生成六瓣花朵图案的基础数据

     {

         d=50*(1+Math.sin(18*i*dig)/5);

         t=d*(0.5+Math.sin(6*i*dig)/2);

         x[i]=(60+t*Math.cos(i*dig));

         y[i]=(60+t*Math.sin(i*dig));

     }

     context.beginPath();

     for (n=0;n<=5;n++)

         for (i=0;i<=128;i++)

         {

            x1=x[i]*Math.cos(n*Math.PI/3)-y[i]*Math.sin(n*Math.PI/3)+160;

            y1=x[i]*Math.sin(n*Math.PI/3)+y[i]*Math.cos(n*Math.PI/3)+160;

            if (i==0)

            {

              context.moveTo(x1,y1);

              bx=x1;  by=y1;

            }

            else

              context.lineTo(x1,y1);

          }

      context.lineTo(bx,by);

      context.closePath();

      context.stroke();

      context.fill();

  }

</script>

</head>

<body onload="draw('myCanvas');">

<canvas id="myCanvas" width="320" height="320">您的浏览器不支持canvas！

</canvas>

</body>

</html>
```



​        在浏览器中打开包含这段HTML代码的html文件，可以看到在浏览器窗口中绘制出六瓣花朵旋转一周图案，如图4所示。

 ![img](https://img2018.cnblogs.com/common/1485495/201912/1485495-20191222194110820-1695797247.png)

图4  六瓣花朵旋转一周

 

​        上面的3个实例均采用图形旋转的坐标计算公式计算后进行旋转图形的绘制。实际上，HTML Canvas API中提供了图形旋转的方法。其调用方法是：

​          context . rotate(angle)     // 图形按给定的弧度angle进行顺时针旋转

​         rotate方法旋转的中心始终是canvas的原点。如果要改变它，需要使用translate方法。

​         用rotate方法改写实例1的程序，编写HTML文件如下。

 ```
<!DOCTYPE html>

<head>

<title>六瓣花朵旋转一周</title>

<script type="text/javascript">

  function draw(id)

  {

     var canvas=document.getElementById(id);

     if (canvas==null)

        return false;

     var context=canvas.getContext('2d');

     context.fillStyle="#EEEEFF";

     context.fillRect(0,0,320,320);

     context.fillStyle="red";

     context.strokeStyle="blue";

     context.lineWidth=1;

     var dig=Math.PI/64;

     var x=new Array(129);

     var y=new Array(129);

     for (var i=0;i<=128;i++)      // 生成六瓣花朵图案的基础数据

     {

         d=50*(1+Math.sin(18*i*dig)/5);

         t=d*(0.5+Math.sin(6*i*dig)/2);

         x[i]=(60+t*Math.cos(i*dig));

         y[i]=(60+t*Math.sin(i*dig));

     }

     context.beginPath();

     for (n=0;n<=5;n++)

         for (i=0;i<=128;i++)

         {

            x1=x[i]*Math.cos(n*Math.PI/3)-y[i]*Math.sin(n*Math.PI/3)+160;

            y1=x[i]*Math.sin(n*Math.PI/3)+y[i]*Math.cos(n*Math.PI/3)+160;

            if (i==0)

            {

              context.moveTo(x1,y1);

              bx=x1;  by=y1;

            }

            else

              context.lineTo(x1,y1);

          }

      context.lineTo(bx,by);

      context.closePath();

      context.stroke();

      context.fill();

  }

</script>

</head>

<body onload="draw('myCanvas');">

<canvas id="myCanvas" width="320" height="320">您的浏览器不支持canvas！

</canvas>

</body>

</html>
 ```



### 4．风车图案

​        将一个梯形按顺时针旋转90°的方式绘制4次，可以绘制出一个风车图案。编写HTML文件如下。

 

```
<!DOCTYPE html>

<head>

<title>风车的绘制</title>

<script type="text/javascript">

  function draw(id)

  {

     var canvas=document.getElementById(id);

     if (canvas==null)

        return false;

     var context=canvas.getContext('2d');

     context.fillStyle="#EEEEFF";

     context.fillRect(0,0,300,300);

     context.translate(150,150);

     context.save();

     context.fillStyle = 'green';

     for (var j=0;j<4;j++)

     {

          context.rotate(Math.PI*2/(4));

          context.beginPath();

          context.moveTo(-20,-80);

          context.lineTo(0,-80);

          context.lineTo(0,0);

          context.lineTo(-30,0);

          context.closePath();

          context.fill();

      }

      context.restore();

   }

</script>

</head>

<body onload="draw('myCanvas');">

<canvas id="myCanvas" width="300" height="300">您的浏览器不支持canvas！

</canvas>

</body>

</html>
```



​      }

​      context.restore();

   }

</script>

</head>

<body onload="draw('myCanvas');">

<canvas id="myCanvas" width="300" height="300">您的浏览器不支持canvas！

</canvas>

</body>

</html>

​        在浏览器中打开包含这段HTML代码的html文件，可以看到在浏览器窗口中绘制出风车图案，如图5所示。

 ![img](https://img2018.cnblogs.com/i-beta/1485495/201912/1485495-20191222194308734-680005075.png) 

图5  风车图案

### 5．七彩圆盘

​        通过旋转绘制圆的方式，可以绘制出一个七彩圆盘图案。编写HTML文件如下。

 

           ```
<!DOCTYPE html>

<head>

<title>七彩圆盘</title>

<script type="text/javascript">

  var colors = ['red','orange', 'yellow', 'green', 'cyan','blue', 'purple' ];

  function draw(id)

  {

     var canvas=document.getElementById(id);

     if (canvas==null)

        return false;

     var context=canvas.getContext('2d');

     context.fillStyle="#EEEEFF";

     context.fillRect(0,0,400,300);

     context.translate(200,150);

     for (var i=1;i<8;i++)

     {

         context.save();

         context.fillStyle = colors[i-1];

         for (var j=0;j<i*7;j++)

         {

              context.rotate(Math.PI*2/(i*7));

              context.beginPath();

              context.arc(0,i*20,8,0,Math.PI*2,true);

              context.fill();

          }

          context.restore();

      }

   }

</script>

</head>

<body onload="draw('myCanvas');">

<canvas id="myCanvas" width="400" height="300">您的浏览器不支持canvas！

</canvas>

</body>

</html>
           ```



​        在浏览器中打开包含这段HTML代码的html文件，可以看到在浏览器窗口中绘制出七彩圆盘图案，如图6所示。

![img](https://img2018.cnblogs.com/common/1485495/201912/1485495-20191222194338973-2068122941.png) 

图6 七彩圆盘







## [JavaScript动画实例：旋转的正三角形](https://www.cnblogs.com/cs-whut/p/13305825.html)

​      给定一个正三角形的重心坐标为（x0,y0），高为h，可以用如下的语句绘制一个底边水平的正三角形。

​         ctx.beginPath();

​         ctx.moveTo(x0,y0-h*2/3);

​         ctx.lineTo(x0+h/Math.sqrt(3), y0+h/3); 

​         ctx.lineTo(x0-h/Math.sqrt(3), y0+h/3);

​         ctx.lineTo(x0,y0-h*2/3);

​         ctx.closePath();

​         ctx.stroke();

​      给定正三角形个数count，通过循环的方式可以绘制出count个重心相同、高度不同正三角形。编写如下的HTML代码。

 

  ```
<!DOCTYPE html>

<html>

<head>

<title>重心相同高度不同的正三角形</title>

</head>

<body>

<canvas id="myCanvas" width="500" height="500" style="border:3px double #996633;">

</canvas>

<script type="text/javascript">

   var canvas=document.getElementById('myCanvas');

   ctx= canvas.getContext('2d');

   var height=360;

   var x0=250;

   var y0=(500-height)/2-(height/7)+(height*2/3);

   var count=4;

   ctx.lineWidth=1;

   ctx.fillStyle="#FF3388";

   ctx.strokeStyle="#FFFFFF";

   for (var i=0;i<count;i++)

   {

         var nHeight = height-(height/count)*i;

         ctx.beginPath();

         ctx.moveTo(x0,y0-nHeight*2/3);

         ctx.lineTo(x0+nHeight/Math.sqrt(3), y0+nHeight/3); 

         ctx.lineTo(x0-nHeight/Math.sqrt(3), y0+nHeight/3);

         ctx.lineTo(x0,y0-nHeight*2/3);

         ctx.closePath();

         ctx.stroke();

         ctx.fill();

   };

</script>

</body>

</html>
  ```



​      在浏览器中打开包含这段HTML代码的html文件，可以看到在浏览器窗口中绘制出如图1所示的4个重心相同高度不同的正三角形。

![img](https://img2020.cnblogs.com/blog/1485495/202007/1485495-20200715152836894-1344127335.png)

图1  4个重心相同高度不同的正三角形

​      若将图1中除最外层的三角形固定不动外，其余的3个正三角形绕重心进行旋转，会产生怎样的效果呢？

编写如下的HTML代码。

 

  ```
<!DOCTYPE html>

<html>

<head>

<title>旋转的正三角形</title>

</head>

<body>

<canvas id="myCanvas" width="500" height="500" style="border:3px double #996633;">

</canvas>

<script type="text/javascript">

   var canvas=document.getElementById('myCanvas');

   ctx= canvas.getContext('2d');

   var height=360;

   var x0=250;

   var y0=(500-height)/2-(height/7)+(height*2/3);

   var count=4;

   var speed=2;

   ctx.lineWidth=1;

   ctx.fillStyle="#FF3388";

   ctx.strokeStyle="#FFFFFF";

   var j = 0;

   function draw()

   {

      ctx.clearRect(0,0,500,500);

      ctx.save();

      for (var i=0;i<=count;i++)

      {

         var nHeight = height-(height/count)*i;

         ctx.translate(x0,y0);

         ctx.rotate(i*j/(80*speed));

         ctx.translate(-x0,-y0);

         ctx.beginPath();

         ctx.moveTo(x0,y0-nHeight*2/3);

         ctx.lineTo(x0+nHeight/Math.sqrt(3), y0+nHeight/3); 

         ctx.lineTo(x0-nHeight/Math.sqrt(3), y0+nHeight/3);

         ctx.lineTo(x0,y0-nHeight*2/3);

         ctx.closePath();

         ctx.stroke();

         ctx.fill();

      };

      ctx.restore();

      j++;

      if (j>100000)  j=0;

   }

   function move()

   {

      draw();

      requestAnimationFrame(move);

   }

   move();

</script>

</body>

</html>
  ```



​      在浏览器中打开包含这段HTML代码的html文件，可以看到在浏览器窗口中呈现出如图2所示重心相同高度不同的正三角形绕重心旋转的动画效果。

![img](https://img2020.cnblogs.com/blog/1485495/202007/1485495-20200715152930562-50815637.gif) 

图2  正三角形绕重心旋转效果（一）

​      若将上面程序中语句“var speed=2;”改写为“var speed=-2;”，其余部分保持不变，则正三角形会逆时针旋转，如图3所示。

![img](https://img2020.cnblogs.com/blog/1485495/202007/1485495-20200715153017205-988905342.gif) 

图3  正三角形绕重心旋转效果（二）

​      若将增加旋转的三角形的个数并适当调低旋转速度的级别，即修改语句：

​      “var count=4;    var speed=2;”   为  “var count=20;    var speed=12;”，其余部分保持不变，则在画布中呈现出如图4所示的正三角形旋转效果。

![img](https://img2020.cnblogs.com/blog/1485495/202007/1485495-20200715153231728-1535511770.gif) 

图4  正三角形绕重心旋转效果（三）

​       由图2、3或4可以看出，正三角形绕重心旋转时，越小的三角形旋转得越快。若将所有的正三角形都用同一种角速度进行旋转，即简单地修改语句 “ctx.rotate(i*j/(80*speed));”为“ctx.rotate(j/(80*speed));”，则在画布中呈现出如图5所示的正三角形旋转效果。

 ![img](https://img2020.cnblogs.com/blog/1485495/202007/1485495-20200715153248891-726269149.gif)

图5  正三角形绕重心旋转效果（四）

​       若为旋转的正三角形设置裁切区域，使得旋转超出最外层三角形的部分均不可见。编写如下的HTML文件。

  

    ```
<!DOCTYPE html>

<html>

<head>

<title>旋转的正三角形</title>

</head>

<body>

<canvas id="myCanvas" width="500" height="500" style="border:3px double #996633;">

</canvas>

<script type="text/javascript">

   var canvas=document.getElementById('myCanvas');

   ctx= canvas.getContext('2d');

   var height=360;

   var x0=250;

   var y0=(500-height)/2-(height/7)+(height*2/3);

   var count=24;

   var speed=18;

   ctx.lineWidth=2;

   ctx.fillStyle="#FF3388";

   ctx.strokeStyle="#FFFFFF";

   var j = 0;

   function draw()

   {

      ctx.clearRect(0,0,500,500);

      ctx.save();

      for (var i=0;i<=count;i++)

      {

         var nHeight = height-(height/count)*i;

         ctx.beginPath();

         ctx.moveTo(x0,y0-nHeight*2/3);

         ctx.lineTo(x0+nHeight/Math.sqrt(3), y0+nHeight/3); 

         ctx.lineTo(x0-nHeight/Math.sqrt(3), y0+nHeight/3);

         ctx.lineTo(x0,y0-nHeight*2/3);

         ctx.closePath();

         ctx.clip();

         ctx.translate(x0,y0);

         ctx.rotate(i*j/(80*speed));

         ctx.translate(-x0,-y0);

         ctx.beginPath();

         ctx.moveTo(x0,y0-nHeight*2/3);

         ctx.lineTo(x0+nHeight/Math.sqrt(3), y0+nHeight/3); 

         ctx.lineTo(x0-nHeight/Math.sqrt(3), y0+nHeight/3);

         ctx.lineTo(x0,y0-nHeight*2/3);

         ctx.closePath();

         ctx.stroke();

         ctx.fill();

      };

      ctx.restore();

      j++;

      if (j>1000)  j=0;

   }

   function move()

   {

      draw();

      requestAnimationFrame(move);

   }

   move();

</script>

</body>

</html>
    ```



在浏览器中打开包含这段HTML代码的html文件，可以看到在浏览器窗口中呈现出如图6所示旋转效果。

 ![img](https://img2020.cnblogs.com/blog/1485495/202007/1485495-20200715153355615-1484695053.gif)

图6  正三角形内的旋转