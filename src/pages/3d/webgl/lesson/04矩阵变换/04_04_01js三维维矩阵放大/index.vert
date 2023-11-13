attribute vec4 a_Position;
// 列主序列
uniform mat3 u_Matrix;
void main(){
    gl_Position=vec4(
        u_Matrix*vec3(a_Position),
        // a_Position.z,
        a_Position.w
    );
    gl_PointSize=10.;
}