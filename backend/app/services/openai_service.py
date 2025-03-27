import os
from openai import OpenAI
import logging

# Set up logging
logger = logging.getLogger(__name__)

def initialize_openai_client():
    """
    Initialize and return the OpenAI client using API key from environment variables.
    
    Returns:
        OpenAI: Initialized OpenAI client
        
    Raises:
        ValueError: If the API key is not found in environment variables
    """
    api_key = os.getenv('OPENAI_API_KEY')
    if not api_key:
        raise ValueError("OpenAI API key not found in environment variables")
    
    return OpenAI(api_key=api_key)

def generate_art_from_doodle(image_bytes, prompt_hint=None):
    """
    Generate art from a doodle using OpenAI's image API.
    
    Args:
        image_bytes (io.BytesIO): Processed image as a file-like object
        prompt_hint (str, optional): Optional hint about the content (e.g., "cat", "robot")
        
    Returns:
        str: URL of the generated image
        
    Raises:
        Exception: If the API call fails or returns an error
    """
    # Initialize the OpenAI client
    client = initialize_openai_client()
    
    # Construct the text prompt
    base_prompt = "Children's coloring book style, vibrant colors, simple and fun, based on the provided sketch"
    if prompt_hint:
        base_prompt += f" of a {prompt_hint}"
    safety_prompt = "Ensure output is safe for children, not scary, not violent, not NSFW."
    
    full_prompt = f"{base_prompt}. {safety_prompt}"
    
    try:
        logger.info(f"Sending request to OpenAI with prompt: {full_prompt}")
        
        # Call the OpenAI API
        response = client.images.edit(
            image=image_bytes,
            prompt=full_prompt,
            n=1,
            size="1024x1024",
            response_format="url"
        )
        
        # Extract the image URL from the response
        image_url = response.data[0].url
        logger.info(f"Successfully generated image: {image_url}")
        
        return image_url
    except Exception as e:
        logger.error(f"Error generating image: {str(e)}")
        raise Exception(f"Failed to generate image: {str(e)}")
