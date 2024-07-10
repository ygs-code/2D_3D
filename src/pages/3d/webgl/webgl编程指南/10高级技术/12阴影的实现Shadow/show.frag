precision mediump float;
void main() {
  gl_FragColor = vec4(gl_FragCoord.z, 0.0, 0.0, 0.0);  // 用R表示z值 Write the z-value in R
}