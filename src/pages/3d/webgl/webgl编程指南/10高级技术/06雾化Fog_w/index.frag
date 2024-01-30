
#ifdef GL_ES
precision mediump float;
#endif
uniform vec3 u_FogColor;// Color of Fog
uniform vec2 u_FogDist;// Distance of Fog (starting point, end point)
varying vec4 v_Color;
varying float v_Dist;
void main(){
  // Calculation of fog factor (factor becomes smaller as it goes further away from eye point)
  float fogFactor=clamp((u_FogDist.y-v_Dist)/(u_FogDist.y-u_FogDist.x),0.,1.);
  // Stronger fog as it gets further: u_FogColor * (1 - fogFactor) + v_Color * fogFactor
  vec3 color=mix(u_FogColor,vec3(v_Color),fogFactor);
  gl_FragColor=vec4(color,v_Color.a);
}