export type Color = string;

export type Tool = 'pen' | 'eraser';

export interface Template {
  id: string;
  name: string;
  imagePath: string;
}

export interface GenerateRequest {
  imageData: string;
  promptHint?: string;
}

export interface GenerateResponse {
  imageUrl: string;
}

export interface ErrorResponse {
  error: string;
} 