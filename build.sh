#!/bin/bash

#Exit if command exits with non-zero
set -e


#Navigate to frontend and build it
cd frontend
npm install
npm run build


#Navigate back to the root
cd ..

#Navigate to the backedn and set up environment
cd 2-backend
pip install -r backend/requirements.txt

