module.exports = {

    entry: "./assets/js/src/index.js",
    mode: 'development',
    output: {
        path: __dirname,
        filename: "./dist/bundle.js"
    },
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    },
    module: {
        rules: [
            {
                test: /\.js$|jsx/,
                loader: "babel-loader"
            },
            {
                test: /\.css$/,
                use: [
                'style-loader',
                'css-loader'
                ]
            },
            {
                test: /\.(png|jpg|gif)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                exclude: /node_modules/,
                use: [
                {
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: 'assets/image/[name].[md5:hash:hex:8].[ext]',
                        // name: 'assets/image/[name].[ext]',
                    },
                },
                ],
            },
            {
                test: /\.svg$/,
                use: ['@svgr/webpack', 'url-loader'],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                loader: 'file-loader',
            }
        ]
    }
};

