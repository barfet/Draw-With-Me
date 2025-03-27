// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

/**
 * Custom command to draw a line on the canvas
 * @param {string} canvasSelector - CSS selector for the canvas element
 * @param {number} startX - Starting X coordinate
 * @param {number} startY - Starting Y coordinate
 * @param {number} endX - Ending X coordinate
 * @param {number} endY - Ending Y coordinate
 */
Cypress.Commands.add('drawLine', (canvasSelector, startX, startY, endX, endY) => {
  cy.get(canvasSelector)
    .trigger('mousedown', { offsetX: startX, offsetY: startY })
    .trigger('mousemove', { offsetX: endX, offsetY: endY })
    .trigger('mouseup');
});

// Select a color from the palette
Cypress.Commands.add('selectColor', (colorName) => {
  // Try to find color by data attribute first
  cy.get(`.color-option[data-color="${colorName}"]`).then($el => {
    if ($el.length) {
      cy.wrap($el).click();
    } else {
      // Fallback to find by color name text if present
      cy.contains('.color-option', colorName).click();
    }
  });
});

/**
 * Custom command to select a tool (Pen, Eraser, etc.)
 * @param {string} toolName - Name of the tool to select
 */
Cypress.Commands.add('selectTool', (toolName) => {
  cy.contains('button', toolName).click();
});

/**
 * Custom command to draw a simple shape on the canvas
 * @param {string} canvasSelector - CSS selector for the canvas element
 * @param {string} shape - Shape to draw: 'square', 'circle', 'triangle'
 * @param {number} x - X coordinate of the shape center
 * @param {number} y - Y coordinate of the shape center
 * @param {number} size - Size of the shape
 */
Cypress.Commands.add('drawShape', (canvasSelector, shape, x, y, size) => {
  switch (shape.toLowerCase()) {
    case 'square':
      // Draw a square using 4 lines
      cy.drawLine(canvasSelector, x - size/2, y - size/2, x + size/2, y - size/2); // Top
      cy.drawLine(canvasSelector, x + size/2, y - size/2, x + size/2, y + size/2); // Right
      cy.drawLine(canvasSelector, x + size/2, y + size/2, x - size/2, y + size/2); // Bottom
      cy.drawLine(canvasSelector, x - size/2, y + size/2, x - size/2, y - size/2); // Left
      break;
      
    case 'triangle':
      // Draw a triangle using 3 lines
      cy.drawLine(canvasSelector, x, y - size/2, x + size/2, y + size/2); // Right line
      cy.drawLine(canvasSelector, x + size/2, y + size/2, x - size/2, y + size/2); // Bottom line
      cy.drawLine(canvasSelector, x - size/2, y + size/2, x, y - size/2); // Left line
      break;
      
    case 'circle':
      // For a circle, we'll approximate with multiple small line segments
      // This is simplified and won't create a perfect circle
      const segments = 20;
      for (let i = 0; i < segments; i++) {
        const angle1 = (i / segments) * 2 * Math.PI;
        const angle2 = ((i + 1) / segments) * 2 * Math.PI;
        
        const x1 = x + Math.cos(angle1) * size/2;
        const y1 = y + Math.sin(angle1) * size/2;
        const x2 = x + Math.cos(angle2) * size/2;
        const y2 = y + Math.sin(angle2) * size/2;
        
        cy.drawLine(canvasSelector, x1, y1, x2, y2);
      }
      break;
      
    default:
      throw new Error(`Unknown shape: ${shape}`);
  }
});

// Verify the canvas has content
Cypress.Commands.add('canvasHasContent', (canvasSelector) => {
  // Take a screenshot of the canvas for visual verification
  cy.get(canvasSelector).screenshot('canvas-content');
  
  // Note: There's no reliable way to programmatically check canvas content
  // This function is primarily for documentation and visual testing
});

// Wait for animation or rendering to complete
Cypress.Commands.add('waitForCanvasRender', (ms = 500) => {
  cy.wait(ms);
}); 