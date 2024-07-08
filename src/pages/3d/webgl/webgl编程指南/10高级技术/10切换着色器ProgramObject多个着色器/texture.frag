#ifdef GL_ES
precision mediump float;
#endif
// 纹理贴图
uniform sampler2D u_Sampler;
// 颜色
varying vec2 v_TexCoord;
// 点击
varying float v_NdotL;
void main(){
  // 贴图
  vec4 color=texture2D(u_Sampler,v_TexCoord);
  // 颜色
  gl_FragColor=vec4(color.rgb*v_NdotL,color.a);
}