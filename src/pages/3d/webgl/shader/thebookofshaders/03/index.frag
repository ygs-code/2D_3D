#ifdef GL_ES
precision mediump float;
#endif
// u_resolution 是一个二维向量， 是 canvas 宽和 canvas的高
uniform vec2 u_resolution;
// uniform vec2 u_mouse;
// uniform float u_time;

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	gl_FragColor = vec4(st.x,st.y,0.0,1.0);
}