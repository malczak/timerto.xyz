const path = require("path");
const webpack = require("webpack");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const Purgecss = require("@fullhuman/postcss-purgecss");

const mode = process.env.NODE_ENV || "development";
const prod = mode === "production";
console.log(`🏗  Building' for '${mode}'`);

const purgecss = new Purgecss({
  content: [`./**/*.svelte`],
  rejected: true,
  defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
});

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
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              ident: "postcss",
              plugins: [
                require("tailwindcss"),
                require("autoprefixer"),
                ...(prod ? [purgecss] : [])
              ]
            }
          }
        ]
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: "file-loader",
            options: {
              limit: 4096,
              name: "assets/[name]-[sha512:hash:base64:7].[ext]"
            }
          }
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
