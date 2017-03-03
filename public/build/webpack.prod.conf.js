var path = require('path')
var config = require('../config')
var utils = require('./utils')
var webpack = require('webpack')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
    // var env = config.build.env
console.log("__dirname", __dirname);
var webpackConfig = merge(baseWebpackConfig, {
    watch: env.NODE_ENV == "production"||env.NODE_ENV == "test" ? false : true,
    module: {
        loaders: utils.styleLoaders({ sourceMap: true, extract: true })
    },
    devtool: '#source-map',
    output: {
        path: config.build.assetsRoot,
        filename: utils.assetsPath('js/[name].js'),
        chunkFilename: utils.assetsPath('js/[id].js')
            // filename: utils.assetsPath('js/[name].[chunkhash].js'),
            // chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
    },
    vue: {
        loaders: utils.cssLoaders({
            sourceMap: true,
            extract: true
        })
    },
    plugins: [
        // http://vuejs.github.io/vue-loader/en/workflow/production.html
        // new webpack.DefinePlugin({
        //   'process.env': env
        // }),
        // new webpack.optimize.UglifyJsPlugin({
        //   comments: false, 
        //   compress: {
        //     warnings: false
        //   }
        // }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        // extract css into its own file
        // new ExtractTextPlugin(utils.assetsPath('css/[name].[contenthash].css')),
        new ExtractTextPlugin(utils.assetsPath('css/[name].css')),
        // generate dist index.html with correct asset hash for caching.
        // you can customize output by editing /index.html
        // see https://github.com/ampedandwired/html-webpack-plugin
        // new HtmlWebpackPlugin({
        //   filename: config.build.index,
        //   template: 'index.html',
        //   inject: true,
        //   minify: {
        //     removeComments: true,
        //     collapseWhitespace: true,
        //     removeAttributeQuotes: true
        //     // more options:
        //     // https://github.com/kangax/html-minifier#options-quick-reference
        //   },
        //   // necessary to consistently work with multiple chunks via CommonsChunkPlugin
        //   chunksSortMode: 'dependency'
        // }),
        // split vendor js into its own file
        // new webpack.optimize.CommonsChunkPlugin({
        //   name: 'vendor',
        //   minChunks: function (module, count) {
        //     // any required modules inside node_modules are extracted to vendor
        //     return (
        //       module.resource &&
        //       /\.js$/.test(module.resource) &&
        //       module.resource.indexOf(
        //         path.join(__dirname, '../node_modules')
        //       ) === 0
        //     )
        //   }
        // }),
        // // extract webpack runtime and module manifest to its own file in order to
        // // prevent vendor hash from being updated whenever app bundle is updated
        // new webpack.optimize.CommonsChunkPlugin({
        //   name: 'manifest',
        //   chunks: ['vendor']
        // }),
        new webpack.optimize.CommonsChunkPlugin({
            name: ['core', 'vendor'],
            minChunks: 2
        })
    ]
})

if (env.NODE_ENV == "production") {
    // var CompressionWebpackPlugin = require('compression-webpack-plugin')

    // webpackConfig.plugins.push(
    //     new CompressionWebpackPlugin({
    //         asset: '[path].gz[query]',
    //         algorithm: 'gzip',
    //         test: new RegExp(
    //             '\\.(' +
    //             config.build.productionGzipExtensions.join('|') +
    //             ')$'
    //         ),
    //         threshold: 10240,
    //         minRatio: 0.8
    //     })
    // )
    webpackConfig.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            comments: false,
            compress: {
                warnings: false
            }
        }))
}

var pages = utils.getEntries('./src/template/**/*.ftl');
var folders = utils.getEntriesFolder('./src/template/**/*.ftl');

console.log(folders);

for (var page in pages) {
    var excludeChunks = Object.keys(pages).filter(item => {
        return (item != page)
    });
        // 配置生成的html文件，定义路径等
    var conf = {
            filename: folders[page] + '/' + page + '.ftl',
            template: pages[page], //模板路径
            // inject: folders[page].indexOf("pages")>-1?true:false,
            inject: false,
            hash: true,
            // excludeChunks 允许跳过某些chunks, 而chunks告诉插件要引用entry里面的哪几个入口
            // 如何更好的理解这块呢？举个例子：比如本demo中包含两个模块（index和about），最好的当然是各个模块引入自己所需的js，
            // 而不是每个页面都引入所有的js，你可以把下面这个excludeChunks去掉，然后npm run build，然后看编译出来的index.html和about.html就知道了
            // filter：将数据过滤，然后返回符合要求的数据，Object.keys是获取JSON对象中的每个key
            excludeChunks: excludeChunks
        }
        // 需要生成几个html文件，就配置几个HtmlWebpackPlugin对象
    webpackConfig.plugins.push(new HtmlWebpackPlugin(conf))
}
module.exports = webpackConfig