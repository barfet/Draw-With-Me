"""
WSGI entry point for the Draw With Me application.
This file is used by WSGI servers (Gunicorn, uWSGI, etc.) to run the application.
"""

from app.app import create_app

# Create the Flask application
app = create_app()

if __name__ == '__main__':
    # Run the application in debug mode when executed directly
    app.run(debug=True, host='0.0.0.0', port=5001) 