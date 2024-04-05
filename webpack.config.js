const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { webpack, DefinePlugin } = require("webpack");

module.exports = {
	entry: path.resolve(__dirname, "src/index.tsx"),
	output: {
		path: path.resolve(__dirname, "build"),
		filename: "bundle.js",
		clean: true,
	},
	devServer: {
		port: 7070,
		open: true,
		hot: true,
		static: {
			directory: path.resolve(__dirname, "dist"),
		}
	},
	resolve: {
		modules: [path.join(__dirname, "src"), "node_modules"],
		alias: {
			react: path.join(__dirname, "node_modules", "react"),
		},
		extensions: [".tsx", ".ts", ".js", ".jsx"]
	},
	plugins: [
		new HtmlWebpackPlugin({
			filename: "index.html",
			template: "./src/index.html",
		}),
		new DefinePlugin({
			"process.env.TOKEN": JSON.stringify(process.env.TOKEN),
		})
	],
	module: {
		rules: [
			{
				test: /\.(ts|tsx)$/,
				exclude: /node_modules/,
				use: "ts-loader",
			},
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: [
							"@babel/preset-env",
							"@babel/preset-react",
							"@babel/preset-typescript",
						],
					},
				},
			},
			{
				test: /\.css$/i,
				use: ["style-loader", "css-loader", "postcss-loader"],
			},
			{
				test: /\.(woff|woff2)$/i,
				type: "asset/resource",
			},
		]
	}
};