attribute vec4 a_Potions;
vec4 translation=vec4(0.,.5,0.,0.);
void main(){
    gl_Position=a_Potions+translation;
    gl_PointSize=10.;
}