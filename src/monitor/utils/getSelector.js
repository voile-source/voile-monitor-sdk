const getSelector = function (path) {
  return path
    .reverse()
    .filter(function (element) {
      return element !== window && element !== document;
    })
    .map(function (element) {
      var selector;
      if (element.id) {
        selector = `#${element.id}`;
      } else if (element.className && typeof element.className === "string") {
        selector =
          "." +
          element.className
            .split(" ")
            .filter(function (item) {
              return !!item;
            })
            .join(".");
      } else {
        selector = element.nodeName;
      }
      return selector;
    })
    .join(" ");
};
export default function (pathsOrTarget) {
  if (Array.isArray(pathsOrTarget)) {
    // 获取 js 报错操作的最后一个按钮数据
    return getSelector(pathsOrTarget);
  } else {
    // 针对资源加载错误的情况，获取错误资源的script或者link标签路径
    let paths = [];
    let element = pathsOrTarget;
    while (element) {
      paths.push(element);
      element = element.parentNode;
    }
    return getSelector(paths);
  }
}
