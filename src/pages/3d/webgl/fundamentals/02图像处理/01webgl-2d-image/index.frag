precision mediump float;

// our texture
uniform sampler2D u_image;

// the texCoords passed in from the vertex shader.
//从顶点着色器传入的texcoord。
varying vec2 v_texCoord;

void main() {
  // 2d 贴图   贴图 赋值给 v_texCoord
   gl_FragColor = texture2D(u_image, v_texCoord);
}