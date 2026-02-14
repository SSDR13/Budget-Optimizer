#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Configuration
# TODO: Change these to match your Google Cloud project details
PROJECT_ID="rl-budget-optimizer"
REGION="asia-south1"
SERVICE_NAME="rl-budget-api"
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"

echo "========================================================"
echo "Deploying $SERVICE_NAME to Google Cloud Run"
echo "Project: $PROJECT_ID"
echo "Region:  $REGION"
echo "========================================================"

# 0. Enable required services (uncomment if running for the first time)
# echo "Enabling Cloud Build and Cloud Run APIs..."
# gcloud services enable cloudbuild.googleapis.com run.googleapis.com

# 1. Build the container image using Cloud Build
# This zips the current directory and sends it to Cloud Build
echo "Step 1: Building container image..."
gcloud builds submit --tag $IMAGE_NAME .

# 2. Deploy to Cloud Run
echo "Step 2: Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --image $IMAGE_NAME \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --memory 2Gi \
  --cpu 1 \
  --set-env-vars "PROJECT_ID=$PROJECT_ID,ENV=production"

# 3. Output the URL
echo "========================================================"
echo "Deployment Complete! 🚀"
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --platform managed --region $REGION --format 'value(status.url)')
echo "Service URL: $SERVICE_URL"
echo "========================================================"