#!/bin/bash

# Navigate to the backend directory
cd 2-backend

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set PYTHONPATH
export PYTHONPATH=$(pwd)

# Ensure migrations directory exists
if [ ! -d "migrations" ]; then
    flask db init
fi

# Run database migrations
flask db upgrade

# Navigate to the frontend directory
cd ../1-frontend

# Install frontend dependencies
npm install

# Build frontend assets
npm run build
