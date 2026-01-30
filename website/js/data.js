// Dummy Data for Marketing Analytics Dashboard
// This file will be replaced with real API data once credentials are configured

const analyticsData = {
    dateRange: {
        start: "2024-03-08",
        end: "2026-01-29",
        lastUpdated: "2026-01-29T12:00:00Z"
    },
    
    summary: {
        totalRevenue: 487250.00,
        totalOrders: 1842,
        totalVisitors: 125430,
        totalPosts: 87,
        totalCampaigns: 24,
        revenueChange: 23.5,
        ordersChange: 18.2,
        visitorsChange: 31.4,
        postsLast30Days: 12
    },
    
    // Daily timeline data (last 60 days sample)
    timeline: generateTimelineData(),
    
    // Social media posts with detailed metrics
    socialPosts: [
        {
            date: "2026-01-28",
            platform: "Instagram",
            influencer: "@modernmangal",
            postUrl: "https://instagram.com/p/sample1",
            views: 45200,
            reach: 38500,
            impressions: 52300,
            likes: 2140,
            comments: 183,
            shares: 95,
            saves: 420,
            engagement: 2838,
            revenueImpact: 4250.00,
            trafficImpact: 1200
        },
        {
            date: "2026-01-25",
            platform: "TikTok",
            influencer: "@modernmangal",
            postUrl: "https://tiktok.com/@modernmangal/video1",
            views: 125000,
            reach: 125000,
            impressions: 125000,
            likes: 8500,
            comments: 340,
            shares: 1200,
            saves: 0,
            engagement: 10040,
            revenueImpact: 5200.00,
            trafficImpact: 2100
        },
        {
            date: "2026-01-22",
            platform: "Instagram",
            influencer: "@jewelryguru",
            postUrl: "https://instagram.com/p/sample2",
            views: 62000,
            reach: 54200,
            impressions: 68400,
            likes: 3200,
            comments: 245,
            shares: 142,
            saves: 580,
            engagement: 4167,
            revenueImpact: 3450.00,
            trafficImpact: 980
        },
        {
            date: "2026-01-20",
            platform: "Pinterest",
            influencer: "@modernmangal",
            postUrl: "https://pinterest.com/pin/sample1",
            views: 0,
            reach: 0,
            impressions: 18500,
            likes: 0,
            comments: 0,
            shares: 0,
            saves: 850,
            clicks: 420,
            engagement: 1270,
            revenueImpact: 1850.00,
            trafficImpact: 420
        },
        {
            date: "2026-01-18",
            platform: "Instagram",
            influencer: "@fashionista_nyc",
            postUrl: "https://instagram.com/p/sample3",
            views: 98000,
            reach: 85000,
            impressions: 112000,
            likes: 5400,
            comments: 420,
            shares: 280,
            saves: 920,
            engagement: 7020,
            revenueImpact: 6800.00,
            trafficImpact: 1850
        }
    ],
    
    // Weekly heat map data - 8 weeks with daily breakdown
    weeklyData: [
        {
            week: 1,
            days: [
                { date: '2026-01-06', posts: 1, campaigns: 0, revenue: 1200 },
                { date: '2026-01-07', posts: 0, campaigns: 1, revenue: 1800 },
                { date: '2026-01-08', posts: 1, campaigns: 0, revenue: 2100 },
                { date: '2026-01-09', posts: 0, campaigns: 0, revenue: 800 },
                { date: '2026-01-10', posts: 2, campaigns: 1, revenue: 3500 },
                { date: '2026-01-11', posts: 0, campaigns: 0, revenue: 600 },
                { date: '2026-01-12', posts: 1, campaigns: 0, revenue: 1400 }
            ]
        },
        {
            week: 2,
            days: [
                { date: '2026-01-13', posts: 0, campaigns: 1, revenue: 2200 },
                { date: '2026-01-14', posts: 1, campaigns: 0, revenue: 1900 },
                { date: '2026-01-15', posts: 2, campaigns: 0, revenue: 3100 },
                { date: '2026-01-16', posts: 0, campaigns: 0, revenue: 700 },
                { date: '2026-01-17', posts: 1, campaigns: 1, revenue: 4200 },
                { date: '2026-01-18', posts: 0, campaigns: 0, revenue: 900 },
                { date: '2026-01-19', posts: 1, campaigns: 0, revenue: 1600 }
            ]
        },
        {
            week: 3,
            days: [
                { date: '2026-01-20', posts: 1, campaigns: 0, revenue: 2400 },
                { date: '2026-01-21', posts: 0, campaigns: 1, revenue: 2800 },
                { date: '2026-01-22', posts: 2, campaigns: 0, revenue: 4100 },
                { date: '2026-01-23', posts: 0, campaigns: 0, revenue: 1100 },
                { date: '2026-01-24', posts: 1, campaigns: 1, revenue: 5200 },
                { date: '2026-01-25', posts: 0, campaigns: 0, revenue: 800 },
                { date: '2026-01-26', posts: 1, campaigns: 0, revenue: 1800 }
            ]
        },
        {
            week: 4,
            days: [
                { date: '2026-01-27', posts: 2, campaigns: 1, revenue: 6200 },
                { date: '2026-01-28', posts: 1, campaigns: 0, revenue: 3400 },
                { date: '2026-01-29', posts: 0, campaigns: 1, revenue: 2800 },
                { date: '2026-01-30', posts: 1, campaigns: 0, revenue: 2100 },
                { date: '2026-01-31', posts: 0, campaigns: 0, revenue: 900 },
                { date: '2026-02-01', posts: 1, campaigns: 1, revenue: 4800 },
                { date: '2026-02-02', posts: 0, campaigns: 0, revenue: 1200 }
            ]
        }
    ],
    
    // Geographic data
    countries: [
        { name: "India", code: "IN", sessions: 45200, revenue: 185000, lat: 20.5937, lng: 78.9629 },
        { name: "United States", code: "US", sessions: 28500, revenue: 142000, lat: 37.0902, lng: -95.7129 },
        { name: "United Kingdom", code: "GB", sessions: 15800, revenue: 78000, lat: 55.3781, lng: -3.4360 },
        { name: "UAE", code: "AE", sessions: 12400, revenue: 58000, lat: 23.4241, lng: 53.8478 },
        { name: "Canada", code: "CA", sessions: 8900, revenue: 38000, lat: 56.1304, lng: -106.3468 },
        { name: "Australia", code: "AU", sessions: 6200, revenue: 25000, lat: -25.2744, lng: 133.7751 },
        { name: "Singapore", code: "SG", sessions: 4800, revenue: 22000, lat: 1.3521, lng: 103.8198 },
        { name: "Germany", code: "DE", sessions: 3500, revenue: 15000, lat: 51.1657, lng: 10.4515 }
    ],
    
    // Traffic sources
    trafficSources: {
        instagram: 42000,
        google: 28500,
        direct: 22000,
        facebook: 15800,
        tiktok: 8900,
        pinterest: 5200,
        other: 3030
    }
};

