module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/thesis-defence-front/'
    : '/',
  pluginOptions: {
    i18n: {
      locale: "pl",
      fallbackLocale: "pl",
      localeDir: "locales",
      enableInSFC: false,
      enableBridge: false,
    },
  },

  transpileDependencies: ["vuetify"],
  lintOnSave: false,
};
