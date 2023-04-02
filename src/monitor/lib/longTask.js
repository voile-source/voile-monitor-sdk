import tracker from "../utils/tracker";
import { formatTime } from "../utils/formatTime";
import getLastEvent from "../utils/getLastEvent.js";
import getSelector from "../utils/getSelector";

export function longTask() {
  new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry.duration > 100) {
        let lastEvent = getLastEvent();

        requestIdleCallback(() => {
          tracker.send({
            kind: "experience",
            type: "longTask",
            eventType: lastEvent ? lastEvent.type : "any",
            startTime: formatTime(entry.startTime),
            duration: formatTime(entry.duration),
            selector: lastEvent
              ? getSelector(lastEvent.path || lastEvent.target)
              : "",
          });
        });
      }
    });
  }).observe({ entryTypes: ["longtask"] });
}
