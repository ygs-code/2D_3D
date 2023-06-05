//路径解析
var path = require('path');
var glob = require('glob');
var fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');

let {
    NODE_ENV, // 环境参数
    WEB_ENV, // 环境参数
    target, // 环境参数
    htmlWebpackPluginOptions = '',
} = process.env; // 环境参数

htmlWebpackPluginOptions = (() => {
    const regex = /(?<=\{)(.+?)(?=\})/g; // {} 花括号，大括号
    htmlWebpackPluginOptions = htmlWebpackPluginOptions.match(regex);
    if (htmlWebpackPluginOptions) {
        htmlWebpackPluginOptions = htmlWebpackPluginOptions[0];
        let htmlWebpackPluginOptionsArr = htmlWebpackPluginOptions.split(',');
        htmlWebpackPluginOptions = {};
        for (let item of htmlWebpackPluginOptionsArr) {
            let [key, value] = item.split(':');
            htmlWebpackPluginOptions[`${key}`] = value;
        }
    } else {
        htmlWebpackPluginOptions = {};
    }
    return htmlWebpackPluginOptions;
})();

//一个整合路径的方法
var resolve = function (dir) {
    return path.join(__dirname, '..', dir);
};

const getDirPages = (dir) => {
    return fs.readdirSync(path.join(resolve('src'), dir));
};

let getEntryPlugins = (dir, entryHtml, entryJs) => {
    let dirPages = getDirPages(dir);
    // 被读取的文件夹地址
    const filePath = path.join(resolve('src'), dir);
    let entry = {
        [entryJs.replace(/(\.js)/g, '')]: path.join(
            resolve('src'),
            dir,
            entryJs
        ),
    };

    let conf = {
        // 生成出来的html文件名
        filename: entryHtml,
        // 每个html的模版，这里多个页面使用同一个模版
        template: path.join(resolve('src'), dir, entryHtml),
        // 自动将引用插入html
        inject: true,
        // 每个html引用的js模块，也可以在这里加上vendor等公用模块
        chunks: [entryJs.replace(/(\.js)/g, '')],
    };

    let plugins = [
        // html静态页面
        new HtmlWebpackPlugin({
            ...htmlWebpackPluginOptions,
            ...conf,
            // title: 'Custom template using Handlebars',
            // 生成出来的html文件名
            // filename: 'index.html',
            // // 每个html的模版，这里多个页面使用同一个模版
            // template: path.join(process.cwd(), '/public/index.html'),
            // // 自动将引用插入html
            // inject: 'body',
            // hash: true,
            // 每个html引用的js模块，也可以在这里加上vendor等公用模块
            // chunks: [
            //   'vendor',
            //   'manifest',
            //   'index',
            //   // "static/vendor.dll",
            //   // "static/vendor.manifest",
            // ],
        }),
    ];
    for (let filename of dirPages) {
        //获取当前文件的绝对路径
        const filedir = path.join(filePath, filename);
        const stats = fs.statSync(filedir);
        // fs.stat(filedir, (eror, stats) => {
        // 是否是文件
        const isFile = stats.isFile();
        // 是否是文件夹
        const isDir = stats.isDirectory();
        if (isFile) {
            continue;
        }
        entry[filename] = path.join(resolve('src'), dir, filename, entryJs);

        conf = {
            // 生成出来的html文件名
            filename: filename + '/index.html',
            // 每个html的模版，这里多个页面使用同一个模版
            template: path.join(resolve('src'), dir, filename, entryHtml),
            // 自动将引用插入html
            inject: true,
            // 每个html引用的js模块，也可以在这里加上vendor等公用模块
            chunks: [filename],
        };
        /*入口文件对应html文件（配置多个，一个页面对应一个入口，通过chunks对应）*/
        plugins.push(
            // html静态页面
            new HtmlWebpackPlugin({
                ...htmlWebpackPluginOptions,
                ...conf,
                // title: 'Custom template using Handlebars',
                // 生成出来的html文件名
                // filename: 'index.html',
                // // 每个html的模版，这里多个页面使用同一个模版
                // template: path.join(process.cwd(), '/public/index.html'),
                // // 自动将引用插入html
                // inject: 'body',
                // hash: true,
                // 每个html引用的js模块，也可以在这里加上vendor等公用模块
                // chunks: [
                //   'vendor',
                //   'manifest',
                //   'index',
                //   // "static/vendor.dll",
                //   // "static/vendor.manifest",
                // ],
            })
        );
    }

    return {
        entry,
        plugins,
    };
};

module.exports = getEntryPlugins;
