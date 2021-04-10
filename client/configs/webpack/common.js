const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Webpack = require("webpack");

module.exports = {
  context: resolve(__dirname, "../../src"),
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    modules: [resolve(__dirname, "../../src"), "node_modules"]
  },
  output: {
    path: resolve(__dirname, 'dist'),
    filename: '[name].[fullhash].bundle.js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(scss|sass)$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          "file-loader?hash=sha512&digest=hex&name=img/[contenthash].[ext]",
          "image-webpack-loader?bypassOnDebug&optipng.optimizationLevel=7&gifsicle.interlaced=false",
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: '../public/index.html',
      filename: './index.html',
      favicon: '../public/favicon.ico'
    }),
    new Webpack.ProvidePlugin({
      "React": "react",
    }),
  ],
  performance: {
    hints: false,
  },
};