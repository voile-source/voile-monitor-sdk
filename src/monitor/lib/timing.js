import onload from "../utils/onload.js";
import tracker from "../utils/tracker.js";
import { formatTime } from "../utils/formatTime.js";
import getLastEvent from "../utils/getLastEvent.js";
import getSelector from "../utils/getSelector.js";

export function timing() {
  console.log(performance.getEntriesByType("navigation"));
  let FMP, LCP;
  new PerformanceObserver((entryList, observer) => {
    // 性能监听
    let perfEntries = entryList.getEntries(); // 绘制的性能指标数组
    FMP = perfEntries[0];
    observer.disconnect(); // 干掉监听
  }).observe({ entryTypes: ["element"] }); // 监听类型， element 代表有意义的绘制
  new PerformanceObserver((entryList, observer) => {
    const perfEntries = entryList.getEntries();
    const lastEntry = perfEntries[perfEntries.length - 1];
    LCP = lastEntry;
    observer.disconnect();
  }).observe({ entryTypes: ["largest-contentful-paint"] });
  new PerformanceObserver(function (entryList, observer) {
    // 首次用户点击触发这里
    let lastEvent = getLastEvent(); // 最后操作的日志
    const firstInput = entryList.getEntries()[0];
    if (firstInput) {
      let inputDelay = firstInput.processingStart - firstInput.startTime; //处理延迟
      let duration = firstInput.duration; //处理耗时
      if (firstInput > 0 || duration > 0) {
        tracker.send({
          kind: "experience",
          type: "firstInputDelay",
          inputDelay: inputDelay ? formatTime(inputDelay) : 0,
          duration: duration ? formatTime(duration) : 0,
          startTime: firstInput.startTime,
          selector: lastEvent
            ? getSelector(lastEvent.path || lastEvent.target)
            : "",
        });
      }
    }
    observer.disconnect();
  }).observe({ type: "first-input", buffered: true });

  onload(function () {
    setTimeout(() => {
      const {
        fetchStart,
        connectStart,
        connectEnd,
        requestStart,
        responseStart,
        responseEnd,
        domInteractive,
        domContentLoadedEventStart,
        domContentLoadedEventEnd,
        loadEventStart,
      } = performance.getEntriesByType("navigation")[0];
      console.log(performance.getEntriesByType("navigation")[0]);
      tracker.send({
        kind: "experience",
        type: "timing",
        connectTime: formatTime(connectEnd - connectStart), //TCP连接耗时
        ttfbTime: formatTime(responseStart - requestStart), //ttfb
        responseTime: formatTime(responseEnd - responseStart), //Response响应耗时
        parseDOMTime: formatTime(domInteractive), //DOM解析渲染耗时
        domContentLoadedTime: formatTime(
          domContentLoadedEventEnd - domContentLoadedEventStart
        ), //DOMContentLoaded事件回调耗时
        timeToInteractive: formatTime(domInteractive - fetchStart), //首次可交互时间
        loadTime: formatTime(loadEventStart - fetchStart), //完整的加载时间
      });
      const FP = performance.getEntriesByName("first-paint")[0];
      const FCP = performance.getEntriesByName("first-contentful-paint")[0];
      console.log({
        kind: "experience",
        type: "paint",
        firstPaint: FP ? formatTime(FP.startTime) : 0,
        firstContentPaint: FCP ? formatTime(FCP.startTime) : 0,
        firstMeaningfulPaint: FMP ? formatTime(FMP.startTime) : 0,
        largestContentfulPaint: LCP
          ? formatTime(LCP.renderTime) || formatTime(LCP.loadTime)
          : 0,
      });
      tracker.send({
        kind: "experience",
        type: "paint",
        firstPaint: FP ? formatTime(FP.startTime) : 0,
        firstContentPaint: FCP ? formatTime(FCP.startTime) : 0,
        firstMeaningfulPaint: FMP ? formatTime(FMP.startTime) : 0,
        largestContentfulPaint: LCP
          ? formatTime(LCP.renderTime) || formatTime(LCP.loadTime)
          : 0,
      });
    }, 3000);
  });
}
