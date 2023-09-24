attribute vec4 a_Position;
uniform float u_Scale;
void main(){
    gl_Position.x=a_Position.x*u_Scale;
    gl_Position.y=a_Position.y*u_Scale;
    gl_Position.z=a_Position.z*u_Scale;
    gl_Position.w=1.;
    // gl_Position = vec4(vec3(a_Position)*u_Scale,1.0);
}

