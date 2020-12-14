
import { Common } from "elmer-common";

class TestFactory extends Common {
    add(a:number,b:number): number {
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