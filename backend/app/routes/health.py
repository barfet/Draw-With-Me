"""Health check endpoints for monitoring the API in production."""

from flask import Blueprint, jsonify

health_bp = Blueprint('health', __name__, url_prefix='/api')

@health_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint to verify the API is running.
    
    Returns:
        JSON response with status 'ok'
    """
    return jsonify({
        'status': 'ok',
        'message': 'Draw With Me API is running',
        'service': 'draw-with-me-api'
    }) 