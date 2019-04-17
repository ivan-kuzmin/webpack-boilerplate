const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const CopyPlugin = require('copy-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = (env, options) => {
  const devMode = options.mode !== 'production';
  const buildDir = 'build';

  return {
    entry: {
      main: './src/index.js',
    },
    output: {
      path: path.resolve(__dirname, buildDir),
      filename: devMode ? '[name].js' : '[name].[hash].js',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          include: path.resolve(__dirname, 'src/js'),
          loader: 'babel-loader',
          options: {
            compact: true,
          },
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: devMode,
              },
            },
            'css-loader',
            'postcss-loader',
            'sass-loader',
          ],
        },
        {
          test: /\.(png|svg|jpg|gif|webmanifest|ico)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: devMode ? '[name].[ext]' : '[name].[hash].[ext]',
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: devMode ? '[name].css' : '[name].[hash].css',
      }),
      new HtmlWebpackPlugin({
        inject: false,
        hash: true,
        minify: !devMode && {
          collapseWhitespace: true, // https://github.com/kangax/html-minifier#options-quick-reference
        },
        template: './src/index.html',
        filename: 'index.html',
      }),
      // new CopyPlugin([{}]),
    ],
    stats: {
      entrypoints: false,
      children: false,
    },
    devtool: 'source-map',
    devServer: {
      contentBase: buildDir,
      compress: true,
      port: 9000,
      stats: 'minimal',
    },
    optimization: {
      minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
    },
  };
};
