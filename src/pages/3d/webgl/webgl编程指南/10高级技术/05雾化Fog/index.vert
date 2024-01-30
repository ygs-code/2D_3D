 
  attribute vec4 a_Position; // 顶点位置
  attribute vec4 a_Color;  // 模型 颜色
  uniform mat4 u_MvpMatrix;  // mvp 矩阵 
  uniform mat4 u_ModelMatrix;   // 模型矩阵
  uniform vec4 u_Eye;     //  视点位置(世界坐标) Position of eye point (world coordinates)
  varying vec4 v_Color;
  varying float v_Dist;
  void main() {
    gl_Position = u_MvpMatrix * a_Position;
    v_Color = a_Color;
     // Calculate the distance to each vertex from eye point
    //  计算从眼点到每个顶点的距离  离散的值 
    v_Dist = distance(u_ModelMatrix * a_Position, u_Eye);
  }
