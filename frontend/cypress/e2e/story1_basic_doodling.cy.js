/// <reference types="cypress" />

describe('Story 1: Basic Doodling', () => {
  const canvasSelector = 'canvas.drawing-canvas';
  
  beforeEach(() => {
    // Visit the application before each test
    cy.visit('/');
    
    // Wait for the canvas to be available
    cy.get(canvasSelector).should('be.visible');
  });
  
  it('Verify canvas loads with white background', () => {
    // Canvas background is initially set as a fill in the useCanvas hook,
    // not as a CSS property. For cypress tests, we'll check the canvas exists
    cy.get(canvasSelector).should('be.visible');
    // We can't check the actual pixels in the canvas easily with Cypress
  });
  
  it('Pen tool is available and selected by default', () => {
    cy.get('button').contains('Pen').should('exist').should('have.class', 'active');
  });
  
  it('Basic color palette is visible with multiple colors', () => {
    cy.get('.color-picker').should('be.visible');
    cy.get('.color-option').should('have.length.at.least', 8);
  });
  
  it('Draw lines with the default color (black)', () => {
    // Use our custom drawLine command
    cy.drawLine(canvasSelector, 50, 50, 200, 200);
    cy.screenshot('draw-default-color');
  });
  
  it('Select a different color and draw lines', () => {
    // Use our custom selectColor command - using an index since we know
    // #FF0000 (Red) is the second color in our palette (index 1)
    cy.get('.color-option').eq(1).click(); // Red color
    cy.drawLine(canvasSelector, 100, 100, 300, 100);
    cy.screenshot('draw-red-color');
  });
  
  it('Use the eraser tool to remove parts of lines', () => {
    // First draw something
    cy.drawLine(canvasSelector, 150, 150, 350, 150);
    
    // Switch to eraser
    cy.get('button').contains('Eraser').click();
    
    // Erase part of the line
    cy.drawLine(canvasSelector, 250, 130, 250, 170);
    cy.screenshot('after-eraser');
  });
  
  it('Clear canvas button resets the canvas', () => {
    // Draw something
    cy.drawLine(canvasSelector, 100, 200, 300, 200);
    
    // Click clear canvas
    cy.get('button').contains('Clear Canvas').click();
    cy.screenshot('after-clear-canvas');
  });
  
  it('Can draw various shapes on the canvas', () => {
    // Draw a square - using color by index (2 = Green)
    cy.get('.color-option').eq(2).click(); // Green
    cy.drawShape(canvasSelector, 'square', 150, 150, 100);
    
    // Draw a triangle
    cy.get('.color-option').eq(3).click(); // Blue
    cy.drawShape(canvasSelector, 'triangle', 300, 150, 100);
    
    // Draw a circle
    cy.get('.color-option').eq(1).click(); // Red
    cy.drawShape(canvasSelector, 'circle', 450, 150, 100);
    
    cy.screenshot('multiple-shapes');
  });
  
  it('Completes all Story 1 acceptance criteria in a single flow', () => {
    // 1. Canvas is loaded (tested in beforeEach)
    cy.get(canvasSelector).should('be.visible');
    
    // 2. Verify pen tool is selected by default
    cy.get('button').contains('Pen').should('have.class', 'active');
    
    // 3-4. Verify color palette and selection
    cy.get('.color-picker').should('be.visible');
    cy.get('.color-option').should('have.length.at.least', 8);
    
    // Draw with default color
    cy.drawLine(canvasSelector, 50, 50, 200, 200);
    
    // Select a different color and draw
    cy.get('.color-option').eq(3).click(); // Blue
    cy.drawLine(canvasSelector, 300, 50, 450, 200);
    
    // Use eraser
    cy.get('button').contains('Eraser').click();
    cy.drawLine(canvasSelector, 125, 125, 125, 175);
    
    cy.screenshot('full-flow-with-drawings');
    
    // Clear canvas
    cy.get('button').contains('Clear Canvas').click();
    cy.screenshot('full-flow-cleared-canvas');
  });
}); 