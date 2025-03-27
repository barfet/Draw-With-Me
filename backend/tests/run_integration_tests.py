#!/usr/bin/env python
"""
Run integration tests for the Draw With Me application.

This script executes integration tests that verify the actual backend 
implementation with real OpenAI API calls.

Usage:
    python run_integration_tests.py
"""

import unittest
import sys
import os
import time
import subprocess
import requests
import signal
import argparse

# Add the parent directory to the path so we can import the integration tests
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from tests.integration.test_openai_integration import OpenAIIntegrationTests

BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:5000")
MAX_STARTUP_WAIT = 30  # Maximum seconds to wait for the backend to start


def is_backend_running():
    """Check if the backend server is running and reachable."""
    try:
        response = requests.get(f"{BACKEND_URL}/api/health", timeout=2)
        return response.status_code == 200
    except requests.RequestException:
        return False


def start_backend_server():
    """Start the backend server as a subprocess."""
    print("Starting backend server...")
    
    # Get the path to the wsgi.py file
    backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    wsgi_path = os.path.join(backend_dir, "wsgi.py")
    
    # Start the server process
    process = subprocess.Popen(
        [sys.executable, wsgi_path],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        # Use process group to ensure we can kill child processes too
        preexec_fn=os.setsid
    )
    
    # Wait for the server to start
    start_time = time.time()
    while time.time() - start_time < MAX_STARTUP_WAIT:
        if is_backend_running():
            print(f"Backend server started successfully at {BACKEND_URL}")
            return process
        time.sleep(1)
    
    # If we get here, the server didn't start in time
    print("Failed to start backend server within timeout period")
    # Kill the process if it's still running but not responding
    try:
        os.killpg(os.getpgid(process.pid), signal.SIGTERM)
    except:
        pass
    return None


def run_tests(start_server=True):
    """Run the integration tests."""
    server_process = None
    
    try:
        # Start the backend server if requested and if it's not already running
        if start_server and not is_backend_running():
            server_process = start_backend_server()
            if not server_process:
                print("Cannot run tests without a running backend server")
                return False
        
        # Run the integration tests
        print("\n===== Running Integration Tests =====\n")
        test_suite = unittest.TestLoader().loadTestsFromTestCase(OpenAIIntegrationTests)
        test_result = unittest.TextTestRunner(verbosity=2).run(test_suite)
        
        # Return True if all tests passed
        return test_result.wasSuccessful()
    
    finally:
        # Clean up the server process if we started it
        if server_process:
            print("Stopping backend server...")
            try:
                os.killpg(os.getpgid(server_process.pid), signal.SIGTERM)
                print("Backend server stopped")
            except:
                print("Failed to stop backend server cleanly")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run integration tests for Draw With Me backend")
    parser.add_argument("--no-server", action="store_true", 
                        help="Don't start a server, use an existing one")
    args = parser.parse_args()
    
    # Run the tests
    success = run_tests(not args.no_server)
    
    # Exit with appropriate code
    sys.exit(0 if success else 1) 