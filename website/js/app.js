// Modern Mangal - Marketing Analytics Dashboard
// Main Application Logic

let currentPlatformFilter = 'all';
let currentDateRange = 30;
let mapMarkers = [];

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupTabSwitching();
    setupSocialMediaDropdown();
    setupDateFilters();
    populateSummaryStats();
    populateDateRange();
    initializeCharts();
    populateSocialMediaTable();
    populateHeatMap();
    initializeMap();
    populateShopifyTab();
    populateRawDataTable();
    updateLastUpdateTime();
}

// Tab Switching
function setupTabSwitching() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active class from all
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active to clicked
            btn.classList.add('active');
            const tabId = btn.getAttribute('data-tab');
            const tabContent = document.getElementById(tabId);
            if (tabContent) {
                tabContent.classList.add('active');
            }
            
            // Reinitialize map if geography tab
            if (tabId === 'geography' && window.map) {
                setTimeout(() => {
                    window.map.invalidateSize();
                }, 100);
            }
        });
    });
}

// Social Media Dropdown
function setupSocialMediaDropdown() {
    const socialTab = document.getElementById('socialMediaTab');
    const dropdown = document.getElementById('socialDropdown');
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    
    if (!socialTab || !dropdown) return;
    
    // Show dropdown on hover
    socialTab.addEventListener('mouseenter', () => {
        dropdown.classList.add('show');
    });
    
    // Keep dropdown visible when hovering over it
    dropdown.addEventListener('mouseenter', () => {
        dropdown.classList.add('show');
    });
    
    // Hide dropdown when leaving both
    socialTab.addEventListener('mouseleave', (e) => {
        setTimeout(() => {
            if (!dropdown.matches(':hover')) {
                dropdown.classList.remove('show');
            }
        }, 100);
    });
    
    dropdown.addEventListener('mouseleave', () => {
        dropdown.classList.remove('show');
    });
    
    // Click on social media tab shows all platforms
    socialTab.addEventListener('click', () => {
        currentPlatformFilter = 'all';
        activateTab('social');
        populateSocialMediaTable();
    });
    
    // Dropdown item clicks
    dropdownItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            const platform = item.getAttribute('data-platform');
            currentPlatformFilter = platform;
            dropdown.classList.remove('show');
            activateTab('social');
            populateSocialMediaTable();
        });
    });
}

// Helper to activate a tab
function activateTab(tabId) {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));
    
    const targetBtn = document.querySelector(`[data-tab="${tabId}"]`);
    const targetContent = document.getElementById(tabId);
    
    if (targetBtn) targetBtn.classList.add('active');
    if (targetContent) targetContent.classList.add('active');
}

// Date Range Filters
function setupDateFilters() {
    const dateSelect = document.getElementById('dateRangeSelect');
    if (!dateSelect) return;
    
    dateSelect.addEventListener('change', () => {
        const range = dateSelect.value;
        
        // Convert range value to days
        if (range === 'all') {
            currentDateRange = 99999;
        } else if (range === 'wtd' || range === 'lw') {
            currentDateRange = 7;
        } else if (range === 'mtd' || range === 'lm') {
            currentDateRange = 30;
        } else if (range === 'qtd' || range === 'lq') {
            currentDateRange = 90;
        } else if (range === 'ytd' || range === 'ly') {
            currentDateRange = 365;
        } else {
            currentDateRange = parseInt(range);
        }
        
        populateRawDataTable();
    });
}

// Populate Summary Statistics
function populateSummaryStats() {
    const { summary } = analyticsData;
    
    document.getElementById('totalRevenue').textContent = 
        '$' + summary.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    document.getElementById('totalOrders').textContent = 
        summary.totalOrders.toLocaleString();
    document.getElementById('totalVisitors').textContent = 
        summary.totalVisitors.toLocaleString();
    document.getElementById('totalPosts').textContent = 
        summary.totalPosts.toLocaleString();
    
    // Update change indicators
    updateChangeIndicator('revenueChange', summary.revenueChange);
    updateChangeIndicator('ordersChange', summary.ordersChange);
    updateChangeIndicator('visitorsChange', summary.visitorsChange);
}

