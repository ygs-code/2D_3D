attribute vec4 a_Position;
// 列主序列
uniform mat4 u_Matrix;
void main(){
    gl_Position=a_Position*u_Matrix;
    gl_PointSize=10.;
}