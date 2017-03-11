module.exports = {
    devtool: "source-map",
    entry: "./src/index.js",
    output: {
        filename: "index.js",
        library: "fae",
        libraryTarget: "umd"
    },
    node: {
        fs: "empty"
    }
};
