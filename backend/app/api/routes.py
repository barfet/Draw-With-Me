from flask import Blueprint, request, jsonify
import logging
from app.utils.image_utils import decode_base64_image, validate_and_process_image
from app.services.openai_service import generate_art_from_doodle

# Set up logger
logger = logging.getLogger(__name__)

# Create blueprint
api = Blueprint('api', __name__)

@api.route('/health', methods=['GET'])
def health_check():
    """
    Health check endpoint.
    
    Returns a success message to confirm the API is running.
    """
    return jsonify({"status": "ok", "message": "API is running"}), 200

@api.route('/generate', methods=['POST'])
def generate():
    """
    Generate art from a doodle using OpenAI.
    
    Expects a JSON payload with:
    - imageData: Base64 encoded PNG image (with or without data URL prefix)
    - promptHint (optional): String describing the content (e.g., "cat", "robot")
    
    Returns a JSON response with:
    - imageUrl: URL of the generated image
    Or if an error occurs:
    - error: Description of the error
    """
    data = request.get_json()
    logger.info(f"Received request to /api/generate with payload keys: {list(data.keys() if data else [])}")
    
    # Validate input
    if not data or 'imageData' not in data:
        logger.error("Missing image data in request")
        return jsonify({"error": "Image data is missing"}), 400
    
    # Extract data
    image_data = data.get('imageData')
    prompt_hint = data.get('promptHint')
    
    try:
        # Process the image
        logger.info("Decoding and processing image")
        image_bytes = decode_base64_image(image_data)
        processed_image = validate_and_process_image(image_bytes)
        
        # Generate the art
        logger.info("Calling OpenAI to generate art")
        image_url = generate_art_from_doodle(processed_image, prompt_hint)
        
        # Return the result
        logger.info("Successfully generated art")
        return jsonify({"imageUrl": image_url}), 200
    
    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        return jsonify({"error": f"Invalid image data: {str(e)}"}), 400
    
    except Exception as e:
        logger.error(f"Error generating image: {str(e)}")
        return jsonify({"error": f"Failed to generate image: {str(e)}"}), 500
