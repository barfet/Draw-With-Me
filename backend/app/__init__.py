import os
from flask import Flask
from flask_cors import CORS

def create_app(test_config=None):
    """Create and configure the Flask application.
    
    Args:
        test_config: Configuration for testing
        
    Returns:
        Flask application
    """
    app = Flask(__name__, instance_relative_config=True)
    
    # Load default configuration
    app.config.from_mapping(
        SECRET_KEY='dev',
        OPENAI_API_KEY=os.environ.get('OPENAI_API_KEY'),
    )
    
    # Load test configuration if provided
    if test_config is not None:
        app.config.update(test_config)
    
    # Register blueprints
    from app.routes import generate_bp
    app.register_blueprint(generate_bp)
    
    # Register health check blueprint for production monitoring
    from app.routes.health import health_bp
    app.register_blueprint(health_bp)
    
    # Enable CORS
    CORS(app)
    
    return app
