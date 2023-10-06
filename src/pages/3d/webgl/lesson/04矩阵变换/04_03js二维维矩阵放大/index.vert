attribute vec4 a_Position;
// 列主序列
uniform mat2 u_Matrix;
void main(){
    gl_Position=vec4(
        vec2(a_Position)*u_Matrix,
        a_Position.z,
        a_Position.w
    );
    gl_PointSize=10.;
}