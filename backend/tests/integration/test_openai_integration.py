import os
import unittest
import base64
import json
import io
from PIL import Image
import requests
import time
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get backend URL from environment or use default
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:5000")


class OpenAIIntegrationTests(unittest.TestCase):
    """
    Integration tests for the OpenAI API integration.
    
    These tests verify the actual backend implementation by making real API calls.
    Note: These tests require a valid OpenAI API key in the backend .env file.
    """
    
    def setUp(self):
        """Set up the test environment."""
        # Check if backend is running
        try:
            response = requests.get(f"{BACKEND_URL}/api/health")
            if response.status_code != 200:
                self.skipTest("Backend server is not running or health check failed")
        except requests.RequestException:
            self.skipTest("Backend server is not running")
            
        # Create a simple test image
        self.test_image = self._create_test_image()
    
    def _create_test_image(self):
        """Create a simple test image and convert to base64."""
        # Create a white 512x512 image with a simple shape
        img = Image.new('RGB', (512, 512), color='white')
        
        # Add a simple drawing (a red circle)
        from PIL import ImageDraw
        draw = ImageDraw.Draw(img)
        draw.ellipse((100, 100, 400, 400), fill='red', outline='black', width=5)
        
        # Convert to base64
        buffered = io.BytesIO()
        img.save(buffered, format="PNG")
        img_base64 = base64.b64encode(buffered.getvalue()).decode('utf-8')
        
        return f"data:image/png;base64,{img_base64}"
    
    def test_generate_api_with_basic_image(self):
        """Test the /api/generate endpoint with a basic image."""
        print("Testing /api/generate with a basic circle image...")
        
        # Prepare request payload
        payload = {
            "imageData": self.test_image,
            "promptHint": "circle"
        }
        
        # Make the request
        start_time = time.time()
        response = requests.post(f"{BACKEND_URL}/api/generate", json=payload)
        end_time = time.time()
        
        # Basic assertions
        self.assertEqual(response.status_code, 200, f"API returned status code {response.status_code}, expected 200")
        
        # Verify response structure
        response_data = response.json()
        self.assertIn("imageUrl", response_data, "Response does not contain 'imageUrl' field")
        
        # Verify the URL is valid and accessible
        image_url = response_data["imageUrl"]
        self.assertTrue(image_url.startswith("http"), f"Invalid URL format: {image_url}")
        
        # Try to access the image
        img_response = requests.get(image_url)
        self.assertEqual(img_response.status_code, 200, f"Could not access the generated image at {image_url}")
        
        # Verify response time (should be reasonable for AI generation)
        response_time = end_time - start_time
        print(f"AI generation took {response_time:.2f} seconds")
        
        # Optional: Save the generated image for manual inspection
        with open("integration_test_result.png", "wb") as f:
            f.write(img_response.content)
        print(f"Generated image saved to 'integration_test_result.png'")
        
        return response_data
    
    def test_generate_api_with_template_based_image(self):
        """Test the /api/generate endpoint with a template description."""
        print("Testing /api/generate with template hint 'cat'...")
        
        # Prepare request payload
        payload = {
            "imageData": self.test_image,
            "promptHint": "cat"
        }
        
        # Make the request
        response = requests.post(f"{BACKEND_URL}/api/generate", json=payload)
        
        # Basic assertions
        self.assertEqual(response.status_code, 200, f"API returned status code {response.status_code}, expected 200")
        
        # Verify response structure
        response_data = response.json()
        self.assertIn("imageUrl", response_data, "Response does not contain 'imageUrl' field")
        
        # Verify the URL is valid
        image_url = response_data["imageUrl"]
        self.assertTrue(image_url.startswith("http"), f"Invalid URL format: {image_url}")
        
        # Try to access the image
        img_response = requests.get(image_url)
        self.assertEqual(img_response.status_code, 200, f"Could not access the generated image at {image_url}")
        
        # Optional: Save the generated image for manual inspection
        with open("integration_test_cat_result.png", "wb") as f:
            f.write(img_response.content)
        print(f"Generated cat image saved to 'integration_test_cat_result.png'")
        
        return response_data
    
    def test_error_handling_with_empty_image(self):
        """Test error handling with an empty or invalid image."""
        print("Testing error handling with empty image data...")
        
        # Prepare request payload with empty image data
        payload = {
            "imageData": "data:image/png;base64,",  # Empty image
            "promptHint": "test"
        }
        
        # Make the request
        response = requests.post(f"{BACKEND_URL}/api/generate", json=payload)
        
        # We expect either a 400 Bad Request or a proper error message in a 200 response
        if response.status_code == 400:
            print("Server correctly rejected empty image with 400 status")
        else:
            self.assertEqual(response.status_code, 200, f"Unexpected status code: {response.status_code}")
            response_data = response.json()
            self.assertIn("error", response_data, "Response should contain error message for empty image")
            print(f"Server handled empty image with error message: {response_data.get('error')}")
    
    def test_rate_limiting_handling(self):
        """Test how the backend handles rate limiting from OpenAI."""
        print("Testing rate limiting handling with multiple rapid requests...")
        
        # Make multiple requests in quick succession to potentially trigger rate limiting
        results = []
        for i in range(3):  # Adjust number if needed
            payload = {
                "imageData": self.test_image,
                "promptHint": f"simple shape {i}"
            }
            
            response = requests.post(f"{BACKEND_URL}/api/generate", json=payload)
            results.append({
                "status_code": response.status_code,
                "response": response.json() if response.status_code == 200 else response.text
            })
            
            print(f"Request {i+1} status code: {response.status_code}")
            
        # Check if any rate limiting occurred
        rate_limited = any(r["status_code"] in [429, 500] for r in results)
        if rate_limited:
            print("Rate limiting detected - checking error handling")
            for result in results:
                if result["status_code"] in [429, 500]:
                    if result["status_code"] == 200:
                        self.assertIn("error", result["response"], 
                                     "Rate limited response should contain error field")
                    else:
                        print(f"Rate limiting response: {result}")
        else:
            print("No rate limiting detected in this test run")


if __name__ == "__main__":
    unittest.main() 