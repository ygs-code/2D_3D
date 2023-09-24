attribute vec4 a_Position;
float scale=1.;
void main(){
    // gl_Position.x=a_Position.x*scale;
    // gl_Position.y=a_Position.y*scale;
    // gl_Position.z=a_Position.z*scale;
    // gl_Position.w=1.;
    gl_Position=vec4(vec3(a_Position)*scale,1.);
}
