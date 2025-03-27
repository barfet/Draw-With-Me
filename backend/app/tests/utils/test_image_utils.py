import unittest
import base64
import io
from PIL import Image
import sys
import os

# Add the parent directory to sys.path to import the app module
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))))

from app.utils.image_utils import (
    decode_base64_image,
    validate_and_process_image,
    resize_and_pad_image
)

class TestImageUtils(unittest.TestCase):
    def setUp(self):
        """Create a simple test image for testing."""
        # Create a small red square image
        self.test_img = Image.new('RGBA', (100, 100), color=(255, 0, 0, 255))
        self.img_buffer = io.BytesIO()
        self.test_img.save(self.img_buffer, format='PNG')
        self.img_buffer.seek(0)
        self.base64_img = base64.b64encode(self.img_buffer.getvalue()).decode('utf-8')
        self.data_url = f"data:image/png;base64,{self.base64_img}"
        
    def test_decode_base64_image(self):
        """Test decoding a base64 image."""
        # Test with valid data URL format
        result = decode_base64_image(self.data_url)
        self.assertIsInstance(result, bytes)
        
        # Test with just the base64 string (no data URL prefix)
        result = decode_base64_image(self.base64_img)
        self.assertIsInstance(result, bytes)
        
        # Test with invalid input
        with self.assertRaises(ValueError):
            decode_base64_image("not-a-base64-string")
    
    def test_validate_and_process_image(self):
        """Test validating and processing image bytes."""
        # Test with valid PNG image
        img_bytes = self.img_buffer.getvalue()
        result = validate_and_process_image(img_bytes)
        self.assertIsInstance(result, io.BytesIO)
        
        # Test with empty image
        with self.assertRaises(ValueError):
            validate_and_process_image(b'')
        
        # Test with invalid image data
        with self.assertRaises(ValueError):
            validate_and_process_image(b'not-an-image')
    
    def test_resize_and_pad_image(self):
        """Test resizing and padding an image to square dimensions."""
        # Test with square image
        result = resize_and_pad_image(self.test_img, target_size=(50, 50))
        self.assertEqual(result.size, (50, 50))
        
        # Test with rectangular image (wider)
        rect_img = Image.new('RGBA', (200, 100), color=(0, 255, 0, 255))
        result = resize_and_pad_image(rect_img, target_size=(50, 50))
        self.assertEqual(result.size, (50, 50))
        
        # Test with rectangular image (taller)
        rect_img = Image.new('RGBA', (100, 200), color=(0, 0, 255, 255))
        result = resize_and_pad_image(rect_img, target_size=(50, 50))
        self.assertEqual(result.size, (50, 50))

if __name__ == '__main__':
    unittest.main()
