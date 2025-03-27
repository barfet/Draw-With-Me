from flask import Flask
import logging
import os
from dotenv import load_dotenv
from app.api.routes import api

# Load environment variables
load_dotenv()

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def create_app(testing=False):
    """Create and configure the Flask application."""
    app = Flask(__name__)
    
    # Register blueprints
    app.register_blueprint(api, url_prefix='/api')
    
    return app

# For running directly (development only)
if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
