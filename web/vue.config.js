const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
    transpileDependencies: true,
    publicPath: "./",
    outputDir: "../docs",
    devServer: {
        port: 20395,
        host: "0.0.0.0"
    }
});
