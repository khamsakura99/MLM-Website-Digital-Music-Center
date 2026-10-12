#!/bin/bash
# Push directly to https://github.com/khamsakura99/Xayraxa-Digital-Music-Center

TARGET_REPO="github.com/khamsakura99/Xayraxa-Digital-Music-Center.git"

if [ -n "$1" ]; then
    TOKEN="$1"
else
    echo "=========================================================="
    echo " Push to https://github.com/khamsakura99/Xayraxa-Digital-Music-Center"
    echo "=========================================================="
    echo "Please enter your GitHub Personal Access Token (PAT):"
    echo "(To generate one: go to https://github.com/settings/tokens -> Generate new token (classic) -> check 'repo')"
    read -p "Token: " TOKEN
fi

if [ -z "$TOKEN" ]; then
    echo "Error: Token cannot be empty."
    exit 1
fi

echo "Building production package and updating /docs..."
npm run build
rm -rf docs && cp -r dist docs

echo "Adding changes to git..."
git add -A
git commit -m "deploy: update production build and GitHub Pages deployment" 2>/dev/null || true

echo "Configuring remote origin with token..."
git remote remove origin 2>/dev/null
git remote add origin "https://${TOKEN}@${TARGET_REPO}"

echo "Checking branch..."
git branch -M main

echo "Pushing code to GitHub..."
git push -u origin main --force

# Clear remote url with token from config for safety
git remote set-url origin "https://github.com/khamsakura99/Xayraxa-Digital-Music-Center.git"

echo "=========================================================="
echo " SUCCESS! All files pushed to:"
echo " https://github.com/khamsakura99/Xayraxa-Digital-Music-Center"
echo "=========================================================="
