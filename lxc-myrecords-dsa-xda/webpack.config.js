const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  config.resolve.alias['react-native-sqlite-storage'] = path.resolve(
    __dirname,
    'src/storage/sqlite-web-stub.js'
  );

  return config;
};
