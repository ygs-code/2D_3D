// MultiJointModel.js (c) 2012 matsuda and itami
// Vertex shader program

attribute vec4 a_Position;// 物体顶点位置
attribute vec4 a_Normal;// 法向量
uniform mat4 u_MvpMatrix;// mvp 矩阵
uniform mat4 u_NormalMatrix;// 法向量矩阵
varying vec4 v_Color;//
void main(){
  // 顶点位置
  gl_Position=u_MvpMatrix*a_Position;
  // Shading calculation to make the arm look three-dimensional
  //阴影计算，使手臂看起来三维
  // 光的方向
  vec3 lightDirection=normalize(vec3(0.,.5,.7));// Light direction
  
  // 物体表面基底色
  vec4 color=vec4(1.,.4,0.,1.);// Robot color
  // 法向量
  vec3 normal=normalize((u_NormalMatrix*a_Normal).xyz);

  // 光照 夹角
  float nDotL=max(dot(normal,lightDirection),0.);
  v_Color=vec4(color.rgb*nDotL+vec3(.1),color.a);
}
