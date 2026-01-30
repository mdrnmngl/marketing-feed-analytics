# 🎯 Marketing Analytics Dashboard

**Modern Mangal - Unified Marketing Data & Insights**

> A complete analytics solution combining Shopify sales, website traffic (Google Analytics), social media posts (Instagram, TikTok, Pinterest), and ad campaigns (Meta, Google) into one interactive dashboard.

## 🌐 Live Dashboard

**Website:** https://mdrnmngl.github.io/marketing-feed-analytics/

View real-time marketing analytics with:
- **📊 Dashboard Overview** - Revenue trends, traffic analysis, and activity timeline
- **📱 Social Media Analytics** - Post-level performance with engagement metrics and 7-day impact
- **🔥 Heat Map** - Weekly activity intensity visualization
- **🌍 Geographic Analysis** - Interactive world map showing traffic by country  
- **🚀 Traffic Sources** - Breakdown of where visitors come from
- **📋 Raw Data** - Complete timeline data in table format

---

## 📁 Repository Structure

```
marketing-feed-analytics/
├── website/              # GitHub Pages dashboard
│   ├── index.html       # Main dashboard UI
│   ├── css/style.css    # Responsive styling
│   └── js/
│       ├── data.js      # Analytics data (auto-generated)
│       ├── charts.js    # Chart.js visualizations
│       └── app.js       # Application logic
│
├── scripts/             # Backend Python scripts
│   ├── marketing_analytics_feed.py  # Main data collector
│   ├── api_connectors.py            # Platform API integrations
│   ├── export_to_json.py            # Excel → JSON converter
│   └── requirements.txt             # Python dependencies
│
├── data/                # Generated data files
│   ├── Marketing_Analytics_Feed.xlsx  # Excel output
│   ├── influencer_posts.json          # Manual entries
│   └── ad_campaigns.json              # Manual entries
│
├── config/              # Configuration
│   └── marketing_config.json
│
├── run_daily_update.sh  # One-click update script
└── README.md
```

---

## 🚀 Quick Start

### 1. Initial Setup

```bash
# Repository is already cloned at:
cd /Users/modernmangal/Library/CloudStorage/OneDrive-ModernMangal/srv/marketing-feed-analytics

# Install Python dependencies
pip install -r scripts/requirements.txt
```

### 2. Configure Credentials

**Required Files** (already in `/srv/secrets/`):
- ✅ `google_analytics_credentials.json` - GA4 service account (Property: 448993628)
- ✅ `shopify_orders_credentials.env` - Shopify API access
- 🔄 `instagram_credentials.env` - Instagram Graph API (to be added)
- 🔄 `tiktok_credentials.env` - TikTok Business API
- 🔄 `pinterest_credentials.env` - Pinterest API
- 🔄 `meta_ads_credentials.env` - Meta Ads Manager
- 🔄 `google_ads_credentials.json` + `google_ads_config.env` - Google Ads API

**Config file:** `config/marketing_config.json` (already configured with 700 days lookback)

### 3. Generate Data & Deploy

```bash
# Run the daily update script (does everything!)
./run_daily_update.sh
```

This will:
1. ✅ Fetch data from all platforms
2. ✅ Generate `data/Marketing_Analytics_Feed.xlsx`
3. ✅ Export JSON to `website/js/data.js`
4. ✅ Commit and push to GitHub
5. ✅ Website auto-updates in 1-2 minutes

---

## 🔄 Daily Updates

### Option 1: One-Click Script (Recommended)

```bash
./run_daily_update.sh
```

### Option 2: Manual Steps

```bash
# Step 1: Collect data from all platforms
python3 scripts/marketing_analytics_feed.py --days 700

# Step 2: Export to JSON for website
python3 scripts/export_to_json.py

# Step 3: Deploy to GitHub
git add data/ website/js/data.js
git commit -m "Daily update $(date '+%Y-%m-%d')"
git push origin main
```

Website updates automatically within 1-2 minutes after push!

---

## 📊 Data Sources

1. Push your code to GitHub
2. Go to repository Settings → Pages  
3. Select branch: `main`
4. Select folder: `/ (root)`
5. Click Save
6. Site will be live at: https://mdrnmngl.github.io/marketing-feed-analytics/

## Updating Data

Replace dummy data with real data:

```bash
# Generate real data from APIs
python3 scripts/marketing_analytics_feed.py --days 700

# Export to JSON
python3 scripts/export_to_json.py

# Delete the old dummy data file
rm website/js/data.js.backup  # if you backed it up

# Commit changes
git add website/js/data.js
git commit -m "Switch to real data"
git push origin main
```

Your dashboard will update automatically with real data within 2 minutes!

---

## 📈 Excel Output

Besides the website, you also get a comprehensive Excel file:

**Location:** `data/Marketing_Analytics_Feed.xlsx`

**7 Sheets:**
1. **Timeline** - Daily metrics (revenue, orders, sessions, events)
2. **Social Media Details** - Individual posts with 7-day impact analysis
3. **Marketing Events** - Days with influencer/campaign activity
4. **Heat Map** - Weekly activity intensity
5. **Traffic Sources** - Referral breakdown
6. **Geography** - Traffic by country
7. **Summary** - Key totals and averages

---

## 🛠️ Manual Data Entry

Add posts/campaigns not captured by APIs:

```bash
# Add influencer post
python3 scripts/marketing_analytics_feed.py --add-influencer

# Add campaign event
python3 scripts/marketing_analytics_feed.py --add-campaign
```

Manual entries saved in:
- `data/influencer_posts.json`
- `data/ad_campaigns.json`

---

## 🔐 Security

- ✅ Credentials stored in `/srv/secrets/` (NOT in this repo)
- ✅ Only aggregated data committed to GitHub
- ✅ No sensitive information in website files
- ✅ Safe to share website link publicly

---

## 📞 Troubleshooting

**Website not updating?**
1. Check GitHub Actions tab for deployment status
2. Verify GitHub Pages is enabled (Settings → Pages)
3. Wait 2-3 minutes after git push

**No data showing?**
1. Run `python3 scripts/marketing_analytics_feed.py --days 7` for test
2. Check `data/Marketing_Analytics_Feed.xlsx` was created
3. Verify `website/js/data.js` has recent timestamp

**API errors?**
1. Verify credential files exist in `/srv/secrets/`
2. Check API access tokens haven't expired
3. Review console output for specific error messages

---

**Last Updated:** January 29, 2026  
**Repository:** https://github.com/mdrnmngl/marketing-feed-analytics  
**Live Site:** https://mdrnmngl.github.io/marketing-feed-analytics/
````
5. Click Save
6. Your dashboard will be live at `https://yourusername.github.io/marketing-feed-analytics/`

## File Structure

```
marketing-feed-analytics/
├── index.html              # Main HTML file
├── css/
│   └── style.css          # All styles
├── js/
│   ├── data.js            # Data source (dummy data for now)
│   ├── charts.js          # Chart configurations
│   └── app.js             # Main application logic
└── README.md
```

## Updating Data

To connect real data instead of dummy data:

1. Replace `js/data.js` with API calls to your backend
2. Or generate a JSON file from the Excel export script
3. Update the `analyticsData` object structure accordingly

## Customization

- **Colors**: Edit CSS variables in `css/style.css`
- **Charts**: Modify configurations in `js/charts.js`
- **Data Display**: Update functions in `js/app.js`

## Browser Support

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Responsive design works on all screen sizes

## License

© 2026 Modern Mangal. All rights reserved.
