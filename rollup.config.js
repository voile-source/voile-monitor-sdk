import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import strip from "@rollup/plugin-strip";

export default {
  input: "./src/index.js", // 打包入口
  output: {
    // 打包出口
    file: "dist/index.js", // 最终打包出来的文件路径和文件名，这里是在package.json的browser: 'dist/index.js'字段中配置的
    format: "es", // umd是兼容amd/cjs/iife的通用打包格式，适合浏览器
  },
  plugins: [
    // 打包插件
    resolve(), // 查找和打包node_modules中的第三方模块
    commonjs(), // 将 CommonJS 转换成 ES2015 模块供 Rollup 处理
    strip(), // 清除项目中的调试代码
  ],
};
