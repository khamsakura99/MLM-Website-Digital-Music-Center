#!/bin/bash
# Script to push MLM Platform to your GitHub repository
# Usage: ./push_to_github.sh <YOUR_GITHUB_REPO_URL>

if [ -z "$1" ]; then
    echo "Usage: ./push_to_github.sh <YOUR_GITHUB_REPO_URL>"
    echo "Example: ./push_to_github.sh https://github.com/yourusername/omc-mlm-platform.git"
    exit 1
fi

REPO_URL=$1

echo "Building production package..."
npm run build
rm -rf docs && cp -r dist docs

echo "Adding changes to git..."
git add -A
git commit -m "deploy: update production build and GitHub Pages deployment configuration" 2>/dev/null || true

echo "Configuring remote origin to $REPO_URL..."
git remote remove origin 2>/dev/null
git remote add origin "$REPO_URL"

echo "Checking branch..."
git branch -M main

echo "Pushing code to GitHub..."
git push -u origin main --force

echo "Done! Your code is now live on GitHub."
