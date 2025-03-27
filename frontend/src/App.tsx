import React, { useState, useRef, useCallback } from 'react';
import './App.css';
import DrawingCanvas from './components/DrawingCanvas';
import Controls from './components/Controls';
import GeneratedImageDisplay from './components/GeneratedImageDisplay';
import { Color, Tool, Template } from './types';
import { generateArt } from './services/api';
import { useCanvas } from './hooks/useCanvas';

function App() {
  // Canvas state
  const [color, setColor] = useState<Color>('#000000');
  const [tool, setTool] = useState<Tool>('pen');
  const [activeTemplate, setActiveTemplate] = useState<Template | null>(null);
  
  // Generated image state
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Canvas functions from hook
  const {
    canvasRef,
    clearCanvas,
    loadTemplate,
    getCanvasImage,
    setColor: setCanvasColor,
    setTool: setCanvasTool,
    startDrawing,
    draw,
    stopDrawing,
  } = useCanvas();
  
  // Handle color change
  const handleColorChange = (newColor: Color) => {
    setColor(newColor);
    setCanvasColor(newColor);
  };
  
  // Handle tool change
  const handleToolChange = (newTool: Tool) => {
    setTool(newTool);
    setCanvasTool(newTool);
  };
  
  // Handle template selection
  const handleTemplateSelect = (template: Template) => {
    setActiveTemplate(template);
    loadTemplate(template.imagePath);
  };
  
  // Handle clear canvas
  const handleClear = () => {
    clearCanvas();
    setActiveTemplate(null);
  };
  
  // Handle generate art
  const handleGenerate = async () => {
    try {
      setError(null);
      setIsGenerating(true);
      
      // Get canvas image as data URL
      const imageData = getCanvasImage();
      if (!imageData) {
        throw new Error('Failed to get canvas image');
      }
      
      // Call API to generate art
      const response = await generateArt({
        imageData,
        promptHint: activeTemplate?.id,
      });
      
      // Set generated image URL
      setGeneratedImageUrl(response.imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error generating art:', err);
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <div className="App">
      <header className="App-header">
        <h1>Draw With Me</h1>
        <p>Draw something fun and let AI transform it!</p>
      </header>
      
      <main className="App-main">
        <div className="drawing-section">
          <DrawingCanvas 
            width={800} 
            height={600}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            canvasRef={canvasRef}
          />
          
          <Controls
            currentColor={color}
            onColorChange={handleColorChange}
            currentTool={tool}
            onToolChange={handleToolChange}
            onClear={handleClear}
            onTemplateSelect={handleTemplateSelect}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
          />
        </div>
        
        <div className="result-section">
          <h2>Your Creation</h2>
          
          <GeneratedImageDisplay
            imageUrl={generatedImageUrl}
            isLoading={isGenerating}
          />
          
          {error && (
            <div className="error-message" style={{ 
              color: 'red', 
              padding: '10px', 
              margin: '10px 0',
              backgroundColor: '#ffebee',
              borderRadius: '4px',
            }}>
              {error}
            </div>
          )}
        </div>
      </main>
      
      <footer className="App-footer">
        <p>Draw With Me - An AI Art Buddy for Kids</p>
      </footer>
    </div>
  );
}

export default App;
