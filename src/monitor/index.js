import { injectJsError } from "./lib/jsError.js"; // 捕获js执行错误和promise错误监控
import { injectXHR } from "./lib/xhr.js"; // 请求异常监控
import { blankScreen } from "./lib/blankScreen"; // 白屏监控
import { timing } from "./lib/timing";
import { longTask } from "./lib/longTask";
import { pv } from "./lib/pv";

injectJsError();
injectXHR();
blankScreen();
timing();
longTask();
pv();
