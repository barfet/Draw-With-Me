import React from 'react';
import { Color, Tool, Template } from '../types';

// Available color options
const colorOptions: Color[] = [
  '#000000', // Black
  '#FF0000', // Red
  '#00FF00', // Green
  '#0000FF', // Blue
  '#FFFF00', // Yellow
  '#FF00FF', // Magenta
  '#00FFFF', // Cyan
  '#FFA500', // Orange
  '#800080', // Purple
  '#A52A2A', // Brown
];

// Templates
const templates: Template[] = [
  { id: 'cat', name: 'Cat', imagePath: '/assets/templates/cat.png' },
  { id: 'robot', name: 'Robot', imagePath: '/assets/templates/robot.png' },
  { id: 'flower', name: 'Flower', imagePath: '/assets/templates/flower.png' },
];

interface ControlsProps {
  currentColor: Color;
  onColorChange: (color: Color) => void;
  currentTool: Tool;
  onToolChange: (tool: Tool) => void;
  onClear: () => void;
  onTemplateSelect: (template: Template) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const Controls: React.FC<ControlsProps> = ({
  currentColor,
  onColorChange,
  currentTool,
  onToolChange,
  onClear,
  onTemplateSelect,
  onGenerate,
  isGenerating,
}) => {
  return (
    <div className="controls">
      <div className="control-section">
        <h3>Colors</h3>
        <div className="color-picker">
          {colorOptions.map((color) => (
            <button
              key={color}
              className={`color-option ${currentColor === color ? 'active' : ''}`}
              style={{
                backgroundColor: color,
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                margin: '0 5px',
                cursor: 'pointer',
                border: currentColor === color ? '3px solid #666' : '1px solid #ddd',
              }}
              onClick={() => onColorChange(color)}
              aria-label={`Select color ${color}`}
            />
          ))}
        </div>
      </div>

      <div className="control-section">
        <h3>Tools</h3>
        <div className="tools">
          <button
            className={`tool-button ${currentTool === 'pen' ? 'active' : ''}`}
            onClick={() => onToolChange('pen')}
            style={{
              backgroundColor: currentTool === 'pen' ? '#e0e0e0' : '#fff',
              padding: '8px 16px',
              margin: '0 5px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              cursor: 'pointer',
            }}
          >
            Pen
          </button>
          <button
            className={`tool-button ${currentTool === 'eraser' ? 'active' : ''}`}
            onClick={() => onToolChange('eraser')}
            style={{
              backgroundColor: currentTool === 'eraser' ? '#e0e0e0' : '#fff',
              padding: '8px 16px',
              margin: '0 5px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              cursor: 'pointer',
            }}
          >
            Eraser
          </button>
        </div>
      </div>

      <div className="control-section">
        <h3>Templates</h3>
        <div className="templates">
          {templates.map((template) => (
            <button
              key={template.id}
              className="template-button"
              onClick={() => onTemplateSelect(template)}
              style={{
                padding: '8px 16px',
                margin: '0 5px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                cursor: 'pointer',
              }}
            >
              {template.name}
            </button>
          ))}
        </div>
      </div>

      <div className="control-section">
        <h3>Actions</h3>
        <div className="actions">
          <button
            className="clear-button"
            onClick={onClear}
            style={{
              backgroundColor: '#ff6b6b',
              color: 'white',
              padding: '8px 16px',
              margin: '0 5px',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Clear Canvas
          </button>
          <button
            className="generate-button"
            onClick={onGenerate}
            disabled={isGenerating}
            style={{
              backgroundColor: '#4dabf7',
              color: 'white',
              padding: '8px 16px',
              margin: '0 5px',
              borderRadius: '4px',
              border: 'none',
              cursor: isGenerating ? 'not-allowed' : 'pointer',
              opacity: isGenerating ? 0.7 : 1,
            }}
          >
            {isGenerating ? 'Generating...' : 'Generate Art'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Controls; 