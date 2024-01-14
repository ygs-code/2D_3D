attribute vec4 a_Position;
attribute vec4 a_Color;
attribute vec4 a_Normal;        // Normal   法向量
uniform mat4 u_MvpMatrix;      // 模型mvp
uniform vec3 u_LightColor;     // Light color  光照颜色
uniform vec3 u_LightDirection; // 归一化世界坐标 Light direction (in the world coordinate, normalized)
varying vec4 v_Color;
void main() {
  // 模型顶点位置
  gl_Position = u_MvpMatrix * a_Position;
  // Make the length of the normal 1.0 
  //设置标准的长度为1.0
  // 法向量
  vec3 normal = normalize(a_Normal.xyz);
  // Dot product of the light direction and the orientation of a surface (the normal)
  //光照方向与曲面方向(法线)的点积
  // max 最大值，如果点积小于0则 用 0 
  /*
  平行光漫反射
     漫反射颜色 = 入射光颜色 * 表面基底色 * (光线方向 * 法线方向)

  入射反方向和法线夹角 = max(dot(u_LightDirection, normal), 0.0)  =  (光线方向 * 法线方向)


  diffuse = u_LightColor * a_Color.rgb * nDotL = 入射光颜色 * 表面基底色 * 入射和法线夹角


  */
  float nDotL = max(dot(u_LightDirection, normal), 0.0);

  // Calculate the color due to diffuse reflection
  // 计算漫反射的颜色 
  vec3 diffuse = u_LightColor * a_Color.rgb * nDotL;
  // 
  v_Color = vec4(diffuse, a_Color.a);
}