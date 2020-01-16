import { ElmerUI, WindowResizeListen } from "elmer-ui-core";

// // dd

window.onload = ()=> {
    const ui = new ElmerUI();
    const indexData = {
        num1:11,
        num2:33,
        exProps: {
            title: "linke",
            before: "sdd"
        }
    };
    typeof window["debug"] === "function" && window["debug"](false);
    let wResizeListen = new WindowResizeListen();
    let htmlCode = require("./app/views/index.html");
    wResizeListen.listen();
    // tslint:disable-next-line:no-console
    console.time("ElmerRender");
    ui.render(document.getElementById("app"), htmlCode, indexData);
    htmlCode = null;
    wResizeListen = null;
    // tslint:disable-next-line:no-console
    console.timeEnd("ElmerRender");
};
