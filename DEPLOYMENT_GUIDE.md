# GitHub Pages Deployment Guide

## Step-by-Step Instructions to Deploy Your Marketing Analytics Dashboard

### Prerequisites
- ✅ GitHub repository already created and cloned locally
- ✅ Website files ready in the repository

### 1. Commit and Push Your Code

```bash
# Navigate to the repository
cd /Users/modernmangal/Library/CloudStorage/OneDrive-ModernMangal/srv/marketing-feed-analytics

# Check status
git status

# Add all files
git add .

# Commit with message
git commit -m "Add marketing analytics dashboard with interactive visualizations"

# Push to GitHub
git push origin main
```

### 2. Enable GitHub Pages

1. Go to your GitHub repository: `https://github.com/[YOUR_USERNAME]/marketing-feed-analytics`
2. Click **Settings** (top right)
3. Scroll down to **Pages** (left sidebar)
4. Under "Source":
   - Select branch: **main**
   - Select folder: **/ (root)**
   - Click **Save**
5. Wait 2-3 minutes for deployment
6. Your site will be live at: `https://[YOUR_USERNAME].github.io/marketing-feed-analytics/`

### 3. Verify Deployment

Visit your GitHub Pages URL. You should see:
- ✅ Professional dashboard with Modern Mangal branding
- ✅ 6 navigation tabs (Dashboard, Social Media, Heat Map, Geography, Traffic Sources, Raw Data)
- ✅ Interactive charts and visualizations
- ✅ Dummy data showing marketing metrics
- ✅ Responsive design on mobile/tablet/desktop

### 4. Share with Your Boss

Once deployed, send your boss this link:
```
https://[YOUR_USERNAME].github.io/marketing-feed-analytics/
```

**What she'll see:**
- Clean, professional analytics dashboard
- Real-time visualizations of marketing performance
- Interactive geographic map showing traffic by country
- Weekly heat map of marketing activity
- Detailed social media post performance
- All metrics in one place

### 5. Update Data (Later, Once You Have Real Credentials)

**Option A: Manual JSON Update**
1. Run the Python script to generate data:
   ```bash
   cd apps/shopify-extraction
   .venv/bin/python3 export_to_json.py
   ```
2. Copy generated JSON to `marketing-feed-analytics/js/data.js`
3. Commit and push
4. GitHub Pages auto-updates in 1-2 minutes

**Option B: Automated Daily Updates**
1. Set up GitHub Actions to run daily
2. Fetch data from APIs automatically
3. Commit updated JSON file
4. GitHub Pages auto-deploys

### 6. Customize for Your Brand

**Change Colors:**
Edit `css/style.css`, lines 6-17 (CSS variables):
```css
:root {
    --primary-color: #6366F1;  /* Change to your brand color */
    --secondary-color: #EC4899;
    /* etc. */
}
```

**Update Branding:**
Edit `index.html`, line 25:
```html
<h1 class="logo">Modern Mangal</h1>  <!-- Your brand name -->
```

### Troubleshooting

**Site not loading?**
- Wait 3-5 minutes after enabling Pages
- Check repository is public (or you have GitHub Pro for private repos)
- Verify files are in root directory (not in a subfolder)

**Charts not showing?**
- Check browser console for errors (F12)
- Verify all JS files are loading
- Make sure CDN links are accessible (Chart.js, Leaflet)

**Data not updating?**
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Check `data.js` file has correct structure
- Verify JSON syntax is valid

### Need Help?

- GitHub Pages Documentation: https://docs.github.com/pages
- Repository Settings → Pages for deployment status
- Check GitHub Actions tab for build logs

---

## Quick Commands Cheat Sheet

```bash
# Local preview (before deploying)
python3 -m http.server 8000
# Visit: http://localhost:8000

# Deploy to GitHub
git add .
git commit -m "Update data"
git push origin main

# Check git status
git status

# View commit history
git log --oneline
```

---

Your dashboard will be **live on the internet** and **automatically updates** whenever you push changes to GitHub! 🚀
