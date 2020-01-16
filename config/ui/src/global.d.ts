declare namespace ElmerUI {
    export interface IRouter {
        path: string | RegExp;
        props?: any;
        selector?: string;
    }
    export interface IElmerGlobal {
        title: string;
        auther: string;
        version: string;
        elmerState: any;
        components: any;
        resizeListeners: any;
        bindTempVars: any;
        $console: any;
        classPool: Function[];
        objPool?: any[];
        routers: IRouter[];
        createUI: Function;
        getUI: Function;
        declareComponent:Function;
        defineReduxProvider:Function;
        autowired:Function;
        Injectable: Function;
        propTypes:any;
        Component:Function;
        extends:ClassDecorator;
    }
}

declare var elmerData: ElmerUI.IElmerGlobal;

declare module "*.html" {
    const content: string;
    export default content;
}

// declare var require: NodeRequire;
// declare interface NodeRequire extends NodeJS.Require {
//   <T>(path: string): any;
// }

declare var UM:any;
