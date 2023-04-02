// screen.width  屏幕的宽度   screen.height 屏幕的高度
// window.innerWidth 去除工具条与滚动条的窗口宽度 window.innerHeight 去除工具条与滚动条的窗口高度
import tracker from "../utils/tracker.js";
import onload from "../utils/onload.js";

function getSelector(element) {
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
    selector = element.nodeName.toLowerCase();
  }
  return selector;
}
export function blankScreen() {
  const wrapperSelectors = ["body", "html", "#container", ".content"]; // 最外层元素的包裹元素，我们认为它是空元素且不让其参与计数
  let emptyPoints = 0;

  function isWrapper(element) {
    // 是否为空元素
    let selector = getSelector(element);
    if (wrapperSelectors.indexOf(selector) >= 0) {
      emptyPoints++;
    }
  }

  onload(function () {
    let xElements, yElements;

    for (let i = 1; i <= 9; i++) {
      xElements = document.elementsFromPoint(
        (window.innerWidth * i) / 10,
        window.innerHeight / 2
      );
      yElements = document.elementsFromPoint(
        window.innerWidth / 2,
        (window.innerHeight * i) / 10
      );

      isWrapper(xElements[0]); // 0 代表最内层的元素
      isWrapper(yElements[0]);
    }

    console.log(emptyPoints, "空元素个数");
    if (emptyPoints >= 14) {
      // 空元素大于14 上报
      let centerElements = document.elementsFromPoint(
        window.innerWidth / 2,
        window.innerHeight / 2
      ); // 中心最内层元素

      tracker.send({
        kind: "stability",
        type: "blank",
        emptyPoints: "" + emptyPoints,
        screen: window.screen.width + "x" + window.screen.height,
        viewPoint: window.innerWidth + "x" + window.innerHeight,
        selector: getSelector(centerElements[0]),
      });
    }
  });
}
