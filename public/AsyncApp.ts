import BasePlugin from "./BasePlugin";

export default class AsyncApp extends BasePlugin {
    run() {
        super.run();
        console.log("run in AsyncApp");
    }
}
