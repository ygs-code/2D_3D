# webgl纹理贴图机制

https://blog.csdn.net/qq_37987033/article/details/128745577

前言
在计算机图形学中，为了模拟更加真实的效果，需要给每个像素赋予不同的颜色值，这种情况下如果手动指定每个像素点的rgb值，将会是一件难以完成的任务。这就需要有一种机制，能够让我们把图片素材渲染到模型的一个或者多个表面上，这种机制叫做纹理贴图，本文将详细介绍在webgl中如何把一张真实图像贴到计算器图形上的。

纹理图片大小规范
WebGL 对纹理图片大小是有要求的，图片的宽度和高度必须是2的N次幂，比如 16 x 16，32 x 32，32 x 64 等。实际上，不是这个尺寸的图片也能进行贴图，但是这样不仅会增加更多的处理，还会影响性能。

纹理坐标系统
纹理也有一套自己的坐标系统，纹理坐标一般被称为 uv 坐标系（或者st），u 代表横轴坐标，v 代表纵轴坐标，他们的范围都是0到1。不管纹理图像本身的长宽是多少，都处于这个坐标系下。

![在这里插入图片描述](https://img-blog.csdnimg.cn/fe8cfa7b68174acfb9cbe89cdec0d3af.png)

## 贴图流程

### JavaScript部分

在javascript中将纹理信息传递给着色器的步骤是固定的，类似缓冲区，流程虽然比较繁琐，但是熟能生巧，下面来一步步解析：

#### 齐次坐标—uv坐标数据准备

```
    const aPosition = gl.getAttribLocation(program, 'aPosition');
    const aTextCoord = gl.getAttribLocation(program, 'aTextCoord');
    const uSample = gl.getUniformLocation(program, 'uSample');
    // 创建缓冲区对象
    const buffer = gl.createBuffer();
    // 绑定缓冲区对象
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    // 传入的数据
    const vertices = new Float32Array([
      -0.5, -0.5,    0.0, 1.0,  // 齐次坐标x, 齐次坐标y, uv坐标u, uv坐标v
      0.5, -0.5,    0.0, 0.0,
      0.5,   0.5,    1.0, 1.0,
      -0.5,  0.5,    1.0, 0.0,
    ])

    const BYTES = vertices.BYTES_PER_ELEMENT;
 
    // 开辟空间并写入数据
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

    // 缓冲区对象分配给attribute变量
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, BYTES * 4, 0)
    // 开启attribue缓冲区变量
    gl.enableVertexAttribArray(aPosition)

    gl.vertexAttribPointer(aTextCoord, 2, gl.FLOAT, false, BYTES * 4, BYTES * 2)
    gl.enableVertexAttribArray(aTextCoord)

```

这里主要关注向缓冲区传递的数据vertices ，第一个顶点齐次坐标为（-0.5，0.5），其对应的纹理图像的uv坐标是（0.0，1.0）；第二个顶点齐次坐标为（-0.5，-0.5），其对应的纹理图像的uv坐标是（0.0，0.0），依次类推。对应关系如下图：

![在这里插入图片描述](https://img-blog.csdnimg.cn/2f478f76b20645c28b688656c9fb2148.png)

然后通过 gl.vertexAttribPointer()方法从缓冲区向着色器中传递attribute变量aPosition和aTextCoord，分别表示齐次坐标和对应的uv映射，uSample 的用处将在稍后介绍。


#### 加载外部纹理图像

```
    const img = new Image()
    img.onload = function(){
      // ...
    }
    img.src = "./img/sky.jpg"

```

我们使用 new Image 新建对象，由于图像的加载是异步的，因此需要对图像进行监听，当图像加载完成（onload事件触发）时，进入后续的步骤。

纹理配置加载
创建纹理对象
使用gl.createTexture() 方法创建纹理对象，该方法不需要参数，返回新创建的纹理对象，webgl中的纹理由纹理对象统一管理

 ```
    img.onload = function(){
      const texture = gl.createTexture() // 创建纹理对象
    }

 ```

- **图像Y轴反转**

webgl中图像纹理坐标系的v和图片的坐标Y是相反的，因此，要先把图像Y轴进行反转，才能正确的映射纹理坐标：
![在这里插入图片描述](https://img-blog.csdnimg.cn/d6ac389d040648109ebdb6f206e2dc8d.png)

```
    img.onload = function(){
      const texture = gl.createTexture() // 创建纹理对象
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true) // 图像反转Y轴
    }

```

gl.pixelStorei规范如下：

gl.pixelStorei (pname，param): 使用pname和param的指定方式得到处理后的图像

pname的枚举如下
– gl.UNPACK_FLIP_Y_WEBGL：对图像进行Y轴反转
– gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL：将图像RGB的每个分量乘以A
param: 非0值（true）或 0（false）
激活纹理单元并绑定至纹理对象
webgl通过名为纹理单元的机制来使用一个或多个纹理，即使使用的纹理图像只有一张，也必须为其指定一个纹理单元。在激活纹理单元后，类似于缓冲区机制，还需要将其绑定纹理对象。

```
    img.onload = function(){
      const texture = gl.createTexture() // 创建纹理对象
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1) // 图像反转Y轴
      gl.activeTexture(gl.TEXTURE0) // 激活纹理单元
      gl.bindTexture(gl.TEXTURE_2D, texture) // 绑定纹理对象
    }

```

纹理单元的激活通过gl.activeTexture()函数

gl.activeTexture(textureUnit): 激活纹理单元，被激活的单元编号是textureUnit

textureUnit ：gl.TEXTURE0、gl.TEXTURE1、gl.TEXTURE2····
gl.bindTexture(target, texture) 将纹理单元开启并绑定至纹理对象

gl.bindTexture (target，texture): 开启texture指定的纹理对象，将其绑定至target上

target的枚举如下
– gl.TEXTURE_2D：二维纹理
– gl.TEXTURE_CUBE_MAP：立方体纹理
texture: 要绑定的纹理对象
完成这两步后，纹理单元的状态将会发生改变：

配置纹理对象参数
接下来，需要配置纹理对象的参数，设置纹理映射到图形的具体方式：如何根据纹理坐标获取纹素颜色，使用哪种方式填充纹理。纹理对象参数配置靠gl.texParameterf（）函数实现。

```
    img.onload = function(){
      const texture = gl.createTexture() // 创建纹理对象

      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1) // 反转Y轴
      gl.activeTexture(gl.TEXTURE0) // 激活纹理单元
      gl.bindTexture(gl.TEXTURE_2D, texture) // 绑定纹理对象

      gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR) // 放大处理方式
      gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR) // 缩小处理方式
      gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE) // 水平平铺方式
      gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE) // 竖直平铺方式

    }

```

gl.texParameterf() 规范如下：

gl.texParameterf(target，pname，param): 将参数param的值，将其绑定至目标纹理对象的panme属性上

target的枚举如下，与绑定纹理对象函数gl.bindTexture的第一个参数相同。
– gl.TEXTURE_2D：二维纹理
– gl.TEXTURE_CUBE_MAP：立方体纹理
pname: 纹理属性
param: 纹理属性对应的参数



纹理属性pname可以指定以下几种

纹理参数	描述	默认值
gl.TEXTURE_MAG_FILTER	放大方法，当纹理的绘制范围比纹理本身更大时，如何获取纹素颜色。如将16 * 16的纹理图像映射到32 * 32的图形上，需要填充不足的纹理图像的像素	gl.LINEAR
gl.TEXTURE_MIN_FILTER	缩小方法，当纹理的绘制范围比纹理本身更小时，如何获取纹素颜色。如将32 * 32的纹理图像映射到16 * 16的图形上，需要剔除多余的纹理图像的像素	gl.LINEAR
gl.TEXTURE_WRAP_S	水平填充方法，如何在水平方向上对纹理图像左右侧进行填充	gl.REPEAT
gl.TEXTURE_WRAP_T	竖直填充方法，如何在水平方向上对纹理图像上下侧进行填充	gl.REPEAT

 

![在这里插入图片描述](https://img-blog.csdnimg.cn/0d989a707e114d26a6007414150c9a92.png)

当pname为**gl.TEXTURE_MAG_FILTER**或者**gl.TEXTURE_MIN_FILTER**时，param可选如下：

值	描述
gl.NEAREST	使用原纹理上距离映射后的像素（新像素）中心最近的那个像素的颜色值作为新像素的值
gl.LINEAR	使用距离新像素最近的四个像素的颜色值的加权平均作为新像素的值
当pname为gl.TEXTURE_WRAP_S或者gl.TEXTURE_WRAP_T时，param可选如下：

值	描述
gl.REPEAT	平铺重复
gl.MIRRORED_REPEAT	镜像对称重复
gl.CLAMP_TO_EDGE	使用纹理边缘拉伸值
纹理图像分配给纹理对象

```
    img.onload = function(){
      const texture = gl.createTexture() // 创建纹理对象

      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1) // 反转Y轴
      gl.activeTexture(gl.TEXTURE0) // 激活纹理单元
      gl.bindTexture(gl.TEXTURE_2D, texture) // 绑定纹理对象

      gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR) // 放大处理方式
      gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR) // 缩小处理方式
      gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE) // 水平平铺方式
      gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE) // 竖直平铺方式

      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img) // 配置纹理图像
    }

```

gl.texImage2D(target，level，internalformat，format，type，image): 将imgae图像分配给绑定至target的纹理对象

target的枚举如下
– gl.TEXTURE_2D：二维纹理
– gl.TEXTURE_CUBE_MAP：立方体纹理
level: 0
internalformat: 图像内部格式
format: 纹理内部格式，与internalformat相同
type: 纹理数据类型，一般使用UNSIGNED_BYTE
image: 纹理图像存储的对象



internalformat和format的枚举如下表所示，其中**流明**表示物体表面的亮度。JPG、BMP通常使用RGB,PNG一般使用RGBA,gl.LUMINANCE和LUMINANCE_ALPHA多用于灰度图。

 

| 值                 | 描述                |
| ------------------ | ------------------- |
| gl.RGB             | 红、绿、蓝          |
| gl.RGBA            | 红、绿、蓝、透明度  |
| gl.ALPHA           | （0，0，0，透明度） |
| gl.LUMINANCE       | L、L、L、1L：流明   |
| gl.LUMINANCE_ALPHA | L、L、L、透明度     |

分配完成后，图像就从javascript程序中存储到了webgl系统中的纹理对象中：

纹理单元传递给着色器
在第一步里，gl.getUniformLocation(program, ‘uSample’) 向着色器声明了一个名为uSample的uniform变量，现在，我们要把纹理单元传递给它。这一步使用 gl.uniform1i()函数，他接受两个参数：变量地址以及序号，因为之前调用绑定函数绑定的是编号 0 的gl.TEXTURE0，因此这里的参数是0：

```
       image.onload = function () {
      // 翻转图片的Y轴,默认是不翻转
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);  // 图像反转Y轴

      gl.activeTexture(gl.TEXTURE0); //激活贴图，放在第0个单元上（最少可以支持8个单元） // 激活纹理单元
      gl.bindTexture(gl.TEXTURE_2D, texture); //绑定贴图：哪种贴图和哪个贴图 绑定纹理对象

      // // 对贴图的参数进行设置gl.texParameteri(贴图的种类，参数的名称，具体值)
      // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

      //设置参数，使我们可以渲染任何大小的图像。
       // Set the parameters so we can render any size image.
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      

      // 贴图用哪张图片，即用image作为texture
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        image
      );

      gl.uniform1f(u_Sampler, 0);
    
    };

```



完成传递之后webgl内部状态如下：
![在这里插入图片描述](https://img-blog.csdnimg.cn/2bff72e343394e19a3f9def17446a6ff.png)

### 着色器部分

#### 顶点着色器

在顶点着色器中接受缓冲区中传递的attribute变量 aPosition 和 aTextCoord;并且使用varying变量把uv坐标传递给片元着色器。

```
 const vertex = `
	  attribute vec4 aPosition;
      attribute vec2 aTextCoord;
      varying  vec2 vTextCoord;
	  void main() {
		gl_Position =  aPosition;
        vTextCoord = aTextCoord;
 	}

```

#### 片元着色器

由顶点着色器传递来的片元纹理坐标会在光栅化过程中被内插，片元着色器接受到的是内插后的纹理坐标。**sampler2D 是一种专门用于接受纹理对象的类型**。接下来，需要**根据纹理坐标，将纹理图像上每个纹素/像素的颜色，赋值到对应片元上**，如下所示：

```
    const fragment = `
	  precision highp float;
      uniform sampler2D uSample;
      varying  vec2 vTextCoord;
		void main(){
			gl_FragColor =texture2D(uSample, vTextCoord);
	  }
		`

```

这里用到的函数是texture2D（），它是glsl的内置函数：

gl.texture2D(sampler2D sampler，vec2 coord): 将sampler的纹理上，获取坐标为coord的纹理像素颜色

sampler: 指定的纹理单元编号
coord: 指定的纹理坐标

### 完整示例

至此，以及完成了纹理贴图的所有步骤，效果的完整代码如下。由于canvas读取本地图片数据会受到浏览器跨域限制，鉴于我使用的是vscode编辑器，可以从左侧扩展搜索并下载一个**Liver Server插件**，将所有资源发布在本地服务下，避免了跨域问题。