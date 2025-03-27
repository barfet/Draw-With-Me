# Story 3: AI Image Generation - Testing Guide

This document explains how to run and interpret the E2E tests for Story 3 of the Draw With Me application.

## Story Acceptance Criteria

Story 3 has the following acceptance criteria:

1. A clearly visible "Generate Art" button exists
2. Clicking the button sends the current canvas content (doodle + template if used) to the AI backend
3. A loading indicator is displayed while the AI is processing
4. The AI-generated image is displayed clearly within a reasonable time
5. The generated image visually relates to the user's doodle/template content
6. The original doodle remains visible for comparison
7. Basic error handling is implemented

## Test Cases

The E2E tests in `cypress/e2e/story3_ai_generation.cy.js` verify all these criteria:

1. **Verify Generate Art button exists and is visible** - Tests criterion #1
2. **Draw a simple shape and generate art** - Tests criteria #2, #3, #4, #5, and #6
3. **Use template, color it, and generate art** - Tests criteria #2, #3, #4, #5, and #6 with template usage
4. **Handle empty canvas appropriately** - Tests an edge case for criteria #2 and #7
5. **Show user-friendly error message when API fails** - Tests criterion #7
6. **Complete flow - from drawing to generation** - Tests all criteria in sequence

## How to Run the Tests

### Prerequisites
1. Ensure both the backend and frontend servers are running:
   - Backend: `cd ../backend && python wsgi.py` (from the frontend directory)
   - Frontend: `npm start` (in a separate terminal)

### Running Tests Interactively
```bash
npm run cypress:open
```
This opens the Cypress Test Runner. Click on "E2E Testing", choose a browser, and then select `story3_ai_generation.cy.js` to run the tests.

### Running Tests Headlessly
```bash
npm run test:e2e -- --spec 'cypress/e2e/story3_ai_generation.cy.js'
```
This runs the Story 3 tests headlessly and generates videos/screenshots.

## API Mocking

To avoid making actual API calls to the backend (and potentially to the OpenAI API) during testing, the tests use Cypress's request interception (`cy.intercept()`) to mock API responses. This allows us to:

1. Test success scenarios with predetermined image URLs
2. Test error handling with simulated API failures
3. Test loading states by adding controlled delays to responses
4. Make tests more reliable and faster by eliminating external dependencies

## Interpreting Results

### Pass Criteria
Story 3 is considered implemented and passed if:

1. All test cases pass successfully
2. Visual verification through screenshots/videos shows:
   - The "Generate Art" button is clearly visible
   - Loading indicator appears while generating
   - Generated images are displayed properly
   - Original drawing remains visible for comparison
   - Error messages are displayed appropriately when API fails

### Visual Verification
Since we're testing both the drawing canvas and the generated image display, visual verification is important:

1. Check `simple-sun-drawing.png` and `after-generation.png` to verify the generation flow
2. Compare `blue-cat-template.png` and `after-cat-generation.png` to verify template-based generation
3. Examine `empty-canvas-handling.png` to verify empty canvas handling
4. Check `api-error-handling.png` to verify error message display
5. Review the complete flow screenshots for the full user journey

### Test Artifacts Location
- **Screenshots:** `cypress/screenshots/story3_ai_generation.cy.js/`
- **Videos:** `cypress/videos/story3_ai_generation.cy.js.mp4`

## Special Considerations for AI Generation Testing

1. **API Mocking**: The tests mock the backend API to avoid actual AI generation during testing. In a real environment, the OpenAI API would be called.
2. **Response Time**: In production, AI generation might take longer than the mocked responses in the tests. The app should handle longer wait times gracefully.
3. **Image Display**: The tests verify that the image is displayed by checking for an img tag with the expected src attribute. In production, the actual generated images would be displayed.
4. **Error Simulation**: Various error scenarios (network issues, API limits, content policy violations) are simulated with a single error response in testing.

## Sign-off Checklist

- [ ] All tests pass
- [ ] Visual verification confirms Generate Art button exists and is visible
- [ ] Visual verification confirms loading indicator is shown during generation
- [ ] Visual verification confirms generated image is displayed properly
- [ ] Visual verification confirms original drawing remains visible for comparison
- [ ] Visual verification confirms error messages are displayed appropriately
- [ ] Visual verification confirms template-based generation works correctly
- [ ] Visual verification confirms empty canvas handling works as expected

Once all checklist items are checked, Story 3 can be signed off as implemented. 