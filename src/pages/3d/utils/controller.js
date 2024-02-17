import * as dat from "dat.gui";

const controller = ({
  parmas = {}, //    参数设置
  options = [], // 选项
  name = "控制器",
  onChange: $onChange = () => {}
}) => {
  const gui = new dat.GUI();
  // 设置一个文件夹
  const folder = gui.addFolder(name);
  for (let item of options) {
    const {
      key,
      min,
      max,
      step,
      name,
      onChange = () => {},
      onFinishChange = () => {}
    } = item;
    let keys = key.split(".");
    let code = "";
    let props = parmas;
    if (keys.length >= 2) {
      code += "parmas";
      for (let i = 0; i < keys.length - 1; i++) {
        code += `.${keys[i]}`;
      }
      props = eval(code);
    }
    //控制器一个x选项
    folder
      .add(
        props, // 需要修改的对象
        keys.slice(-1)[0] // 需要修改的属性
      )
      .min(min)
      .max(max)
      // 每次改变为0.1
      .step(step)
      .name(name)
      .onChange((value) => {
        // 回调函数
        onChange(value);
        $onChange(parmas);
      })
      .onFinishChange((value) => {
        // 完全修改停下来的时候触发这个事件
        onFinishChange(value);
      });
  }

  return {
    gui,
    folder
  };
};

export default controller;
