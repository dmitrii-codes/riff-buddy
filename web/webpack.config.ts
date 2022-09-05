import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { Configuration } from "webpack";

const config: Configuration = {
    mode: "production",
    entry: "./app/index.tsx",
    watchOptions: {
        poll: true,
        ignored: /node_modules/,
    },
    module: {
        rules: [
            {
                test: /\.(jpg|png|svg|gif)$/,
                type: "asset/resource",
            },
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    optimization: {
        usedExports: true,
        minimize: true,
        splitChunks: {
            cacheGroups: {
                vendor: {
                    name: "vendors",
                    test: /[\\/]node_modules[\\/]/,
                    chunks: "all",
                },
            },
        },
    },
    output: {
        path: path.resolve(__dirname, "static/"),
        publicPath: "static/",
        filename: "[name].js",
        chunkFilename: "[id].[chunkhash].js",
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "./app/index.html"),
        }),
    ],
};

export default config;
