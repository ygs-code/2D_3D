import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";

window.onload = () => {
  const scene = new THREE.Scene();

  // 创建性能监视器
  let stats = new Stats();
  // 将监视器添加到页面中
  document.body.appendChild(stats.domElement);

  const canvas = document.querySelector("#canvas");
  const camera = new THREE.PerspectiveCamera(
    75,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    100000
  );
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

  const raycaster = new THREE.Raycaster();

  // 添加Box1
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  // 添加Box2
  const box = new THREE.BoxGeometry(1, 1, 1);
  const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const boxMesh = new THREE.Mesh(box, boxMaterial);
  boxMesh.position.set(6, 0, 0);
  scene.add(boxMesh);

  const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#canvas"),
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight, false);

  const controls = new OrbitControls(camera, renderer.domElement);

  function animate() {
    // 更新帧数
    stats.update();

    boxMesh.position.x -= 0.01;

    cube.material.color.set(0x0000ff);

    raycaster.set(boxMesh.position, new THREE.Vector3(-1, 0, 0).normalize());
    const intersection = raycaster.intersectObject(cube);

    if (intersection.length > 0) {
      if (intersection[0].distance < 0.5) {
        intersection[0].object.material.color.set(0xff0000);
      }
    }

    raycaster.set(boxMesh.position, new THREE.Vector3(1, 0, 0).normalize());

    const intersection2 = raycaster.intersectObject(cube);

    if (intersection2.length > 0) {
      if (intersection2[0].distance < 0.5) {
        intersection2[0].object.material.color.set(0xff0000);
      }
    }

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();
};
