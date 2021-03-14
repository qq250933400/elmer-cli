import BasePlugin from "./BasePlugin";
import "./test.less";

export default class AsyncApp extends BasePlugin {
    run() {
        super.run();
        console.log("run in AsyncApp");
    }
}
