const path = require("path");
const webpack = require("webpack");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const mode = process.env.NODE_ENV || "development";
const prod = mode === "production";

module.exports = {
  entry: {
    bundle: ["./src/main.js"]
  },
  resolve: {
    alias: {
      svelte: path.resolve("node_modules", "svelte")
    },
    extensions: [".mjs", ".js", ".svelte"],
    mainFields: ["svelte", "browser", "module", "main"]
  },
  output: {
    path: __dirname + "/public",
    filename: "[name].js",
    chunkFilename: "[name].[id].js"
  },
  module: {
    rules: [
      {
        test: /\.svelte$/,
        use: {
          loader: "svelte-loader",
          options: {
            emitCss: true,
            hotReload: true
          }
        }
      },
      {
        test: /\.less$/,
        use: [
          prod ? MiniCssExtractPlugin.loader : "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: true,
              sourceMap: true,
              importLoaders: 1
            }
          },
          {
            loader: "less-loader"
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          /**
           * MiniCssExtractPlugin doesn't support HMR.
           * For developing, use 'style-loader' instead.
           * */
          prod ? MiniCssExtractPlugin.loader : "style-loader",
          "css-loader"
        ]
      }
    ]
  },
  mode,
  optimization: prod
    ? {
        minimize: true,
        runtimeChunk: false,
        minimizer: [
          new OptimizeCSSAssetsPlugin({
            cssProcessorOptions: {
              preset: [
                "advanced",
                {
                  zindex: false,
                  mergeIdents: false,
                  reduceIdents: false,
                  discardUnused: false
                }
              ]
            },
            canPrint: true
          }),
          new TerserPlugin()
        ]
      }
    : {},
  plugins: [
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new MiniCssExtractPlugin({
      filename: "[name].css"
    })
  ],
  devtool: prod ? false : "source-map"
};
