#!/bin/bash

echo "=== Build-And-Zip Start ==="
echo ""

echo "--- Remove old building files"
rm -rf .next build.zip
echo ""

echo "--- npm --omit=dev install"
npm --omit=dev install
echo ""

echo "--- Build the web application"
NODE_ENV=production npm run build
echo ""

echo "--- Zip the build files"
zip build.zip -r .next package.json package-lock.json next.config.js public
echo ""

echo "=== Build-And-Zip Done! ==="
