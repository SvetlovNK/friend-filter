let webpack = require('webpack');
let HtmlPlugin = require('html-webpack-plugin');
let BrowserSyncPlugin = require('browser-sync-webpack-plugin');
let CleanWebpackPlugin = require('clean-webpack-plugin');
let styleLintPlugin = require('stylelint-webpack-plugin');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let loaders = require('./webpack.config.loaders')();
let path = require('path');

module.exports = {
    entry: {
        main: './src/main.js',
    },
    output: {
        filename: '[name].[hash].js',
        path: path.resolve('build/')
    },
    devtool: 'source-map',
    module: {
        loaders
    },
    plugins: [
        new HtmlPlugin({
            title: 'Main Homework',
            template: 'index.hbs',
            chunks: ['main']
        }),
        new ExtractTextPlugin({
            filename: 'css/[name].css',
            allChunks: true,
        }),
        new CleanWebpackPlugin(['build']),
        new styleLintPlugin({
            configFile: 'stylelint.',
            context: path.resolve(__dirname, 'src/'),
            files: '**/*.scss',
            failOnError: false,
            quiet: false
        }),
        new BrowserSyncPlugin({
            host: 'localhost',
            port: 8080,
            server: { baseDir: ['build'] }
            // proxy: 'http://127.0.0.1:8000/',
            // open: false,
        })
    ]
};