#ifdef GL_ES
precision mediump float;
#endif
uniform sampler2D u_Sampler;
varying vec2 v_TexCoord;
vec4 color=vec4(1.,0.,0.,1.);
void main(){
  vec4 texColor=texture2D(u_Sampler,v_TexCoord);
  if(texColor.a<.01){
    // 这段代码会检查纹理的透明度值，如果透明度小于0.1，则会丢弃该像素。
    discard;
  }
  
  gl_FragColor=texColor;
}
