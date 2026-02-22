#!/bin/bash
# This script restarts the homepage Docker project.

echo "Stopping and removing Docker containers..."
docker compose down

docker system prune -f

echo "Rebuilding Docker image without cache..."
docker compose build --no-cache

echo "Starting Docker containers..."
docker compose up -d

echo "Restart complete."
