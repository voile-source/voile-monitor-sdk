let lastEvent; // 记录最后一个操作的事件的事件对线

["click", "touchstart", "mousedown", "keydown", "mouseover"].forEach(function (
  eventType
) {
  document.addEventListener(
    eventType,
    function (event) {
      lastEvent = event;
    },
    {
      capture: true, // 捕获阶段执行
      passive: true, // 不阻止默认行为
    }
  );
});

export default function () {
  return lastEvent;
}
