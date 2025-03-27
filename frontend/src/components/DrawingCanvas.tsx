import React from 'react';

interface DrawingCanvasProps {
  width?: number;
  height?: number;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  onMouseDown: (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => void;
  onMouseMove: (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
  onTouchStart: (e: React.TouchEvent<HTMLCanvasElement>) => void;
  onTouchMove: (e: React.TouchEvent<HTMLCanvasElement>) => void;
  onTouchEnd: () => void;
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  width = 800,
  height = 600,
  canvasRef,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseLeave,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
}) => {
  return (
    <div className="drawing-canvas-container" style={{ touchAction: 'none' }}>
      <canvas
        ref={canvasRef}
        className="drawing-canvas"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          border: '1px solid #ccc',
          borderRadius: '4px',
          touchAction: 'none', // Prevents scrolling on touch devices
          width: `${width}px`,
          height: `${height}px`,
        }}
      />
    </div>
  );
};

export default DrawingCanvas; 