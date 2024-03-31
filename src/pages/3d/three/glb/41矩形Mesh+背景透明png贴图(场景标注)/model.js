import * as THREE from 'three';
import wheel  from  './转弯.png'



const geometry = new THREE.PlaneGeometry(50, 50);
//纹理贴图加载器TextureLoader
const texLoader = new THREE.TextureLoader();
// .load()方法加载图像，返回一个纹理对象Texture
// const texture = texLoader.load('./指南针.png');
const texture = texLoader.load(wheel);

const material = new THREE.MeshLambertMaterial({
    map: texture,//map表示材质的颜色贴图属性
    transparent:true,//开启透明，这样png贴图的透明部分不显示
});



const mesh = new THREE.Mesh(geometry, material);

mesh.rotateX(-Math.PI/2);
mesh.position.y = 1;

export default mesh;