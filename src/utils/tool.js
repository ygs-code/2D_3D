export const color = (rgbaCss) => {
//   const rgbaCss = "rgba(255, 200, 2, 1)";
  const reg = /rgba\((.*?)\)/;
  const colorText = rgbaCss.match(reg);
  if (colorText && colorText[1]) {
    let [r, g, b, a] = colorText[1].split(",").map((item) => Number(item));
    return [
        r / 255, g / 255, b / 255, a
    ];
  }
};
