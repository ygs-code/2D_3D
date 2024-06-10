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
import "./index.less";

class Plane {
  constructor(game) {
    this.assetsPath = game.assetsPath;
    this.loadingBar = game.loadingBar;
    this.game = game;
    this.scene = game.scene;
    this.load();
    this.tmpPos = new THREE.Vector3();
  }

  get position() {
    if (this.plane !== undefined) this.plane.getWorldPosition(this.tmpPos);
    return this.tmpPos;
  }

  load() {
    const loader = new GLTFLoader()  // .setPath(`${this.assetsPath}plane/`);
    this.ready = false;

    // Load a glTF resource
    // 飞机模型
    loader.load(
      // resource URL
      "/static/file/plane/microplane.glb",
      // called when the resource is loaded
      (gltf) => {
        this.scene.add(gltf.scene);
        this.plane = gltf.scene;
        this.velocity = new THREE.Vector3(0, 0, 0.1);

        // 获取到飞机叶片
        this.propeller = this.plane.getObjectByName("propeller");

        this.ready = true;
      },
      // called while loading is progressing
      (xhr) => {
        // 进度条
        this.loadingBar.update("plane", xhr.loaded, xhr.total);
      },
      // called when loading has errors
      (err) => {
        console.error(err);
      }
    );
  }

  reset() {
    // 设置模型到中心点
    this.plane.position.set(0, 0, 0);
    this.velocity.set(0, 0, 0.1);
  }

  update(time) {
    if (this.propeller !== undefined) {
      /*
       orbit2.rotateZ(1) 等同于 orbit2.rotation.z += 1
       rotation和rotateX(rotateY/rotateZ)的区别
       orbit2.rotateY(0.01); orbit2.rotation.y += 0.01;
      */
      // 控制飞机叶片旋转
      this.propeller.rotateZ(1);
    }

    // 如果被激活啦
    if (this.game.active) {
      if (!this.game.spaceKey) {
        this.velocity.y -= 0.001;
      } else {
        this.velocity.y += 0.001;
      }
      this.plane.rotation.set(0, 0, Math.sin(time * 3) * 0.2, "XYZ");
      this.plane.translateZ(this.velocity.z);
      this.plane.translateY(this.velocity.y);
    } else {
      this.plane.rotation.set(0, 0, Math.sin(time * 3) * 0.2, "XYZ");
      this.plane.position.y = Math.cos(time) * 1.5;
    }
  }
}

export { Plane };
