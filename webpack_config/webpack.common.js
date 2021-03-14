global.window = {};
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");
const path = require("path");
const { HtmlParse } = require("elmer-virtual-dom");
const { getCommand } = require("elmer-common/lib/BaseModule/StaticCommon");
const parseObj = new HtmlParse();
const devMode = process.env.NODE_ENV !== 'production'
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
    // 使用 source-map
    devtool: 'source-map',
    resolve:{
        extensions: ['.ts', '.js', '.json']
    },
    plugins:[
        new webpack.DefinePlugin({
            ENV: JSON.stringify(getCommand(process.argv, "env"))
        }),
        new MiniCssExtractPlugin({
            filename: 'css/vendor.css',
            chunkFilename: 'css/app[name][contenthash:12].css',
            ignoreOrder: true
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
                        loader: "elmer-loader",
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
                        options: {
                            babelrc: false,
                            plugins: [
                                "@babel/plugin-transform-runtime",
                                ["@babel/plugin-proposal-decorators", { "legacy": true }],
                                ["@babel/plugin-proposal-class-properties", { "loose" : true }],
                                "@babel/plugin-syntax-dynamic-import"
                            ],
                            "presets": [
                                [
                                    "@babel/preset-env",
                                    {
                                        "modules": "commonjs",
                                        "targets": {
                                            "browsers": [
                                                "last 2 versions",
                                                "safari >= 7"
                                            ]
                                        }
                                    }
                                ]
                            ],
                        }
                    },
                    {
                        loader: 'ts-loader'
                    },
                    {
                        loader: "elmer-loader",
                        options: {
                            parse: function(source) {
                                return parseObj.parse(source);
                            }
                        }
                    }
                ]
            },{
                test:/\.css$/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: "./css",
                            esModule: false,
                            modules: {
                                namedExport: true
                            }
                        }
                    },
                    "css-loader",
                    'postcss-loader'
                ]
            },
            {
                test: /\.less$/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: "./css",
                            esModule: false,
                            modules: {
                                namedExport: true
                            }
                        }
                    },
                    "css-loader",
                    'postcss-loader',
                    'less-loader'
                ]
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
                        loader: "elmer-loader",
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
            }
        ]
    }
};