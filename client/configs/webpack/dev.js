const { merge } = require("webpack-merge");
const webpack = require("webpack");
const commonConfig = require("./common");

module.exports = merge(commonConfig, {
  mode: "development",
  entry: {
    main: ['@babel/polyfill', './index'],
  },
  devServer: {
    hot: true, 
    port: 3000,
    historyApiFallback: true,
    proxy: { "/gql": { target: 'http://localhost:5000', secure: false }  },
  },
  devtool: "cheap-module-source-map",
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
});