# Draw With Me - Cypress Testing

This directory contains all the Cypress E2E tests for the Draw With Me application. The tests are organized by user stories and feature requirements.

## Directory Structure

```
cypress/
├── docs/               # Testing documentation by feature
│   ├── story1_testing.md
│   ├── story1_verification_report.md
│   ├── story2_testing.md
│   ├── story2_verification_report.md
│   ├── story3_testing.md
│   └── story3_verification_report.md
├── e2e/                # E2E test files organized by stories
│   ├── story1_basic_doodling.cy.js
│   ├── story2_templates.cy.js
│   └── story3_ai_generation.cy.js
├── fixtures/           # Test data files
├── support/            # Custom commands and utilities
│   ├── commands.js     # Custom Cypress commands for drawing operations
│   └── e2e.js          # Global configuration for tests
└── README.md           # This file
```

## Prerequisites

1. Both the frontend and backend servers need to be running:
   ```bash
   # Start backend (from the project root)
   cd backend
   python wsgi.py
   
   # Start frontend (in another terminal, from the project root)
   cd frontend
   npm start
   ```

## Running Tests

There are two ways to run Cypress tests:

### 1. Interactive Mode

This opens the Cypress Test Runner UI where you can select tests to run:

```bash
# From the frontend directory
npm run cypress:open
```

### 2. Headless Mode

This runs all tests in the background:

```bash
# From the frontend directory
npm run test:e2e
```

To run tests for a specific story:

```bash
# For Story 1: Basic Doodling
npm run test:e2e -- --spec 'cypress/e2e/story1_basic_doodling.cy.js'

# For Story 2: Use Drawing Templates
npm run test:e2e -- --spec 'cypress/e2e/story2_templates.cy.js'

# For Story 3: AI Image Generation
npm run test:e2e -- --spec 'cypress/e2e/story3_ai_generation.cy.js'
```

## Custom Commands

We've extended Cypress with custom commands to make canvas testing easier:

1. `cy.drawLine(canvasSelector, startX, startY, endX, endY)` - Draw a line on the canvas
2. `cy.selectColor(colorName)` - Select a color from the palette
3. `cy.selectTool(toolName)` - Select a drawing tool (Pen, Eraser)
4. `cy.drawShape(canvasSelector, shape, x, y, size)` - Draw a shape (square, triangle, circle)
5. `cy.canvasHasContent(canvasSelector)` - Visual verification that canvas has content
6. `cy.waitForCanvasRender(ms)` - Wait for a canvas render to complete

## Implemented Stories

### Story 1: Basic Doodling

Tests for basic drawing functionality:
- Canvas loads with white background
- Drawing with default color (black)
- Selecting different colors and drawing
- Using the eraser tool
- Clearing the canvas

See `docs/story1_testing.md` for detailed acceptance criteria and test strategies, and `docs/story1_verification_report.md` for test results.

### Story 2: Use Drawing Templates

Tests for template functionality:
- Template selection UI exists
- Templates (Cat, Robot, Flower) are available
- Templates load correctly on canvas when selected
- Drawing on templates works correctly
- Clear Canvas removes both template and drawing

See `docs/story2_testing.md` for detailed acceptance criteria and test strategies, and `docs/story2_verification_report.md` for test results.

### Story 3: AI Image Generation

Tests for AI generation functionality:
- Generate Art button exists and works
- Drawing and generating content works properly
- API interactions are handled correctly
- Loading states and error handling work as expected
- Original drawing and generated image are displayed together

See `docs/story3_testing.md` for detailed acceptance criteria and test strategies, and `docs/story3_verification_report.md` for test results.

## Visual Testing

Canvas testing is primarily visual, as it's difficult to programmatically verify pixel data with Cypress. Our approach:

1. We take screenshots at key steps in the tests
2. The tests perform drawing operations and verify UI elements
3. Visual verification is required to confirm the tests are working correctly

Screenshots are saved in `cypress/screenshots/` and videos in `cypress/videos/`.

## API Mocking

For Story 3, we use Cypress's request interception to mock API responses from the backend. This allows us to:

1. Test success scenarios with predetermined image URLs
2. Test error handling with simulated API failures
3. Test loading states by adding controlled delays to responses
4. Make tests more reliable and faster by eliminating external dependencies

## Adding New Tests

When adding new feature tests:

1. Create a new test file in `cypress/e2e/` named after the story/feature
2. Add any custom commands to `cypress/support/commands.js`
3. Document the testing approach in `cypress/docs/`
4. Add the feature to this README

## Test Strategy

Our testing strategy follows these principles:

1. Each user story has a dedicated test file
2. Tests verify all acceptance criteria
3. Tests are independent and can run in any order
4. Custom commands abstract canvas operations for readability
5. Visual verification supplements automated tests
6. API mocking is used to test backend interactions without dependencies

## Troubleshooting

If you encounter test failures:

1. Check that both frontend and backend are running
2. Ensure the canvas element has the expected class (`drawing-canvas`)
3. Review screenshots for visual verification
4. Check browser console for any JavaScript errors
5. Try running the specific failing test in isolation 