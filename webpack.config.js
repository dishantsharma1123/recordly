const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/extension.ts",
  output: {
    filename: "extension.js",
    path: path.resolve(__dirname, "out"),
    libraryTarget: "commonjs2",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  target: "node",
  externals: {
    vscode: "commonjs vscode", // Ignore VS Code's own modules
  },
};