function updateChangeIndicator(elementId, value) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const isPositive = value >= 0;
    element.className = 'stat-change ' + (isPositive ? 'positive' : 'negative');
    element.textContent = (isPositive ? '↑' : '↓') + ' ' + Math.abs(value).toFixed(1) + '%';
}

// Populate Date Range
function populateDateRange() {
    const { dateRange } = analyticsData;
    const rangeElement = document.getElementById('dateRange');
    if (rangeElement) {
        rangeElement.textContent = `${dateRange.start} to ${dateRange.end}`;
    }
}

// Populate Social Media Table with Platform Filter
function populateSocialMediaTable() {
    const tableBody = document.getElementById('socialTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    let filteredPosts = analyticsData.socialPosts;
    
    // Apply platform filter
    if (currentPlatformFilter !== 'all') {
        filteredPosts = filteredPosts.filter(post => 
            post.platform.toLowerCase() === currentPlatformFilter.toLowerCase()
        );
    }
    
    // Update section title to show filter
    const sectionTitle = document.querySelector('#social .section-title');
    if (sectionTitle) {
        const platformName = currentPlatformFilter === 'all' ? 'All Platforms' : 
            currentPlatformFilter.charAt(0).toUpperCase() + currentPlatformFilter.slice(1);
        sectionTitle.textContent = `Social Media Analytics - ${platformName}`;
    }
    
    filteredPosts.forEach(post => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${post.date}</td>
            <td><strong>${post.platform}</strong></td>
            <td>${post.influencer}</td>
            <td><a href="${post.postUrl}" target="_blank" style="color: var(--brand-mocha);">View Post</a></td>
            <td>${post.views.toLocaleString()}</td>
            <td>${post.reach.toLocaleString()}</td>
            <td>${post.impressions.toLocaleString()}</td>
            <td>${post.likes.toLocaleString()}</td>
            <td>${post.comments.toLocaleString()}</td>
            <td>${post.shares.toLocaleString()}</td>
            <td>${post.saves.toLocaleString()}</td>
            <td>${post.engagement.toLocaleString()}</td>
            <td>$${post.revenueImpact.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            <td>${post.trafficImpact.toLocaleString()}</td>
        `;
        tableBody.appendChild(row);
    });
    
    // Show message if no posts
    if (filteredPosts.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="14" style="text-align: center; padding: 2rem; color: var(--text-secondary);">No posts found for ${currentPlatformFilter}</td>`;
        tableBody.appendChild(row);
    }
}

// Enhanced Heat Map with Better Visualization
function populateHeatMap() {
    const container = document.getElementById('heatmapContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    const { weeklyData } = analyticsData;
    
    // Create heat map structure
    const heatmapHtml = `
        <div style="margin-bottom: 2rem;">
            <h3 style="font-family: 'Cardo', serif; color: var(--brand-black-blue); margin-bottom: 1rem;">Weekly Marketing Activity Intensity</h3>
            <p style="font-family: 'Cardo', serif; font-style: italic; color: var(--text-secondary); margin-bottom: 1.5rem;">
                Color intensity represents combined marketing activity (posts + campaigns) and performance metrics
            </p>
        </div>
        
        <div class="heatmap-grid">
            <div></div>
            <div class="heatmap-header">Mon</div>
            <div class="heatmap-header">Tue</div>
            <div class="heatmap-header">Wed</div>
            <div class="heatmap-header">Thu</div>
            <div class="heatmap-header">Fri</div>
            <div class="heatmap-header">Sat</div>
            <div class="heatmap-header">Sun</div>
            
            ${weeklyData.map((week, weekIdx) => `
                <div class="heatmap-week-label">Week ${weekIdx + 1}</div>
                ${week.days.map(day => {
                    const intensity = getIntensityLevel(day.posts, day.campaigns, day.revenue);
                    return `
                        <div class="heatmap-cell intensity-${intensity}" title="${day.date}: ${day.posts} posts, ${day.campaigns} campaigns, $${day.revenue.toLocaleString()}">
                            <div class="heatmap-date">${day.date.split('-')[2]}</div>
                            <div class="heatmap-value">${day.posts + day.campaigns}</div>
                            <div class="heatmap-label">${intensity.toUpperCase()}</div>
                        </div>
                    `;
                }).join('')}
            `).join('')}
        </div>
        
        <div class="heatmap-legend">
            <div class="legend-item">
                <div class="legend-color intensity-high"></div>
                <span class="legend-label">High Activity (3+ events, high revenue)</span>
            </div>
            <div class="legend-item">
                <div class="legend-color intensity-medium"></div>
                <span class="legend-label">Medium Activity (1-2 events)</span>
            </div>
            <div class="legend-item">
                <div class="legend-color intensity-low"></div>
                <span class="legend-label">Low Activity (events but low impact)</span>
            </div>
            <div class="legend-item">
                <div class="legend-color intensity-none"></div>
                <span class="legend-label">No Activity</span>
            </div>
        </div>
    `;
    
    container.innerHTML = heatmapHtml;
}

function getIntensityLevel(posts, campaigns, revenue) {
    const totalEvents = posts + campaigns;
    
    if (totalEvents === 0) return 'none';
    if (totalEvents >= 3 && revenue > 5000) return 'high';
    if (totalEvents >= 1) return 'medium';
    return 'low';
}

// Initialize Map with Hover (not click)
function initializeMap() {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;
    
    // Initialize Leaflet map
    const map = L.map('map').setView([20, 0], 2);
    window.map = map;
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(map);
    
    // Clear existing markers
    mapMarkers.forEach(marker => map.removeLayer(marker));
    mapMarkers = [];
    
    const { countries } = analyticsData;
    
    // Add markers for each country with HOVER popup
    countries.forEach(country => {
        const markerSize = Math.max(8, Math.min(30, country.sessions / 1000));
        
        const marker = L.circleMarker([country.lat, country.lng], {
            radius: markerSize,
            fillColor: getColorByIntensity(country.sessions),
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.7
        }).addTo(map);
        
        // Create popup content
        const popupContent = `
            <div style="font-family: 'Cardo', serif; min-width: 150px;">
                <h4 style="margin: 0 0 0.5rem 0; color: var(--brand-black-blue); font-size: 1.1rem;">${country.name}</h4>
                <p style="margin: 0.25rem 0; color: var(--brand-mocha);"><strong>Sessions:</strong> ${country.sessions.toLocaleString()}</p>
                <p style="margin: 0.25rem 0; color: var(--brand-mocha);"><strong>Revenue:</strong> $${country.revenue.toLocaleString()}</p>
            </div>
        `;
        
        // Bind popup and open on HOVER
        marker.bindPopup(popupContent);
        
        marker.on('mouseover', function(e) {
            this.openPopup();
        });
        
        marker.on('mouseout', function(e) {
            this.closePopup();
        });
        
        mapMarkers.push(marker);
    });
    
    // Populate country list
    populateCountryList();
}

function getColorByIntensity(sessions) {
    if (sessions > 10000) return '#10B981'; // High - Green
    if (sessions > 5000) return '#F59E0B';  // Medium - Orange
    if (sessions > 1000) return '#6366F1';  // Low - Blue
    return '#9CA3AF';                        // Very Low - Gray
}

function populateCountryList() {
    const listElement = document.getElementById('countryList');
    if (!listElement) return;
    
    listElement.innerHTML = '';
    
    const sortedCountries = [...analyticsData.countries].sort((a, b) => b.sessions - a.sessions);
    
    sortedCountries.slice(0, 10).forEach((country, index) => {
        const item = document.createElement('div');
        item.className = 'country-item';
        item.innerHTML = `
            <span class="country-name">${index + 1}. ${country.name}</span>
            <span class="country-sessions">${country.sessions.toLocaleString()} sessions</span>
        `;
        listElement.appendChild(item);
    });
}

// Populate Shopify Tab
function populateShopifyTab() {
    // Calculate Shopify-specific stats from timeline data
    const { timeline } = analyticsData;
    
    let totalShopifySessions = 0;
    let totalShopifyRevenue = 0;
    let totalOrders = 0;
    
    timeline.forEach(day => {
        totalShopifySessions += day.shopifySessions || 0;
        totalShopifyRevenue += day.revenue || 0;
        totalOrders += day.orders || 0;
    });
    
    const avgConversion = totalShopifySessions > 0 ? (totalOrders / totalShopifySessions * 100) : 0;
    const avgSessionValue = totalShopifySessions > 0 ? (totalShopifyRevenue / totalShopifySessions) : 0;
    
    // Update stats
    const shopifySessionsEl = document.getElementById('shopifySessions');
    const shopifyVisitorsEl = document.getElementById('shopifyVisitors');
    const shopifyConversionEl = document.getElementById('shopifyConversion');
    const shopifySessionValueEl = document.getElementById('shopifySessionValue');
    
    if (shopifySessionsEl) shopifySessionsEl.textContent = totalShopifySessions.toLocaleString();
    if (shopifyVisitorsEl) shopifyVisitorsEl.textContent = Math.round(totalShopifySessions * 0.8).toLocaleString();
    if (shopifyConversionEl) shopifyConversionEl.textContent = avgConversion.toFixed(2) + '%';
    if (shopifySessionValueEl) shopifySessionValueEl.textContent = '$' + avgSessionValue.toFixed(2);
    
    // Populate table
    const tableBody = document.getElementById('shopifyTrafficTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    // Show last 30 days
    const recentData = timeline.slice(-30);
    
    recentData.forEach(day => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${day.date}</td>
            <td>${(day.shopifySessions || 0).toLocaleString()}</td>
            <td>${day.topSources || 'Direct, Google, Facebook'}</td>
            <td>${day.topCountries || 'United States, Canada, UK'}</td>
            <td>$${(day.revenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Enhanced Raw Data Table with More Columns and Date Filtering
function populateRawDataTable() {
    const tableBody = document.getElementById('rawDataTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    const { timeline } = analyticsData;
    
    // Filter by date range
    const filteredData = timeline.slice(-currentDateRange);
    
    filteredData.reverse().forEach(day => {
        const row = document.createElement('tr');
        const hasEvent = (day.posts > 0 || day.campaigns > 0);
        
        if (hasEvent) {
            row.classList.add('highlight');
        }
        
        const aov = day.orders > 0 ? (day.revenue / day.orders) : 0;
        const conversionRate = day.sessions > 0 ? (day.orders / day.sessions * 100) : 0;
        
        row.innerHTML = `
            <td><strong>${day.date}</strong></td>
            <td>$${day.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            <td>${day.orders.toLocaleString()}</td>
            <td>$${aov.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            <td>${day.sessions.toLocaleString()}</td>
            <td>${day.visitors.toLocaleString()}</td>
            <td>${day.pageViews.toLocaleString()}</td>
            <td>${conversionRate.toFixed(2)}%</td>
            <td>${day.posts}</td>
            <td>${day.campaigns}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Update Last Update Time
function updateLastUpdateTime() {
    const element = document.getElementById('lastUpdate');
    if (element && analyticsData.dateRange) {
        element.textContent = analyticsData.dateRange.lastUpdated || new Date().toISOString().split('T')[0];
    }
}
