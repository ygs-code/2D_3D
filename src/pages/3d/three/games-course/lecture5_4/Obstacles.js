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

// 炮弹类
class Obstacles {
  constructor(game) {
    this.assetsPath = game.assetsPath;
    this.loadingBar = game.loadingBar;
    this.game = game;
    this.scene = game.scene;
    // 星星模型
    this.loadStar();
    // 炮弹模型
    this.loadBomb();
    this.tmpPos = new THREE.Vector3();
  }

  // 星星模型
  loadStar() {
    // 加载模型
    const loader = new GLTFLoader()  //.setPath(`${this.assetsPath}plane/`);
    this.ready = false;

    // Load a glTF resource
    loader.load(
      // resource URL
      // 星星模型
      "/static/file/plane/star.glb",
      // called when the resource is loaded
      (gltf) => {
        this.star = gltf.scene.children[0];

        this.star.name = "star";

        if (this.bomb !== undefined) {
          this.initialize();
        }
      },
      // called while loading is progressing
      (xhr) => {
        // 加载进度条
        this.loadingBar.update("star", xhr.loaded, xhr.total);
      },
      // called when loading has errors
      (err) => {
        console.error(err);
      }
    );
  }

  // 炮弹模型
  loadBomb() {
    const loader = new GLTFLoader(); //.setPath(`${this.assetsPath}plane/`);

    // Load a glTF resource
    loader.load(
      // resource URL
      // 炮弹模型
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

  /*
  模型组加载,
  这里意思是把炮弹和星星 弄成一个模型组，到时候改变模型组的y轴，这里所有的 模型组的子模型就会跟着变动
  */
  initialize() {
    this.obstacles = [];

    const obstacle = new THREE.Group();



    obstacle.add(this.star);

    // 设置 炮弹 x 轴
    this.bomb.rotation.x = -Math.PI * 0.5;
    // 设置 炮弹 y轴
    this.bomb.position.y = 7.5;

    // 将炮弹 放进 里面
    obstacle.add(this.bomb);

    let rotate = true;
    /*
        开始 y=7.5 
        条件式y小于-8则停止，
        然后每次都会减去 2.5
 
        执行6次
     */
    // 增加模型
    for (let y = 7.5; y > -8; y -= 2.5) {
      rotate = !rotate;
      if (y == 0) {
        continue;
      }
      // 克隆炮弹
      const bomb = this.bomb.clone();
      // 设置炮弹 x 轴
      bomb.rotation.x = rotate ? -Math.PI * 0.5 : 0;
      // 设置炮弹y轴
      bomb.position.y = y;
      // 把炮弹放进分组里面
      obstacle.add(bomb);
    }

    // 把分组的模型放到一个数组中
    this.obstacles.push(obstacle);

    // 把分组模型添加到场景中
    this.scene.add(obstacle);

    // 执行3组
    for (let i = 0; i < 3; i++) {
      // 克隆分组
      const obstacle1 = obstacle.clone();

      // 克隆分组
      this.scene.add(obstacle1);
      // 把模型分组添加到数组中
      this.obstacles.push(obstacle1);
    }

    this.reset();

    this.ready = true;
  }

  reset() {
    this.obstacleSpawn = { pos: 20, offset: 5 };
    this.obstacles.forEach((obstacle) => this.respawnObstacle(obstacle));
  }

  // 设置整个模型 y 轴
  respawnObstacle(obstacle) {

    this.obstacleSpawn.pos += 30;


    /*
     大于0， 小于1
     Math.random() 0.0001-0.99 * 2

    */
    // 上一次值 * 1.多 + 0.2
    const offset = (Math.random() * 2 - 1) * this.obstacleSpawn.offset;

    this.obstacleSpawn.offset += 0.2;

    // console.log('this.obstacleSpawn.offset=', this.obstacleSpawn.offset)

    // 设置 y 轴 和  z 轴
    obstacle.position.set(
      0,
      // 更新z轴
      offset,
      // 更新z轴 
      this.obstacleSpawn.pos,
    );

    // console.log('obstacle==', obstacle)
    obstacle.children[0].rotation.y = Math.random() * Math.PI * 2;

    // 重置模型碰撞标志
    obstacle.userData.hit = false;

    obstacle.children.forEach((child) => {
      child.visible = true;
    });

  }

  // 更新模型
  update(
    pos // 飞机模型位置
  ) {
    let collisionObstacle;

    this.obstacles.forEach((obstacle) => {

      obstacle.children[0].rotateY(0.01);

      // 如果炮弹组模型位置 z 轴 相差 小于 2 的时候，就是飞机和模型 在z轴相碰
      const relativePosZ = obstacle.position.z - pos.z;

      if (
        Math.abs(relativePosZ) < 2
        &&
        !obstacle.userData.hit // 标志
      ) {

        collisionObstacle = obstacle;

      }

      if (relativePosZ < -20) {
        this.respawnObstacle(obstacle);
      }
    });

    if (collisionObstacle !== undefined) {

      collisionObstacle.children.some((child) => {
        /*
        // 声明一个三维向量用来保存世界坐标
          var worldPosition = new THREE.Vector3();
          // 执行getWorldPosition方法把模型的世界坐标保存到参数worldPosition中
          mesh.getWorldPosition(worldPosition);
 
        */
        // 模型的.getWorldPosition()方法获得该模型在世界坐标下的三维坐标 把世界坐标存放到this.tmpPos中
        child.getWorldPosition(this.tmpPos);
        console.log('this.tmpPos==', this.tmpPos)


        // 函数distanceToSquared(v)和distanceTo(v)将返回调用者和向量v的距离。
        // 这里的距离其实是两向量起点都在原点时，终点之间的距离，也就是向量this-v的长度。

        // 比较 child 表示炮弹或者星星模型 this.tmpPos 到 飞机模型的 距离
        // 碰撞检测

        /*
        
       最简单的选择是使用Vector3的distanceTo()或distanceToSquared函数来使用两个对象之间的欧氏距离。 例如

        console.log(yourCube.position.distanceToSquared(yourSphere.position));
        如果两个物体之间的距离大于球体半径和立方体侧面之间的距离，那么这将是潜在的碰撞。我也建议使用distanceToSquared，因为它更快(因为它没有调用sqrt)，它仍然可用于检查冲突。 请注意，这种方法并不是非常精确 - 它实际上是检查两个球体之间的碰撞(将立方体估计为半径等于立方体一半的球体)，但我希望它对于您的设置来说非常接近/足够好，因为它是在我看来，最简单，最快速的实施。 您可能会注意到，在一定距离之前，立方体的角将发生碰撞而不会触发碰撞。您可以通过传递不同的立方体比率来调整“阈值”。想象一下你的立方体周围的球体，球体的比例应该多大，以便为你的设置获得一个不错的估计碰撞。 想到的另一种方法是找到最靠近立方体的球体上的点：
        你知道可以通过减去两个位置向量得到从球体中心到立方体中心的点
        您可以通过对上面的差异向量进行归一化并使用球半径缩放它来获得立方体方向上的球体上的点
        然后你可以检查那个点是否在立方体内(通过检查坐标是否在立方体的轴对齐边界框内(AABB)
        例如
        var pointOnSphere = yourSphere.position.clone().sub(yourCube.position).normalize(). multiplyScalar(yourSphereRadius);
        这个如果不在我的头顶，所以我无法保证上面的代码片段能够正常工作，可能值得将一个粒子放在pointOnSphere的坐标上进行检查。 您还可以在this book中查看其他更先进的3D碰撞检测算法，但最好尽量保持简单/快速。
     
      */
        const dist = this.tmpPos.distanceToSquared(pos);

        if (dist < 5) {
          // 标志 已经被碰撞过模型
          collisionObstacle.userData.hit = true;
          // 判断模型 是判断还是星星
          this.hit(child);
          return true;
        }
      });
    }
  }
  // 判断模型 是判断还是星星
  hit(obj) {

    if (obj.name == "star") {
      this.game.incScore();
    } else {
      this.game.decLives();
    }
    obj.visible = false;
  }
}

export { Obstacles };
