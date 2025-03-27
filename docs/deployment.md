# Draw With Me - Deployment Guide

This document outlines the deployment process for the Draw With Me application, including the CI/CD pipeline and AWS infrastructure setup.

## Architecture Overview

The Draw With Me application is deployed using a modern cloud-native architecture:

- **Frontend**: Static React application hosted on AWS S3 and distributed via CloudFront CDN
- **Backend**: Python Flask API deployed as an AWS Lambda function and exposed through API Gateway
- **CI/CD**: Automated build, test, and deployment pipeline using GitHub Actions

```
                      ┌─────────────────┐
                      │  GitHub Actions │
                      │     CI/CD       │
                      └────────┬────────┘
                               │
          ┌───────────────────┴───────────────────┐
          │                                       │
          ▼                                       ▼
┌─────────────────────┐               ┌─────────────────────┐
│  Frontend Pipeline  │               │  Backend Pipeline   │
│                     │               │                     │
│ ┌─────────────────┐ │               │ ┌─────────────────┐ │
│ │ Build React App │ │               │ │ Run Python Tests│ │
│ └────────┬────────┘ │               │ └────────┬────────┘ │
│          │          │               │          │          │
│ ┌────────▼────────┐ │               │ ┌────────▼────────┐ │
│ │ Run Jest Tests  │ │               │ │ Package Lambda  │ │
│ └────────┬────────┘ │               │ └────────┬────────┘ │
│          │          │               │          │          │
│ ┌────────▼────────┐ │               │ ┌────────▼────────┐ │
│ │  Deploy to S3   │ │               │ │Deploy to Lambda │ │
│ └────────┬────────┘ │               │ └────────┬────────┘ │
└──────────┼──────────┘               └──────────┼──────────┘
           │                                     │
┌──────────▼──────────┐             ┌────────────▼────────────┐
│    AWS S3 Bucket    │             │       AWS Lambda        │
└──────────┬──────────┘             └────────────┬────────────┘
           │                                     │
┌──────────▼──────────┐             ┌────────────▼────────────┐
│  CloudFront CDN     │             │     API Gateway         │
└──────────┬──────────┘             └────────────┬────────────┘
           │                                     │
           └─────────────────┬─────────────────┘
                             │
                             ▼
                    ┌─────────────────────┐
                    │       Users         │
                    └─────────────────────┘
```

## AWS Infrastructure Setup

The AWS infrastructure is defined using CloudFormation, which creates all the necessary resources as a stack.

### Resources Created

1. **Frontend**:
   - S3 Bucket for hosting static files
   - CloudFront Distribution for content delivery
   - CloudFront Origin Access Identity for S3 access control

2. **Backend**:
   - Lambda Function for hosting the Flask API
   - API Gateway for exposing the Lambda function
   - IAM Role for Lambda execution

### Setting Up Infrastructure

1. Navigate to the `infrastructure` directory:
   ```bash
   cd infrastructure
   ```

2. Make the deployment script executable:
   ```bash
   chmod +x deploy.sh
   ```

3. Set your OpenAI API key as an environment variable:
   ```bash
   export OPENAI_API_KEY=your_openai_api_key
   ```

4. Run the deployment script:
   ```bash
   ./deploy.sh
   ```

5. Note the output values after successful deployment:
   - CloudFront URL (for accessing the frontend)
   - API Gateway URL (for backend API calls)
   - S3 Bucket name (for CI/CD pipeline)
   - CloudFront Distribution ID (for cache invalidation)

## CI/CD Pipeline

The CI/CD pipeline is implemented using GitHub Actions and is defined in `.github/workflows/ci-cd.yml`.

### Pipeline Setup

1. Add the following secrets to your GitHub repository:
   - `AWS_ACCESS_KEY_ID`: Your AWS access key
   - `AWS_SECRET_ACCESS_KEY`: Your AWS secret key
   - `AWS_S3_BUCKET`: S3 bucket name (from CloudFormation output)
   - `AWS_CLOUDFRONT_DISTRIBUTION_ID`: CloudFront distribution ID (from CloudFormation output)
   - `AWS_LAMBDA_FUNCTION_NAME`: Lambda function name (from CloudFormation output, typically "draw-with-me-api")
   - `OPENAI_API_KEY`: Your OpenAI API key

2. Push to the main branch to trigger the CI/CD pipeline.

### Pipeline Workflow

1. **Testing Phase**:
   - Build and test the frontend React application
   - Test the backend Python Flask API

2. **Deployment Phase** (only on main branch):
   - Deploy the frontend to S3 and invalidate CloudFront cache
   - Package and deploy the backend to Lambda

## Frontend Configuration

Update the frontend environment variables to point to the deployed backend:

1. Create or update `.env` file in the frontend directory:
   ```
   REACT_APP_API_URL=https://your-api-gateway-id.execute-api.us-east-1.amazonaws.com/prod/api
   ```

2. Rebuild and redeploy the frontend (or let the CI/CD pipeline handle it).

## Local Development vs. Production

### Local Development

- Frontend: `npm start` (runs on `http://localhost:3000`)
- Backend: `flask run` (runs on `http://localhost:5000`)
- Environment variables in local `.env` files

### Production

- Frontend: Hosted on S3, served via CloudFront
- Backend: Runs as a Lambda function, accessed via API Gateway
- Environment variables configured in AWS Lambda environment

## Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Check API Gateway CORS configuration
   - Verify frontend API URL is correct

2. **Lambda Deployment Failures**:
   - Check Lambda function logs in AWS CloudWatch
   - Verify Lambda has enough memory and timeout settings

3. **CloudFront Cache Issues**:
   - Manual invalidation: `aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"`

4. **Missing AWS Permissions**:
   - Verify the IAM user has the necessary permissions for S3, CloudFront, Lambda, and API Gateway

## Monitoring and Maintenance

- **Logs**: Check AWS CloudWatch Logs for Lambda function logs
- **Metrics**: Monitor Lambda execution metrics in CloudWatch
- **Costs**: Keep an eye on AWS billing and OpenAI API usage

## Updating the Application

1. Make changes to your code locally
2. Push to GitHub
3. The CI/CD pipeline automatically deploys your changes

For manual updates:
- Frontend: Build and upload to S3, invalidate CloudFront cache
- Backend: Package and update Lambda function code 