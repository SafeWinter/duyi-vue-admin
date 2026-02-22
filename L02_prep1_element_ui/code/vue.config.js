module.exports = {
  lintOnSave: false,
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      // 在这里设置你想要的项目标题
      args[0].title = "S18L02 - Element UI 入门";
      return args;
    });
  },
};
