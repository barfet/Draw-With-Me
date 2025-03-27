import unittest
from unittest.mock import patch, MagicMock
import json
import sys
import os
import base64
import io
from PIL import Image

# Add the parent directory to sys.path to import the app module
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))))

class TestRoutes(unittest.TestCase):
    def setUp(self):
        """Set up the test data."""
        # Create a test image
        test_img = Image.new('RGBA', (100, 100), color=(255, 0, 0, 255))
        img_buffer = io.BytesIO()
        test_img.save(img_buffer, format='PNG')
        img_buffer.seek(0)
        self.base64_img = base64.b64encode(img_buffer.getvalue()).decode('utf-8')
        self.data_url = f"data:image/png;base64,{self.base64_img}"
    
    # Use function patching to test the route behavior
    @patch('app.api.routes.generate_art_from_doodle')
    @patch('app.api.routes.validate_and_process_image')
    @patch('app.api.routes.decode_base64_image')
    def test_generate_endpoint_success(self, mock_decode, mock_process, mock_generate):
        """Test the success scenario of the generate endpoint function directly."""
        from app.api.routes import generate
        from flask import jsonify
        
        # Configure mocks
        mock_decode.return_value = b'decoded_image_data'
        mock_process.return_value = io.BytesIO(b'processed_image_data')
        mock_generate.return_value = "https://example.com/generated-image.png"
        
        # Create mock request
        mock_request = MagicMock()
        mock_request.get_json.return_value = {
            'imageData': self.data_url,
            'promptHint': 'cat'
        }
        
        # Test the function with patch for request
        with patch('app.api.routes.request', mock_request):
            response, status_code = generate()
        
        # Convert the response to a dict for testing
        response_data = json.loads(response.get_data())
        
        # Verify response
        self.assertEqual(status_code, 200)
        self.assertIn('imageUrl', response_data)
        self.assertEqual(response_data['imageUrl'], "https://example.com/generated-image.png")
        
        # Verify mocks were called correctly
        mock_decode.assert_called_once_with(self.data_url)
        mock_process.assert_called_once_with(b'decoded_image_data')
        mock_generate.assert_called_once_with(io.BytesIO(b'processed_image_data'), 'cat')
    
    def test_generate_endpoint_missing_image(self):
        """Test the case where image data is missing."""
        from app.api.routes import generate
        
        # Create mock request
        mock_request = MagicMock()
        mock_request.get_json.return_value = {
            'promptHint': 'cat'  # Missing imageData
        }
        
        # Test the function with patch for request
        with patch('app.api.routes.request', mock_request):
            response, status_code = generate()
        
        # Convert the response to a dict for testing
        response_data = json.loads(response.get_data())
        
        # Verify response
        self.assertEqual(status_code, 400)
        self.assertIn('error', response_data)
        self.assertIn('image data is missing', response_data['error'].lower())
    
    def test_generate_endpoint_invalid_image(self):
        """Test the case where image data is invalid."""
        from app.api.routes import generate
        
        # Create mock request
        mock_request = MagicMock()
        mock_request.get_json.return_value = {
            'imageData': 'invalid-base64-data',
            'promptHint': 'cat'
        }
        
        # Configure the decode function to raise ValueError
        with patch('app.api.routes.request', mock_request):
            with patch('app.api.routes.decode_base64_image') as mock_decode:
                mock_decode.side_effect = ValueError("Invalid base64 string")
                response, status_code = generate()
        
        # Convert the response to a dict for testing
        response_data = json.loads(response.get_data())
        
        # Verify response
        self.assertEqual(status_code, 400)
        self.assertIn('error', response_data)
        self.assertIn('invalid image data', response_data['error'].lower())
    
    def test_generate_endpoint_openai_error(self):
        """Test the case where OpenAI API returns an error."""
        from app.api.routes import generate
        
        # Create mock request
        mock_request = MagicMock()
        mock_request.get_json.return_value = {
            'imageData': self.data_url,
            'promptHint': 'cat'
        }
        
        # Configure mocks
        with patch('app.api.routes.request', mock_request):
            with patch('app.api.routes.decode_base64_image') as mock_decode:
                with patch('app.api.routes.validate_and_process_image') as mock_process:
                    with patch('app.api.routes.generate_art_from_doodle') as mock_generate:
                        mock_decode.return_value = b'decoded_image_data'
                        mock_process.return_value = io.BytesIO(b'processed_image_data')
                        mock_generate.side_effect = Exception("OpenAI API Error")
                        
                        response, status_code = generate()
        
        # Convert the response to a dict for testing
        response_data = json.loads(response.get_data())
        
        # Verify response
        self.assertEqual(status_code, 500)
        self.assertIn('error', response_data)
        self.assertIn('failed to generate image', response_data['error'].lower())

if __name__ == '__main__':
    unittest.main()
