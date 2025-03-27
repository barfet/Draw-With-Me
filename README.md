# Draw With Me - AI Art Buddy

A fun web application where children can create doodles and have AI transform them into more detailed images.

## Features

- **Drawing Canvas**: Simple drawing interface with pen and eraser tools
- **Color Palette**: Multiple colors to choose from
- **Templates**: Start with pre-made templates like Cat, Robot, or Flower
- **AI Generation**: Transform doodles into richly detailed images using OpenAI's API
- **Download Images**: Save the generated artwork to your device

## Technologies Used

### Frontend
- React with TypeScript
- HTML Canvas for drawing
- Axios for API communication

### Backend
- Python with Flask
- OpenAI API for image generation
- Pillow for image processing

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment and install dependencies:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. Create a `.env` file with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. Run the backend server:
   ```bash
   python wsgi.py
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

## Project Structure

- `/backend`: Python Flask backend
  - `/app`: Main application code
    - `/api`: API routes
    - `/services`: Service modules (OpenAI integration)
    - `/utils`: Utility functions (image processing)
    - `/tests`: Unit tests
- `/frontend`: React frontend
  - `/src`: Source code
    - `/components`: React components
    - `/hooks`: Custom React hooks
    - `/services`: API services
    - `/assets`: Static assets

## License

This project is licensed under the MIT License - see the LICENSE file for details.