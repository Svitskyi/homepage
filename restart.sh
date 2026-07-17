#!/bin/bash
set -e

echo "Restarting homepage..."

bash /home/prod/projects/k8s/homepage/build.sh
kubectl rollout restart deployment/homepage -n homepage
kubectl rollout status deployment/homepage -n homepage --timeout=60s

echo ""
echo "  Homepage: http://localhost:8080"
