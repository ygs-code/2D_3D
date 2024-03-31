import * as THREE from 'three';
import texture3 from './纹理3.jpg'


// 一个矩形平面几何体用来表示传送带
const geometry = new THREE.PlaneGeometry(200, 20);
//纹理贴图加载器TextureLoader
const texLoader = new THREE.TextureLoader();
// .load()方法加载图像，返回一个纹理对象Texture
const texture = texLoader.load(texture3);

const material = new THREE.MeshLambertMaterial({
    map: texture,//map表示材质的颜色贴图属性
});
const mesh = new THREE.Mesh(geometry, material);
mesh.rotateX(-Math.PI/2);

// 设置阵列
texture.wrapS = THREE.RepeatWrapping;
// uv两个方向纹理重复数量
texture.repeat.x=50;//注意选择合适的阵列数量

export  {mesh,texture};