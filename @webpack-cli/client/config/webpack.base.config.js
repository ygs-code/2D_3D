require('@babel/polyfill');
const webpack = require('webpack');
const fs = require('fs');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const WebpackBar = require('webpackbar');
const { ProgressPlugin } = require('webpack');
const HappyPack = require('happypack');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const DirectoryNamedWebpackPlugin = require('directory-named-webpack-plugin');
const { CheckerPlugin } = require('awesome-typescript-loader');
const os = require('os');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const WebpackBuildDllPlugin = require('webpack-build-dll-plugin');
const DllReferencePlugin = require('webpack/lib/DllReferencePlugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const ExtendedDefinePlugin = require('extended-define-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const { ESBuildPlugin, ESBuildMinifyPlugin } = require('esbuild-loader');
const getEntryPlugins = require('../../HtmlWebpackPluginPages');

const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length - 1 });



const { resolve } = path;
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

//    是否是生产环境
const isEnvProduction = NODE_ENV === 'production';
//   是否是测试开发环境
const isEnvDevelopment = NODE_ENV === 'development';

const {
  entry,
  plugins,
}=getEntryPlugins('pages', 'index.html', 'index.js')

// console.log('entry==',entry)
// console.log('plugins==',plugins)

const cacheLoader = (happypackId) => {
    return isEnvDevelopment
        ? [
              `happypack/loader?id=${happypackId}&cacheDirectory=true`,
              'thread-loader',
              'cache-loader',
          ]
        : ['thread-loader', `happypack/loader?id=${happypackId}`];
};

// console.log("resolve   : " + resolve("./"));
// console.log("__dirname : " + __dirname);
// console.log("cwd       : " + process.cwd());

// webpack  loaders  https://webpack.javascriptc.com/loaders/

