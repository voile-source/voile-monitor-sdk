import getLastEvent from "../utils/getLastEvent.js";
import getSeletor from "../utils/getSelector.js";
import tracker from "../utils/tracker.js";

export function injectJsError() {
  window.addEventListener(
    "error",
    function (event) {
      console.log("on js error", event);
      let lastEvent = getLastEvent(); // 获取最后一个操作的事件对象

      if (event.target && (event.target.src || event.target.href)) {
        // 脚本加载错误
        console.log("脚本加载错误");
        tracker.send({
          kind: "stability", // 监控指标的大类 这里代表稳定性相关的监控指标
          type: "error", // 小类型 这是一个错误
          errorType: "resourceError", // 资源加载错误
          filename: event.target.src || event.target.href, // 访问的文件名，这里指资源路径
          tagName: event.target.tagName, // 标签名
          selector: getSeletor(event.target), // 传入 event.target 去获取到对应的加载元素 > html body script
        });
      } else {
        // js运行错误
        tracker.send({
          kind: "stability", // 监控指标的大类，这里代表稳定性相关的监控指标
          type: "error", // 类型，这里是一个错误
          errorType: "jsError", // js 执行错误
          message: event.message, // 报错信息
          filename: event.filename, // 访问的文件名
          position: `${event.lineno}:${event.colno}`, // 行列信息
          stack: getLines(event.error.stack), // 堆栈信息
          selector: lastEvent ? getSeletor(lastEvent.path) : "", // 代表最后一个操作的元素 -> 'html body div#container div.contentinput'
        });
      }
    },
    true
  );

  window.addEventListener(
    "unhandledrejection",
    function (event) {
      console.log("unhandledrejection", event);
      const lastEvent = getLastEvent();
      let message;
      let reason = event.reason;
      let filename;
      let line;
      let column;
      let stack = "";

      if (typeof reason === "string") {
        message = reason;
      } else if (typeof reason === "object") {
        if (reason.stack) {
          let matchResult = reason.stack.match(/at\s+(.+):(\d+):(\d+)/);

          filename = matchResult[1];
          line = matchResult[2];
          column = matchResult[3];
          stack = getLines(reason.stack);
        }
        message = reason.message;
      }

      tracker.send({
        kind: "stability", // 监控指标的大类 这里代表稳定性相关的监控指标
        type: "error", // 小类型 这是一个错误
        errorType: "promiseError", // promise 错误
        message, // 报错信息
        filename, // 访问的文件名
        position: `${line}:${column}`, // 行列信息
        stack: stack, // 堆栈信息
        selector: lastEvent ? getSeletor(lastEvent.path) : "", // 代表最后一个操作的元素 -> 'html body div#container div.content input'
      });
    },
    true
  );

  // 格式化错误堆栈信息
  function getLines(stack) {
    // 'TypeError: Cannot set properties of undefined (setting 'error')
    // at errorClick (http://localhost:8080/:19:34)
    // at HTMLInputElement.onclick (http://localhost:8080/:12:78)'
    // 变成
    //  'errorClick (http://localhost:8080/:19:34)^HTMLInputElement.onclick (http://localhost:8080/:12:78)'
    return stack
      .split("\n")
      .slice(1)
      .map((item) => item.replace(/^\s+at\s+/g, "").replace(/^(\S+\s+){4}/, ""))
      .join("^");
  }
}
