const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const webpack = require('webpack')
const dotenv = require('dotenv')

module.exports = merge(common, {
  mode: "production",
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(dotenv.config({ path: '.env.prod' }).parsed)
    })
  ]
});
