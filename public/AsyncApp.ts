import BasePlugin from "./BasePlugin";
import "./test.less";

console.log(this);

export default class AsyncApp extends BasePlugin {
    run() {
        super.run();
        console.log("run in AsyncApp");
    }
}
