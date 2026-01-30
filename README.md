# Modern Mangal - Marketing Analytics Dashboard

A professional, interactive analytics dashboard for visualizing marketing performance data.

## Features

- **📊 Dashboard Overview** - Key metrics, revenue trends, and activity timeline
- **📱 Social Media Analytics** - Post-level performance with engagement metrics and impact analysis
- **🔥 Heat Map** - Weekly activity intensity visualization
- **🌍 Geographic Analysis** - Interactive world map showing traffic by country
- **🚀 Traffic Sources** - Breakdown of where visitors come from
- **📋 Raw Data** - Complete timeline data in table format

## Live Demo

Visit the dashboard: **[Your GitHub Pages URL will be here]**

## Technology Stack

- Pure HTML5/CSS3/JavaScript (no frameworks needed)
- Chart.js for data visualizations
- Leaflet for interactive maps
- Responsive design for all screen sizes

## Data Source

Currently uses dummy data for demonstration. Once API credentials are configured, the dashboard will automatically pull real data from:
- Shopify (sales, traffic)
- Google Analytics (web traffic)
- Instagram, TikTok, Pinterest (social media)
- Meta Ads, Google Ads (campaigns)

## Local Development

```bash
# Clone the repository
git clone https://github.com/yourusername/marketing-feed-analytics.git

# Open index.html in your browser
# OR use a local server:
python3 -m http.server 8000
# Then visit http://localhost:8000
```

## Deploying to GitHub Pages

1. Push your code to GitHub
2. Go to repository Settings → Pages
3. Select branch: `main`
4. Select folder: `/ (root)`
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
