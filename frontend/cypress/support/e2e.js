// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Configure Cypress to handle uncaught exceptions
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  return false;
});

// Take screenshots on failure
Cypress.Screenshot.defaults({
  capture: 'viewport',
});

// Log test pass/fail status
afterEach(function() {
  const testTitle = this.currentTest.title;
  const testState = this.currentTest.state;
  
  if (testState === 'failed') {
    // Test failed, we already take screenshots automatically
    console.log(`Test Failed: ${testTitle}`);
  } else if (testState === 'passed') {
    // Test passed
    console.log(`Test Passed: ${testTitle}`);
  }
}); 