#!/bin/bash
###############################################################################
# Marketing Analytics Dashboard - Daily Update Script
# 
# This script:
# 1. Runs the marketing analytics feed generator (Python)
# 2. Exports data to JSON for the website
# 3. Commits and pushes changes to GitHub
# 4. Your website automatically updates!
###############################################################################

set -e  # Exit on error

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "========================================="
echo "Marketing Analytics Dashboard Update"
echo "========================================="
echo "Started: $(date)"
echo ""

# Step 1: Generate Excel data from all platforms
echo "📊 Step 1: Fetching data from all platforms..."
python3 scripts/marketing_analytics_feed.py --days 700

if [ ! -f "data/Marketing_Analytics_Feed.xlsx" ]; then
    echo "❌ Error: Excel file not generated"
    exit 1
fi

echo "✅ Excel file generated successfully"
echo ""

# Step 2: Export to JSON for website
echo "🌐 Step 2: Converting to JSON for website..."
python3 scripts/export_to_json.py

if [ ! -f "website/js/data.js" ]; then
    echo "❌ Error: JSON export failed"
    exit 1
fi

echo "✅ JSON export completed"
echo ""

# Step 3: Commit and push to GitHub
echo "📤 Step 3: Deploying to GitHub Pages..."

# Check if there are changes
if git diff --quiet && git diff --cached --quiet; then
    echo "ℹ️  No changes detected - website is up to date"
else
    git add data/Marketing_Analytics_Feed.xlsx
    git add website/js/data.js
    git commit -m "Daily update: $(date '+%Y-%m-%d %H:%M')"
    git push origin main
    
    echo "✅ Pushed to GitHub"
    echo ""
    echo "🎉 Website will update in 1-2 minutes at:"
    echo "   https://mdrnmngl.github.io/marketing-feed-analytics/"
fi

echo ""
echo "========================================="
echo "Update Complete: $(date)"
echo "========================================="
