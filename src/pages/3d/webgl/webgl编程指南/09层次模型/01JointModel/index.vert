// JointModel.js (c) 2012 matsuda
// Vertex shader program

attribute vec4 a_Position;   // 物体顶点位置
attribute vec4 a_Normal;  // 法向量
uniform mat4 u_MvpMatrix;   // mvp矩阵
uniform mat4 u_NormalMatrix;  // 法向量矩阵
varying vec4 v_Color;  // 颜色
void main(){ 
  gl_Position=u_MvpMatrix*a_Position;  // mvp矩阵
  // Shading calculation to make the arm look three-dimensional
  //阴影计算，使手臂看起来三维  光的方向
  vec3 lightDirection=normalize(vec3(0.,.5,.7));// Light direction
  //
  vec4 color=vec4(1.,.4,0.,1.);
  // 法向量
  vec3 normal=normalize((u_NormalMatrix*a_Normal).xyz);
  // 夹角  入射反方向和法线夹角  θ = max(dot(u_LightDirection, normal), 0.0)  =  (光线方向 * 法线方向)
  float nDotL=max(dot(normal,lightDirection),0.);
  
  v_Color=vec4(color.rgb*nDotL+vec3(.1),color.a);
}
