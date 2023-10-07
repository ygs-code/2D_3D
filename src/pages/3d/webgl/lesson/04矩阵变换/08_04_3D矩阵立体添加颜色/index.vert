attribute vec3 a_Position;
attribute vec4 a_Colors;
uniform mat4 u_RotationMatrix;
varying vec4 v_Color;
// mat4 rotationMatrix = mat4(
  //     1.0, 0.0, 0.0, 0.0,
  //     0.0, 1.0, 0.0, 0.0,
  //     0.0, 0.0, 1.0, 0.0,
  //     0.0, 0.0, 0.0, 1.0
// );
void main(){
  v_Color=a_Colors;
  gl_Position=u_RotationMatrix*vec4(a_Position,1.);
  gl_PointSize=10.;
}