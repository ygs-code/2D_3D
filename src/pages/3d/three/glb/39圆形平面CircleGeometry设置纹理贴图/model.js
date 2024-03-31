import * as THREE from 'three';
//模型对象
import  $texture  from './texture.jpg';

//CircleGeometry的顶点UV坐标是按照圆形采样纹理贴图
const geometry = new THREE.CircleGeometry(60, 100);
//纹理贴图加载器TextureLoader
const texLoader = new THREE.TextureLoader();
const texture = texLoader.load($texture);
const material = new THREE.MeshBasicMaterial({
    map: texture,//map表示材质的颜色贴图属性
    side:THREE.DoubleSide,
});
const mesh = new THREE.Mesh(geometry, material);

export default mesh;