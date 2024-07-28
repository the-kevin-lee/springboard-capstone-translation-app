#!/bin/bash

# Navigate to frontend directory
cd 1-frontend/translation-app || exit

# Install frontend dependencies
npm install

# Build the frontend
npm run build

# Navigate back to the root directory
cd ../../2-backend || exit

# Activate virtual environment
source venv/bin/activate

# Install backend dependencies
pip install -r requirements.txt

# Run database migrations if any (for example using Flask-Migrate)
flask db upgrade
