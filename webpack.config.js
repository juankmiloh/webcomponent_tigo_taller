const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const folderName = 'src';

const createBanner = (CONFIG, environment) => {
  const today = new Date();
  const dd = today.getDate();
  const mm = today.getMonth() + 1;
  const yyyy = today.getFullYear();
  return `
  * 
  *   Name: ${CONFIG.name}
  *   Version: ${CONFIG.version}
  *   Date: ${dd} - ${mm} - ${yyyy}
  *   Env: ${environment}
  *\n`;
};

module.exports = (env, argv) => {
  const environment = argv.mode;
  const CONFIGPATH = path.resolve(__dirname, folderName, env.component, 'config.json');
  const isDevelopment = environment === "development";
  console.log(`[environment] :>> [${environment}]`);

  const CONFIG = require(CONFIGPATH);
  const banner = createBanner(CONFIG, environment);
  return {
    devtool: false,
    entry: {
      [env.component]: path.resolve(
        __dirname,
        folderName,
        env.component,
        'src',
        `${env.component}.js`
      ),
    },
    output: {
      path: path.resolve(__dirname, folderName, env.component, 'dist'),
      filename: `[name]-v${CONFIG.version}.js`,
      clean: true,
    },
    mode: environment, // ['development | production']
    devServer: {
      open: true,
      historyApiFallback: true,
      hot: true,
    },
    performance: {
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    },
    optimization: {
      minimize: true,
      splitChunks: {
        minSize: 10000,
        maxSize: 250000,
      },
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: isDevelopment ? false : true, // [remove|clear] all console.log statement
            },
          },
          extractComments: {
            banner: () => {
              return banner;
            },
          },
        }),
      ],
    },
    resolve: {
      extensions: ['.js', '.css', '.scss', '.json'],
      alias: {
        [env.component]: path.resolve(__dirname, folderName, env.component),
        utils: path.resolve(__dirname, 'shared', 'utils'),
        styles: path.resolve(__dirname, 'shared', 'styles'),
        node_modules: path.resolve(__dirname, 'node_modules'),
        mock: path.resolve(__dirname, folderName, env.component, 'mock'),
      },
    },
    module: {
      rules: [
        {
          test: /\.css|\.s(c|a)ss$/,
          use: [
            {
              loader: 'lit-scss-loader',
              options: {
                minify: true, // defaults to false
              },
            },
            'extract-loader',
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
                esModule: false,
                // url: false,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
              },
            },
          ],
        },
        {
          test: /\.svg$/,
          use: 'file-loader',
        },
        {
          test: /\.js$/,
          use: 'babel-loader',
          exclude: [/node_modules|bscroll/],
        },
      ],
    },
    plugins: [
      new webpack.BannerPlugin(banner),
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        title: 'Custom template',
        template: path.resolve(__dirname, 'index.html'),
        filename: 'index.html',
        templateParameters: CONFIG,
        inject: 'head',
        hash: true,
        scriptLoading: 'blocking',
        publicPath: './',
        cache: false,
      }),
      new AddAssetHtmlPlugin({
        filepath: path.resolve(__dirname, 'shared', 'utils', 'utilsFunctionsToTest.js'),
        hash: true,
        publicPath: './',
      }),
      new webpack.DefinePlugin({
        'process.env.activedMock': JSON.stringify(env.activedMock),
        'process.env.NODE_ENV': JSON.stringify(environment),
        'DEBUG': isDevelopment ? true : false, // Variable creada para omitir los mock en PROD
      }),
    ],
  };
};
