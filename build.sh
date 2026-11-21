#!/usr/bin/env bash
# Build the homepage image and push it to the local registry.
# Usage: ./build.sh [image-name]   (REGISTRY env overrides localhost:5000)
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")"

IMAGE="${1:-homepage}"
REGISTRY="${REGISTRY:-localhost:5000}"

docker build --pull \
  -t "${IMAGE}:latest" \
  -t "${REGISTRY}/${IMAGE}:latest" \
  .

docker push "${REGISTRY}/${IMAGE}:latest"
echo "Pushed ${REGISTRY}/${IMAGE}:latest"
