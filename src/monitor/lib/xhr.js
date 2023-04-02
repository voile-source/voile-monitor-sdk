  import tracker from "../utils/tracker.js";
  export function injectXHR() {
    const XMLHttpRequest = window.XMLHttpRequest;
    const oldOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url, async) {
      if (!url.match(/logstores/) && !url.match(/sockjs/)) {
        this.logData = {
          method,
          url,
          async,
        };
      }
      return oldOpen.apply(this, arguments);
    };

    let oldSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.send = function (body) {
      if (this.logData) {
        let start = Date.now();
        let handelr = (type) => (event) => {
          let duration = Date.now - start;
          let status = this.status;
          let statusText = this.statusText;

          tracker.send({
            // 未捕获的promise错误
            kind: "stability",
            type: "xhr",
            eventType: type,
            pathname: this.logData.url,
            status: status + "-" + statusText,
            duration: "" + duration,
            response: this.response ? JSON.stringify(this.response) : "",
            params: body || "",
          });
        };

        this.addEventListener("load", handelr("load"), false);
        this.addEventListener("error", handelr("error"), false);
        this.addEventListener("abort", handelr("abort"), false);
      }
      oldSend.apply(this, arguments);
    };
  }
