import { useRef, useEffect, useState, useCallback } from 'react';
import { Color, Tool } from '../types';

interface UseCanvasOptions {
  width?: number;
  height?: number;
  initialColor?: Color;
  initialTool?: Tool;
  brushSize?: number;
}

export const useCanvas = ({
  width = 800,
  height = 600,
  initialColor = '#000000',
  initialTool = 'pen',
  brushSize = 5,
}: UseCanvasOptions = {}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState<Color>(initialColor);
  const [tool, setTool] = useState<Tool>(initialTool);
  
  // Initialize canvas context
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Set canvas dimensions
    canvas.width = width;
    canvas.height = height;
    
    // Get context and set default styles
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = color;
    
    // Initialize with white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Store context reference
    ctxRef.current = ctx;
  }, [width, height, brushSize, color]);
  
  // Update stroke style when color changes
  useEffect(() => {
    if (!ctxRef.current) return;
    ctxRef.current.strokeStyle = tool === 'eraser' ? 'white' : color;
  }, [color, tool]);
  
  // Start drawing
  const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!ctxRef.current) return;
    
    ctxRef.current.beginPath();
    
    // Get coordinates based on event type
    let x: number, y: number;
    
    if ('touches' in e) {
      // Touch event
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      // Mouse event
      x = e.nativeEvent.offsetX;
      y = e.nativeEvent.offsetY;
    }
    
    ctxRef.current.moveTo(x, y);
    setIsDrawing(true);
  }, []);
  
  // Draw line
  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !ctxRef.current) return;
    
    // Get coordinates based on event type
    let x: number, y: number;
    
    if ('touches' in e) {
      // Touch event
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      // Mouse event
      x = e.nativeEvent.offsetX;
      y = e.nativeEvent.offsetY;
    }
    
    ctxRef.current.lineTo(x, y);
    ctxRef.current.stroke();
  }, [isDrawing]);
  
  // Stop drawing
  const stopDrawing = useCallback(() => {
    if (!ctxRef.current) return;
    
    ctxRef.current.closePath();
    setIsDrawing(false);
  }, []);
  
  // Clear canvas
  const clearCanvas = useCallback(() => {
    if (!ctxRef.current || !canvasRef.current) return;
    
    ctxRef.current.fillStyle = 'white';
    ctxRef.current.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  }, []);
  
  // Get canvas data URL
  const getCanvasImage = useCallback((): string => {
    if (!canvasRef.current) return '';
    return canvasRef.current.toDataURL('image/png');
  }, []);
  
  // Load template onto canvas
  const loadTemplate = useCallback((templateSrc: string) => {
    if (!ctxRef.current || !canvasRef.current) return;
    
    // Clear canvas first
    clearCanvas();
    
    // Create image element
    const templateImage = new Image();
    templateImage.onload = () => {
      if (!ctxRef.current || !canvasRef.current) return;
      
      // Draw template centered on canvas
      const x = (canvasRef.current.width - templateImage.width) / 2;
      const y = (canvasRef.current.height - templateImage.height) / 2;
      
      ctxRef.current.drawImage(templateImage, x, y);
    };
    templateImage.src = templateSrc;
  }, [clearCanvas]);
  
  return {
    canvasRef,
    startDrawing,
    draw,
    stopDrawing,
    clearCanvas,
    getCanvasImage,
    loadTemplate,
    setColor,
    color,
    setTool,
    tool,
  };
}; 