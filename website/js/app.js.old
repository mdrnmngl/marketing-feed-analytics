// Main Application Logic
// Handles tab switching, data population, and interactivity

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupTabSwitching();
    populateSummaryStats();
    populateDateRange();
    initializeCharts();
    populateSocialMediaTable();
    populateHeatMap();
    initializeMap();
    populateRawDataTable();
    updateLastUpdateTime();
}

// Tab Switching
function setupTabSwitching() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active to clicked
            btn.classList.add('active');
            const tabId = btn.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
            
            // Reinitialize map if geography tab
            if (tabId === 'geography') {
                setTimeout(() => {
                    if (window.map) {
                        window.map.invalidateSize();
                    }
                }, 100);
            }
        });
    });
}

// Populate Summary Statistics
function populateSummaryStats() {
    const { summary } = analyticsData;
    
    document.getElementById('totalRevenue').textContent = 
        '$' + summary.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 });
    document.getElementById('totalOrders').textContent = 
        summary.totalOrders.toLocaleString();
    document.getElementById('totalVisitors').textContent = 
        summary.totalVisitors.toLocaleString();
    document.getElementById('totalPosts').textContent = 
        summary.totalPosts.toLocaleString();
    
    document.getElementById('revenueChange').textContent = 
        '+' + summary.revenueChange + '% vs last period';
    document.getElementById('ordersChange').textContent = 
        '+' + summary.ordersChange + '% vs last period';
    document.getElementById('visitorsChange').textContent = 
        '+' + summary.visitorsChange + '% vs last period';
    document.getElementById('postsChange').textContent = 
        summary.postsLast30Days + ' in last 30 days';
}

// Populate Date Range
function populateDateRange() {
    const { dateRange } = analyticsData;
    const start = new Date(dateRange.start).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    const end = new Date(dateRange.end).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    
    document.getElementById('dateRange').textContent = `${start} - ${end}`;
}

// Populate Social Media Table
function populateSocialMediaTable() {
    const tbody = document.getElementById('socialTableBody');
    tbody.innerHTML = '';
    
    analyticsData.socialPosts.forEach(post => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
            <td><span class="platform-badge platform-${post.platform.toLowerCase()}">${post.platform}</span></td>
            <td>${post.influencer}</td>
            <td>${post.views ? post.views.toLocaleString() : '-'}</td>
            <td>${post.reach ? post.reach.toLocaleString() : '-'}</td>
            <td><strong>${post.engagement.toLocaleString()}</strong></td>
            <td style="color: #10B981; font-weight: 600;">$${post.revenueImpact.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
            <td style="color: #6366F1; font-weight: 600;">${post.trafficImpact.toLocaleString()}</td>
        `;
        
        tbody.appendChild(row);
    });
    
    // Add platform badge styles
    const style = document.createElement('style');
    style.textContent = `
        .platform-badge {
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
            display: inline-block;
        }
        .platform-instagram { background: #E1306C; color: white; }
        .platform-tiktok { background: #000000; color: white; }
        .platform-pinterest { background: #E60023; color: white; }
        .platform-facebook { background: #1877F2; color: white; }
    `;
    document.head.appendChild(style);
}

// Populate Heat Map
function populateHeatMap() {
    const container = document.getElementById('heatmapContainer');
    container.innerHTML = '';
    
    analyticsData.weeklyData.forEach(week => {
        const cell = document.createElement('div');
        cell.className = `heatmap-cell activity-${week.activity}`;
        
        cell.innerHTML = `
            <div class="heatmap-week">Week ${week.week}, ${week.year}</div>
            <div class="heatmap-revenue">$${week.revenue.toLocaleString()}</div>
            <div class="heatmap-posts">${week.posts} posts, ${week.campaigns} campaigns</div>
            <div style="font-size: 12px; margin-top: 4px;">${week.sessions.toLocaleString()} sessions</div>
        `;
        
        container.appendChild(cell);
    });
}

// Initialize Geographic Map
function initializeMap() {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;
    
    // Create map
    const map = L.map('map').setView([20, 0], 2);
    window.map = map;
    
    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(map);
    
    // Add markers for each country
    analyticsData.countries.forEach(country => {
        const markerSize = Math.min(Math.max(country.sessions / 1000, 5), 25);
        
        const circle = L.circleMarker([country.lat, country.lng], {
            radius: markerSize,
            fillColor: getColorByIntensity(country.sessions),
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.7
        }).addTo(map);
        
        circle.bindPopup(`
            <div style="font-weight: 600; margin-bottom: 4px;">${country.flag} ${country.name}</div>
            <div>Sessions: <strong>${country.sessions.toLocaleString()}</strong></div>
            <div>Revenue: <strong>$${country.revenue.toLocaleString()}</strong></div>
        `);
    });
    
    // Populate country list
    populateCountryList();
}

// Get color based on session intensity
function getColorByIntensity(sessions) {
    if (sessions > 30000) return '#10B981'; // Green (high)
    if (sessions > 15000) return '#F59E0B'; // Orange (medium)
    if (sessions > 5000) return '#6366F1';  // Blue (medium-low)
    return '#94A3B8'; // Gray (low)
}

// Populate Country List
function populateCountryList() {
    const container = document.getElementById('countryList');
    container.innerHTML = '';
    
    // Sort by sessions descending
    const sorted = [...analyticsData.countries].sort((a, b) => b.sessions - a.sessions);
    
    sorted.forEach((country, index) => {
        if (index < 10) { // Top 10
            const item = document.createElement('div');
            item.className = 'country-item';
            
            item.innerHTML = `
                <div class="country-name">
                    <span class="country-flag">${country.flag}</span>
                    <span>${country.name}</span>
                </div>
                <div class="country-sessions">${country.sessions.toLocaleString()}</div>
            `;
            
            container.appendChild(item);
        }
    });
}

// Populate Raw Data Table
function populateRawDataTable() {
    const tbody = document.getElementById('rawDataTableBody');
    tbody.innerHTML = '';
    
    // Show last 30 days
    const recentData = analyticsData.timeline.slice(-30);
    
    recentData.reverse().forEach(day => {
        const row = document.createElement('tr');
        
        // Highlight days with marketing events
        if (day.hasEvent) {
            row.style.backgroundColor = '#FFF2CC';
        }
        
        row.innerHTML = `
            <td>${new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
            <td style="font-weight: 600; color: #10B981;">$${day.revenue.toFixed(2)}</td>
            <td>${day.orders}</td>
            <td>${day.sessions.toLocaleString()}</td>
            <td>${day.visitors.toLocaleString()}</td>
            <td>${day.posts > 0 ? '✓ ' + day.posts : '-'}</td>
            <td>${day.campaigns > 0 ? '✓ ' + day.campaigns : '-'}</td>
        `;
        
        tbody.appendChild(row);
    });
}

// Update Last Update Time
function updateLastUpdateTime() {
    const lastUpdate = new Date(analyticsData.dateRange.lastUpdated);
    document.getElementById('lastUpdate').textContent = lastUpdate.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
    });
}
