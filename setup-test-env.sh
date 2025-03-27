#!/bin/bash
# Set up the environment for running Draw With Me integration tests

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

echo "Using Python command: $PYTHON_CMD"

# Create and activate a virtual environment
VENV_DIR="venv"
if [ ! -d "$VENV_DIR" ]; then
    echo "Creating virtual environment..."
    $PYTHON_CMD -m venv $VENV_DIR
    if [ $? -ne 0 ]; then
        echo "❌ Failed to create virtual environment"
        exit 1
    fi
else
    echo "Using existing virtual environment"
fi

# Determine activation script based on OS
if [[ "$OSTYPE" == "darwin"* ]] || [[ "$OSTYPE" == "linux"* ]]; then
    # Mac or Linux
    ACTIVATE_SCRIPT="$VENV_DIR/bin/activate"
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]] || [[ "$OSTYPE" == "win32" ]]; then
    # Windows
    ACTIVATE_SCRIPT="$VENV_DIR/Scripts/activate"
else
    echo "❌ Unsupported operating system"
    exit 1
fi

# Create the .env file for activating the environment
cat > .env.sh << EOF
#!/bin/bash
source "$ACTIVATE_SCRIPT"
EOF
chmod +x .env.sh

# Install dependencies inside the virtual environment
echo "Installing required dependencies..."
source "$ACTIVATE_SCRIPT" && pip install requests pillow python-dotenv

echo "✅ Environment setup completed successfully!"
echo ""
echo "To activate the virtual environment, run:"
echo "  source .env.sh"
echo ""
echo "To run the integration tests, activate the environment first, then run:"
echo "  ./run-integration-tests.sh" 