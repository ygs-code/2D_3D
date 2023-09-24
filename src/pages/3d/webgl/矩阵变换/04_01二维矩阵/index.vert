attribute vec4 a_Position;
float angle=radians(10.);
float cosB=cos(angle);
float sinB=sin(angle);
mat2 m2=mat2(
    cosB,sinB,
    -sinB,cosB
);
void main(){
    gl_Position=vec4(
        m2*vec2(a_Position),
        a_Position.z,
        a_Position.w
    );
}