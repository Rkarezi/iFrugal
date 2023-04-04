const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",

  output: {
    path: path.join(__dirname, "/dist"),
    filename: "bundle.js",
    publicPath: "/",
  },

  plugins: [
    new HTMLWebpackPlugin({
      template: "./src/index.html",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(gif|svg|jpg|png|jpeg|webp)$/,
        loader: "file-loader",
      },
    ],
  },
  resolve: {
    fallback: {
      https: "https-browserify",
      querystring: "querystring-es3",
      url: "url/",
      http: "stream-http",
      buffer: "buffer/",
      stream: "stream-browserify",
    },
  },

  devServer: {
    historyApiFallback: true,
  },
};
