// https://github.com/shelljs/shelljs
require('./check-versions')()
require('shelljs/global')
var optimist =require('optimist');
var NODE_ENV=optimist.argv.env||'dev';
env.NODE_ENV = NODE_ENV;
console.log("NODE_ENV",env.NODE_ENV);
var path = require('path')
var config = require('../config')
var ora = require('ora')
var webpack = require('webpack')
var webpackConfig = require('./webpack.prod.conf')

var spinner = ora('building for production...')
spinner.start()

var assetsPath = path.join(config.build.assetsRoot, config.build.assetsSubDirectory)
rm('-rf', assetsPath)
rm('-rf', path.join(config.build.assetsRoot,'/template'))
mkdir('-p', assetsPath)
// cp('-R', 'static/*', assetsPath)
// cp('-R', 'images/*', assetsPath)
// cp('favicon.ico', assetsPath)
webpack(webpackConfig, function (err, stats) {
  spinner.stop()
  if (err) throw err
  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }) + '\n')
})
