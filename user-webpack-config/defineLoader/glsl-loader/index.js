var _loaderUtils = require("loader-utils");

function rawLoader(source) {
  const options = (0, _loaderUtils.getOptions)(this);

  const json = JSON.stringify(source)
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
  const esModule =
    typeof options.esModule !== "undefined" ? options.esModule : true;

  return `${esModule ? "export default" : "module.exports ="} ${json};`;
}

exports.default = rawLoader;
