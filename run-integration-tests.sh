#!/bin/bash
# Run integration tests for the Draw With Me backend
# This script executes the integration tests that verify the actual backend with real OpenAI API calls

# Set the current directory to the script directory
cd "$(dirname "$0")"

echo "=============================================="
echo "Running Draw With Me OpenAI Integration Tests"
echo "=============================================="
echo ""
echo "Note: These tests make REAL API calls to OpenAI"
echo "      and may incur costs on your account."
echo ""
read -p "Press Enter to continue or Ctrl+C to cancel..."

# Find the Python command (try python3 first, then python)
PYTHON_CMD="python3"
if ! command -v $PYTHON_CMD &> /dev/null; then
    PYTHON_CMD="python"
    if ! command -v $PYTHON_CMD &> /dev/null; then
        echo "❌ Error: Neither python3 nor python commands were found!"
        echo "Please ensure Python is installed and in your PATH."
        exit 1
    fi
fi

# Check if required modules are installed
echo "Checking dependencies..."
if ! $PYTHON_CMD -c "import requests, PIL, dotenv" &> /dev/null; then
    echo "❌ Missing required Python dependencies."
    echo "Please run ./setup-test-env.sh to install them."
    exit 1
fi

# Run the integration tests
cd backend
$PYTHON_CMD tests/run_integration_tests.py

# Store the exit code
RESULT=$?

if [ $RESULT -eq 0 ]; then
    echo ""
    echo "✅ All integration tests passed!"
else
    echo ""
    echo "❌ Some integration tests failed. Check the output above for details."
fi

# Exit with the same status code
exit $RESULT 