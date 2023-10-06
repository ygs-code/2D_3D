attribute vec3 a_Position;
attribute vec2 a_Uvs;
varying  vec2 v_Uvs;
void main(){
    v_Uvs = a_Uvs;
    gl_Position=vec4(a_Position,1.0);
    gl_PointSize=10.0;
    // gl_Position=vec4(a_Position,1.,1.);
    // gl_PointSize=10.;
}
