# 🚀 QUICK START GUIDE - Marketing Analytics Dashboard

**Repository Location:**  
`/Users/modernmangal/Library/CloudStorage/OneDrive-ModernMangal/srv/marketing-feed-analytics`

**Live Website:**  
https://mdrnmngl.github.io/marketing-feed-analytics/

---

## ⚡ One-Command Daily Update

```bash
cd /Users/modernmangal/Library/CloudStorage/OneDrive-ModernMangal/srv/marketing-feed-analytics
./run_daily_update.sh
```

**What it does:**
1. ✅ Fetches fresh data from Shopify, GA4, Instagram, TikTok, Pinterest
2. ✅ Generates Excel file: `data/Marketing_Analytics_Feed.xlsx`
3. ✅ Exports JSON: `website/js/data.js`
4. ✅ Commits & pushes to GitHub
5. ✅ Website auto-updates in 1-2 minutes

---

## 📂 Repository Structure

```
marketing-feed-analytics/
├── website/              ← Dashboard (HTML/CSS/JS)
├── scripts/              ← Python backend
├── data/                 ← Generated Excel & JSON
├── config/               ← Settings
└── run_daily_update.sh   ← Daily automation
```

---

## 🎯 Quick Commands

### Daily Update (Recommended)
```bash
./run_daily_update.sh
```

### Manual Steps
```bash
# Step 1: Fetch data
python3 scripts/marketing_analytics_feed.py --days 700

# Step 2: Export to JSON
python3 scripts/export_to_json.py

# Step 3: Deploy
git add data/ website/js/data.js
git commit -m "Update $(date '+%Y-%m-%d')"
git push origin main
```

### Add Manual Entries
```bash
# Add influencer post
python3 scripts/marketing_analytics_feed.py --add-influencer

# Add campaign event
python3 scripts/marketing_analytics_feed.py --add-campaign
```

---

## 📊 Output Files

### Excel (Detailed Analysis)
**Location:** `data/Marketing_Analytics_Feed.xlsx`

**7 Sheets:**
1. Timeline - Daily metrics
2. Social Media Details - Post performance
3. Marketing Events - Event correlation
4. Heat Map - Weekly patterns
5. Traffic Sources - Attribution
6. Geography - Regional analysis
7. Summary - Totals & averages

### Website (Client Presentation)
**URL:** https://mdrnmngl.github.io/marketing-feed-analytics/

**6 Tabs:**
- 📊 Dashboard
- 📱 Social Media
- 🔥 Heat Map
- 🗺️ Geography
- 🚀 Traffic Sources
- 📋 Raw Data

---

## 🔐 Credentials Status

**Location:** `/srv/secrets/`

| Platform | File | Status |
|----------|------|--------|
| Google Analytics | `google_analytics_credentials.json` | ✅ Ready |
| Shopify Orders | `shopify_orders_credentials.env` | ✅ Ready |
| Shopify Analytics | `shopify_credentials.env` | ✅ Ready |
| Instagram | `instagram_credentials.env` | ⏳ Pending |
| TikTok | `tiktok_credentials.env` | ⏳ Pending |
| Pinterest | `pinterest_credentials.env` | ⏳ Pending |
| Meta Ads | `meta_ads_credentials.env` | ⏳ Pending |
| Google Ads | `google_ads_credentials.json` | ⏳ Pending |

**Note:** Scripts gracefully handle missing credentials - they'll skip those platforms and continue.

---

## ⚙️ Configuration

**File:** `config/marketing_config.json`

```json
{
  "ga4_property_id": "448993628",
  "ga4_credentials_json": "/Users/.../srv/secrets/google_analytics_credentials.json",
  "lookback_days": 700,
  "correlation_window_days": 7
}
```

---

## 🐛 Troubleshooting

### Website Not Showing Data?
```bash
# Check if data file exists
ls -lh data/Marketing_Analytics_Feed.xlsx

# Check if JSON was generated
ls -lh website/js/data.js

# Regenerate
./run_daily_update.sh
```

### Git Push Failed?
```bash
# Check status
git status

# Pull latest first
git pull origin main

# Then push again
git push origin main
```

### API Errors?
```bash
# Test with shorter timeframe
python3 scripts/marketing_analytics_feed.py --days 7

# Check specific credential file
cat /Users/modernmangal/Library/CloudStorage/OneDrive-ModernMangal/srv/secrets/[PLATFORM]_credentials.env
```

### Website Shows Old Data?
1. Wait 2-3 minutes after git push
2. Hard refresh browser: `Cmd + Shift + R`
3. Check GitHub Actions tab for deployment status
4. Verify GitHub Pages is enabled (Settings → Pages)

---

## 📅 Recommended Workflow

### Daily (Automated)
```bash
# Morning: Update dashboard
./run_daily_update.sh
```

### Weekly (Manual Review)
1. Open Excel: `data/Marketing_Analytics_Feed.xlsx`
2. Review Social Media Details sheet
3. Check which posts drove revenue
4. Identify top-performing content

### Monthly (Analysis)
1. Share website link with boss: https://mdrnmngl.github.io/marketing-feed-analytics/
2. Export specific date ranges from Excel
3. Create monthly reports

---

## 🎯 Next Steps

### Immediate
1. ✅ Enable GitHub Pages (Settings → Pages → main branch)
2. ⏳ Grant GA4 access to service account email
3. ⏳ Collect Instagram credentials

### Soon
1. Add Instagram credentials → Get real social data
2. Add TikTok credentials → Track TikTok performance
3. Add Pinterest credentials → Complete social coverage
4. Run first real data update → Replace dummy data

### Future Enhancements
- [ ] GitHub Actions daily cron (auto-update at 9 AM)
- [ ] Email alerts for revenue spikes
- [ ] Forecasting with ML
- [ ] A/B test tracking

---

## 📞 Help

**Documentation:**
- `README.md` - Full setup guide
- `PROJECT_STRUCTURE.md` - Technical architecture
- `DEPLOYMENT_GUIDE.md` - GitHub Pages setup
- `WEBSITE_COMPLETE.md` - Feature documentation

**Key Files:**
- `run_daily_update.sh` - Main automation script
- `scripts/marketing_analytics_feed.py` - Data collector
- `scripts/export_to_json.py` - Excel → JSON converter

**Common Issues:**
- Credentials missing → Check `/srv/secrets/`
- Data not updating → Run `./run_daily_update.sh`
- Website not loading → Enable GitHub Pages
- API errors → Check credential expiration

---

**Last Updated:** January 29, 2026  
**Repository:** github.com/mdrnmngl/marketing-feed-analytics  
**Location:** `/srv/marketing-feed-analytics/`
