const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  context: process.cwd(),
  mode: "development", // 不会压缩，有利于分析打包代码
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "monitor.js",
  },
  devServer: {
    static: path.join(__dirname, "dist"), // 静态文件目录
    setupMiddlewares(middlewares, devServer) {
      devServer.app.get('/success', function(req, res) {
        res.json({id: 1});
      });

      return middlewares;
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      inject: "head", // 注入 monitor.js 的位置，这里 js 要注入到上方 head 标签内部，先于 body 后注入的 js 执行
    }),
  ],
};
