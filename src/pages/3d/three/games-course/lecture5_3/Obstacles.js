// import { Group, Vector3 } from '../../libs/three137/three.module.js';
// import { GLTFLoader } from '../../libs/three137/GLTFLoader.js';

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";
import venice_sunset_1k from "static/file/hdr/venice_sunset_1k.hdr";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { LoadingBar } from "@/pages/3d/utils/LoadingBar.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";

class Obstacles {
  constructor(game) {
    this.assetsPath = game.assetsPath;
    this.loadingBar = game.loadingBar;
    this.game = game;
    this.scene = game.scene;
    this.loadStar();
    this.loadBomb();
    this.tmpPos = new THREE.Vector3();
  }

  loadStar() {
    const loader = new GLTFLoader(); // .setPath(`${this.assetsPath}plane/`);
    this.ready = false;

    // Load a glTF resource
    loader.load(
      // resource URL
      "/static/file/plane/star.glb",
      // called when the resource is loaded
      (gltf) => {
        this.star = gltf.scene.children[0];

        this.star.name = "star";

        if (this.bomb !== undefined) this.initialize();
      },
      // called while loading is progressing
      (xhr) => {
        this.loadingBar.update("star", xhr.loaded, xhr.total);
      },
      // called when loading has errors
      (err) => {
        console.error(err);
      }
    );
  }

  loadBomb() {
    const loader = new GLTFLoader(); //.setPath(`${this.assetsPath}plane/`);

    // Load a glTF resource
    // 加载炸弹模型
    loader.load(
      // resource URL
      "/static/file/plane/bomb.glb",
      // called when the resource is loaded
      (gltf) => {
        this.bomb = gltf.scene.children[0];

        if (this.star !== undefined) {
          this.initialize();
        }
      },
      // called while loading is progressing
      (xhr) => {
        this.loadingBar.update("bomb", xhr.loaded, xhr.total);
      },
      // called when loading has errors
      (err) => {
        console.error(err);
      }
    );
  }

  initialize() {
    this.obstacles = [];

    // 创建模型组
    const obstacle = new THREE.Group();

    obstacle.add(this.star);

    this.bomb.rotation.x = -Math.PI * 0.5;
    this.bomb.position.y = 7.5;
    obstacle.add(this.bomb);

    let rotate = true;

    /*
       开始 y=7.5 
       条件式y小于-8则停止，
       然后每次都会减去 2.5
    */
   // 增加模型
    for (let y = 7.5; y > -8; y -= 2.5) {
      rotate = !rotate;
      if (y == 0) {
        continue;
      }
      const bomb = this.bomb.clone();
      bomb.rotation.x = rotate ? -Math.PI * 0.5 : 0;
      bomb.position.y = y;
      obstacle.add(bomb);
    }

    this.obstacles.push(obstacle);

    // 模型组增加到场景
    this.scene.add(obstacle);


    // 添加模型组
    for (let i = 0; i < 3; i++) {
      const obstacle1 = obstacle.clone();

      this.scene.add(obstacle1);
      this.obstacles.push(obstacle1);
    }

    this.reset();

    this.ready = true;
  }

  reset() {
    this.obstacleSpawn = { pos: 20, offset: 5 };
    this.obstacles.forEach((obstacle) => this.respawnObstacle(obstacle));
  }

  respawnObstacle(obstacle) {
    this.obstacleSpawn.pos += 30;
    const offset = (Math.random() * 2 - 1) * this.obstacleSpawn.offset;
    this.obstacleSpawn.offset += 0.2;
    obstacle.position.set(0, offset, this.obstacleSpawn.pos);
    obstacle.children[0].rotation.y = Math.random() * Math.PI * 2;
    obstacle.userData.hit = false;
    obstacle.children.forEach((child) => {
      child.visible = true;
    });
  }

  update(pos) {}

  hit(obj) {}
}

export { Obstacles };
