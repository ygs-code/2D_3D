#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;

// Plot a line on Y using a value between 0.0-1.0
// 使用0.0-1.0之间的值在Y上画一条线
float plot(vec2 st){
    
    return smoothstep(.02,0.,abs(st.y-st.x));
}

void main(){
    vec2 st=gl_FragCoord.xy/u_resolution;
    
    float y=st.x;
    
    vec3 color=vec3(y);
    
    // Plot a line
    float pct=plot(st);
    
    color=(1.-pct)*color+pct*vec3(0.,1.,0.);
    
    gl_FragColor=vec4(pct,0.,0.,1.);
}
