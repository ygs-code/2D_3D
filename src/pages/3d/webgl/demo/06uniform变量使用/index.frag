precision mediump float;  // 定义浮点变量
uniform vec4 u_FragColor;  // 定义u_FragColor变量
void main() {
          // gl_FragColor = vec4(1.0, 1.0, 0.0 , 1.0);    // 颜色rgba
    gl_FragColor = u_FragColor;    // 颜色rgba
}