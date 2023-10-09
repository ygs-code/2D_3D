// // attribute vec2 a_Position;
// // void main() {
// //     gl_Position = vec4(a_Position, 1.0, 1.);
// //     gl_PointSize = 10.;
// // }

// attribute vec4 a_position;

// uniform vec2 u_resolution;

// void main() {
//      // convert the position from pixels to 0.0 to 1.0
//     //  将位置从像素转换为0.0到1.0
//     vec2 zeroToOne = a_position.xy / u_resolution;

//      // convert from 0->1 to 0->2
//      //从0->1转换为0->2
//     vec2 zeroToTwo = zeroToOne * 2.0;

//      // convert from 0->2 to -1->+1 (clipspace)
//      //从0->2转换为-1->+1 (clipspace)
//     vec2 clipSpace = zeroToTwo - 1.0;

//     gl_Position = vec4(clipSpace, 0, 1);
//     gl_PointSize = 10.;

// }


  attribute vec4 a_position;

  uniform vec2 u_resolution;

  void main() {
     // convert the position from pixels to 0.0 to 1.0
     vec2 zeroToOne = a_position.xy / u_resolution;

     // convert from 0->1 to 0->2
     vec2 zeroToTwo = zeroToOne * 2.0;

     // convert from 0->2 to -1->+1 (clipspace)
     vec2 clipSpace = zeroToTwo - 1.0;
    // 你可能注意到矩形在区域左下角，WebGL认为左下角是 0，0 。 想要像传统二维API那样起点在左上角，我们只需翻转y轴即可。
     gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
  }
