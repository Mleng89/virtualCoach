const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const fs = require('fs');
// Instantiate the plugin.
/* The `template` property defines the source of a template file
that this plugin will use. We will create it later at the bottom. */
const htmlPlugin = new HtmlWebPackPlugin({
    template: './src/index.html'
});

const getFilesAndDirectories = source =>
    fs.readdirSync(source, { withFileTypes: true }).map(dirent => dirent.name);
const absoluteImports = {};

const srcPath = subdir => path.join(__dirname, 'src', subdir);
getFilesAndDirectories('src').forEach(fileName => {
    const fileNameWithoutExtension = path.parse(fileName).name;
    absoluteImports[`web/${fileNameWithoutExtension}`] = srcPath(fileName);
});

const serverPath = subdir => path.join(__dirname, 'server', subdir);
getFilesAndDirectories('server').forEach(fileName => {
    const fileNameWithoutExtension = path.parse(fileName).name;
    absoluteImports[`server/${fileNameWithoutExtension}`] =
        serverPath(fileName);
});

console.log('absoluteImports', absoluteImports);

module.exports = {
    // Our application's entry point.
    entry: './src/index.tsx',

    /*These rules define how to deal with files with given extensions.
    For example: .tsx files will be compiled with ts-loader,
    a spcific loader for webpack that knows how to work with TypeScript files.*/

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },

    /* Telling webpack which extensions we are going to be using.*/
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
            ...absoluteImports
        }
    },

    /* This is what file name should be used for the result file, and where it should be palced.*/
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    mode: 'development',

    /*plugins needed, some documentation on various plugins webpack has: https://webpack.js.org/plugins/
    ie: new webpack.new webpack.DefinePlugin({Definitions...});*/
    plugins: [htmlPlugin],
    performance: {
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 3000
    }
};
