attribute vec4 a_Position;
// 列主序列
uniform mat2 u_Matrix;
void main(){
    gl_Position=vec4(
        u_Matrix*vec2(a_Position),
        a_Position.z,
        a_Position.w
    );
}