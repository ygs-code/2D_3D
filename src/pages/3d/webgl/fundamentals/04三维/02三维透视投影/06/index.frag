precision mediump float;
varying vec4 v_color;
varying vec4 v_position;
uniform vec4 u_color;
void main(){
    
    bool blend=(v_position.x<-1.||v_position.x>1.||
        v_position.y<-1.||v_position.y>1.||
    v_position.z<-1.||v_position.z>1.);

    vec4 blendColor=blend?vec4(.35,.35,.35,1.):vec4(1,1,1,1);
    gl_FragColor=v_color*u_color*blendColor;
}