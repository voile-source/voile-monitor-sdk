import tracker from "../utils/tracker";

export function pv() {
  let startTime;

  // 针对 vue 阻止默认事件，实现路由切换上报 pv
  window.montorInstall = (router) => {
    return {
      install(_Vue) {
        let startTime = null; // 浏览开始时间 首次为null

        router.beforeEach((to, from, next) => {
          if (to.path) {
            const connection = navigator.connection;

            console.log(to, "to.path");
            if (startTime) {
              // 上报停留时间
              let stayTime = Date.now() - startTime;

              tracker.send({
                kind: "business",
                type: "stayTime",
                stayTime,
                stayPage: from.fullPath, // 停留的页面
              });
            }

            tracker.send({
              kind: "business",
              type: "pv",
              effectiveType: connection.effectiveType, //网络环境
              pathname: to.path,
              rtt: connection.rtt, //往返时间
              screen: `${window.screen.width}x${window.screen.height}`, //设备分辨率
            });
          }

          startTime = Date.now();
          next();
        });
      },
    };
  };

  window.addEventListener("load", function () {
    startTime = Date.now();
    const connection = navigator.connection;

    tracker.send({
      kind: "business",
      type: "pv",
      pathname: location.pathname,
      effectiveType: connection.effectiveType, //网络环境
      rtt: connection.rtt, //往返时间
      screen: `${window.screen.width}x${window.screen.height}`, //设备分辨率
    });
  });

  window.addEventListener(
    "unload",
    () => {
      let stayTime = Date.now() - startTime;

      tracker.send({
        kind: "business",
        type: "stayTime",
        stayTime,
      });
    },
    false
  );
}
