
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { LoadingBar } from "@/pages/3d/utils/LoadingBar.js";
import { NPCHandler } from './NPCHandler.js';
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { Pathfinding } from '@/pages/3d/utils/pathfinding/Pathfinding.js';
class Game {
  constructor() {
    const container = document.createElement('div');
    document.body.appendChild(container);

    // 渲染时间戳
    this.clock = new THREE.Clock();
    // 进度条加载
    this.loadingBar = new LoadingBar();
    this.loadingBar.visible = false;

    this.assetsPath = '../../assets/';
    // 透视投影
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 500);

    // 相机位置
    this.camera.position.set(0, 40, 20);
    // 眼睛位置
    this.camera.lookAt(0, 0, -10);

    let col = 0x201510;
    // 创建场景
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(col);
    // 开启雾化
    this.scene.fog = new THREE.Fog(col, 100, 200);


    // 半球光（HemisphereLight）
    // 光源直接放置于场景之上，光照颜色从天空光线颜色渐变到地面光线颜色。
    // 半球光不能投射阴影。
    const ambient = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    this.scene.add(ambient);
    // 平行光（DirectionalLight）
    // 平行光是沿着特定方向发射的光。这种光的表现像是无限远，从它发出的光线都是平行的。
    // 常常用平行光来模拟太阳光的效果。 太阳足够远，因此我们可以认为太阳的位置是无限远，
    // 所以我们认为从太阳发出的光线也都是平行的。
    const light = new THREE.DirectionalLight();
    light.position.set(4, 20, 20);
    light.target.position.set(-2, 0, 0);
    light.castShadow = true;
    //Set up shadow properties for the light
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 512;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 50;
    const d = 30;
    light.shadow.camera.left = -d;
    light.shadow.camera.bottom = -d * 0.25;
    light.shadow.camera.right = light.shadow.camera.top = d;
    this.scene.add(light);
    this.light = light;

    // 渲染器
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.shadowMap.enabled = true;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(this.renderer.domElement);
    this.setEnvironment();

    this.load();

    window.addEventListener('resize', this.resize.bind(this));
  }

  initPathfinding(navmesh) {
    // 寻路
    this.pathfinder = new Pathfinding();
    this.pathfinder.setZoneData('factory', Pathfinding.createZone(navmesh.geometry, 0.02));

    if (this.npcHandler.gltf !== undefined) {
      this.npcHandler.initNPCs();
    }
  }

  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  setEnvironment() {
    const loader = new RGBELoader()  //.setPath(this.assetsPath);
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    pmremGenerator.compileEquirectangularShader();


    // 加载模型
    loader.load('/static/file/hdr/factory.hdr',
      texture => {
        const envMap = pmremGenerator.fromEquirectangular(texture).texture;
        pmremGenerator.dispose();

        this.scene.environment = envMap;

        this.loadingBar.visible = !this.loadingBar.loaded;
      },
      xhr => {
        this.loadingBar.update('envmap', xhr.loaded, xhr.total);
      },
      err => {
        console.error(err.message);
      });
  }

  load() {
    this.loadEnvironment();
    this.npcHandler = new NPCHandler(this);
  }

  loadEnvironment() {
    const loader = new GLTFLoader() //.setPath(`${this.assetsPath}factory/`);

    this.loadingBar.visible = true;

    // 加载模型
    // Load a glTF resource
    loader.load(
      // resource URL
      '/static/file/factory/factory2.glb',
      // called when the resource is loaded
      gltf => {

        this.scene.add(gltf.scene);
        this.factory = gltf.scene;
        this.fans = [];

        const mergeObjects = { elements2: [], elements5: [], terrain: [] };

        gltf.scene.traverse(child => {
          if (child.isMesh) {
            if (child.name == 'NavMesh') {
              this.navmesh = child;
              this.navmesh.geometry.rotateX(Math.PI / 2);
              this.navmesh.quaternion.identity();
              this.navmesh.position.set(0, 0, 0);
              child.material.transparent = true;
              child.material.opacity = 0.5;
            } else if (child.name.includes('fan')) {
              // 风扇模型
              this.fans.push(child);
            } else if (child.material.name.includes('elements2')) {

              mergeObjects.elements2.push(child);
              child.castShadow = true;
            } else if (child.material.name.includes('elements5')) {

              mergeObjects.elements5.push(child);
              child.castShadow = true;

            } else if (child.material.name.includes('terrain')) {

              mergeObjects.terrain.push(child);
              child.castShadow = true;
            } else if (child.material.name.includes('sand')) {
              child.receiveShadow = true;

            } else if (child.material.name.includes('elements1')) {

              child.castShadow = true;
              child.receiveShadow = true;
            } else if (child.parent.name.includes('main')) {

              child.castShadow = true;
            }
          }
        });

        this.scene.add(this.navmesh);

        for (let prop in mergeObjects) {
          const array = mergeObjects[prop];
          let material;
          array.forEach(object => {
            if (material == undefined) {
              material = object.material;
            } else {
              object.material = material;
            }
          });
        }

        this.renderer.setAnimationLoop(this.render.bind(this));

        this.initPathfinding(this.navmesh);

        this.loadingBar.visible = !this.loadingBar.loaded;
      },
      // called while loading is progressing
      xhr => {

        this.loadingBar.update('environment', xhr.loaded, xhr.total);

      },
      // called when loading has errors
      err => {

        console.error(err);

      }
    );
  }

  startRendering() {
    this.renderer.setAnimationLoop(this.render.bind(this));
  }

  render() {
    const dt = this.clock.getDelta();

    if (this.fans !== undefined) {
      this.fans.forEach(fan => {
        fan.rotateY(dt);
      });
    }

    if (this.npcHandler !== undefined) this.npcHandler.update(dt);

    this.renderer.render(this.scene, this.camera);

  }
}


// export { Game };

document.addEventListener("DOMContentLoaded", () => {
  const game = new Game();
  window.game = game;
});
