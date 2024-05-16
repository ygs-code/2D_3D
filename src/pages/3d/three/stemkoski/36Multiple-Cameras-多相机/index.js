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

import checkerboard from "static/image/checkerboard.jpg";

window.onload = () => {
  // standard global variables
  var container, scene, renderer, controls, stats;
  var keyboard = new KeyboardState();
  var clock = new THREE.Clock();

  // custom global variables
  var MovingCube;
  var chaseCamera, topCamera;
  var chaseCameraActive = false;

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



    // camera 1 相机1
    topCamera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    scene.add(topCamera);
    topCamera.position.set(0, 200, 550);
    topCamera.lookAt(scene.position);



    // camera 2 相机2
    chaseCamera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    scene.add(chaseCamera);


    // RENDERER
    if (Detector.webgl) {
      renderer = new THREE.WebGLRenderer({ antialias: true });
    } else {
      renderer = new THREE.CanvasRenderer();
    }

    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    container = document.createElement("div");
    // container = document.getElementById( 'ThreeJS' );
    container.appendChild(renderer.domElement);
    document.body.appendChild(container);
    // EVENTS
    WindowResize(renderer, topCamera);
    FullScreen.bindKey({ charCode: "m".charCodeAt(0) });

    // CONTROLS
    // MUST REMOVE THIS LINE FOR THIS DEMO.
    // controls = ...

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
    var floorTexture = new THREE.ImageUtils.loadTexture(checkerboard);
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(10, 10);
    var floorMaterial = new THREE.MeshBasicMaterial({
      map: floorTexture,
      side: THREE.DoubleSide
    });
    var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
    var floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.y = -0.5;
    floor.rotation.x = Math.PI / 2;
    scene.add(floor);
    // SKYBOX/FOG
    var skyBoxGeometry = new THREE.CubeGeometry(10000, 10000, 10000);
    var skyBoxMaterial = new THREE.MeshBasicMaterial({
      color: 0x9999ff,
      side: THREE.BackSide
    });
    var skyBox = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial);
    // scene.add(skyBox);
    scene.fog = new THREE.FogExp2(0x9999ff, 0.00025);

    ////////////
    // CUSTOM //
    ////////////

    // create an array with six textures for a cool cube
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

    var wireMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      wireframe: true,
      transparent: true
    });

    // torus knot
    var colorMaterial = new THREE.MeshPhongMaterial({ color: 0xff3333 });
    var shape = THREE.SceneUtils.createMultiMaterialObject(
      new THREE.TorusKnotGeometry(30, 6, 160, 10, 2, 5),
      [colorMaterial, wireMaterial]
    );
    shape.position.set(-200, 50, -200);
    scene.add(shape);

    // torus knot
    var colorMaterial1 = new THREE.MeshPhongMaterial({ color: 0x33ff33 });
    var shape1 = THREE.SceneUtils.createMultiMaterialObject(
      new THREE.TorusKnotGeometry(30, 6, 160, 10, 3, 2),
      [colorMaterial1, wireMaterial]
    );
    shape1.position.set(200, 50, -200);
    scene.add(shape1);

    // torus knot
    var colorMaterial2 = new THREE.MeshPhongMaterial({ color: 0xffff33 });
    var shape2 = THREE.SceneUtils.createMultiMaterialObject(
      new THREE.TorusKnotGeometry(30, 6, 160, 10, 4, 3),
      [colorMaterial2, wireMaterial]
    );
    shape2.position.set(200, 50, 200);
    scene.add(shape2);

    // torus knot
    var colorMaterial3 = new THREE.MeshPhongMaterial({ color: 0x3333ff });
    var shape3 = THREE.SceneUtils.createMultiMaterialObject(
      new THREE.TorusKnotGeometry(30, 6, 160, 10, 3, 4),
      [colorMaterial3, wireMaterial]
    );
    shape3.position.set(-200, 50, 200);
    scene.add(shape3);
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
    if (keyboard.pressed("R"))
      MovingCube.rotateOnAxis(new THREE.Vector3(1, 0, 0), rotateAngle);
    if (keyboard.pressed("F"))
      MovingCube.rotateOnAxis(new THREE.Vector3(1, 0, 0), -rotateAngle);

    if (keyboard.pressed("Z")) {
      MovingCube.position.set(0, 25.1, 0);
      MovingCube.rotation.set(0, 0, 0);
    }

    var relativeCameraOffset = new THREE.Vector3(0, 50, 200);

    var cameraOffset = relativeCameraOffset.applyMatrix4(
      MovingCube.matrixWorld
    );

    chaseCamera.position.x = cameraOffset.x;
    chaseCamera.position.y = cameraOffset.y;
    chaseCamera.position.z = cameraOffset.z;
    // 相机
    chaseCamera.lookAt(MovingCube.position);

    //camera.updateMatrix();
    //camera.updateProjectionMatrix();

    if (keyboard.pressed("1")) {
      chaseCameraActive = true;
    }
    if (keyboard.pressed("2")) {
      chaseCameraActive = false;
    }

    stats.update();
  }

  function render() {
    if (chaseCameraActive) {
      renderer.render(scene, chaseCamera);
    } else {
      renderer.render(scene, topCamera);
    }
  }
};
