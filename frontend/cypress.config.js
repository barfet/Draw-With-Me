const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    videoCompression: 15,
    screenshotOnRunFailure: true,
    trashAssetsBeforeRuns: true,
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    retries: {
      // Configure retry attempts for `cypress run`
      runMode: 2,
      // Configure retry attempts for `cypress open`
      openMode: 0
    },
  },
}); 