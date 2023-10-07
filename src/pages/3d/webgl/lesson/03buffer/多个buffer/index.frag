precision mediump float;
uniform float u_w;
uniform float u_h;

varying vec3 v_color;
// gl_FragCoord: canvas画布的坐标（100， 100）
void main() {
    // gl_FragColor = vec4(gl_FragCoord.x / u_w, gl_FragCoord.y / u_h, 0.0, 1.0);
    gl_FragColor = vec4(v_color, 1.0);
}