# 在Three.js中动画 简单案例

动画文档 ：http://cw.hubwiz.com/card/c/three.js-api/1/1/1/

在Three.js中，动画是指在场景中创建和控制对象的运动和变化。模型是指通过Three.js加载的3D对象，可以是几何体、网格或复杂的模型文件（如.obj或.gltf）。动画可以存在于模型中，也可以单独定义。

编辑关键帧：
关键帧动画是通过关键帧KeyframeTrack和剪辑AnimationClip两个API来完成，实际开发中如果需要制作一个复杂三维模型的帧动画，比如一个人走路、跑步等动作，一般情况是美术通过3dmax、blender等软件编辑好，不需要程序员用代码实现。

播放关键帧
通过操作AnimationAction和混合器AnimationMixer两个API播放已有的帧动画数据。

混合器THREE.AnimationMixer()的参数是案例代码中编写的两个网格模型的父对象group，实际开发中参数Group也可以是你加载外部模型返回的模型对象。

播放关键帧动画的时候，注意在渲染函数render()中执行mixer.update(渲染间隔时间)告诉帧动画系统Threejs两次渲染的时间间隔，获得时间间隔可以通过Threejs提供的一个时钟类Clock实现。

总结
1.需要一个父级的组，在其中加入网格对象，命名网格对象
2.编辑关键帧
(1) 运用KeyframeTrack和剪辑AnimationClip两个API
(2) new THREE.KeyframeTrack可以在关键帧中设置位置，颜色，缩放等属性，用时间点和变化的数值
(3) 设置播放时间duration
(4)创建剪辑clip对象，命名，持续时间，关键帧。
3.播放关键帧
操作AnimationAction和混合器AnimationMixer两个API播放
(1) new THREE.AnimationMixer(group);播放组中所有子对象的帧动画
(2)clip作为参数，通过混合器clipAction方法返回一个操作对象AnimationAction
(3)通过操作Action设置播放方式，调节播放速度，是否循环
(4)开始播放
4.渲染
(1)创建时钟对象
(2)执行渲染操作，请求再次渲染，渲染下一帧，更新混合器相关时间。
