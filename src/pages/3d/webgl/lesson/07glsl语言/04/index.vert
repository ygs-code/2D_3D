attribute vec3 a_Position;

void main(){
  // 角度
  float deg=30.;
  // 转弧度
  float rad=radians(deg);
  
  mat4 roteteMatrix=mat4(
    cos(rad),sin(rad),0.,0.,
    -sin(rad),cos(rad),0.,0.,
    0.,0.,1.,0.,
    0.,0.,0.,1.
  );
  
  gl_Position=roteteMatrix * vec4(a_Position,1.);
  gl_PointSize=10.;
}