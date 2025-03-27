# Draw With Me - Architecture Documentation

## Overview

"Draw With Me" is a web application that allows children to create doodles, optionally using templates, and have an AI transform their creations into more detailed images. The application consists of a React frontend and a Python Flask backend that integrates with the OpenAI API.

## System Architecture

```
+-----------------+      +----------------------+      +-----------------------+      +-----------------+
| User (Browser)  | ---> | React Frontend       | ---> | Backend API Endpoint  | ---> | OpenAI Service  |
|                 |      | (Canvas, UI)         |      | (Python/Flask) |      | Wrapper         |
+-----------------+      +----------------------+      +-----------------------+      +--------+--------+
        ^                      |   (Static Host)            |  (e.g., AWS Lambda/  |                 |
        |                      |                            |   API Gateway)       |                 |
        |                      +----------------------------+                      |                 |
        |                         (1. POST /api/generate)                          |                 |
        |                            (imageData, promptHint)                       |                 |
        |                                                                          | (3. Call OpenAI |
        |                                                                          |    Image API)   |
        |                               +------------------------------------------+----------+      |
        |                               |                                                     |      |
        |                               v                                                     v      v
        |                      +-----------------+                             +----------------------+
        |                      | Image Processor | <---------------------------+ OpenAI Python Lib    |
        |                      | (Validation,    |                             +----------------------+
        |                      |  Resize, Format)|                                         |
        |                      +--------+--------+                                         |
        |                               |                                                  |
        |                               | (2. Preprocess Image, Build Prompt)              |
        |                               v                                                  |
        +----------------------------------------------------------------------------------+
                               (4. Return Generated Image URL/Data)

        <----------------------------------------------------------------------------------
                               (5. Send Response to Frontend)
                                  (imageUrl / imageData)
```

## Component Breakdown

### Frontend (React/TypeScript)

- **DrawingCanvas**: Custom component utilizing HTML Canvas for drawing
- **Controls**: Component for color selection, tools, templates, and actions
- **GeneratedImageDisplay**: Component for displaying the AI-generated image
- **useCanvas**: Custom React hook that handles canvas operations
- **API Service**: Handles communication with the backend

### Backend (Python/Flask)

- **API Routes**: RESTful endpoints for image generation
- **Image Utilities**: Functions for processing and validating images
- **OpenAI Service**: Wrapper for interacting with the OpenAI API

## Data Flow

1. User draws on the canvas in the React frontend
2. User clicks "Generate Art" button
3. Frontend captures the canvas content as a data URL
4. Frontend sends a POST request to `/api/generate` with:
   - `imageData`: Base64-encoded PNG data
   - `promptHint` (optional): Template hint (e.g., "cat")
5. Backend validates and processes the image:
   - Decodes base64 image data
   - Validates format and size
   - Resizes/pads to optimal dimensions for OpenAI
6. Backend constructs the OpenAI API call:
   - Builds a prompt based on template hint
   - Adds safety parameters
   - Sends request to OpenAI's image generation API
7. Backend receives the generated image URL from OpenAI
8. Backend returns the image URL to the frontend
9. Frontend displays the generated image and enables download

## Key Technologies

- **Frontend**: 
  - React 18+
  - TypeScript
  - HTML Canvas API
  - Axios for API calls

- **Backend**:
  - Python 3.9+
  - Flask web framework
  - Pillow (PIL) for image processing
  - OpenAI Python library

## Deployment Considerations

- **Frontend**: Static hosting (Vercel, Netlify, AWS S3)
- **Backend**: Serverless (AWS Lambda, Google Cloud Functions) or container-based (Docker/Kubernetes)
- **Environment Variables**: 
  - Backend: OPENAI_API_KEY
  - Frontend: REACT_APP_API_URL

## Security Considerations

- Keep OpenAI API key secure on the backend only (never expose in frontend)
- Validate all user inputs
- Implement CORS properly
- Add content safety prompts for AI generation
- Limit maximum image size to prevent abuse