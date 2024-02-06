attribute vec4 a_Position;  // 物体顶点位置
attribute vec4 a_Color;  // 物体表面基底颜色 
attribute vec4 a_Normal;   // 法向量
uniform mat4 u_MvpMatrix;  // mvp  矩阵
uniform mat4 u_ModelMatrix;   // Model matrix  模型矩阵
uniform mat4 u_NormalMatrix;  // Transformation matrix of the normal  法向量矩阵
uniform vec3 u_LightColor;    // Light color  // 光照颜色
uniform vec3 u_LightPosition; // 光照方向 光源位置(在世界坐标系中)  Position of the light source (in the world coordinate system) 
uniform vec3 u_AmbientLight;  // 环境光色 Ambient light color
varying vec4 v_Color; // 合并的颜色
void main() {
  // 顶点位置 mvp
  gl_Position = u_MvpMatrix * a_Position;
     // Recalculate the normal based on the model matrix and make its length 1.
     //根据模型矩阵重新计算法线，使其长度为1。
  vec3 normal = normalize(vec3(u_NormalMatrix * a_Normal));

     // Calculate world coordinate of vertex
     //计算顶点的世界坐标 模型矩阵
  vec4 vertexPosition = u_ModelMatrix * a_Position;

     // Calculate the light direction and make it 1.0 in length
    //  计算光的方向，长度设为1.0
  vec3 lightDirection = normalize(u_LightPosition - vec3(vertexPosition));

     // The dot product of the light direction and the normal
     //光方向与法线的点积
  float nDotL = max(dot(lightDirection, normal), 0.0);

     // Calculate the color due to diffuse reflection
     //计算漫反射的颜色
  vec3 diffuse = u_LightColor * a_Color.rgb * nDotL;
     // Calculate the color due to ambient reflection
     //根据环境反射计算颜色
  vec3 ambient = u_AmbientLight * a_Color.rgb;
     //  Add the surface colors due to diffuse reflection and ambient reflection
     //根据漫反射和环境反射添加表面颜色
  v_Color = vec4(diffuse + ambient, a_Color.a);
}