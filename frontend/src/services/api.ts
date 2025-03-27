import axios from 'axios';
import { GenerateRequest, GenerateResponse } from '../types';

// Create an axios instance with common config
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Generate art from a doodle using the backend API
 */
export const generateArt = async (request: GenerateRequest): Promise<GenerateResponse> => {
  try {
    const response = await apiClient.post<GenerateResponse>('/generate', request);
    return response.data;
  } catch (error) {
    // Handle axios errors
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || 'Failed to generate art');
    }
    throw new Error('Network error or server unavailable');
  }
}; 