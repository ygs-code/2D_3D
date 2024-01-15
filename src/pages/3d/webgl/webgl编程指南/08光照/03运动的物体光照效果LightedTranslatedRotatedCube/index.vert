attribute vec4 a_Position;  // 顶点位置
attribute vec4 a_Color;  // 物体表面基底
attribute vec4 a_Normal;  // 法向量
uniform mat4 u_MvpMatrix;  // mvp 模型
uniform mat4 u_NormalMatrix; // Transformation matrix of the normal 法向量的变换矩阵
uniform vec3 u_LightColor;   // Light color  漫反射
uniform vec3 u_LightDirection; // Light direction (in the world coordinate, normalized)  光方向(世界坐标，归一化)
uniform vec3 u_AmbientLight; // 环境光色  Ambient light color
varying vec4 v_Color;
void main() {
   // 物体定点
   gl_Position = u_MvpMatrix * a_Position;
 /* 
                                    法线矩阵 * 法线
      法线 = normal = normalize(vec3(u_NormalMatrix * a_Normal));


      入射反方向和法线夹角 = nDotL = max(dot(u_LightDirection, normal), 0.0)  =  (光线方向 * 法线方向)
   1. 
      环境反射光颜色 =               环境入射光颜色 * 表面基底颜色
      环境反射光颜色 =  ambient = u_AmbientLight * a_Color.rgb

   2. 
      漫反射光颜色 =            漫反射光颜色   *   表面基地色  *  入射反方向和法线夹角    
      漫反射光颜色 =  diffuse = u_LightColor * a_Color.rgb * nDotL;

   3.
   表面的发射光颜色 = 漫反射光颜色 + 环境反射光颜色            a_Color.a 是透明度
   v_Color = vec4(diffuse + ambient, a_Color.a);

*/

     // Recalculate the normal based on the model matrix and make its length 1.
    //根据模型矩阵重新计算法线，使其长度为1。
   vec3 normal = normalize(vec3(u_NormalMatrix * a_Normal));

     // Calculate the dot product of the light direction and the orientation of a surface (the normal)

   //   计算光线方向与表面方向(法线)的点积。
   float nDotL = max(dot(u_LightDirection, normal), 0.0);

     // Calculate the color due to diffuse reflection
   //   计算漫反射的颜色
   vec3 diffuse = u_LightColor * a_Color.rgb * nDotL;

     // Calculate the color due to ambient reflection
     //根据环境反射计算颜色
   vec3 ambient = u_AmbientLight * a_Color.rgb;
     // Add the surface colors due to diffuse reflection and ambient reflection
     //根据漫反射和环境反射添加表面颜色
   v_Color = vec4(diffuse + ambient, a_Color.a);
}