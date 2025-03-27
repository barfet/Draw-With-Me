# Story 2: Use Drawing Templates - Testing Guide

This document explains how to run and interpret the E2E tests for Story 2 of the Draw With Me application.

## Story Acceptance Criteria

Story 2 has the following acceptance criteria:

1. A button/area exists to select a template
2. A small selection of templates (e.g., Cat, Robot, Flower) is presented upon clicking the template button
3. Selecting a template loads its outline onto the canvas
4. The user can draw/color "on" the template (template lines should remain visible)
5. The "Clear Canvas" button removes both the user's drawing and the template

## Test Cases

The E2E tests in `cypress/e2e/story2_templates.cy.js` verify all these criteria:

1. **Verify template selection UI is present** - Tests criteria #1 and #2
2. **Select the "Cat" template and verify it appears on canvas** - Tests criterion #3
3. **Draw inside/around the template** - Tests criterion #4
4. **Clear canvas removes both template and drawing** - Tests criterion #5
5. **Select "Robot" template and verify it loads** - Tests criterion #3 with a different template
6. **Select "Flower" template and verify it loads** - Tests criterion #3 with a different template
7. **Complete flow of Story 2 acceptance criteria** - Tests all criteria in sequence

## How to Run the Tests

### Prerequisites
1. Ensure both the backend and frontend servers are running:
   - Backend: `cd ../backend && python wsgi.py` (from the frontend directory)
   - Frontend: `npm start` (in a separate terminal)

### Running Tests Interactively
```bash
npm run cypress:open
```
This opens the Cypress Test Runner. Click on "E2E Testing", choose a browser, and then select `story2_templates.cy.js` to run the tests.

### Running Tests Headlessly
```bash
npm run test:e2e
```
This runs all the E2E tests headlessly and generates videos/screenshots.

## Interpreting Results

### Pass Criteria
Story 2 is considered implemented and passed if:

1. All test cases pass successfully
2. Visual verification through screenshots/videos shows:
   - The template selection UI is properly displayed
   - Template outlines are loaded correctly when selected
   - Drawing on templates works as expected
   - Clear canvas removes both the template and the drawing

### Visual Verification
Since canvas content can't be directly asserted in tests, verification is primarily visual:

1. Compare `before-template.png` and `after-cat-template.png` to verify the template was loaded
2. Examine `drawing-on-template.png` to verify drawing on the template works
3. Compare `template-with-drawing.png` and `cleared-template-and-drawing.png` to verify clearing works
4. Check `robot-template.png` and `flower-template.png` to verify other templates load correctly

### Test Artifacts Location
- **Screenshots:** `cypress/screenshots/story2_templates.cy.js/`
- **Videos:** `cypress/videos/story2_templates.cy.js.mp4`

## Canvas Verification Challenges

Canvas testing presents unique challenges since we can't directly query the canvas content. Our approach relies on:

1. **Visual verification**: Screenshots before and after actions to visually confirm changes
2. **Action verification**: Confirming that actions (like selecting templates and drawing) can be performed without errors
3. **UI verification**: Ensuring all necessary UI elements (template buttons, etc.) are present and functional

## Special Considerations for Template Testing

1. **Template loading**: Since template loading happens asynchronously when an image is loaded, there might be slight delays. The tests have been designed to accommodate this.
2. **Template visibility**: The templates should remain visible when drawing on them. This can only be verified visually through screenshots.
3. **Template locations**: Templates should be centered on the canvas for aesthetic purposes. This is verified through visual inspection of screenshots.

## Sign-off Checklist

- [ ] All tests pass
- [ ] Visual verification confirms template selection UI exists
- [ ] Visual verification confirms Cat template loads correctly
- [ ] Visual verification confirms Robot template loads correctly
- [ ] Visual verification confirms Flower template loads correctly
- [ ] Visual verification confirms drawing on templates works
- [ ] Visual verification confirms clearing canvas removes both template and drawing

Once all checklist items are checked, Story 2 can be signed off as implemented. 