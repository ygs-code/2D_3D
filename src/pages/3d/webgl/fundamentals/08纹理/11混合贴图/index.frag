precision highp float;
varying vec2 A_UV;
uniform sampler2D A_Texture;
void main(){
   vec4 imgColor=texture2D(A_Texture,A_UV);
   gl_FragColor=imgColor;
}