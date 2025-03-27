#!/bin/bash
# Deploy the Draw With Me infrastructure to AWS

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ Error: AWS CLI is not installed."
    echo "Please install it from https://aws.amazon.com/cli/"
    exit 1
fi

# Check if AWS is configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ Error: AWS CLI is not configured."
    echo "Please run 'aws configure' to set up your AWS credentials."
    exit 1
fi

# Set variables
STACK_NAME="draw-with-me"
TEMPLATE_FILE="cloudformation.yml"
REGION="us-east-1"

# Check for OpenAI API key
if [ -z "$OPENAI_API_KEY" ]; then
    echo "❌ Error: OPENAI_API_KEY environment variable is not set."
    echo "Please set it using 'export OPENAI_API_KEY=your_api_key'"
    exit 1
fi

echo "Deploying Draw With Me infrastructure to AWS..."
echo "Stack name: $STACK_NAME"
echo "Region: $REGION"
echo ""

# Create/update the CloudFormation stack
aws cloudformation deploy \
    --template-file $TEMPLATE_FILE \
    --stack-name $STACK_NAME \
    --parameter-overrides \
        ProjectName=$STACK_NAME \
        LambdaFunctionName="$STACK_NAME-api" \
        OpenAIApiKey=$OPENAI_API_KEY \
    --capabilities CAPABILITY_IAM \
    --region $REGION

# Check if deployment was successful
if [ $? -eq 0 ]; then
    echo "✅ Infrastructure deployment successful!"
    
    # Get the outputs from the CloudFormation stack
    echo ""
    echo "Fetching deployment outputs..."
    aws cloudformation describe-stacks \
        --stack-name $STACK_NAME \
        --query "Stacks[0].Outputs" \
        --output table \
        --region $REGION
    
    # Instructions for next steps
    echo ""
    echo "Next steps:"
    echo "1. Update your frontend .env file with the API Gateway URL"
    echo "2. Run the CI/CD pipeline to deploy your code"
    echo "3. Access your application using the CloudFront URL"
else
    echo "❌ Infrastructure deployment failed!"
    echo "Check the CloudFormation console for more details."
fi 