#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Directory paths
const ROOT_DIR = path.join(__dirname, '..');
const CYPRESS_DIR = path.join(ROOT_DIR, 'cypress');
const dirs = [
  path.join(CYPRESS_DIR, 'e2e'),
  path.join(CYPRESS_DIR, 'support'),
  path.join(CYPRESS_DIR, 'fixtures'),
  path.join(CYPRESS_DIR, 'docs'),
];

/**
 * Creates directories if they don't exist
 */
function createDirectories() {
  console.log('Creating Cypress directories...');
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created ${dir}`);
    } else {
      console.log(`Directory already exists: ${dir}`);
    }
  });
}

/**
 * Checks if we have Cypress installed
 */
function checkCypressInstallation() {
  const packageJsonPath = path.join(ROOT_DIR, 'package.json');
  
  if (!fs.existsSync(packageJsonPath)) {
    console.error('package.json not found, are you in the correct directory?');
    process.exit(1);
  }
  
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const devDependencies = packageJson.devDependencies || {};
  
  if (!devDependencies.cypress) {
    console.log('Cypress not found in devDependencies, installing...');
    try {
      execSync('npm install --save-dev cypress', { stdio: 'inherit' });
    } catch (error) {
      console.error('Failed to install Cypress:', error);
      process.exit(1);
    }
  } else {
    console.log(`Cypress already installed (version: ${devDependencies.cypress})`);
  }
}

/**
 * Adds scripts to package.json if they don't exist
 */
function updatePackageJsonScripts() {
  const packageJsonPath = path.join(ROOT_DIR, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  const requiredScripts = {
    'cypress:open': 'cypress open',
    'cypress:run': 'cypress run',
    'test:e2e': 'cypress run --spec "cypress/e2e/**/*.cy.js"',
  };
  
  let updated = false;
  
  if (!packageJson.scripts) {
    packageJson.scripts = {};
  }
  
  Object.entries(requiredScripts).forEach(([scriptName, scriptCommand]) => {
    if (!packageJson.scripts[scriptName]) {
      packageJson.scripts[scriptName] = scriptCommand;
      updated = true;
    }
  });
  
  if (updated) {
    console.log('Updating package.json scripts...');
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  } else {
    console.log('All required scripts already exist in package.json');
  }
}

/**
 * Creates Cypress config file if it doesn't exist
 */
function createCypressConfig() {
  const configPath = path.join(ROOT_DIR, 'cypress.config.js');
  
  if (!fs.existsSync(configPath)) {
    console.log('Creating cypress.config.js...');
    
    const configContent = `const { defineConfig } = require('cypress')

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
      // Configure retry attempts for \`cypress run\`
      runMode: 2,
      // Configure retry attempts for \`cypress open\`
      openMode: 0
    },
  },
});`;
    
    fs.writeFileSync(configPath, configContent);
  } else {
    console.log('cypress.config.js already exists');
  }
}

/**
 * Setup TypeScript config for Cypress if using TypeScript
 */
function setupTypeScript() {
  const tsconfigPath = path.join(ROOT_DIR, 'tsconfig.json');
  
  if (fs.existsSync(tsconfigPath)) {
    // Project uses TypeScript, check if we need to include Cypress types
    console.log('TypeScript project detected, updating tsconfig.json for Cypress...');
    
    const tsconfigContent = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
    
    if (!tsconfigContent.compilerOptions) {
      tsconfigContent.compilerOptions = {};
    }
    
    // Ensure we have the right TS settings for Cypress
    tsconfigContent.compilerOptions.types = [
      ...(tsconfigContent.compilerOptions.types || []),
      "cypress",
      "node"
    ].filter((v, i, a) => a.indexOf(v) === i); // Remove duplicates
    
    // Create cypress/tsconfig.json specifically for Cypress
    const cypressTsConfigPath = path.join(CYPRESS_DIR, 'tsconfig.json');
    const cypressTsConfig = {
      "compilerOptions": {
        "target": "es5",
        "lib": ["es5", "dom"],
        "types": ["cypress", "node"],
        "allowJs": true,
        "jsx": "react"
      },
      "include": ["**/*.ts", "**/*.tsx"]
    };
    
    fs.writeFileSync(cypressTsConfigPath, JSON.stringify(cypressTsConfig, null, 2));
    console.log('Created cypress/tsconfig.json for Cypress TypeScript support');
    
    // Also check if @types/cypress is installed
    const packageJsonPath = path.join(ROOT_DIR, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    if (!packageJson.devDependencies['@types/cypress']) {
      console.log('Installing @types/cypress for TypeScript support...');
      try {
        execSync('npm install --save-dev @types/cypress', { stdio: 'inherit' });
      } catch (error) {
        console.warn('Failed to install @types/cypress, but continuing:', error);
      }
    }
  }
}

/**
 * Initialize example test files
 */
function createExampleFiles() {
  const e2eFile = path.join(CYPRESS_DIR, 'e2e', 'example.cy.js');
  if (!fs.existsSync(e2eFile)) {
    console.log('Creating example test file...');
    const exampleContent = `
describe('Example Test', () => {
  it('Visits the app', () => {
    cy.visit('/');
    cy.contains('h1', 'Draw With Me').should('exist');
  });
});
`;
    fs.writeFileSync(e2eFile, exampleContent.trim());
  }
  
  const commandsFile = path.join(CYPRESS_DIR, 'support', 'commands.js');
  if (!fs.existsSync(commandsFile)) {
    console.log('Creating commands.js file...');
    const commandsContent = `
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
`;
    fs.writeFileSync(commandsFile, commandsContent.trim());
  }
  
  const e2eJsFile = path.join(CYPRESS_DIR, 'support', 'e2e.js');
  if (!fs.existsSync(e2eJsFile)) {
    console.log('Creating e2e.js file...');
    const e2eJsContent = `
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

// Configure global behavior
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false;
});

// Default settings for taking screenshots
Cypress.Screenshot.defaults({
  capture: 'viewport',
});

// Log the result of each test
Cypress.on('test:after:run', (test, runnable) => {
  console.log(\`Test "\${test.title}" \${test.state}\`);
});
`;
    fs.writeFileSync(e2eJsFile, e2eJsContent.trim());
  }
}

// Run the setup
console.log('🚀 Setting up Cypress test environment');
checkCypressInstallation();
createDirectories();
updatePackageJsonScripts();
createCypressConfig();
setupTypeScript();
createExampleFiles();
console.log('✅ Cypress environment setup complete!');
console.log('');
console.log('Next steps:');
console.log('1. Run "npm run cypress:open" to launch the Cypress Test Runner');
console.log('2. Add your own tests in cypress/e2e/');
console.log('3. Check out the example test file at cypress/e2e/example.cy.js'); 