// attribute vec4 a_Position;
// vec4 translation = vec4(0,0.5,0,0);
// void main(){
    //   gl_Position = a_Position+translation;
// }

attribute vec4 a_Position;
vec4 translation=vec4(0.,.5,0.,0.);
void main(){
    gl_Position=a_Position+translation;
}