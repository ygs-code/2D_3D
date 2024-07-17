

  #ifdef GL_ES
precision mediump float;
  #endif
uniform sampler2D u_Sampler;
varying vec2 v_TexCoord;

  // Get the number at the specified digit
float getNumber(float value, float digit) {
  int thisDigit = int(value / digit);
  int upperDigit = int(thisDigit / 10) * 10;
  return float(thisDigit - upperDigit);
}

void main() {

  float testValue = gl_FragCoord.x;             // The value to be displayed


  float thousand = 1000.0;
  float best = 100.0;
  float ten = 10.0;
  float units = 1.0;
  float onePoint = 0.1;
  float twoPoint = 0.01;
  float threePoint = 0.001;
  float fourPoint = 0.0001;
  float fivePoint = 0.00001;

  vec2 texCoord = v_TexCoord;

  // 
  // 渲染的位置
  if(texCoord.x < (1. / 16.0)) {         // 1000
    if(testValue >= thousand) {
      float xOffset = mod(texCoord.x, 1.0 / 16.0);
      // 贴图位置需要 渲染什么 图片 
      texCoord.x = getNumber(testValue, thousand) / 16.0 + xOffset;
    } else {
      // 渲染黑色图
      texCoord.x = 12.0 / 16.0;
    }
  } else if(texCoord.x < (2. / 16.0)) {         // 100
    if(testValue >= best) {
      float xOffset = mod(texCoord.x, 1.0 / 16.0);
      // 贴图位置需要 渲染什么 图片 
      texCoord.x = getNumber(testValue, best) / 16.0 + xOffset;
    } else {
      // 渲染黑色图
      texCoord.x = 12.0 / 16.0;
    }
  } else if(texCoord.x < (3. / 16.0)) {         // 10
    if(testValue >= ten) {
      float xOffset = mod(texCoord.x, 1.0 / 16.0);
      // 贴图位置需要 渲染什么 图片 
      texCoord.x = getNumber(testValue, ten) / 16.0 + xOffset;
    } else {
      // 渲染黑色图
      texCoord.x = 12.0 / 16.0;
    }
  } else if(texCoord.x < (4. / 16.0)) {         // 1
    if(testValue >= units) {
      float xOffset = mod(texCoord.x, 1.0 / 16.0);
      // 贴图位置需要 渲染什么 图片 
      texCoord.x = getNumber(testValue, units) / 16.0 + xOffset;
    } else {
      // 渲染黑色图
      texCoord.x = 12.0 / 16.0;
    }
  } else if(texCoord.x < (5. / 16.0)) {         // .
    float xOffset = mod(texCoord.x, 1.0 / 16.0);
    texCoord.x = (10.0 / 16.0) + xOffset;   // Decimal point is located at 10/16
  } else if(texCoord.x < (6. / 16.0)) {         // 0.1
    if(testValue >= onePoint) {
      float xOffset = mod(texCoord.x, 1.0 / 16.0);
      // 贴图位置需要 渲染什么 图片 
      texCoord.x = getNumber(testValue, onePoint) / 16.0 + xOffset;
    } else {
      // 渲染黑色图
      texCoord.x = 12.0 / 16.0;
    }
  } else if(texCoord.x < (7. / 16.0)) {         // 0.01
    if(testValue >= twoPoint) {
      float xOffset = mod(texCoord.x, 1.0 / 16.0);
      // 贴图位置需要 渲染什么 图片 
      texCoord.x = getNumber(testValue, twoPoint) / 16.0 + xOffset;
    } else {
      // 渲染黑色图
      texCoord.x = 12.0 / 16.0;
    }
  } else if(texCoord.x < (8. / 16.0)) {         // 0.001
    if(testValue >= threePoint) {
      float xOffset = mod(texCoord.x, 1.0 / 16.0);
      // 贴图位置需要 渲染什么 图片 
      texCoord.x = getNumber(testValue, threePoint) / 16.0 + xOffset;
    } else {
      // 渲染黑色图
      texCoord.x = 12.0 / 16.0;
    }
  } else if(texCoord.x < (9. / 16.0)) {         // 0.0001
    if(testValue >= fourPoint) {
      float xOffset = mod(texCoord.x, 1.0 / 16.0);
      // 贴图位置需要 渲染什么 图片 
      texCoord.x = getNumber(testValue, fourPoint) / 16.0 + xOffset;
    } else {
      // 渲染黑色图
      texCoord.x = 12.0 / 16.0;
    }
  } else if(texCoord.x < (10. / 16.0)) {         // 0.00001
    if(testValue >= fivePoint) {
      float xOffset = mod(texCoord.x, 1.0 / 16.0);
      // 贴图位置需要 渲染什么 图片 
      texCoord.x = getNumber(testValue, fivePoint) / 16.0 + xOffset;
    } else {
      // 渲染黑色图
      texCoord.x = 12.0 / 16.0;
    }
  } else {
     // 渲染黑色图
    texCoord.x = 12.0 / 16.0;
  }

  gl_FragColor = texture2D(u_Sampler, texCoord); // Display the number
}
