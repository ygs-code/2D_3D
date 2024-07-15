const gl = require('headless-gl')({ width: 512, height: 512 });



console.log(gl)

 
// 创建一个简单的WebGL程序
const render = gl.renderer(() => {
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
 
  // 设置颜色为红色
  gl.drawArrays(gl.TRIANGLES, 0, 3);
});
 
render();