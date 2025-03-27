# Testing Guide for Draw With Me Application

This document explains how to set up and run the various types of tests for the Draw With Me application.

## End-to-End Testing with Cypress

The application uses Cypress for end-to-end testing to verify functionality from a user's perspective.

### Setup

The Cypress testing environment can be set up automatically using the included setup script:

```bash
# Make the setup script executable
chmod +x scripts/setup-cypress.js

# Run the setup script
npm run setup:cypress
```

This script will:

1. Install Cypress if not already installed
2. Create the necessary directory structure
3. Add test scripts to package.json
4. Generate configuration files for Cypress
5. Create example test files

### Running Tests

There are two ways to run the Cypress tests:

#### Interactive Mode

This opens the Cypress Test Runner UI where you can select tests to run:

```bash
npm run cypress:open
```

#### Headless Mode

This runs all tests in the background:

```bash
npm run test:e2e
```

### Test Files

The Cypress tests are organized by user stories and features:

- `cypress/e2e/story1_basic_doodling.cy.js` - Tests the basic drawing functionality (Story 1)

### Custom Commands

We've extended Cypress with custom commands to make canvas testing easier:

- `cy.drawLine(canvasSelector, startX, startY, endX, endY)` - Draw a line on the canvas
- `cy.selectColor(colorName)` - Select a color from the palette
- `cy.selectTool(toolName)` - Select a drawing tool (Pen, Eraser)
- `cy.drawShape(canvasSelector, shape, x, y, size)` - Draw shapes (square, triangle, circle)

### Visual Testing Approach

Since canvas testing has limitations with programmatic verification, we use a visual approach:

1. Tests perform drawing operations on the canvas
2. Screenshots are taken at key steps
3. Visual verification of screenshots confirms the functionality

## Component Testing with React Testing Library

For component-level tests, we use React Testing Library.

### Running Component Tests

```bash
npm test
```

This runs Jest with React Testing Library for component tests.

To run a specific test file:

```bash
npm test -- ComponentName
```

### Coverage Report

To generate and view test coverage:

```bash
npm test -- --coverage
```

## Test Documentation

Additional documentation for specific features can be found in the `cypress/docs/` directory:

- `cypress/docs/story1_testing.md` - Detailed testing guide for Story 1 (Basic Doodling)

## CI/CD Integration

The tests are configured to run in CI/CD pipelines:

- E2E tests run with `npm run test:e2e`
- Component tests run with `npm test`

Tests generate artifacts that can be viewed after the pipeline completes:

- Screenshots: `cypress/screenshots/`
- Videos: `cypress/videos/`
- Coverage reports: `coverage/`

## Best Practices

When adding new tests:

1. Create a test file in the appropriate directory (E2E or component)
2. Follow the existing test patterns
3. Update documentation if adding significant new functionality
4. Ensure tests are independent and don't rely on state from other tests
5. For canvas operations, use the custom Cypress commands

## Troubleshooting

Common issues and solutions:

- **Tests can't find elements**: Check selectors, element classes, and component structure
- **Canvas testing issues**: Visual verification is required for canvas operations
- **Timeout errors**: Increase timeout in `cypress.config.js` if tests are too slow

For more help, consult the [Cypress Documentation](https://docs.cypress.io/). 