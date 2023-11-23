precision mediump float;
uniform vec4 u_FragColor;
varying vec4 v_Color;
void main() {
          //gl_FragColor = vec4(1.0, 1.0, 0.0 , 1.0);    // 颜色rgba
          // gl_FragColor = u_FragColor;    // 颜色rgba
    gl_FragColor = v_Color;    // 将 v_Color 值赋值给颜色gl_FragColor
}