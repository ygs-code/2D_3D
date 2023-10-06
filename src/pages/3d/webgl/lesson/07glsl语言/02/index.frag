//
precision mediump float;
void main(){
  float x=(gl_FragCoord.x/400.);
  float y=(gl_FragCoord.y/400.);
  float r=0.;
  float g=.5;
  float b=.5;
  
  vec3 color=vec3(r,g,b);
  vec3 color1=vec3(1.,1.,1.);
  vec3 color2=vec3(0.,0.,1.);
  if(x>0.5){
    //黄色
    gl_FragColor=vec4(color1-color2,1.);
  }else{
    gl_FragColor=vec4(0.0,0.0,1.,1.);
  }
  
}