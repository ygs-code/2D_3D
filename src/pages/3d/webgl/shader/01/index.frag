
// void main(){
//     precision mediump float;
//     // 颜色
//     gl_FragColor=vec4(1.,0.,0.,1.);
// }




precision mediump float;


uniform float u_time;

void main() {
	gl_FragColor = vec4(abs(sin(u_time)),0.0,0.0,1.0);
}


