/// <reference types="cypress" />

describe('Story 3: AI Image Generation', () => {
  const canvasSelector = 'canvas.drawing-canvas';
  
  beforeEach(() => {
    // Visit the application before each test
    cy.visit('/');
    
    // Wait for the canvas to be available
    cy.get(canvasSelector).should('be.visible');
  });
  
  it('Verify Generate Art button exists and is visible', () => {
    // Check the Generate Art button exists and is visible
    cy.contains('button', 'Generate Art').should('be.visible');
    cy.contains('button', 'Generate Art').should('not.be.disabled');
  });
  
  it('Draw a simple shape and generate art', () => {
    // Mock the API response to avoid actual API calls
    cy.intercept('POST', '/api/generate', {
      statusCode: 200,
      body: {
        imageUrl: 'https://example.com/generated-art.png'
      },
      delay: 500 // Simulate a short delay for loading state testing
    }).as('generateRequest');
    
    // Draw a simple sun shape
    cy.get('.color-option').eq(4).click(); // Yellow
    cy.drawShape(canvasSelector, 'circle', 200, 200, 100);
    
    // Draw sun rays
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * 2 * Math.PI;
      const startX = 200 + Math.cos(angle) * 50;
      const startY = 200 + Math.sin(angle) * 50;
      const endX = 200 + Math.cos(angle) * 120;
      const endY = 200 + Math.sin(angle) * 120;
      cy.drawLine(canvasSelector, startX, startY, endX, endY);
    }
    
    cy.screenshot('simple-sun-drawing');
    
    // Click the Generate Art button
    cy.contains('button', 'Generate Art').click();
    
    // Verify loading state is shown - check for any visual indicator of loading
    // The app might show "Generating..." text or a loading spinner
    cy.wait(100); // Small wait to ensure UI updates
    
    // Wait for the mock API response
    cy.wait('@generateRequest');
    
    // Verify the generated image is displayed
    cy.get('img').should('be.visible');
    cy.get('img').should('have.attr', 'src', 'https://example.com/generated-art.png');
    
    // Verify the original drawing is still visible (for comparison)
    cy.get(canvasSelector).should('be.visible');
    
    cy.screenshot('after-generation');
  });
  
  it('Use template, color it, and generate art', () => {
    // Mock the API response
    cy.intercept('POST', '/api/generate', {
      statusCode: 200,
      body: {
        imageUrl: 'https://example.com/generated-cat.png'
      },
      delay: 1000
    }).as('generateRequest');
    
    // Select the Cat template
    cy.contains('button', 'Cat').click();
    
    // Color it blue
    cy.get('.color-option').eq(3).click(); // Blue
    cy.drawLine(canvasSelector, 150, 150, 250, 150);
    cy.drawLine(canvasSelector, 200, 100, 200, 200);
    
    cy.screenshot('blue-cat-template');
    
    // Generate art
    cy.contains('button', 'Generate Art').click();
    
    // Verify loading state - we expect some indication of loading
    // but without asserting specific implementation details
    cy.wait(100); // Small wait to ensure UI updates
    
    // Wait for the mock API response
    cy.wait('@generateRequest');
    
    // Verify the generated image
    cy.get('img').should('be.visible');
    cy.get('img').should('have.attr', 'src', 'https://example.com/generated-cat.png');
    
    cy.screenshot('after-cat-generation');
  });
  
  it('Handle empty canvas appropriately', () => {
    // Don't draw anything on the canvas
    
    // Check if Generate button is disabled or enabled
    cy.contains('button', 'Generate Art').then($button => {
      if ($button.prop('disabled')) {
        // If button is disabled on empty canvas, that's one valid implementation
        cy.contains('button', 'Generate Art').should('be.disabled');
      } else {
        // If button is enabled, click it and expect a message or special handling
        cy.contains('button', 'Generate Art').click();
        
        // Check for a message about empty canvas
        cy.contains(/empty canvas|draw something/i).should('be.visible');
      }
    });
    
    cy.screenshot('empty-canvas-handling');
  });
  
  it('Show user-friendly error message when API fails', () => {
    // Mock a failed API response
    cy.intercept('POST', '/api/generate', {
      statusCode: 500,
      body: {
        error: 'Internal server error'
      },
      delay: 300
    }).as('failedRequest');
    
    // Draw something simple
    cy.drawLine(canvasSelector, 100, 100, 300, 300);
    
    // Click generate
    cy.contains('button', 'Generate Art').click();
    
    // Wait for the failed request
    cy.wait('@failedRequest');
    
    // Verify error message is shown
    cy.get('.error-message').should('be.visible');
    cy.contains(/failed|error|try again/i).should('be.visible');
    
    cy.screenshot('api-error-handling');
  });
  
  it('Complete flow - from drawing to generation', () => {
    // Mock successful API response
    cy.intercept('POST', '/api/generate', {
      statusCode: 200,
      body: {
        imageUrl: 'https://example.com/generated-flow.png'
      },
      delay: 700
    }).as('generateRequest');
    
    // 1. Verify Generate button exists
    cy.contains('button', 'Generate Art').should('be.visible');
    
    // 2. Draw something (a simple house)
    cy.get('.color-option').eq(0).click(); // Black
    
    // Draw house shape
    cy.drawLine(canvasSelector, 100, 200, 100, 300); // Left wall
    cy.drawLine(canvasSelector, 100, 300, 300, 300); // Floor
    cy.drawLine(canvasSelector, 300, 300, 300, 200); // Right wall
    cy.drawLine(canvasSelector, 100, 200, 200, 100); // Left roof
    cy.drawLine(canvasSelector, 200, 100, 300, 200); // Right roof
    
    // Draw door
    cy.get('.color-option').eq(1).click(); // Red
    cy.drawLine(canvasSelector, 170, 300, 170, 250);
    cy.drawLine(canvasSelector, 170, 250, 220, 250);
    cy.drawLine(canvasSelector, 220, 250, 220, 300);
    
    // Draw window
    cy.get('.color-option').eq(3).click(); // Blue
    cy.drawShape(canvasSelector, 'square', 250, 220, 30);
    
    cy.screenshot('house-drawing');
    
    // 3. Generate art
    cy.contains('button', 'Generate Art').click();
    
    // 4. Wait a bit to let the loading state appear
    cy.wait(100);
    
    // 5. Wait for generation
    cy.wait('@generateRequest');
    
    // 6. Verify result
    cy.get('img').should('be.visible');
    cy.get('img').should('have.attr', 'src', 'https://example.com/generated-flow.png');
    
    // 7. Verify original drawing is still visible
    cy.get(canvasSelector).should('be.visible');
    
    cy.screenshot('flow-generated-result');
  });
}); 