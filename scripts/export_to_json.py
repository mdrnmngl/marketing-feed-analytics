#!/usr/bin/env python3
"""
Export Marketing Analytics Data to JSON for Website
Converts Excel output to JSON format for the GitHub Pages dashboard
"""

import json
import pandas as pd
from pathlib import Path
from datetime import datetime

# Paths for repository structure
SCRIPT_DIR = Path(__file__).parent
REPO_ROOT = SCRIPT_DIR.parent  # marketing-feed-analytics/
DATA_DIR = REPO_ROOT / "data"
WEBSITE_DIR = REPO_ROOT / "website"
OUTPUT_FILE = WEBSITE_DIR / "js" / "data.js"
EXCEL_FILE = DATA_DIR / "Marketing_Analytics_Feed.xlsx"

def export_to_json():
    """Export Excel data to JSON for website"""
    
    if not EXCEL_FILE.exists():
        print(f"❌ Excel file not found: {EXCEL_FILE}")
        print("Run marketing_analytics_feed.py first to generate data")
        return
    
    print("📊 Reading Excel data...")
    
    # Read sheets
    timeline_df = pd.read_excel(EXCEL_FILE, sheet_name='Timeline')
    social_df = pd.read_excel(EXCEL_FILE, sheet_name='Social Media Details', nrows=50)  # Last 50 posts
    
    # Convert timeline to JSON-friendly format
    timeline_data = []
    for _, row in timeline_df.iterrows():
        timeline_data.append({
            'date': row['date'].strftime('%Y-%m-%d') if pd.notna(row['date']) else None,
            'revenue': float(row.get('total_revenue', 0)) if pd.notna(row.get('total_revenue')) else 0,
            'orders': int(row.get('order_count', 0)) if pd.notna(row.get('order_count')) else 0,
            'sessions': int(row.get('sessions', 0)) if pd.notna(row.get('sessions')) else 0,
            'visitors': int(row.get('users', 0)) if pd.notna(row.get('users')) else 0,
            'pageViews': int(row.get('page_views', 0)) if pd.notna(row.get('page_views')) else 0,
            'posts': int(row.get('influencer_posts', 0)) if pd.notna(row.get('influencer_posts')) else 0,
            'campaigns': int(row.get('campaign_events', 0)) if pd.notna(row.get('campaign_events')) else 0,
            'hasEvent': bool(row.get('has_marketing_event', False))
        })
    
    # Convert social media to JSON
    social_data = []
    for _, row in social_df.iterrows():
        social_data.append({
            'date': row['Date'].strftime('%Y-%m-%d') if pd.notna(row['Date']) else None,
            'platform': str(row.get('Platform', 'Unknown')),
            'influencer': str(row.get('Influencer/Account', 'Unknown')),
            'postUrl': str(row.get('Post URL', '')),
            'views': int(row.get('Views', 0)) if pd.notna(row.get('Views')) else 0,
            'reach': int(row.get('Reach', 0)) if pd.notna(row.get('Reach')) else 0,
            'impressions': int(row.get('Impressions', 0)) if pd.notna(row.get('Impressions')) else 0,
            'likes': int(row.get('Likes', 0)) if pd.notna(row.get('Likes')) else 0,
            'comments': int(row.get('Comments', 0)) if pd.notna(row.get('Comments')) else 0,
            'shares': int(row.get('Shares', 0)) if pd.notna(row.get('Shares')) else 0,
            'saves': int(row.get('Saves', 0)) if pd.notna(row.get('Saves')) else 0,
            'engagement': int(row.get('Total Engagement', 0)) if pd.notna(row.get('Total Engagement')) else 0,
            'revenueImpact': float(row.get('7-Day Revenue Impact', '0').replace('$', '').replace(',', '')) if pd.notna(row.get('7-Day Revenue Impact')) else 0,
            'trafficImpact': int(row.get('7-Day Traffic Impact', 0)) if pd.notna(row.get('7-Day Traffic Impact')) else 0
        })
    
    # Calculate summary stats
    summary = {
        'totalRevenue': sum(d['revenue'] for d in timeline_data),
        'totalOrders': sum(d['orders'] for d in timeline_data),
        'totalVisitors': sum(d['visitors'] for d in timeline_data),
        'totalPosts': sum(d['posts'] for d in timeline_data),
        'totalCampaigns': sum(d['campaigns'] for d in timeline_data),
        'revenueChange': 0,  # Calculate manually if needed
        'ordersChange': 0,
        'visitorsChange': 0,
        'postsLast30Days': sum(d['posts'] for d in timeline_data[-30:])
    }
    
    # Create JavaScript file
    js_content = f'''// Real Data from Marketing Analytics Feed
// Auto-generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
// DO NOT EDIT MANUALLY - Run export_to_json.py to update

const analyticsData = {{
    dateRange: {{
        start: "{timeline_data[0]['date']}",
        end: "{timeline_data[-1]['date']}",
        lastUpdated: "{datetime.now().isoformat()}Z"
    }},
    
    summary: {json.dumps(summary, indent=8).replace('{', '').replace('}', '')},
    
    timeline: {json.dumps(timeline_data, indent=8)},
    
    socialPosts: {json.dumps(social_data, indent=8)},
    
    // Weekly data (aggregated from timeline)
    weeklyData: [],  // TODO: Calculate from timeline
    
    // Geographic data (from Shopify Analytics)
    countries: [],  // TODO: Parse from Geography sheet
    
    // Traffic sources (from Traffic Sources sheet)
    trafficSources: {{}}  // TODO: Parse from sheet
}};

// Keep helper function
{open('js/data.js').read().split('// Export for use')[0].split('function generateTimelineData')[1] if EXCEL_FILE.exists() else ''}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {{
    module.exports = analyticsData;
}}
'''
    
    # Write to file
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_FILE, 'w') as f:
        f.write(js_content)
    
    print(f"✅ Exported data to {OUTPUT_FILE}")
    print(f"   - {len(timeline_data)} days of timeline data")
    print(f"   - {len(social_data)} social media posts")
    print(f"   - Total revenue: ${summary['totalRevenue']:,.2f}")
    print(f"\n🚀 Now commit and push to update GitHub Pages!")
    print(f"   cd marketing-feed-analytics")
    print(f"   git add js/data.js")
    print(f"   git commit -m 'Update with real data'")
    print(f"   git push origin main")

if __name__ == '__main__':
    export_to_json()
