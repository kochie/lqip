const withCSS = require("@zeit/next-css");
const withPlugins = require("next-compose-plugins");
const ThreadsPlugin = require("threads-plugin");

const config = {
  cssModules: true,
  webpack(config) {
    config.plugins.push(new ThreadsPlugin({globalObject: 'self'}))
    return config
  }
};

module.exports = withPlugins([withCSS], config);
