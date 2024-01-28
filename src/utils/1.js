let str = `
.canvas_webgl{  
    position: absolute;
    top:0px;
    left:0px;
    z-index:1;
  }
`;



str = str.replace(/(\r)|(\n)/g, "");

var regex3 = /(.+?)(?=\{)/g;  // {} 花括号，大括号
// let reg = /(?!\}).*\{/g  ///.*\{/g; // /^(?![-.])\w/g
// console.log( str)

console.log(str.match(regex3));
