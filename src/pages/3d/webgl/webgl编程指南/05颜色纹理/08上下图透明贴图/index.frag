// Fragment shader program
precision mediump float;
uniform sampler2D u_Sampler0;
uniform sampler2D u_Sampler1;
varying vec2 v_TexCoord;
void main(){
  vec4 color0=texture2D(u_Sampler0,v_TexCoord);
  vec4 color1=texture2D(u_Sampler1,v_TexCoord);
  
  /*
  0-0.2
  
  0.2-0.3
  
  0.3
  */
  
  // vec4 texColor=texture2D(u_Sampler,v_TexCoord);
  if(color0.a>.1){
    // 这段代码会检查纹理的透明度值，如果透明度小于0.1，则会丢弃该像素。
    // discard;
    gl_FragColor=color0;
  }
  // else if(color0.a>.1&&color0.a<=.5){
  //   gl_FragColor=color0*color1;// vec4(color0.rgb*color1.rgb,0.1);
  // }
  else{
    gl_FragColor=color1;
  }
  
  // gl_FragColor=texColor;
  
  // gl_FragColor=color0*color1;
}