module.exports = {
    name: 'client',
    target: 'web',
    // 入口
    entry: {
        // myVue: [path.join(process.cwd(), "/src/myVue.js")], // 公共包抽取
        // vendor: ['react'],
        // index: [
        //     '@babel/polyfill',
        //     //添加编译缓存
        //     // "webpack/hot/poll?1000",
        //     //  path.join(process.cwd(), "/src/index.js")
        //     //入口主文件
        //     path.join(process.cwd(), '/src/index'), // 如果没有配置 context 则需要这样引入  path.join(__dirname, "../../src/index.js")
        // ],
        ...entry,
    },

    // 出口
    output: {
        // 输出目录
        path: path.join(process.cwd(), '/dist'),
        // filename: '[name].[hash].js',
        // chunkFilename: '[name].[hash].js',
        // Chunk 配置
        filename: 'static/js/[name].js',
        chunkFilename: 'static/js/[name][contenthash].js',
        // 访问静态资源目录 比如 css img
        publicPath: '/', // dev 服务器需要是绝对，而编译出来需要是相对
        // // 导出库(exported library)的名称
        // library: "server",
        // //   导出库(exported library)的类型
        // libraryTarget: "umd",
        // // 在 UMD 库中使用命名的 AMD 模块
        // umdNamedDefine: true,
        // globalObject: "this",
        // chunk 请求到期之前的毫秒数，默认为 120000
        chunkLoadTimeout: 120000,
        // 「devtool 中模块」的文件名模板 调试webpack的配置问题
        // 你的文件在chrome开发者工具中显示为webpack:///foo.js?a93h, 。如果我们希望文件名显示得更清晰呢，比如说 webpack:///path/to/foo.js
        devtoolModuleFilenameTemplate: (info) => {
            // "webpack://[namespace]/[resource-path]?[loaders]"
            return `webpack:///${info.resourcePath}?${info.loaders}`;
        },
        // 如果多个模块产生相同的名称，使用
        devtoolFallbackModuleFilenameTemplate: (info) => {
            return `webpack:///${info.resourcePath}?${info.loaders}`;
        },
        // 如果一个模块是在 require 时抛出异常，告诉 webpack 从模块实例缓存(require.cache)中删除这个模块。
        // 并且重启webpack的时候也会删除cache缓存
        // strictModuleExceptionHandling: true,
    },

    // 是否监听文件
    // watch: false,

    resolve: {
        // //决定请求是否应该被缓存的函数。函数传入一个带有 path 和 request 属性的对象。默认：
        // cachePredicate: () => {
        //   return true;
        // },
        plugins: [
            //如果在引用目录中没有index.js文件的时候。
            // 当require("component/foo")路径“component/foo”解析到目录时，
            // Webpack将尝试查找component/foo/foo.js作为条目.
            new DirectoryNamedWebpackPlugin({
                honorIndex: true, // defaults to false
                // 排除
                exclude: /node_modules/,
                //入口文件
                include: [path.join(process.cwd(), '/src')],
            }),
        ],
        // //启用，会主动缓存模块，但并不安全。传递 true 将缓存一切
        // unsafeCache: true,
        // 模块查找优先顺序配置
        // 1.配置模块的查找规则,
        // 2.导入 require('sql')，会先在node_modules下查找，然后再到app下查找
        // 相对路径是相对于webpack.config.js文件所在的路劲
        // 详细教程: https://blog.csdn.net/u012987546/article/details/97389078
        modules: [
            path.join(process.cwd(), '/node_modules'),
            path.join(process.cwd(), '/src'),
        ],
        // 可以省略引用后缀
        extensions: [
            '.tsx',
            '.ts',
            '.js',
            '.graphql',
            '.json',
            '.node',
            '.sql',
        ],
        // 1.不需要node polyfilss webpack 去掉了node polyfilss 需要自己手动添加
        //dllPlugin 插件需要的包
        alias: {
            // buffer: "buffer",
            // crypto: "crypto-browserify",
            // vm: "vm-browserify",
            // crypto: false,
            // stream: "stream-browserify",
            // '@': path.join(process.cwd(), '/src'),
        },
        // 2.手动添加polyfills
        fallback: {
            // path: require.resolve("path-browserify"),
            // crypto: require.resolve("crypto-browserify"),
            // stream: require.resolve("stream-browserify"),
            // util: require.resolve("util/"),
            // assert: require.resolve("assert/"),
            // http: require.resolve("stream-http"),
        },
    },
    // // 打包文件大小监听
    // performance: {
    //   maxEntrypointSize: 1024 * 512, // 设置最大输入512kb的文件，如果大于他则发出警告
    //   maxAssetSize: 1024 * 256, // 设置最大输出256kb的文件，如果大于他则发出警告
    //   hints: 'warning',
    //   // 过滤文件
    //   assetFilter: function (assetFilename) {
    //     // console.log('assetFilename==========', assetFilename,assetFilename.endsWith('.js'))
    //     // 只要监听js文件，过滤其他文件判断
    //     return assetFilename.endsWith('.js')
    //   },
    // },

    //选项决定文件系统快照的创建和失效方式。
    snapshot: {
        managedPaths: [path.join(process.cwd(), '/node_modules')],
        immutablePaths: [],
        buildDependencies: {
            hash: true,
            timestamp: true,
        },
        module: {
            timestamp: true,
        },
        resolve: {
            timestamp: true,
        },
        resolveBuildDependencies: {
            hash: true,
            timestamp: true,
        },
    },
    //在第一个错误出现时抛出失败结果，而不是容忍它
    bail:true,
    // 打包优化配置
    optimization: {
        //告知 webpack 去决定每个模块使用的导出内容。这取决于 optimization.providedExports 选项。
        //由 optimization.usedExports 收集的信息会被其它优化手段或者代码生成使用，比如未使用的导出内容不会被生成， 当所有的使用都适配，导出名称会被处理做单个标记字符
        usedExports: 'global',
        //告知 webpack 去辨识 package.json 中的 副作用 标记或规则，以跳过那些当导出不被使用且被标记不包含副作用的模块。
        sideEffects: true,
        //使用 optimization.emitOnErrors 在编译时每当有错误时，就会 emit asset。这样可以确保出错的 asset 被 emit 出来。关键错误会被 emit 到生成的代码中，并会在运行时报错
        emitOnErrors: true,
        //如果模块已经包含在所有父级模块中，告知 webpack 从 chunk 中检测出这些模块，或移除这些模块
        removeAvailableModules: true,
        //如果 chunk 为空，告知 webpack 检测或移除这些 chunk
        removeEmptyChunks: true,
        //告知 webpack 合并含有相同模块的 chunk
        mergeDuplicateChunks: true,
        //告知 webpack 确定和标记出作为其他 chunk 子集的那些 chunk，其方式是在已经加载过较大的 chunk 之后，就不再去加载这些 chunk 子集。
        flagIncludedChunks: true,
        //告知 webpack 去确定那些由模块提供的导出内容，为 export * from ... 生成更多高效的代码。
        providedExports: true,
        //告知 webpack 是否对未使用的导出内容，实施内部图形分析(graph analysis)。
        innerGraph: true,
        //在处理资产之后添加额外的散列编译通道，以获得正确的资产内容散列。如果realContentHash被设置为false，则使用内部数据来计算散列，当资产相同时，它可以更改。
        realContentHash: true,
        // Chunk start splitChunks [name].chunk  公共包抽取  vendor
        // 开启这个编译包更小
        // runtimeChunk: 'single',
        // 开启这个编译包更小
        // runtimeChunk: {
        //   // name: (entrypoint) => `runtime~${entrypoint.name}`,
        // },
        //
        // 打包大小拆包
        splitChunks: {
            // 最大超过多少就要拆分
            // maxSize: 204800, //大小超过204800个字节 200kb 就要拆分
            // // 最小多少被匹配拆分
            // minSize: 102400, //大小超过102400个字节  100kb 就要拆分
            enforceSizeThreshold: 102400,
            name: false,
            chunks: 'all',
            minRemainingSize: 0,
            minChunks: 1,
            maxAsyncRequests: 50,
            maxInitialRequests: 50,
            automaticNameDelimiter: '~',
            cacheGroups: {
                // vendor: {
                //     //第三方依赖
                //     priority: 1, //设置优先级，首先抽离第三方模块
                //     name: 'vendor',
                //     test: /node_modules/,
                //     chunks: 'initial',
                //     minSize: 0,
                //     minChunks: 1, //最少引入了1次
                // },
                // //缓存组
                // common: {
                //     //公共模块
                //     chunks: 'initial',
                //     name: 'common',
                //     minSize: 1000, //大小超过1000个字节
                //     minChunks: 3, //最少引入了3次
                // },
                node_modulesVendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    reuseExistingChunk: true,
                    // minSize: 100, //大小超过1000个字节
                    minChunks: 1, //最少引入了1次
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true,
                },
            },
        },
        // Chunk end
    },

    // 捕获时机信息
    profile: true,
    // 限制并行处理模块的数量
    parallelism: 1, // number
    //统计信息(stats)
    stats: {
        // 未定义选项时，stats 选项的备用值(fallback value)（优先级高于 webpack 本地默认值）
        all: undefined,
        // 添加资源信息
        assets: false,
        // 对资源按指定的字段进行排序
        // 你可以使用 `!field` 来反转排序。
        assetsSort: 'field',
        // 添加构建日期和构建时间信息
        builtAt: true,
        // 添加缓存（但未构建）模块的信息
        cached: false,
        // 显示缓存的资源（将其设置为 `false` 则仅显示输出的文件）
        cachedAssets: false,
        // 添加 children 信息
        children: false,
        // 添加 chunk 信息（设置为 `false` 能允许较少的冗长输出）
        chunks: false,
        // 将构建模块信息添加到 chunk 信息
        chunkModules: false,
        // 添加 chunk 和 chunk merge 来源的信息
        chunkOrigins: false,
        // 按指定的字段，对 chunk 进行排序
        // 你可以使用 `!field` 来反转排序。默认是按照 `id` 排序。
        chunksSort: 'id',
        // 用于缩短 request 的上下文目录
        // context: "../src/",
        // `webpack --colors` 等同于 显示日志不同的颜色
        colors: true,
        // 显示每个模块到入口起点的距离(distance)
        depth: false,
        // 通过对应的 bundle 显示入口起点
        entrypoints: false,
        // 添加 --env information
        env: false,
        // 添加错误信息
        errors: true,
        // 添加错误的详细信息（就像解析日志一样）
        errorDetails: true,
        // 将资源显示在 stats 中的情况排除
        // 这可以通过 String, RegExp, 获取 assetName 的函数来实现
        // 并返回一个布尔值或如下所述的数组。
        // excludeAssets: "filter" | /filter/ | (assetName) => ... return true|false |
        //   ["filter"] | [/filter/] | [(assetName) => ... return true|false],
        // 将模块显示在 stats 中的情况排除
        // 这可以通过 String, RegExp, 获取 moduleSource 的函数来实现
        // 并返回一个布尔值或如下所述的数组。
        // excludeModules: "filter" | /filter/ | (moduleSource) => ... return true|false |
        //   ["filter"] | [/filter/] | [(moduleSource) => ... return true|false],
        // // 和 excludeModules 相同
        // exclude: "filter" | /filter/ | (moduleSource) => ... return true|false |
        //   ["filter"] | [/filter/] | [(moduleSource) => ... return true|false],
        // 添加 compilation 的哈希值
        hash: true,
        // 设置要显示的模块的最大数量
        // maxModules: 15,
        // 添加构建模块信息
        modules: false,
        // 按指定的字段，对模块进行排序
        // 你可以使用 `!field` 来反转排序。默认是按照 `id` 排序。
        modulesSort: 'id',
        // 显示警告/错误的依赖和来源（从 webpack 2.5.0 开始）
        moduleTrace: true,
        // 当文件大小超过 `performance.maxAssetSize` 时显示性能提示
        performance: true,
        // 显示模块的导出
        providedExports: false,
        // 添加 public path 的信息
        publicPath: false,
        // 添加模块被引入的原因
        reasons: false,
        // 添加模块的源码
        source: false,
        // 添加时间信息
        timings: true,
        // 显示哪个模块导出被用到
        usedExports: false,
        // 添加 webpack 版本信息
        version: true,
        // 添加警告
        warnings: true,
        // 过滤警告显示（从 webpack 2.4.0 开始），
        // 可以是 String, Regexp, 一个获取 warning 的函数
        // 并返回一个布尔值或上述组合的数组。第一个匹配到的为胜(First match wins.)。
        // warningsFilter: "filter" | /filter/ | ["filter", /filter/] | (warning) => ... return true|false
    },

    //防止将某些 import 的包(package)打包到 bundle 中,而是在运行时(runtime)再去从外部获取这些扩展依赖
    externals: [],

    module: {
        rules: [
         
            //处理图片
            //！默认处理不了html中的图片 <img src="./img/BM.jpg" alt=""> 打包后路径不会改变！
            {
                test: /\.(jpg|jpeg|png|gif|svg)$/,
                //只用一个loader  但要下载url-loader 和 file-loader
                loader: 'url-loader', // 处理样式中的url
                options: {
                    //当图片小于8k 会被base64处理
                    //图片体积会变大，文件请求更慢 如果使用http 2.0 则这里配置是不好的
                    limit: 8 * 1024,
                    //默认使用的是es6模块化，
                    //解析时就会报错
                    // 解决，关闭es6模块化，使用commonjs
                    esModule: false,
                    //图片名字重命名
                    // [name] 文件名
                    //[contenthash:10]  hash 10
                    //[ext]  原拓展名
                    name: 'static/image/[name].[contenthash:10].[ext]',
                },
            },

            // {
            //   test: /\.(json)$/,
            //   loader: 'url-loader',
            //   // Exclude `js` files to keep "css" loader working as it injects
            //   // its runtime that would otherwise be processed through "file" loader.
            //   // Also exclude `html` and `json` extensions so they get processed
            //   // by webpacks internal loaders.
            //   // exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/, /\.css$/],
            //   options: {
            //     name: 'static/json/[name].[contenthash:10].[ext]',
            //   },
            // },

            // ts
            {
                test: /\.ts?$/,
                enforce: 'pre',
                // 排除文件,因为这些包已经编译过，无需再次编译
                exclude: /(node_modules|bower_components)/,
                use: cacheLoader('ts'),
            },

            //tsx
            {
                test: /(\.tsx?$)/,
                enforce: 'pre',
                // 排除文件,因为这些包已经编译过，无需再次编译
                exclude: /(node_modules|bower_components)/,
                use: cacheLoader('tsx'),
            },

            {
                include: path.join(process.cwd(), '/src'),
                sideEffects: true,
            },
            {
                test: /\.node$/,
                use: [
                    //   "happypack/loader?id=node&cacheDirectory=true",
                    //   // 'thread-loader',
                    //   //  WEB_ENV == 'test' ? '' : 'thread-loader',
                    //   ...(isEnvDevelopment ? ["thread-loader"] : []),
                    //   "cache-loader",
                    // {
                    //   loader: "thread-loader",
                    //   // 有同样配置的 loader 会共享一个 worker 池(worker pool)
                    //   options: {
                    //     // 产生的 worker 的数量，默认是 cpu 的核心数
                    //     workers: 2,
                    //     // 一个 worker 进程中并行执行工作的数量
                    //     // 默认为 20
                    //     workerParallelJobs: 50,
                    //     // 额外的 node.js 参数
                    //     workerNodeArgs: ['--max-old-space-size', '1024'],
                    //     // 闲置时定时删除 worker 进程
                    //     // 默认为 500ms
                    //     // 可以设置为无穷大， 这样在监视模式(--watch)下可以保持 worker 持续存在
                    //     poolTimeout: 2000,
                    //     // 池(pool)分配给 worker 的工作数量
                    //     // 默认为 200
                    //     // 降低这个数值会降低总体的效率，但是会提升工作分布更均一
                    //     poolParallelJobs: 50,
                    //     // 池(pool)的名称
                    //     // 可以修改名称来创建其余选项都一样的池(pool)
                    //     name: "my-pool"
                    //   }
                    // },
                ].concat(cacheLoader('node')),
                // 排除文件,因为这些包已经编译过，无需再次编译
                exclude: /(node_modules|bower_components)/,
                // use: {
                //   loader:"node-loader",
                //   options: {
                //     name: "[path][name].[ext]",
                //   },
                // },
            },
         
            {
                test: /\.(graphql|gql|sql|vert|frag|glsl|json)$/,
                // 排除文件,因为这些包已经编译过，无需再次编译
                exclude: /(node_modules|bower_components)/,
                use: [].concat(cacheLoader('rawLoader')),
                // use: {
                //   loader: "raw-loader",
                // },
            },
        ],
    },

    plugins: [
      ...plugins,
        new ESBuildPlugin(),
        // new ESLintPlugin({
        //   emitError: true, //发现的错误将始终被触发，将禁用设置为false。
        //   emitWarning: true, //如果将disable设置为false，则发现的警告将始终被发出。
        //   failOnError: true, //如果有任何错误，将导致模块构建失败，禁用设置为false。
        //   failOnWarning: false, //如果有任何警告，如果设置为true，将导致模块构建失败。
        //   quiet: false, //如果设置为true，将只处理和报告错误，而忽略警告。
        //   fix: true, //自动修复
        // }),
        // html静态页面
        // new HtmlWebpackPlugin({
        //     ...htmlWebpackPluginOptions,
        //     // title: 'Custom template using Handlebars',
        //     // 生成出来的html文件名
        //     filename: 'index.html',
        //     // 每个html的模版，这里多个页面使用同一个模版
        //     template: path.join(process.cwd(), '/public/index.html'),
        //     // 自动将引用插入html
        //     inject: 'body',
        //     hash: true,
        //     // 每个html引用的js模块，也可以在这里加上vendor等公用模块
        //     // chunks: [
        //     //   'vendor',
        //     //   'manifest',
        //     //   'index',
        //     //   // "static/vendor.dll",
        //     //   // "static/vendor.manifest",
        //     // ],
        // }),
        // 加载该插件报错 找不到原因
        // new HardSourceWebpackPlugin({
        // // cacheDirectory是在高速缓存写入。默认情况下，将缓存存储在node_modules下的目录中，因此如
        // // 果清除了node_modules，则缓存也是如此
        // cacheDirectory: "node_modules/.cache/hard-source/[confighash]",
        // // Either an absolute path or relative to webpack's options.context.
        // // Sets webpack's recordsPath if not already set.
        // recordsPath: "node_modules/.cache/hard-source/[confighash]/records.json",
        // // configHash在启动webpack实例时转换webpack配置，并用于cacheDirectory为不同的webpack配
        // // 置构建不同的缓存
        // configHash: function (webpackConfig) {
        //   // node-object-hash on npm can be used to build this.
        //   return require("node-object-hash")({ sort: false }).hash(webpackConfig);
        // },
        // // 当加载器，插件，其他构建时脚本或其他动态依赖项发生更改时，hard-source需要替换缓存以确保输
        // // 出正确。environmentHash被用来确定这一点。如果散列与先前的构建不同，则将使用新的缓存
        // environmentHash: {
        //   root: process.cwd(),
        //   directories: [],
        //   files: ["package-lock.json", "yarn.lock"],
        // },
        // }),

        // dll start dll配置 在服务端 DllPlugin 用不了没办法加载js, 只有客户端才能用
        // 运行DllPlugin配置文件
        // new WebpackBuildDllPlugin({
        //   // dllConfigPath: required, your Dll Config Path, support absolute path.
        //   dllConfigPath: path.join(__dirname, "./webpack.dll.config.js"),
        //   forceBuild: false,
        // }),

        //    告诉webpack使用了哪些第三方库代码
        // new webpack.DllReferencePlugin({
        //   // vue 映射到json文件上去
        //   manifest: path.join(process.cwd(), "/dist/dllFile", "vue.manifest.json"),
        // }),
        // dll end dll配置
        // //体积包分析插件
        // new BundleAnalyzerPlugin(),

        //AggressiveSplittingPlugin 可以将 bundle 拆分成更小的 chunk，
        //直到各个 chunk 的大小达到 option 设置的 maxSize。它通过目录结构将模块组织在一起。
        // new webpack.optimize.AggressiveSplittingPlugin({
        //   // minSize: 30720/2, // 字节，分割点。默认：30720
        //   // maxSize: 51200/2, // 字节，每个文件最大字节。默认：51200
        //   // chunkOverhead: 0, // 默认：0
        //   // entryChunkMultiplicator: 1, // 默认：1
        // }),

        // 在开发时自动安装缺少的依赖
        // new NpmInstallPlugin(),

        //友好的错误WebPACK插件 错误提示插件
        //友好的错误认识webpackerrors WebPACK插件类  这是很容易添加类型的错误，所以如果你想看moreerrors得到处理
        new FriendlyErrorsPlugin(),
        //这个Webpack插件将强制所有必需模块的整个路径与磁盘上实际路径的确切情况相匹配。
        // 使用此插件有助于缓解OSX上的开发人员不遵循严格的路径区分大小写的情况，
        // 这些情况将导致与其他开发人员或运行其他操作系统（需要正确使用大小写正确的路径）的构建箱发生冲突。
        new CaseSensitivePathsPlugin(),
        // 开启多进程
        // node
        new HappyPack({
            id: 'node',
            use: ['node-loader'],
            // 输出执行日志
            // verbose: true,
            // 使用共享线程池
            threadPool: happyThreadPool,
        }),
        // ts
        new HappyPack({
            id: 'ts',
            //添加loader
            use: [
                {
                    loader: 'ts-loader',
                    options: {
                        // cacheDirectory: true,
                    },
                },
            ],
            // 输出执行日志
            // verbose: true,
            // 使用共享线程池
            threadPool: happyThreadPool,
        }),

        // tsx
        new HappyPack({
            id: 'tsx',
            //添加loader
            use: [
                {
                    loader: 'awesome-typescript-loader',
                    options: {
                        // cacheDirectory: true,
                    },
                },
            ],
            // 输出执行日志
            // verbose: true,
            // 使用共享线程池
            threadPool: happyThreadPool,
        }),

        new HappyPack({
            id: 'rawLoader',
            use: [
                {
                    loader: 'raw-loader',
                    options: {},
                },
            ],
            // 输出执行日志
            // verbose: true,
            // 使用共享线程池
            threadPool: happyThreadPool,
        }),

        // 编译ts插件
        new CheckerPlugin(),
        // 编译进度条
        new WebpackBar(),
        // 编译进度条
        new ProgressPlugin({
            activeModules: true, // 默认false，显示活动模块计数和一个活动模块正在进行消息。
            entries: true, // 默认true，显示正在进行的条目计数消息。
            modules: false, // 默认true，显示正在进行的模块计数消息。
            modulesCount: 5000, // 默认5000，开始时的最小模块数。PS:modules启用属性时生效。
            profile: false, // 默认false，告诉ProgressPlugin为进度步骤收集配置文件数据。
            dependencies: false, // 默认true，显示正在进行的依赖项计数消息。
            dependenciesCount: 10000, // 默认10000，开始时的最小依赖项计数。PS:dependencies启用属性时生效。
        }),
        // //缓存包 热启动
        // new webpack.HotModuleReplacementPlugin(),
        //使用 NoEmitOnErrorsPlugin 来跳过输出阶段。这样可以确保输出资源不会包含错误
        new webpack.NoEmitOnErrorsPlugin(),
        //DefinePlugin 允许创建一个在编译时可以配置的全局常量。这可能会对开发模式和发布模式的构建允许不同的行为非常有用
        new ExtendedDefinePlugin({
            process: {
                env: {
                    WEB_ENV,
                    NODE_ENV, // 将属性转化为全局变量，让代码中可以正常访问
                },
            },
        }),

        // webpack.BannerPlugin 为每一个头文件添加一个文件，这里可以加入公共文件
        // source-map-support 源映射(Source Map)是一种数据格式，它存储了源代码和生成代码之间的位置映射关系。
        // new webpack.BannerPlugin({
        //   banner: 'require("source-map-support").install();',
        //   raw: true,
        //   entryOnly: false,
        // }),
    ],
};
