#!/bin/bash

# Navigate to frontend directory
cd 1-frontend/translation-app || exit

# Install frontend dependencies
npm install

# Build the frontend
npm run build

# Navigate back to the root directory
cd ../../2-backend || exit

# Check if the virtual environment directory exists, create if it doesn't
if [ ! -d "venv" ]; then
  python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install backend dependencies
pip install -r requirements.txt

# Set PYTHONPATH to ensure correct module imports
export PYTHONPATH=$(pwd)

# Run database migrations if any (for example using Flask-Migrate)
flask db upgrade



