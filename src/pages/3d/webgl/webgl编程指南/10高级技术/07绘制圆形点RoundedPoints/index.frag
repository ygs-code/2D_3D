precision mediump float;

void main() {    // Center coordinate is (0.5, 0.5)
  float d = distance(gl_PointCoord, vec2(0.5, 0.5));
  if(d < 0.5) {  // Radius is 0.5
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  } else {
    discard;
  }
}