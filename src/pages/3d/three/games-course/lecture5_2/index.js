// import * as THREE from '../../libs/three137/three.module.js';
// import { RGBELoader } from '../../libs/three137/RGBELoader.js';
// import { LoadingBar } from '../../libs/LoadingBar.js';
import { Plane } from "./Plane.js";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";
import venice_sunset_1k from "static/file/hdr/venice_sunset_1k.hdr";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { LoadingBar } from "@/pages/3d/utils/LoadingBar.js";

import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";

class Game {
  constructor() {
    const container = document.createElement("div");
    document.body.appendChild(container);

    this.loadingBar = new LoadingBar();
    this.loadingBar.visible = false;

    this.clock = new THREE.Clock();

    // this.assetsPath = '../../assets/';

    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.01,
      100
    );
    this.camera.position.set(-4.37, 0, -4.75);
    this.camera.lookAt(0, 0, 6);

    this.cameraController = new THREE.Object3D();
    this.cameraController.add(this.camera);
    this.cameraTarget = new THREE.Vector3(0, 0, 6);

    this.scene = new THREE.Scene();
    this.scene.add(this.cameraController);

    const ambient = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    ambient.position.set(0.5, 1, 0.25);
    this.scene.add(ambient);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(this.renderer.domElement);
    this.setEnvironment();

    this.load();

    window.addEventListener("resize", this.resize.bind(this));

    document.addEventListener("keydown", this.keyDown.bind(this));
    document.addEventListener("keyup", this.keyUp.bind(this));

    document.addEventListener("touchstart", this.mouseDown.bind(this));
    document.addEventListener("touchend", this.mouseUp.bind(this));
    document.addEventListener("mousedown", this.mouseDown.bind(this));
    document.addEventListener("mouseup", this.mouseUp.bind(this));

    this.spaceKey = false;
    this.active = false;

    const btn = document.getElementById("playBtn");
    btn.addEventListener("click", this.startGame.bind(this));
  }

  startGame() {
    const instructions = document.getElementById("instructions");
    const btn = document.getElementById("playBtn");

    instructions.style.display = "none";
    btn.style.display = "none";

    this.active = true;
  }

  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  mouseDown(evt) {
    this.spaceKey = true;
  }

  mouseUp(evt) {
    this.spaceKey = false;
  }

  keyDown(evt) {
    switch (evt.keyCode) {
      case 32:
        this.spaceKey = true;
        break;
    }
  }

  keyUp(evt) {
    switch (evt.keyCode) {
      case 32:
        this.spaceKey = false;
        break;
    }
  }

  setEnvironment() {
    const loader = new RGBELoader().setPath(this.assetsPath);
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
        console.error(err.message);
      }
    );
  }

  load() {
    this.loadSkybox();
    this.loading = true;
    this.loadingBar.visible = true;

    this.plane = new Plane(this);
  }

  loadSkybox() {
    this.scene.background = new THREE.CubeTextureLoader()
      .setPath("/static/file/plane/paintedsky/")
      .load(
        ["px.jpg", "nx.jpg", "py.jpg", "ny.jpg", "pz.jpg", "nz.jpg"],
        () => {
          this.renderer.setAnimationLoop(this.render.bind(this));
        }
      );
  }

  updateCamera() {
    this.cameraController.position.copy(this.plane.position);
    this.cameraController.position.y = 0;
    this.cameraTarget.copy(this.plane.position);
    this.cameraTarget.z += 6;
    this.camera.lookAt(this.cameraTarget);
  }

  render() {
    if (this.loading) {
      if (this.plane.ready) {
        this.loading = false;
        this.loadingBar.visible = false;
      } else {
        return;
      }
    }

    const time = this.clock.getElapsedTime();

    this.plane.update(time);

    this.updateCamera();

    this.renderer.render(this.scene, this.camera);
  }
}

// export { Game };

document.addEventListener("DOMContentLoaded", () => {
  const game = new Game();
  window.game = game;
});
