attribute vec4 a_Position;
// 矩阵
mat4 m4=mat4(
    1.,0.,0.,0.,
    0.,1.,0.,0.,
    0.,0.,1.,0.,
    0.,0.,0.,1.
);

void main(){
    gl_Position=m4*a_Position;
    gl_PointSize=10.;
}