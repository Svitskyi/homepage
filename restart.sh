#!/bin/bash
set -e

echo "Restarting homepage..."

bash "$(dirname "$0")/build.sh"
kubectl rollout restart deployment/homepage -n homepage
kubectl rollout status deployment/homepage -n homepage --timeout=60s

echo ""
echo "  Homepage: https://svitskyi.com"
