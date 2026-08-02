module.exports = {
  project: {
    android: {
      sourceDir: '../lxc-myhealthhub-xda',
    },
    ios: {
      sourceDir: process.env.LXC_IOS_SOURCE_DIR || '../lxc-myhealthhub-ios',
    },
  },
};
