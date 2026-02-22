#!/bin/bash
# This script restarts the homepage Docker project.

# Change to the script's directory to ensure docker-compose can find the YAML file
cd "$(dirname "$0")"

echo "Stopping and removing Docker containers..."
docker compose down

docker system prune -f

echo "Rebuilding Docker image without cache..."
docker compose build --no-cache

echo "Starting Docker containers..."
docker compose up -d

echo "Restart complete."
