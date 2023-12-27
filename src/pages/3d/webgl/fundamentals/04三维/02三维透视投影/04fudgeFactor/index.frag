precision mediump float;

// uniform vec4 u_color;

// 从顶点着色器中传入
varying vec4 v_colors;

void main() {
   gl_FragColor = v_colors;   //v_colors;
}