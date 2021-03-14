type TypeLoadableOptions = {
    loader: Function;
    loading?: Function;
};

export const Loadable = (options: TypeLoadableOptions):Function => {
    return () => {
        let fn = null;
        const obj = {
            done: (fnArg) => {
                fn = fnArg;
            }
        }
        if(typeof options.loader === "function") {
            console.log("---开始执行请求------");
            options.loader().then((resp:any) => {
                if(resp['__esModule']) {
                    console.log(resp.default);
                    typeof fn === "function" && fn(resp.default);
                }
            }).catch((err) => {
                console.error(err);
            });
        }
        return obj;
    };
}
