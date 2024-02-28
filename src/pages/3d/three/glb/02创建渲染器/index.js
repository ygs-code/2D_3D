// 引入three.js
import * as THREE from "three";

import "./index.less";

window.onload = () => {
  /*
    创建一个3d场景scene
   */

  const scene = new THREE.Scene();
  /*
     创建网格模型
   */
  // 创建一个长方体几何对象 geometry 相当于shader创建 顶点 位置
  const geometry = new THREE.BoxGeometry(50, 50, 50);
  // 材质对象 Material
  const material = new THREE.MeshBasicMaterial({
    color: 0x00ffff, //设置材质颜色
    // alpha: 0.5
  });
  /*
     顶点数据
      2、网格 Mesh 示例
          Unity 中的 游戏物体 都是由 三角平面 组成 ,
          网格 Mesh 中 记录了 这些 三角平面 和 顶点 的数据 ;
          立方体 每个面由 2 个三角形组成 ,
          整个立方体由 12 个三角形构成 ;

          球体 是由 很多个 三角形 拼接成的平面 组成的 , 内部是中空的 ; 球体表面不是圆滑的 , 是由一个个平面组成的 ; 组成球体 使用的三角形平面越多 , 其看起来就越平滑 , 显示的越精细 , 但是相应的 GPU 消耗也越来越高 ;    
          高模 : 非常精细的 3D 模型 , 有非常多的面数 , 如千万级别 ;
          低模 : 与高模相对 , 组成模型的面很简单 ;

    */
  const mesh = new THREE.Mesh(geometry, material);
  // 设置网格模型在三维空间中的位置坐标，默认是原始点
  /*
      设置物体在三维空间的位置 相当于用 变换矩阵 相乘 物体
    */
  mesh.position.set(0, 10, 0);
  scene.add(mesh); //网格模型添加到场景中

  // width和height用来设置Three.js输出的Canvas画布尺寸(像素px)
  const width = 800; //宽度
  const height = 500; //高度
  /*
      设置透视投影相机
    */
  // 30 角度
  const camera = new THREE.PerspectiveCamera(
    30, // 相机夹角
    width / height, // 宽高比
    1, // 近截面
    3000 // 远截面
  );

  //相机在Three.js三维坐标系中的位置
  // .position 设置相机在三维坐标中的位置。  eye
  camera.position.set(292, 223, 185);

  // .lookAt 设置相机拍摄时指向的方向。 at
  camera.lookAt(0, 0, -1);

  // up .up 设置相机拍摄时相机头顶的方向。
  camera.up.set(0, 1, 0);

  const render = new THREE.WebGLRenderer();
  // 设置画布canvas大小
  render.setSize(width, height);

  // 执行渲染操作
  render.render(scene, camera);
  // three.js 执行渲染命令
  document.body.appendChild(render.domElement);
};
