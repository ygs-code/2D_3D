import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";
import venice_sunset_1k from "static/file/hdr/venice_sunset_1k.hdr";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { LoadingBar } from "@/pages/3d/utils/LoadingBar.js";
class App {
  constructor() {
    // 创建dom
    const container = document.createElement("div");
    // 把div dom 添加到 body中
    document.body.appendChild(container);

    //透视投影
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    // 设置相机位置
    this.camera.position.set(0, 0, 5);

    // 设置场景
    this.scene = new THREE.Scene();
    // 设置背景颜色
    this.scene.background = new THREE.Color(0xaaaaaa);

    // 创建一个虚拟的球形网格 Mesh 的辅助对象来模拟 半球形光源 HemisphereLight.
    const ambient = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 0.5);
    this.scene.add(ambient);

    /*
            平行光（DirectionalLight）
            平行光是沿着特定方向发射的光。这种光的表现像是无限远，
            从它发出的光线都是平行的。常常用平行光来模拟太阳光的效果。
            太阳足够远，因此我们可以认为太阳的位置是无限远，
            所以我们认为从太阳发出的光线也都是平行的。
        */
    const light = new THREE.DirectionalLight(0xffffff, 1.5);
    light.position.set(0.2, 1, 1);
    this.scene.add(light);

    // 渲染器
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.physicallyCorrectLights = true;
    container.appendChild(this.renderer.domElement);

    this.setEnvironment();

    this.loadingBar = new LoadingBar();

    this.loadGLTF();

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    window.addEventListener("resize", this.resize.bind(this));
  }

  setEnvironment() {
    // 加载模型
    const loader = new RGBELoader();
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    pmremGenerator.compileEquirectangularShader();

    const self = this;

    loader.load(
      "/static/file/hdr/venice_sunset_1k.hdr",
      (texture) => {
        const envMap = pmremGenerator.fromEquirectangular(texture).texture;
        pmremGenerator.dispose();

        self.scene.environment = envMap;
      },
      undefined,
      (err) => {
        console.error("An error occurred setting the environment");
      }
    );
  }

  loadGLTF() {
    // 加载 gltf 模型
    const loader = new GLTFLoader(); //.setPath('../../assets/plane/');

    // Load a glTF resource
    loader.load(
      // resource URL
      "/static/file/plane/microplane.glb",
      // called when the resource is loaded
      (gltf) => {
        const bbox = new THREE.Box3().setFromObject(gltf.scene);

        console.log(
          `min:${bbox.min.x.toFixed(2)},${bbox.min.y.toFixed(
            2
          )},${bbox.min.z.toFixed(2)} -  max:${bbox.max.x.toFixed(
            2
          )},${bbox.max.y.toFixed(2)},${bbox.max.z.toFixed(2)}`
        );

        // 模型
        this.plane = gltf.scene;

        this.scene.add(gltf.scene);

        this.loadingBar.visible = false;

        this.renderer.setAnimationLoop(this.render.bind(this));
        console.log("模型加载成功");
      },
      // called while loading is progressing
      (xhr) => {
        this.loadingBar.progress = xhr.loaded / xhr.total;
      },
      // called when loading has errors
      (err) => {
        console.error(err);
      }
    );
  }

  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  render() {
    // 改变模型 旋转y轴角度
    this.plane.rotateY(0.01);
    this.renderer.render(this.scene, this.camera);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const app = new App();
  window.app = app;
});
