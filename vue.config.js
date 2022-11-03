module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/ThesisDefenceFront/" : "/",
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
