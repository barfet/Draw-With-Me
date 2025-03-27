"""
WSGI entry point for the Draw With Me application.
This file is used by WSGI servers (Gunicorn, uWSGI, etc.) to run the application.
"""

from app import create_app

# Create the Flask application
app = create_app()

def lambda_handler(event, context):
    """Lambda handler function for AWS Lambda deployment.
    
    This function processes API Gateway events and forwards them to the Flask application.
    
    Args:
        event: API Gateway event
        context: Lambda context
        
    Returns:
        API Gateway response
    """
    # Create a proper WSGI environment from the API Gateway event
    # For a production environment, you would use a library like aws-wsgi
    # This is a simplified version for demonstration purposes
    
    try:
        # Extract HTTP method, path, headers, and body from the event
        method = event.get('httpMethod', 'GET')
        path = event.get('path', '/')
        headers = event.get('headers', {})
        body = event.get('body', '')
        
        # Build environment for WSGI application
        environ = {
            'REQUEST_METHOD': method,
            'PATH_INFO': path,
            'QUERY_STRING': event.get('queryStringParameters', ''),
            'CONTENT_LENGTH': str(len(body)) if body else '',
            'CONTENT_TYPE': headers.get('Content-Type', ''),
            'wsgi.version': (1, 0),
            'wsgi.url_scheme': 'https',
            'wsgi.input': body,
            'wsgi.errors': '',
            'wsgi.multithread': False,
            'wsgi.multiprocess': False,
            'wsgi.run_once': False,
        }
        
        # Add HTTP headers
        for key, value in headers.items():
            environ[f'HTTP_{key.upper().replace("-", "_")}'] = value
        
        # Response holder
        response_data = {
            'statusCode': 200,
            'headers': {},
            'body': ''
        }
        
        # WSGI response handler
        def start_response(status, response_headers):
            status_code = int(status.split(' ')[0])
            response_data['statusCode'] = status_code
            for key, value in response_headers:
                response_data['headers'][key] = value
        
        # Process the request and get the response
        response_body = app(environ, start_response)
        response_data['body'] = ''.join(response_body)
        
        # For a production app, you would want to properly handle binary responses,
        # cookies, etc. by using a proper AWS Lambda adapter like aws-wsgi.
        
        return response_data
        
    except Exception as e:
        # Simple error handling
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': f'{{"error": "Internal Server Error", "message": "{str(e)}"}}'
        }

if __name__ == "__main__":
    # Run the application in debug mode when executed directly
    app.run(debug=True, host='0.0.0.0', port=5001) 