const { defineConfig } = require("cypress");

module.exports = defineConfig({
  allowCypressEnv: false,

  e2e: {
    baseUrl: "https://desafio-ps-qa.bridge.ufsc.tech/",
    allowCypressEnv: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
