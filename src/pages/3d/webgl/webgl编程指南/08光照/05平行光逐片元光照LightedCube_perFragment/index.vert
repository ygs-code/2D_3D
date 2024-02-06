  attribute vec4 a_Position;
  attribute vec4 a_Color;
  attribute vec4 a_Normal;
  uniform mat4 u_mvpMatrix;
  uniform mat4 u_normalMatrix;
  uniform vec3 u_LightDir;
  varying vec4 v_Color;
  varying float v_Dot;
  void main() {
    gl_Position = u_mvpMatrix * a_Position;
    v_Color = a_Color;
    vec4 normal = u_normalMatrix * a_Normal;
    v_Dot = max(dot(normalize(normal.xyz), u_LightDir), 0.0);
  }