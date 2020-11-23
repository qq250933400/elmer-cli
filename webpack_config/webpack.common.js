global.window = {};
const htmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextWebpackPlugin = require("extract-text-webpack-plugin");
const webpack = require("webpack");
const path = require("path");
const { HtmlParse } = require("elmer-virtual-dom");
const { getCommand } = require("elmer-common/lib/BaseModule/StaticCommon");
const parseObj = new HtmlParse();
// 对babel的配置，内容同.babelrc文件
const babelOptions = {
    "presets": [
        ["env", {
            "targets": {
                "browsers": ["last 2 versions", "safari >= 7"]
            }
        }]
    ]
}

module.exports = {
    devtool: "source-map",
    resolve:{
        extensions: ['.ts', '.js', '.json']
    },
    plugins:[
        new webpack.DefinePlugin({
            ENV: JSON.stringify(getCommand(process.argv, "env"))
        }),
        new ExtractTextWebpackPlugin('css/style[chunkhash:8].css', {
            allChunks: false
        }),
        new webpack.DefinePlugin({
            template: function(path){
                return require(path);
            }
        })
    ],
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                enforce: 'pre',
                use: [
                    {loader: 'tslint-loader'}
                ]
            },{
                test: /\.js$/,
                use: [
                    { loader: "babel-loader"},
                    {
                        loader: path.resolve("./node_modules/elmer-loader/lib/loader/TPLoader.js"),
                        options: {
                            parse: function(source) {
                                return parseObj.parse(source);
                            }
                        }
                    }
                ]
            },
            {
                test: /\.ts$/,
                use: [
                    {
                        loader: 'babel-loader',
                    },
                    {
                        loader: 'ts-loader'
                    },
                    {
                        loader: path.resolve("./node_modules/elmer-loader/lib/loader/TPLoader.js"),
                        options: {
                            parse: function(source) {
                                return parseObj.parse(source);
                            }
                        }
                    }
                ]
            },{
                test:/\.css$/i,
                use: ExtractTextWebpackPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        "css-loader",
                        'postcss-loader'
                    ],
                    filename: "[name][hash:8].css"
                })
            },
            {
                test: /\.less$/i,
                use: ExtractTextWebpackPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        "css-loader",
                        'postcss-loader',
                        'less-loader'
                    ],
                    filename: "[name][hash:8].css"
                })
            },{
                test: /\.(woff|woff2|ttf|eot)/,
                use: [
                    {loader: 'url-loader?limit=400&outputPath=font/&publicPath=../font/'}
                ]
            },{
                test: /\.(jpg|bmp|gif|png|svg)/,
                use: [
                    {loader: 'url-loader?limit=400&outputPath=img/&publicPath=../img/'}
                ]
            },
            {
                test: /\.(html|htm)$/i,
                use : [
                    {
                        loader: path.resolve("./node_modules/elmer-loader/lib/loader/HtmlLoader.js"),
                        options: {
                            parse: function(source) {
                                return parseObj.parse(source);
                            }
                        }
                    }
                ]
            },
            {
                test: /\.d\.ts$/,
                loader: 'ignore-loader'
            }, {
                test: /\.js$/,
                loader: "babel-loader"
            }
        ]
    }
};