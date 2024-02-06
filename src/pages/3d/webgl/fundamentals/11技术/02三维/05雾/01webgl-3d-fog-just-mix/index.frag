    precision mediump float;
    
    // Passed in from the vertex shader.
    // 贴图
    varying vec2 v_texcoord;
    
    // The texture.
    uniform sampler2D u_texture;
    
    uniform vec4 u_fogColor;
    uniform float u_fogAmount;
    
    void main() {
      vec4 color = texture2D(u_texture, v_texcoord);
      // 最小
      gl_FragColor = mix(color, u_fogColor, u_fogAmount);  
    }