precision mediump float;
varying vec3 v_colors;

void main() {

    gl_FragColor = vec4(v_colors, 1);
}