import THREE from "./Three";

import KeyboardState from "@/pages/3d/utils/KeyboardState.js";
import Detector from "@/pages/3d/utils/Detector.js";
import WindowResize from "@/pages/3d/utils/WindowResize.js";
import FullScreen from "@/pages/3d/utils/FullScreen.js";
//引入性能监视器stats.js,显示帧率
import Stats from "three/addons/libs/stats.module.js";

import xpos from "static/image/xpos.png";
import xneg from "static/image/xneg.png";
import ypos from "static/image/ypos.png";
import yneg from "static/image/yneg.png";
import zpos from "static/image/zpos.png";
import zneg from "static/image/zneg.png";

import dawnmountainXpos from "static/image/dawnmountain-xpos.png";
import dawnmountainXneg from "static/image/dawnmountain-xneg.png";
import dawnmountainYpos from "static/image/dawnmountain-ypos.png";
import dawnmountainYneg from "static/image/dawnmountain-yneg.png";
import dawnmountainZpos from "static/image/dawnmountain-zpos.png";
import dawnmountainZneg from "static/image/dawnmountain-zneg.png";

import checkerboard from "static/image/checkerboard.jpg";
import uvgrid01 from "static/image/uvgrid01.jpg";

window.onload = () => {
  /*
	Three.js "tutorials by example"
	Author: Lee Stemkoski
	Date: October 2013 (three.js v62)
*/

  // MAIN

  // standard global variables
  var container, scene, renderer, controls, stats;
  var keyboard = new KeyboardState();
  var clock = new THREE.Clock();

  // custom global variables
  var MovingCube;
  var perspectiveCamera;

  var mapCamera,
    mapWidth = 240,
    mapHeight = 160; // w/h should match div dimensions

  init();
  animate();

  // FUNCTIONS
  function init() {
    // SCENE
    scene = new THREE.Scene();
    // CAMERA
    var SCREEN_WIDTH = window.innerWidth,
      SCREEN_HEIGHT = window.innerHeight;
    var VIEW_ANGLE = 45,
      ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT,
      NEAR = 0.1,
      FAR = 20000;

    // perspective cameras
    perspectiveCamera = new THREE.PerspectiveCamera(
      VIEW_ANGLE,
      ASPECT,
      NEAR,
      FAR
    );
    perspectiveCamera.position.set(0, 200, 550);
    perspectiveCamera.lookAt(scene.position);
    scene.add(perspectiveCamera);

    // orthographic cameras
    // 
    mapCamera = new THREE.OrthographicCamera(
      window.innerWidth / -1, // Left
      window.innerWidth / 1, // Right

      window.innerHeight / 1, // Top
      window.innerHeight / -1, // Bottom

      -5000, // Near
      10000
    ); // Far
    mapCamera.up = new THREE.Vector3(0, 0, -1);
    mapCamera.lookAt(new THREE.Vector3(0, -1, 0));
    scene.add(mapCamera);

    // RENDERER
    if (Detector.webgl) renderer = new THREE.WebGLRenderer({ antialias: true });
    else renderer = new THREE.CanvasRenderer();
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    container = document.body;
    container.appendChild(renderer.domElement);

    // EVENTS
    WindowResize(renderer, mapCamera);
    FullScreen.bindKey({ charCode: "m".charCodeAt(0) });

    // STATS
    stats = new Stats();
    stats.domElement.style.position = "absolute";
    stats.domElement.style.bottom = "0px";
    stats.domElement.style.zIndex = 100;
    container.appendChild(stats.domElement);
    // LIGHT
    var light = new THREE.PointLight(0xffffff);
    light.position.set(0, 250, 0);
    scene.add(light);
    // FLOOR
    var floorTexture = new THREE.ImageUtils.loadTexture(uvgrid01);
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(10, 10);
    var floorMaterial = new THREE.MeshBasicMaterial({
      map: floorTexture,
      side: THREE.DoubleSide
    });
    var floorGeometry = new THREE.PlaneGeometry(2000, 2000, 10, 10);
    var floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.y = -0.5;
    floor.rotation.x = Math.PI / 2;
    scene.add(floor);

    ////////////
    // CUSTOM //
    ////////////

    // create an array with six textures for cube
    var materialArray = [];
    materialArray.push(
      new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture(xpos)
      })
    );
    materialArray.push(
      new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture(xneg)
      })
    );
    materialArray.push(
      new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture(ypos)
      })
    );
    materialArray.push(
      new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture(yneg)
      })
    );
    materialArray.push(
      new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture(zpos)
      })
    );
    materialArray.push(
      new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture(zneg)
      })
    );
    var MovingCubeMat = new THREE.MeshFaceMaterial(materialArray);
    var MovingCubeGeom = new THREE.CubeGeometry(
      50,
      50,
      50,
      1,
      1,
      1,
      materialArray
    );
    MovingCube = new THREE.Mesh(MovingCubeGeom, MovingCubeMat);
    MovingCube.position.set(0, 25.1, 0);
    scene.add(MovingCube);

    // a little bit of scenery...

    var ambientlight = new THREE.AmbientLight(0x111111);
    scene.add(ambientlight);

    // torus knot
    var colorMaterial = new THREE.MeshLambertMaterial({ color: 0xff3333 });
    var shape = new THREE.Mesh(
      new THREE.TorusKnotGeometry(30, 6, 160, 10, 2, 5),
      colorMaterial
    );
    shape.position.set(-200, 50, -200);
    scene.add(shape);
    // torus knot
    var colorMaterial = new THREE.MeshLambertMaterial({ color: 0x33ff33 });
    var shape = new THREE.Mesh(
      new THREE.TorusKnotGeometry(30, 6, 160, 10, 3, 2),
      colorMaterial
    );
    shape.position.set(200, 50, -200);
    scene.add(shape);
    // torus knot
    var colorMaterial = new THREE.MeshLambertMaterial({ color: 0xffff33 });
    var shape = new THREE.Mesh(
      new THREE.TorusKnotGeometry(30, 6, 160, 10, 4, 3),
      colorMaterial
    );
    shape.position.set(200, 50, 200);
    scene.add(shape);
    // torus knot
    var colorMaterial = new THREE.MeshLambertMaterial({ color: 0x3333ff });
    var shape = new THREE.Mesh(
      new THREE.TorusKnotGeometry(30, 6, 160, 10, 3, 4),
      colorMaterial
    );
    shape.position.set(-200, 50, 200);
    scene.add(shape);

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1);
    renderer.autoClear = false;
  }

  function animate() {
    requestAnimationFrame(animate);
    render();
    update();
  }

  function update() {
    var delta = clock.getDelta(); // seconds.
    var moveDistance = 200 * delta; // 200 pixels per second
    var rotateAngle = (Math.PI / 2) * delta; // pi/2 radians (90 degrees) per second

    // local transformations

    // move forwards/backwards/left/right
    if (keyboard.pressed("W")) MovingCube.translateZ(-moveDistance);
    if (keyboard.pressed("S")) MovingCube.translateZ(moveDistance);
    if (keyboard.pressed("Q")) MovingCube.translateX(-moveDistance);
    if (keyboard.pressed("E")) MovingCube.translateX(moveDistance);

    // rotate left/right/up/down
    var rotation_matrix = new THREE.Matrix4().identity();
    if (keyboard.pressed("A"))
      MovingCube.rotateOnAxis(new THREE.Vector3(0, 1, 0), rotateAngle);
    if (keyboard.pressed("D"))
      MovingCube.rotateOnAxis(new THREE.Vector3(0, 1, 0), -rotateAngle);

    if (keyboard.pressed("Z")) {
      MovingCube.position.set(0, 25.1, 0);
      MovingCube.rotation.set(0, 0, 0);
    }

    stats.update();
  }

  function render() {
    var w = window.innerWidth,
      h = window.innerHeight;

    // setViewport parameters:
    //  lower_left_x, lower_left_y, viewport_width, viewport_height
    renderer.setViewport(0, 0, w, h);
    renderer.clear();

    // full display
    // renderer.setViewport( 0, 0, SCREEN_WIDTH - 2, 0.5 * SCREEN_HEIGHT - 2 );
    renderer.render(scene, perspectiveCamera);

    // minimap (overhead orthogonal camera)
    //  lower_left_x, lower_left_y, viewport_width, viewport_height
    renderer.setViewport(10, h - mapHeight - 10, mapWidth, mapHeight);
    renderer.render(scene, mapCamera);
  }
};
