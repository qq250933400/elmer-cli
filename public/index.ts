
import { Common } from "elmer-common";
import { Loadable } from "./Loadable";
import "./styles.less";

const connect = () => {
    return (Factory:Function) => {
        Factory.prototype.inject = true;
    }
}

const TestAysncApp = Loadable({
    loader: () => import(/* webpackChunkName: "AsyncApp" */"./AsyncApp")
});


@connect()
class TestFactory extends Common {
    add(a:number,b:number): number {
        const obj = TestAysncApp();
        obj.done((TestApp) => {
            console.log((new TestApp()).run());
        })
        return (a + b) * 1.3;
    }
}
const demo = () => {
    const b = new TestFactory();
    console.log("demo", b.add(33,2));
}

window.onload = function() {
    console.log("Cli run success");
    demo();
}
