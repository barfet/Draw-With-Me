/// <reference types="cypress" />

describe('Story 2: Use Drawing Templates', () => {
  const canvasSelector = 'canvas.drawing-canvas';
  
  beforeEach(() => {
    // Visit the application before each test
    cy.visit('/');
    
    // Wait for the canvas to be available
    cy.get(canvasSelector).should('be.visible');
  });
  
  it('Verify template selection UI is present', () => {
    // Check templates section exists
    cy.contains('h3', 'Templates').should('be.visible');
    
    // Check template buttons exist
    cy.contains('button', 'Cat').should('be.visible');
    cy.contains('button', 'Robot').should('be.visible');
    cy.contains('button', 'Flower').should('be.visible');
  });
  
  it('Select the "Cat" template and verify it appears on canvas', () => {
    // Get initial canvas state for comparison
    cy.screenshot('before-template');
    
    // Select the Cat template
    cy.contains('button', 'Cat').click();
    
    // Take a screenshot to verify template was loaded
    // We can't directly test canvas content, so visual verification is needed
    cy.screenshot('after-cat-template');
  });
  
  it('Draw inside/around the template', () => {
    // First select the Cat template
    cy.contains('button', 'Cat').click();
    
    // Select a color
    cy.get('.color-option').eq(3).click(); // Blue
    
    // Draw on the template
    cy.drawLine(canvasSelector, 150, 150, 250, 200);
    cy.drawLine(canvasSelector, 200, 150, 300, 180);
    
    // Take a screenshot for visual verification
    cy.screenshot('drawing-on-template');
  });
  
  it('Clear canvas removes both template and drawing', () => {
    // First select the Cat template
    cy.contains('button', 'Cat').click();
    
    // Draw on the template
    cy.get('.color-option').eq(2).click(); // Green 
    cy.drawLine(canvasSelector, 200, 150, 300, 250);
    
    // Take a screenshot of canvas with template and drawing
    cy.screenshot('template-with-drawing');
    
    // Clear the canvas
    cy.contains('button', 'Clear Canvas').click();
    
    // Take a screenshot to verify template and drawing are gone
    cy.screenshot('cleared-template-and-drawing');
  });
  
  it('Select "Robot" template and verify it loads', () => {
    // Select the Robot template
    cy.contains('button', 'Robot').click();
    
    // Take a screenshot to verify template was loaded
    cy.screenshot('robot-template');
  });
  
  it('Select "Flower" template and verify it loads', () => {
    // Select the Flower template
    cy.contains('button', 'Flower').click();
    
    // Take a screenshot to verify template was loaded
    cy.screenshot('flower-template');
  });
  
  it('Complete flow of Story 2 acceptance criteria', () => {
    // 1. Verify template selection UI is present
    cy.contains('h3', 'Templates').should('be.visible');
    cy.contains('button', 'Cat').should('be.visible');
    cy.contains('button', 'Robot').should('be.visible');
    cy.contains('button', 'Flower').should('be.visible');
    
    // 2. Select Cat template
    cy.contains('button', 'Cat').click();
    cy.screenshot('flow-cat-template');
    
    // 3. Draw on the template
    cy.get('.color-option').eq(4).click(); // Yellow
    cy.drawLine(canvasSelector, 150, 150, 250, 150);
    cy.drawLine(canvasSelector, 200, 100, 200, 200);
    cy.screenshot('flow-drawing-on-template');
    
    // 4. Clear canvas
    cy.contains('button', 'Clear Canvas').click();
    cy.screenshot('flow-cleared-canvas');
    
    // 5. Select Robot template
    cy.contains('button', 'Robot').click();
    cy.screenshot('flow-robot-template');
    
    // 6. Draw on robot template with different color
    cy.get('.color-option').eq(1).click(); // Red
    cy.drawLine(canvasSelector, 100, 200, 300, 200);
    cy.screenshot('flow-drawing-on-robot');
  });
}); 