 
 attribute vec4 a_Position; // 顶点位置
 attribute vec4 a_Color; // 物体颜色 表面基色
 attribute vec4 a_Normal;       // Normal 表面法向量
 uniform mat4 u_MvpMatrix; // mvp矩阵

 uniform vec3 u_LightColor;    // Light color 浅色：指颜色较浅的色彩 光线颜色

 uniform vec3 u_LightDirection;// 光方向(世界坐标，归一化) Light direction (in the world coordinate, normalized)
 
 varying vec4 v_Color;

 void main() {

   gl_Position = u_MvpMatrix * a_Position ;// 物体
  // Make the length of the normal 1.0
  //设置法向量的长度为1.0 对法向量 归一化
   vec3 normal = normalize(a_Normal.xyz); // 法向量

  // Dot product of the light direction and the orientation of a surface (the normal)
  //光照方向与曲面方向(法线)的点积
 // 计算光线方向和法向量的点积
 // θ = 光方向 * 法向量 
 /*
    dot 是计算两个矢量的点积<光线方向>*<法线向量> 
    该函数接收两个矢量作为参数，返回他们的点积
 */
   float nDotL = max(dot(u_LightDirection, normal), 0.0);

  // Calculate the color due to diffuse reflection
  //计算漫反射的颜色 
   vec3 diffuse = u_LightColor * a_Color.rgb * nDotL;
   v_Color = vec4(diffuse, a_Color.a);
 }