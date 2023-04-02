import userAgent from "user-agent"; // 浏览器信息
const host = "cn-guangzhou.log.aliyuncs.com"; // 日志服务的域名
const project = "voile"; //项目名
const logstore = "voile-store"; //日志库名

class SendTracker {
  send(data) {
    let extraData = {
      timestamp: Date.now(),
      userAgent: userAgent.parse(navigator.userAgent).name,
      userId: localStorage.getItem("userId") || "",
    };

    let log = { ...extraData, ...data };

    for (let key in log) {
      if (typeof log[key] !== "string") {
        log[key] = JSON.stringify(log[key]);
      }
    }

    this.sendBeacon(log); // 发送日志
  }

  sendBeacon(body) {
    let path = `https://${project}.${host}/logstores/${logstore}/track?APIVersion=0.6.0`;
    let headers = {
      Host: `${project}.${host}`,
    };

    body = {
      __logs__: [body],
      __tags__: { tags: "tags" },
      __topic__: "topic",
      __source__: "xyy-lz",
    };

    const blob = new Blob([JSON.stringify(body)], headers);
    navigator.sendBeacon(path, blob);
  }
}

export default new SendTracker();
