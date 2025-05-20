#!/bin/bash

set -e

if [ -z "$1" ]; then
  echo "❌ A version number is expected : ./publish.sh 1.0.1"
  exit 1
fi

VERSION=$1

for pkg in packages/*; do
  if [ -f "$pkg/package.json" ]; then
    sed -i '' -E "s/\"version\": \"[^\"]+\"/\"version\": \"$VERSION\"/" "$pkg/package.json"
  fi
done

pnpm -r run build
pnpm dlx @changesets/cli version
pnpm dlx @changesets/cli publish --access public