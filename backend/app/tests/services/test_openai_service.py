import unittest
from unittest.mock import patch, MagicMock
import io
import sys
import os

# Add the parent directory to sys.path to import the app module
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))))

from app.services.openai_service import (
    initialize_openai_client,
    generate_art_from_doodle
)

class TestOpenAIService(unittest.TestCase):
    
    @patch('app.services.openai_service.os.getenv')
    def test_initialize_openai_client(self, mock_getenv):
        """Test initializing the OpenAI client."""
        # Test with API key set
        mock_getenv.return_value = "test_api_key"
        client = initialize_openai_client()
        self.assertIsNotNone(client)
        
        # Test with no API key
        mock_getenv.return_value = None
        with self.assertRaises(ValueError):
            initialize_openai_client()
    
    @patch('app.services.openai_service.initialize_openai_client')
    def test_generate_art_from_doodle(self, mock_init_client):
        """Test generating art from a doodle."""
        # Mock the OpenAI client and its response
        mock_client = MagicMock()
        mock_init_client.return_value = mock_client
        
        # Mock the successful response
        mock_response = MagicMock()
        mock_response.data = [MagicMock(url="https://example.com/image.png")]
        mock_client.images.edit.return_value = mock_response
        
        # Test with valid inputs
        image_bytes = io.BytesIO(b'test_image_data')
        result = generate_art_from_doodle(image_bytes, "cat")
        
        # Check the result
        self.assertEqual(result, "https://example.com/image.png")
        
        # Verify the OpenAI client was called with the correct parameters
        mock_client.images.edit.assert_called_once()
        call_args = mock_client.images.edit.call_args[1]
        self.assertEqual(call_args["n"], 1)
        self.assertEqual(call_args["size"], "1024x1024")
        self.assertEqual(call_args["response_format"], "url")
        self.assertIn("children's coloring book style", call_args["prompt"].lower())
        self.assertIn("cat", call_args["prompt"].lower())
        self.assertIn("safe for children", call_args["prompt"].lower())
        
        # Test with API error
        mock_client.images.edit.side_effect = Exception("API Error")
        with self.assertRaises(Exception):
            generate_art_from_doodle(image_bytes, "cat")

if __name__ == '__main__':
    unittest.main()
