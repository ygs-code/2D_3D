attribute vec3 a_Position;
uniform mat4 u_RotationMatrix;
// mat4 rotationMatrix = mat4(
//     1.0, 0.0, 0.0, 0.0,
//     0.0, 1.0, 0.0, 0.0,
//     0.0, 0.0, 1.0, 0.0,
//     0.0, 0.0, 0.0, 1.0
// );
void main(){
  gl_Position=u_RotationMatrix*vec4(a_Position,1.);
  gl_PointSize=10.;
}