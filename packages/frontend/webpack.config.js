const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const webpack = require("webpack");
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
    output: {
        filename: "index.js",
        path: path.resolve(__dirname, "dist"),
    },

    mode: process.env.NODE_ENV === "production" ? "production" : "development",

    devServer: {
        contentBase: path.resolve(__dirname, "src"),
        compress: true,
        hot: true,
        inline: true,
        host: process.env.DEV_ADDRESS || "0.0.0.0",
        port: 3001,
        stats: {
            colors: true,
            builtAt: false,
            entrypoints: false,
            hash: false,
            version: false,
            timings: false,
            assets: false,
            chunks: false,
            modules: false,
            children: false,
            source: false,
            warnings: false,
            publicPath: false,
        },
    },

    devtool: process.env.NODE_ENV === "production" ? "production" : "source-map",

    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                include: path.resolve(__dirname, "src"),
                exclude: /node_modules/,
                use: [
                    {
                        loader: "react-hot-loader/webpack",
                    },
                    {
                        loader: "ts-loader",
                        options: {
                            experimentalWatchApi: true,
                        },
                    },
                ],
            },
            {
                test: /\.module.s(a|c)ss$/,
                include: path.resolve(__dirname, "src"),
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: require.resolve("@out-of-step/scss-modules"),
                    },
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 1,
                            modules: {
                                mode: "local",
                                localIdentName: "[path][name]__[local]__[hash:base64:10]",
                                exportLocalsConvention: "camelCaseOnly",
                            },
                            sourceMap: true,
                        },
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: false,
                        },
                    },
                ],
            },
            {
                test: /\.s(a|c)ss$/,
                include: path.resolve(__dirname, "src"),
                exclude: /\.module.s(a|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: false,
                        },
                    },
                ],
            },
            {
                test: /\.css$/,
                exclude: /\.s(a|c)ss$/,
                include: path.resolve(__dirname, "src"),
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
            {
                type: "javascript/auto",
                test: /\.json$/,
                include: path.resolve(__dirname, "src"),
                exclude: /node_modules/,
                loader: "file-loader",
                options: {
                    name: "[name].[ext]",
                },
            },
        ],
    },

    plugins: [
        new HtmlWebpackPlugin({
            filename: "index.html",
            // favicon: path.resolve(__dirname, "public/favicon.ico"),
            meta: {
                copyright: "Copyright 2020",
                description: "Play out of step, a collaborative puzzle room.",
                "og:title": "out of step",
                // "og:image": path.resolve(__dirname, "public/og-image.png"),
                title: "out of step.",
                viewport: "width=device-width, initial-scale=1.0",
            },
            template: "./src/index.html",
        }),
        new MiniCssExtractPlugin({
            filename: process.env.NODE_ENV === "production" ? "main-[hash].css" : "main.css",
            chunkFilename: process.env.NODE_ENV === "production" ? "[id].css" : "[id].[hash].css",
        }),
        new webpack.ProvidePlugin({ process: path.resolve(__dirname, "shims/process") }),
        new webpack.optimize.AggressiveMergingPlugin(),
        ...(process.env.NODE_ENV === "production"
            ? [
                  new CompressionPlugin({
                      filename: "[path].gz[query]",
                      algorithm: "gzip",
                      test: /\.js$|\.css$|\.html$|\.json$/,
                      threshold: 10240,
                      deleteOriginalAssets: true,
                      minRatio: 0.8,
                  }),
              ]
            : [new BundleAnalyzerPlugin({ analyzerMode: "static", openAnalyzer: false })]),
    ],

    resolve: {
        extensions: [".js", ".ts", ".tsx", ".scss", ".json"],
    },

    externals: {
        react: "React",
        "react-dom": "ReactDOM",
    },
};
