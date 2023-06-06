## 1. 坐标轴辅助器

![img](https://threejs-1251830808.cos.ap-guangzhou.myqcloud.com/1659158000267-f25299bf-9c01-444d-bb03-1d81f455f31d.png)

一般我们在开发阶段，添加物体和设置物体位置，都需要参考一下坐标轴，方便查看是否放置到对应位置。所以一般添加坐标轴辅助器来作为参考，辅助器简单模拟3个坐标轴的对象。红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴。

```
const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );

```

## [#](https://www.three3d.cn/threejs/02-Threejs%E5%BC%80%E5%8F%91%E5%85%A5%E9%97%A8%E4%B8%8E%E8%B0%83%E8%AF%95/03-%E6%B7%BB%E5%8A%A0%E5%9D%90%E6%A0%87%E8%BD%B4%E8%BE%85%E5%8A%A9%E5%99%A8.html#_2-arrowhelper%E7%AE%AD%E5%A4%B4%E8%BE%85%E5%8A%A9%E5%99%A8)2 ArrowHelper箭头辅助器

用于模拟方向的3维箭头对象

![img](https://threejs-1251830808.cos.ap-guangzhou.myqcloud.com/1659164108801-0a3c374f-0b44-4cb8-92a7-013bd117f1c8.png)

```
const dir = new THREE.Vector3( 1, 2, 0 );

//normalize the direction vector (convert to vector of length 1)
dir.normalize();

const origin = new THREE.Vector3( 0, 0, 0 );
const length = 1;
const hex = 0xffff00;

const arrowHelper = new THREE.ArrowHelper( dir, origin, length, hex );
scene.add( arrowHelper )

```

## [#](https://www.three3d.cn/threejs/02-Threejs%E5%BC%80%E5%8F%91%E5%85%A5%E9%97%A8%E4%B8%8E%E8%B0%83%E8%AF%95/03-%E6%B7%BB%E5%8A%A0%E5%9D%90%E6%A0%87%E8%BD%B4%E8%BE%85%E5%8A%A9%E5%99%A8.html#%E6%9E%84%E9%80%A0%E5%87%BD%E6%95%B0)构造函数

ArrowHelper(dir : Vector3, origin : Vector3, length : Number, hex : Number, headLength : Number, headWidth : Number )

dir -- 基于箭头原点的方向. 必须为单位向量. origin -- 箭头的原点. length -- 箭头的长度. 默认为 1. hex -- 定义的16进制颜色值. 默认为 0xffff00. headLength -- 箭头头部(锥体)的长度. 默认为箭头长度的0.2倍(0.2 * length). headWidth -- The width of the head of the arrow. Default is 0.2 * headLength.

### [#](https://www.three3d.cn/threejs/02-Threejs%E5%BC%80%E5%8F%91%E5%85%A5%E9%97%A8%E4%B8%8E%E8%B0%83%E8%AF%95/03-%E6%B7%BB%E5%8A%A0%E5%9D%90%E6%A0%87%E8%BD%B4%E8%BE%85%E5%8A%A9%E5%99%A8.html#)