// Generate realistic timeline data for last 60 days
function generateTimelineData() {
    const data = [];
    const endDate = new Date('2026-01-29');
    
    for (let i = 59; i >= 0; i--) {
        const date = new Date(endDate);
        date.setDate(date.getDate() - i);
        
        const dayOfWeek = date.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        
        // Base metrics with some randomness
        const baseRevenue = isWeekend ? 600 : 800;
        const revenue = baseRevenue + Math.random() * 400;
        
        const baseSessions = isWeekend ? 180 : 250;
        const sessions = Math.floor(baseSessions + Math.random() * 100);
        
        const orders = Math.floor(revenue / 35); // ~$35 AOV
        const visitors = Math.floor(sessions * 0.85);
        const shopifySessions = Math.floor(sessions * 0.6); // 60% from Shopify Analytics
        
        // Occasional marketing events
        const hasPost = Math.random() > 0.85;
        const hasCampaign = Math.random() > 0.95;
        
        // Sample traffic sources and countries
        const topSources = ['Google, Direct, Instagram', 'Instagram, Facebook, Direct', 'Direct, Google, TikTok'][Math.floor(Math.random() * 3)];
        const topCountries = ['United States, India, Canada', 'India, UAE, United States', 'United States, UK, Australia'][Math.floor(Math.random() * 3)];
        
        data.push({
            date: date.toISOString().split('T')[0],
            revenue: Math.round(revenue * 100) / 100,
            orders: orders,
            sessions: sessions,
            visitors: visitors,
            pageViews: Math.round(sessions * 3.2),
            shopifySessions: shopifySessions,
            topSources: topSources,
            topCountries: topCountries,
            posts: hasPost ? 1 : 0,
            campaigns: hasCampaign ? 1 : 0,
            hasEvent: hasPost || hasCampaign
        });
    }
    
    return data;
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = analyticsData;
}
