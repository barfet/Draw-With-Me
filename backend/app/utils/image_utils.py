import base64
import io
import re
from PIL import Image

def decode_base64_image(base64_string):
    """
    Decode base64 string to bytes, handling both data URL format and raw base64.
    
    Args:
        base64_string (str): Base64 encoded image, with or without data URL prefix
        
    Returns:
        bytes: Decoded image bytes
        
    Raises:
        ValueError: If the input is not a valid base64 string
    """
    # Handle data URL format (data:image/png;base64,...)
    if base64_string.startswith('data:'):
        pattern = r'data:image/[^;]+;base64,(.+)'
        match = re.match(pattern, base64_string)
        if match:
            base64_string = match.group(1)
        else:
            raise ValueError("Invalid data URL format")
    
    try:
        # Add padding if necessary
        missing_padding = len(base64_string) % 4
        if missing_padding:
            base64_string += '=' * (4 - missing_padding)
        
        # Check for valid base64 characters
        if not re.match(r'^[A-Za-z0-9+/=]+$', base64_string):
            raise ValueError("String contains invalid base64 characters")
        
        # Attempt to decode
        image_bytes = base64.b64decode(base64_string)
        
        # Check if decoded content is not empty
        if not image_bytes:
            raise ValueError("Decoded image is empty")
            
        return image_bytes
    except Exception as e:
        raise ValueError(f"Invalid base64 string: {str(e)}")

def validate_and_process_image(image_bytes):
    """
    Validate image bytes and process into the required format for OpenAI API.
    
    Args:
        image_bytes (bytes): Raw image bytes
        
    Returns:
        io.BytesIO: In-memory file-like object containing the processed image
        
    Raises:
        ValueError: If the image is invalid, empty, or too large
    """
    if not image_bytes:
        raise ValueError("Empty image data")
    
    try:
        # Open the image with PIL
        image = Image.open(io.BytesIO(image_bytes))
        
        # Ensure it's in RGBA format (with alpha channel)
        if image.mode != 'RGBA':
            image = image.convert('RGBA')
        
        # Validate image size (OpenAI API has a 4MB limit)
        img_byte_arr = io.BytesIO()
        image.save(img_byte_arr, format='PNG')
        if len(img_byte_arr.getvalue()) > 4 * 1024 * 1024:  # 4MB
            raise ValueError("Image is too large (>4MB)")
        
        # Resize to fit OpenAI requirements (1024x1024 is optimal)
        image = resize_and_pad_image(image, target_size=(1024, 1024))
        
        # Save the resized image to a new byte buffer
        output_buffer = io.BytesIO()
        image.save(output_buffer, format='PNG')
        output_buffer.seek(0)
        
        return output_buffer
    except Exception as e:
        if isinstance(e, ValueError) and "too large" in str(e):
            raise  # Re-raise our own ValueError
        raise ValueError(f"Invalid image data: {str(e)}")

def resize_and_pad_image(image, target_size=(1024, 1024)):
    """
    Resize an image to the target size while maintaining aspect ratio and adding padding.
    
    Args:
        image (PIL.Image): Image to resize
        target_size (tuple): Target size as (width, height)
        
    Returns:
        PIL.Image: Resized and padded image
    """
    # Calculate the scaling factor to maintain aspect ratio
    width_ratio = target_size[0] / image.width
    height_ratio = target_size[1] / image.height
    scale_factor = min(width_ratio, height_ratio)
    
    # Calculate new dimensions
    new_width = int(image.width * scale_factor)
    new_height = int(image.height * scale_factor)
    
    # Resize the image while maintaining aspect ratio
    resized_image = image.resize((new_width, new_height), Image.Resampling.LANCZOS)
    
    # Create a new blank image with the target size and paste the resized image
    new_image = Image.new('RGBA', target_size, (255, 255, 255, 0))  # Transparent background
    
    # Calculate the position to paste the resized image (center it)
    paste_x = (target_size[0] - new_width) // 2
    paste_y = (target_size[1] - new_height) // 2
    
    # Paste the resized image onto the new image
    new_image.paste(resized_image, (paste_x, paste_y))
    
    return new_image
