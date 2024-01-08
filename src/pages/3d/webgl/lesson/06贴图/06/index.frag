  precision mediump float;
  varying vec2 v_uv;
  uniform sampler2D u_sampler1;
  uniform sampler2D u_sampler2;
  
  void main() {
      vec4 color1 = texture2D(u_sampler1, v_uv);
      vec4 color2 = texture2D(u_sampler2, v_uv);
      // 颜色 计算
      gl_FragColor = color1 * (vec4(1.0, 1.0, 1.0, 2.0) - color2);
      // gl_FragColor = color1 * color2;
  }