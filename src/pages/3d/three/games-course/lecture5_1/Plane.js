// import { Vector3 } from '../../libs/three137/three.module.js';
// import { GLTFLoader } from '../../libs/three137/GLTFLoader.js';

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";
import venice_sunset_1k from "static/file/hdr/venice_sunset_1k.hdr";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { LoadingBar } from "@/pages/3d/utils/LoadingBar.js";

import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";

class Plane {
  constructor(game) {
    this.assetsPath = game.assetsPath;
    this.loadingBar = game.loadingBar;
    this.game = game;
    this.scene = game.scene;
    this.load();
    // 声明三个向量 就是三维中的一个空间点
    this.tmpPos = new THREE.Vector3();
  }

  get position() {
    if (this.plane !== undefined) {
      this.plane.getWorldPosition(this.tmpPos);
    }
    return this.tmpPos;
  }

  set visible(mode) {
    this.plane.visible = mode;
  }

  load() {
    const loader = new GLTFLoader(); //.setPath(`${this.assetsPath}plane/`);
    this.ready = false;

    // Load a glTF resource
    // 加载模型 飞机模型
    loader.load(
      // resource URL
      "/static/file/plane/microplane.glb",
      // called when the resource is loaded
      (gltf) => {
        this.scene.add(gltf.scene);
        this.plane = gltf.scene;
        // 声明三个向量 就是三维中的一个空间点
        this.velocity = new THREE.Vector3(0, 0, 0.1);

        this.propeller = this.plane.getObjectByName("propeller");

        this.ready = true;
      },
      // called while loading is progressing
      (xhr) => {
        console.log('xhr.total==',xhr.total)
        this.loadingBar.update("plane", xhr.loaded, xhr.total);
      },
      // called when loading has errors
      (err) => {
        console.error(err);
      }
    );
  }

  update(time) {
    if (this.propeller !== undefined) {
      this.propeller.rotateZ(1);
    }

    // 更新位置 更新z 轴
    this.plane.rotation.set(0, 0, Math.sin(time * 3) * 0.2, "XYZ");

    // 更新y 轴
    this.plane.position.y = Math.cos(time) * 1.5;
  }
}

export { Plane };
