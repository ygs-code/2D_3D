attribute vec4 a_Position;
attribute vec4 a_Normal;
uniform mat4 u_MvpMatrix;
uniform mat4 u_NormalMatrix;
varying vec4 v_Color;
void main(){
  vec3 lightDirection=vec3(0.,0.,1.);// Light direction(World coordinate)
  vec4 color=vec4(0.,1.,1.,1.);// Face color
  // mvp 矩阵
  gl_Position=u_MvpMatrix*a_Position;
  // normalize 归一化
  vec3 normal=normalize(vec3(u_NormalMatrix*a_Normal));
  // dot 表示两个向量的"点"积
  float nDotL=max(dot(normal,lightDirection),0.);
  // 颜色
  v_Color=vec4(color.rgb*nDotL,color.a);
}