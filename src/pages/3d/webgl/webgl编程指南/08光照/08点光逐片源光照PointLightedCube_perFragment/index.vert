 
  attribute vec4 a_Position; // 物体顶点
  attribute vec4 a_Color;  // 物体表面基地色
  attribute vec4 a_Normal;  // 法向量
  uniform mat4 u_MvpMatrix; // mvp矩阵
  uniform mat4 u_ModelMatrix;   // Model matrix  模型矩阵
  uniform mat4 u_NormalMatrix;  // Transformation matrix of the normal 法向量矩阵

  // 传递给fragmet
  varying vec4 v_Color; // 
  varying vec3 v_Normal; // 
  varying vec3 v_Position;
  void main() {

    gl_Position = u_MvpMatrix * a_Position;

     // Calculate the vertex position in the world coordinate
     //计算顶点在世界坐标中的位置
    v_Position = vec3(u_ModelMatrix * a_Position);
    // 归一化
    v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));
    
    v_Color = a_Color;
  }
