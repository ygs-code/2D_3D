export const getStyle = (ele, attr) => {
  var style = null;
  if (window.getComputedStyle) {
    style = window.getComputedStyle(ele, null);
  } else {
    style = ele.currentStyle;
  }
  return attr ? style[attr] : style;
};

export const insertStyle = (css) => {
  //首先创建一个样式元素
  var styleElement = document.createElement("style");
  //将样式元素插入到head标签中
  document.head.appendChild(styleElement);
  //获取样式元素的sheet属性，该属性是CSSStyleSheet对象，用于操作CSS规则
  var styleSheet = styleElement.sheet;
  //创建CSS规则，并添加到样式表中
  styleSheet.insertRule(css, 0);

  return styleSheet;
};

// 封装插入样式的函数 , 一次只能插入一个 css 
export const addCss = (css) => {
  let styles = document.getElementsByTagName("style") || [];
  if (styles.length >= 1) {
    css = css.replace(/(\r)|(\n)/g, "");
    var regex1 = /(.+?)(?=\{)/g; // {} 花括号，大括号
    var regex2 = /(?<=\{)(.+?)(?=\})/g; // {} 花括号，大括号
    styles[0].sheet.addRule(
      css.match(regex1)[0],
      css.match(regex2)[0].replace(/(\r)|(\n)/g, ""),
      0
    );
  } else {
    insertStyle(css);
  }

  return;
};
