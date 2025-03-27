# Story 1: Basic Doodling - Testing Guide

This document explains how to run and interpret the E2E tests for Story 1 of the Draw With Me application.

## Story Acceptance Criteria

Story 1 has the following acceptance criteria:

1. A white canvas area is displayed upon loading the app
2. A pen tool is available and selected by default
3. A basic color palette (8-12 common colors) is visible
4. Clicking/tapping a color changes the pen tool's color
5. Clicking and dragging draws a line in the selected color
6. An eraser tool is available to remove parts of the drawing
7. A "Clear Canvas" button exists to start over

## Test Cases

The E2E tests in `cypress/e2e/story1_basic_doodling.cy.js` verify all these criteria:

1. **Verify canvas loads with white background** - Tests criterion #1
2. **Draw lines with the default color (black)** - Tests criteria #2 and #5
3. **Select a different color and draw lines** - Tests criteria #3, #4, and #5
4. **Use the eraser tool to remove parts of lines** - Tests criterion #6
5. **Clear canvas button resets the canvas** - Tests criterion #7
6. **Pen tool is available and selected by default** - Tests criterion #2
7. **Basic color palette is visible with multiple colors** - Tests criterion #3
8. **Completes all Story 1 acceptance criteria in a single flow** - Tests all criteria in sequence

## How to Run the Tests

### Prerequisites
1. Ensure both the backend and frontend servers are running:
   - Backend: `cd ../backend && python wsgi.py` (from the frontend directory)
   - Frontend: `npm start` (in a separate terminal)

### Running Tests Interactively
```bash
npm run cypress:open
```
This opens the Cypress Test Runner. Click on "E2E Testing", choose a browser, and then select `story1_basic_doodling.cy.js` to run the tests.

### Running Tests Headlessly
```bash
npm run test:e2e
```
This runs all the E2E tests headlessly and generates videos/screenshots.

## Interpreting Results

### Pass Criteria
Story 1 is considered implemented and passed if:

1. All test cases pass successfully
2. Visual verification through screenshots/videos shows:
   - The canvas properly displays with a white background
   - Black lines are drawn with the default pen
   - Colored lines are drawn when different colors are selected
   - The eraser tool successfully removes parts of drawn lines
   - The Clear Canvas button successfully clears the canvas

### Visual Verification
Since canvas content can't be directly asserted in tests, some verifications are visual:

1. Check the screenshots in `cypress/screenshots` (on test failures)
2. Review the video recordings in `cypress/videos` (after headless runs)

### Test Artifacts Location
- **Screenshots:** `cypress/screenshots/story1_basic_doodling.cy.js/` (only on failures)
- **Videos:** `cypress/videos/story1_basic_doodling.cy.js.mp4`

## Troubleshooting

### Common Issues
1. **Canvas not found:** Ensure the canvas has the class `drawing-canvas`.
2. **Color selection not working:** Verify that `.color-option` elements exist and can be clicked.
3. **Tool selection not working:** Check that the tool buttons have the correct text ('Pen' and 'Eraser').

### Canvas Testing Limitations
Canvas testing has inherent limitations since Cypress cannot directly access the canvas content. The tests trigger drawing actions and rely on visual verification to confirm their effects. This approach is sufficient for this story's acceptance criteria.

## Sign-off Checklist

- [ ] All tests pass
- [ ] Visual verification confirms proper drawing functionality
- [ ] The canvas loads with a white background
- [ ] The pen tool is active by default
- [ ] Color selection works
- [ ] Drawing with pen works in different colors
- [ ] Eraser successfully removes drawn content
- [ ] Clear Canvas button successfully resets the canvas

Once all checklist items are checked, Story 1 can be signed off as implemented. 