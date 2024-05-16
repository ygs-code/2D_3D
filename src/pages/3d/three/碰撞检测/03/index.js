import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/addons/libs/stats.module.js'

window.onload = () => {
  const scene = new THREE.Scene();
  const world = new CANNON.World()

  // 创建性能监视器
  let stats = new Stats();
  // 将监视器添加到页面中
  document.body.appendChild(stats.domElement)

  const canvas = document.querySelector('#canvas');
  const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 100000);
  camera.position.set(0, 0, 10);

  // 添加环境光
  const ambient = new THREE.AmbientLight("#FFFFFF");
  ambient.intensity = 5;
  scene.add(ambient);
  // 添加平行光
  const directionalLight = new THREE.DirectionalLight("#FFFFFF");
  directionalLight.position.set(0, 0, 0);
  directionalLight.intensity = 16;
  scene.add(directionalLight);

  // 创建第一个Cube的Three.js模型
  const cubeGeometry1 = new THREE.BoxGeometry(1, 1, 1);
  const cubeMaterial1 = new THREE.MeshBasicMaterial({ color: 0x0000ff });
  const cube1 = new THREE.Mesh(cubeGeometry1, cubeMaterial1);
  scene.add(cube1);

  // 创建第一个Cube的Cannon.js刚体
  const cubeShape1 = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
  const cubeBody1 = new CANNON.Body({ mass: 1, shape: cubeShape1 });
  cubeBody1.position.set(1, 0, 0);
  world.addBody(cubeBody1);

  // 创建第二个Cube的Three.js模型
  const cubeGeometry2 = new THREE.BoxGeometry(1, 1, 1);
  const cubeMaterial2 = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube2 = new THREE.Mesh(cubeGeometry2, cubeMaterial2);
  scene.add(cube2);

  // 创建第二个Cube的Cannon.js刚体
  const cubeShape2 = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
  const cubeBody2 = new CANNON.Body({ mass: 1, shape: cubeShape2 });
  cubeBody2.position.set(-1, 0, 0);
  world.addBody(cubeBody2);

  // 监听碰撞事件
  cubeBody2.addEventListener("collide", function (e) {
    cube2.material.color.set(0xff0000);
  });

  const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#canvas'),
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight, false)

  const controls = new OrbitControls(camera, renderer.domElement);

  function animate() {
    // 更新帧数
    stats.update()

    world.step(1 / 60);

    cubeBody1.position.x -= 0.02;

    // 更新Three.js模型的位置
    cube1.position.copy(cubeBody1.position);
    cube1.quaternion.copy(cubeBody1.quaternion);
    cube2.position.copy(cubeBody2.position);
    cube2.quaternion.copy(cubeBody2.quaternion);

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }

  animate();
};
