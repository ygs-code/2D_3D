// 声明精度
precision mediump float;
// 声明一个变量
varying vec2 v_Uvs;
// 声明一个变量
uniform sampler2D u_Sampler;
void main(){
    vec4 color = texture2D(u_Sampler,v_Uvs);
    gl_FragColor = color;
}