## 1 自适应屏幕大小

![img](https://threejs-1251830808.cos.ap-guangzhou.myqcloud.com/1660117583297-c5f6d661-4420-4a85-b6c6-09f166375dc0.gif)

你会发现，我们前面写好的代码，在页面尺寸发生改变的时候，并不能自适应的改变尺寸，而出现空白或者滚动条突出的情况。所以监听屏幕大小的改变，来重新设置相机的宽高比例和渲染器的尺寸大小，代码如下：

```javascript
// 监听画面变化，更新渲染画面
window.addEventListener("resize", () => {
  //   console.log("画面变化了");
  // 更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight;
  //   更新摄像机的投影矩阵
  camera.updateProjectionMatrix();

  //   更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight);
  //   设置渲染器的像素比
  renderer.setPixelRatio(window.devicePixelRatio);
});
```



























aspect属性是设置摄像机视锥体的长宽比，通常是使用画布的宽/画布的高。camera.updateProjectionMatrix()用于更新摄像机投影矩阵，相机任何参数被改变以后必须被调用

## [#](https://www.three3d.cn/threejs/02-Threejs开发入门与调试/08-画布自适应屏幕大小与全屏.html#_1-2-控制场景全屏)1.2 控制场景全屏

经常我们需要全屏的展示三维场景。例如，我们想要双击，实现全屏效果，代码如下：

```javascript
window.addEventListener("dblclick", () => {
  const fullScreenElement = document.fullscreenElement;
  if (!fullScreenElement) {
    //   双击控制屏幕进入全屏，退出全屏
    // 让画布对象全屏
    renderer.domElement.requestFullscreen();
  } else {
    //   退出全屏，使用document对象
    document.exitFullscreen();
  }
});
```























**fullscreenElement**只读属性返回当前在此文档中以全屏模式显示的元素。

如果文档当前未使用全屏模式，则返回值为null。

使用[element.requestFullscreen()open in new window](https://www.nhooo.com/jsref/elem_requestfullscreen.html)方法以全屏模式查看元素，exitFullscreen方法退出全屏。

## [#](https://www.three3d.cn/threejs/02-Threejs开发入门与调试/08-画布自适应屏幕大小与全屏.html#_2-综合上述代码)2 综合上述代码

1、在前面创建的项目中的main.js文件写入代码

```javascript
import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 导入动画库
import gsap from "gsap";

// console.log(THREE);

// 目标：js控制画面全屏

// 1、创建场景
const scene = new THREE.Scene();

// 2、创建相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// 设置相机位置
camera.position.set(0, 0, 10);
scene.add(camera);

// 添加物体
// 创建几何体
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
// 根据几何体和材质创建物体
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

// 修改物体的位置
// cube.position.set(5, 0, 0);
// cube.position.x = 3;
// 缩放
// cube.scale.set(3, 2, 1);
// cube.scale.x = 5;
// 旋转
cube.rotation.set(Math.PI / 4, 0, 0, "XZY");

// 将几何体添加到场景中
scene.add(cube);

console.log(cube);

// 初始化渲染器
const renderer = new THREE.WebGLRenderer();
// 设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);
// console.log(renderer);
// 将webgl渲染的canvas内容添加到body
document.body.appendChild(renderer.domElement);

// // 使用渲染器，通过相机将场景渲染进来
// renderer.render(scene, camera);

// 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
// 设置控制器阻尼，让控制器更有真实效果,必须在动画循环里调用.update()。
controls.enableDamping = true;

// 添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
// 设置时钟
const clock = new THREE.Clock();

window.addEventListener("dblclick", () => {
  const fullScreenElement = document.fullscreenElement;
  if (!fullScreenElement) {
    //   双击控制屏幕进入全屏，退出全屏
    // 让画布对象全屏
    renderer.domElement.requestFullscreen();
  } else {
    //   退出全屏，使用document对象
    document.exitFullscreen();
  }
  //   console.log(fullScreenElement);
});

function render() {
  controls.update();
  renderer.render(scene, camera);
  //   渲染下一帧的时候就会调用render函数
  requestAnimationFrame(render);
}

render();

// 监听画面变化，更新渲染画面
window.addEventListener("resize", () => {
  //   console.log("画面变化了");
  // 更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight;
  //   更新摄像机的投影矩阵
  camera.updateProjectionMatrix();

  //   更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight);
  //   设置渲染器的像素比
  renderer.setPixelRatio(window.devicePixelRatio);
});
```















































































































































































































效果演示：

![img](https://threejs-1251830808.cos.ap-guangzhou.myqcloud.com/1660120029071-60d93f64-7d2f-478e-9e0f-bc7f94b24e32.gif)

## [#](https://www.three3d.cn/threejs/02-Threejs开发入门与调试/08-画布自适应屏幕大小与全屏.html#应对hd-dpi显示器)应对HD-DPI显示器

HD-DPI代表每英寸高密度点显示器(视网膜显示器)。它指的是当今大多数的Mac和windows机器以及几乎所有的智能手机。

浏览器中的工作方式是不管屏幕的分辨率有多高使用CSS像素设置尺寸会被认为是一样的。 同样的物理尺寸浏览器会渲染出字体的更多细节。

使用three.js有多种方法来应对HD-DPI。

第一种就是不做任何特别的事情。这可以说是最常见的。 渲染三维图形需要大量的GPU处理能力。移动端的GPU能力比桌面端的要弱。至少截止到2018年, 手机都有非常高的分辨率显示器。 目前最好的手机的HD-DPI比例为3x，意思是非高密度点显示器上的一个像素在高密度显示器上是9个像素。 意味着需要9倍的渲染。

计算9倍的像素是个大工程所以如果保持代码不变我们将计算一个像素然后浏览器将以三倍大小绘制(3x3=9像素)。

对于大型的three.js应用来说上面就是你想要的否侧你的帧速率会很低。

尽管如此如果你确实想用设备的分辨率来渲染，three.js中有两种方法来实现。

一种是使用renderer.setPixelRatio来告诉three.js分辨率的倍数。 访问浏览器从CSS像素到设备像素的倍数然后传给three.js。

```javascript
 renderer.setPixelRatio(window.devicePixelRatio);
```



之后任何对renderer.setSize的调用都会神奇地使用您请求的大小乘以您传入的像素比例. 强烈不建议这样。 看下面。

另一种方法是在调整canvas的大小时自己处理。

```javascript
function resizeRendererToDisplaySize(renderer) {
      const canvas = renderer.domElement;
      const pixelRatio = window.devicePixelRatio;
      const width = canvas.clientWidth * pixelRatio | 0;
      const height = canvas.clientHeight * pixelRatio | 0;
      const needResize = canvas.width !== width || canvas.height !== height;
      if (needResize) {
        renderer.setSize(width, height, false);
      }
      return needResize;
    }
```























第二章方法从客观上来说更好。为什么？因为我拿到了我想要的。 在使用three.js时有很多种情况下我们需要知道canvas的绘图缓冲区的确切尺寸。 比如制作后期处理滤镜或者我们在操作着色器需要访问gl_FragCoord变量，如果我们截屏或者给GPU 读取像素，绘制到二维的canvas等等。 通过我们自己处理我们会一直知道使用的尺寸是不是我们需要的。 幕后并没有什么特殊的魔法发生。