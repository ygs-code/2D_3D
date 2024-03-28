import * as THREE from 'three';

const geometry = new THREE.BoxGeometry(50, 50, 50);
const material = new THREE.MeshLambertMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 0.5,
});
const mesh = new THREE.Mesh(geometry, material);


// 位置属性.position使用threejs三维向量对象Vector3表示的
console.log('模型位置属性.position的值', mesh.position);

//new THREE.Vector3()实例化一个三维向量对象
const v3 = new THREE.Vector3(0,0,0);
console.log('v3', v3);
v3.set(10,0,0);//set方法设置向量的值
v3.x = 100;//访问x、y或z属性改变某个分量的值


// .position的值是Vector3，意味着你想改变.position,可以查询文档Vector3类
// 直接设置网格模型的位置
mesh.position.set(100, 100, 100);
mesh.position.x = 100;//设置模型的x坐标

// 网格模型沿着x轴方向平移100,
mesh.translateX(100);

mesh.scale.y = 3;//y方向放大3倍
// 网格模型xyz方向分别缩放0.5,1.5,2倍
mesh.scale.set(0.5, 1.5, 2);
 
export default mesh;