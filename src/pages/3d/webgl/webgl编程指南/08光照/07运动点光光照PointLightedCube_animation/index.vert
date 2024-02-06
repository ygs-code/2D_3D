attribute vec4 a_Position;  // 物体顶点位置
attribute vec4 a_Color;   // 物体表面基底色
attribute vec4 a_Normal;  // 法向量 
uniform mat4 u_MvpMatrix;   // mvp 矩阵
uniform mat4 u_ModelMatrix;    //模型矩阵 Model matrix  
uniform mat4 u_NormalMatrix;   //法向量矩阵 Coordinate transformation matrix of the normal
uniform vec3 u_LightColor;     //光照颜色 Light color
uniform vec3 u_LightPosition;  //光照位置 Position of the light source
uniform vec3 u_AmbientLight;   //环境光颜色 Ambient light color
varying vec4 v_Color;
void main() {
   // 物体定位位置
   gl_Position = u_MvpMatrix * a_Position;
     // Recalculate the normal based on the model matrix and make its length 1.
     //根据模型矩阵重新计算法线，使其长度为1。
     /*
     u_NormalMatrix 法向量矩阵
     a_Normal 法向量
     */
   vec3 normal = normalize(vec3(u_NormalMatrix * a_Normal));
     // Calculate world coordinate of vertex
     //计算顶点的世界坐标
     /*
       模型矩阵 * 顶点位置
     */
   vec4 vertexPosition = u_ModelMatrix * a_Position;
     // Calculate the light direction and make it 1.0 in length
     //计算光线方向，使其长度为1.0
     /*
         光照的位置 - 物体顶点位置
     */
   vec3 lightDirection = normalize(u_LightPosition - vec3(vertexPosition));

     // Calculate the dot product of the normal and light direction
     //计算法线方向和光方向的点积
   float nDotL = max(dot(normal, lightDirection), 0.0);
     // Calculate the color due to diffuse reflection
     //计算漫反射的颜色
   vec3 diffuse = u_LightColor * a_Color.rgb * nDotL;
     // Calculate the color due to ambient reflection
     //根据环境反射计算颜色
   vec3 ambient = u_AmbientLight * a_Color.rgb;
     // Add the surface colors due to diffuse reflection and ambient reflection
     //根据漫反射和环境反射添加表面颜色
   v_Color = vec4(diffuse + ambient, a_Color.a);
}