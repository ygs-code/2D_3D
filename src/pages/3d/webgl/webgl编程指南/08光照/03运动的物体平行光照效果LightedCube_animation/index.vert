attribute vec4 a_Position;// 顶点位置
attribute vec4 a_Color;// 物体表面基底色
attribute vec4 a_Normal;// 法向量
uniform mat4 u_MvpMatrix;// mvp 矩阵
uniform mat4 u_NormalMatrix;//  法向量矩阵
uniform vec3 u_LightDirection;
varying vec4 v_Color;
void main(){
  gl_Position=u_MvpMatrix*a_Position;
  // 法向量矩阵 * 法向量
  vec4 normal=u_NormalMatrix*a_Normal;
  // 光线的夹角
  /*
  
  入射反方向和法线夹角 = nDotL = max(dot(u_LightDirection, normal), 0.0)  =  (光线方向 * 法线方向)
  

  
  */
  
  //光照颜色
  vec3 lightColor=vec3(1,0.1,1.0);
  float nDotL=max(dot(u_LightDirection,normalize(normal.xyz)),0.);
  
  v_Color=vec4(lightColor*a_Color.xyz*nDotL,a_Color.a);
}