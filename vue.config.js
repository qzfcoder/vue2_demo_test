/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      fallback: {
        path: require.resolve('path-browserify'),
      },
    },
  },
  chainWebpack: (config) => {
    // 修改项目名称
    config.plugin('html').tap((args) => {
      args[0].title = 'vue2初始模板'; // 项目名称
      return args;
    });
    // 配置别名后需要重启项目
    config.resolve.alias.set('@', path.resolve('src'));
    // twig rule loader
    const twigRule = config.module.rule('twig');
    twigRule.exclude.add(/node_modules/);
    // 添加新的loader处理
    twigRule
      .test(/\.twig$/)
      .use('twig-loader')
      .loader('twig-loader')
      .end();
  },
  publicPath: './',
});
