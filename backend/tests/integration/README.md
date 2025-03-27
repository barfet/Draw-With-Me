# OpenAI Integration Tests

This directory contains integration tests for verifying the actual backend implementation with real OpenAI API calls.

## Purpose

Unlike unit tests that mock external dependencies, these integration tests validate:

1. The end-to-end flow from frontend to backend to OpenAI
2. Proper handling of real API responses and error cases
3. Real-world performance characteristics
4. API key configuration validation

## Prerequisites

1. A valid OpenAI API key configured in your `.env` file:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

2. Python dependencies installed:
   ```
   pip install -r ../../requirements.txt
   ```

## Running the Tests

### Option 1: Using the test runner script (recommended)

The test runner script will automatically start and stop the backend server for you:

```bash
# From the backend directory
python tests/run_integration_tests.py
```

If you already have a backend server running:

```bash
python tests/run_integration_tests.py --no-server
```

### Option 2: Running tests directly

If you want to run the tests directly:

1. Make sure the backend server is running:
   ```bash
   # From the backend directory
   python wsgi.py
   ```

2. In another terminal, run the tests:
   ```bash
   # From the backend directory
   python -m unittest tests.integration.test_openai_integration
   ```

## Test Output

The tests will:

1. Generate actual images through the OpenAI API
2. Save the generated images in the current directory for manual inspection
3. Log response times and other performance metrics
4. Verify proper error handling for edge cases

## Interpreting Results

### Success Case

When tests pass, you'll see:
- All tests marked as passed 
- Response times logged for AI generation
- Generated images saved to disk

### Failure Cases

Common failure scenarios and troubleshooting:

1. **API Key Issues**
   - Error: `Authentication error` or `Invalid API key`
   - Solution: Check your `.env` file has a valid API key

2. **Rate Limiting**
   - Error: Mentions of rate limits or too many requests
   - Solution: The tests include rate limiting handling, but you may need to wait before running again

3. **Network/Connection Issues**
   - Error: Connection timeouts or similar errors
   - Solution: Check your internet connection and that OpenAI services are available

4. **Image Processing Issues**
   - Error: Problems with image validation or processing
   - Solution: Check the implementation of image processing utilities

## Notes

- These tests incur actual API costs since they make real calls to OpenAI
- Test frequency should be limited to avoid unnecessary API charges
- Consider running these tests only for significant changes to the backend 