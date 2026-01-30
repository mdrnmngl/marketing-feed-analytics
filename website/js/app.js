// Modern Mangal - Marketing Analytics Dashboard
// Main Application Logic

let currentPlatformFilter = 'all';
let currentDateRange = 30; // Default to 30 days
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
    const customRangeDiv = document.getElementById('customDateRange');
    const applyBtn = document.getElementById('applyCustomRange');
    
    if (!dateSelect) return;
    
    dateSelect.addEventListener('change', () => {
        const range = dateSelect.value;
        
        if (range === 'custom') {
            if (customRangeDiv) customRangeDiv.style.display = 'flex';
            return;
        }
        
        if (customRangeDiv) customRangeDiv.style.display = 'none';
        
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
    
    // Custom date range apply button
    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
            const startDate = document.getElementById('startDate').value;
            const endDate = document.getElementById('endDate').value;
            
            if (startDate && endDate) {
                const start = new Date(startDate);
                const end = new Date(endDate);
                const diffTime = Math.abs(end - start);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                currentDateRange = diffDays;
                populateRawDataTable();
                // Keep custom range visible
            } else {
                alert('Please select both start and end dates');
            }
        });
    }
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
            <td><span class="platform-badge ${post.platform.toLowerCase()}">${post.platform}</span></td>
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

// Enhanced Heat Map with Calendar Format
let currentHeatMapYear = 2026;
let currentHeatMapMonth = 0; // January  
let currentHeatMapView = 'month'; // 'month', 'quarter', 'year'

function populateHeatMap(year = currentHeatMapYear, month = currentHeatMapMonth, view = currentHeatMapView) {
    const container = document.getElementById('heatmapContainer');
    if (!container) return;
    
    // Update current values
    currentHeatMapYear = year;
    currentHeatMapMonth = month;
    currentHeatMapView = view;
    
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                        'July', 'August', 'September', 'October', 'November', 'December'];
    
    // Build header with view title
    const viewTitle = view === 'month' ? `${monthNames[month]} ${year}` :
                      view === 'quarter' ? `Q${Math.floor(month / 3) + 1} ${year}` :
                      `${year} Overview`;
    
    // Build calendar HTML
    let calendarHtml = `
        <div class="heatmap-header-bar">
            <h3 style="margin: 0; font-family: Arial, sans-serif; font-size: 1.25rem;">${viewTitle}</h3>
            <div style="display: flex; gap: 0.75rem; align-items: center;">
                <select id="viewSelector" class="month-selector">
                    <option value="month" ${view === 'month' ? 'selected' : ''}>Month</option>
                    <option value="quarter" ${view === 'quarter' ? 'selected' : ''}>Quarter</option>
                    <option value="year" ${view === 'year' ? 'selected' : ''}>Year</option>
                </select>
                ${view === 'month' ? `
                    <select id="monthSelector" class="month-selector">
                        ${monthNames.map((m, i) => `<option value="${i}" ${i === month ? 'selected' : ''}>${m}</option>`).join('')}
                    </select>
                ` : ''}
                ${view === 'quarter' ? `
                    <select id="quarterSelector" class="month-selector">
                        <option value="0" ${month < 3 ? 'selected' : ''}>Q1</option>
                        <option value="1" ${month >= 3 && month < 6 ? 'selected' : ''}>Q2</option>
                        <option value="2" ${month >= 6 && month < 9 ? 'selected' : ''}>Q3</option>
                        <option value="3" ${month >= 9 ? 'selected' : ''}>Q4</option>
                    </select>
                ` : ''}
                <select id="yearSelector" class="month-selector">
                    <option value="2024" ${year === 2024 ? 'selected' : ''}>2024</option>
                    <option value="2025" ${year === 2025 ? 'selected' : ''}>2025</option>
                    <option value="2026" ${year === 2026 ? 'selected' : ''}>2026</option>
                </select>
            </div>
        </div>
    `;
    
    // Generate view content
    if (view === 'month') {
        calendarHtml += generateMonthView(year, month);
    } else if (view === 'quarter') {
        calendarHtml += generateQuarterView(year, month);
    } else {
        calendarHtml += generateYearView(year);
    }
    
    // Add legend
    calendarHtml += `<div class="heatmap-legend">
            <div class="legend-item">
                <div class="legend-color intensity-high"></div>
                <span>High Activity</span>
            </div>
            <div class="legend-item">
                <div class="legend-color intensity-medium"></div>
                <span>Medium Activity</span>
            </div>
            <div class="legend-item">
                <div class="legend-color intensity-low"></div>
                <span>Low Activity</span>
            </div>
            <div class="legend-item">
                <div class="legend-color intensity-none"></div>
                <span>No Activity</span>
            </div>
        </div>`;
    
    container.innerHTML = calendarHtml;
    
    // Add event listeners
    const viewSelector = document.getElementById('viewSelector');
    const monthSelector = document.getElementById('monthSelector');
    const quarterSelector = document.getElementById('quarterSelector');
    const yearSelector = document.getElementById('yearSelector');
    
    if (viewSelector) {
        viewSelector.addEventListener('change', function() {
            populateHeatMap(currentHeatMapYear, currentHeatMapMonth, this.value);
        });
    }
    if (monthSelector) {
        monthSelector.addEventListener('change', function() {
            populateHeatMap(currentHeatMapYear, parseInt(this.value), currentHeatMapView);
        });
    }
    if (quarterSelector) {
        quarterSelector.addEventListener('change', function() {
            const quarterMonth = parseInt(this.value) * 3;
            populateHeatMap(currentHeatMapYear, quarterMonth, currentHeatMapView);
        });
    }
    if (yearSelector) {
        yearSelector.addEventListener('change', function() {
            populateHeatMap(parseInt(this.value), currentHeatMapMonth, currentHeatMapView);
        });
    }
}

function generateMonthView(year, month) {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                        'July', 'August', 'September', 'October', 'November', 'December'];
    
    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const activityMap = generateMonthlyActivityData(year, month);
    
    let html = `
        <div class="calendar-grid">
            <div class="calendar-day-header">Sun</div>
            <div class="calendar-day-header">Mon</div>
            <div class="calendar-day-header">Tue</div>
            <div class="calendar-day-header">Wed</div>
            <div class="calendar-day-header">Thu</div>
            <div class="calendar-day-header">Fri</div>
            <div class="calendar-day-header">Sat</div>
    `;
    
    for (let i = 0; i < startingDayOfWeek; i++) {
        html += '<div class="calendar-day empty"></div>';
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const activity = activityMap[dateStr] || { posts: 0, campaigns: 0, revenue: 0 };
        const intensity = getIntensityLevel(activity.posts, activity.campaigns, activity.revenue);
        
        html += `
            <div class="calendar-day intensity-${intensity}" data-date="${dateStr}">
                <span class="day-number">${day}</span>
                <div class="day-tooltip">
                    <strong>${monthNames[month]} ${day}, ${year}</strong><br>
                    ${activity.posts} posts · ${activity.campaigns} campaigns<br>
                    Revenue: $${activity.revenue.toLocaleString()}
                </div>
            </div>
        `;
    }
    
    html += '</div>';
    return html;
}

function generateQuarterView(year, month) {
    const quarterStart = Math.floor(month / 3) * 3;
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    let html = '<div class="quarter-grid">';
    
    for (let m = quarterStart; m < quarterStart + 3; m++) {
        const activityMap = generateMonthlyActivityData(year, m);
        const firstDay = new Date(year, m, 1);
        const daysInMonth = new Date(year, m + 1, 0).getDate();
        const startingDayOfWeek = firstDay.getDay();
        
        html += `
            <div class="mini-month">
                <div class="mini-month-header">${monthNames[m]}</div>
                <div class="mini-calendar-grid">
                    <div class="mini-day-header">S</div><div class="mini-day-header">M</div><div class="mini-day-header">T</div><div class="mini-day-header">W</div><div class="mini-day-header">T</div><div class="mini-day-header">F</div><div class="mini-day-header">S</div>
        `;
        
        for (let i = 0; i < startingDayOfWeek; i++) {
            html += '<div class="mini-day empty"></div>';
        }
        
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(m + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const activity = activityMap[dateStr] || { posts: 0, campaigns: 0, revenue: 0 };
            const intensity = getIntensityLevel(activity.posts, activity.campaigns, activity.revenue);
            
            html += `<div class="mini-day intensity-${intensity}" title="${monthNames[m]} ${day}: ${activity.posts} posts, ${activity.campaigns} campaigns, $${activity.revenue.toLocaleString()}"></div>`;
        }
        
        html += '</div></div>';
    }
    
    html += '</div>';
    return html;
}

function generateYearView(year) {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    let html = '<div class="year-grid">';
    
    for (let m = 0; m < 12; m++) {
        const activityMap = generateMonthlyActivityData(year, m);
        const firstDay = new Date(year, m, 1);
        const daysInMonth = new Date(year, m + 1, 0).getDate();
        const startingDayOfWeek = firstDay.getDay();
        
        html += `<div class="tiny-month"><div class="tiny-month-header">${monthNames[m]}</div><div class="tiny-calendar-grid">`;
        
        for (let i = 0; i < startingDayOfWeek; i++) {
            html += '<div class="tiny-day empty"></div>';
        }
        
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(m + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const activity = activityMap[dateStr] || { posts: 0, campaigns: 0, revenue: 0 };
            const intensity = getIntensityLevel(activity.posts, activity.campaigns, activity.revenue);
            
            html += `<div class="tiny-day intensity-${intensity}" title="${monthNames[m]} ${day}: ${activity.posts} posts, ${activity.campaigns} campaigns, $${activity.revenue.toLocaleString()}"></div>`;
        }
        
        html += '</div></div>';
    }
    
    html += '</div>';
    return html;
}
}

// Generate activity data for any month
function generateMonthlyActivityData(year, month) {
    const activityMap = {};
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Generate random but consistent activity for each day
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        // Use date-based seed for consistency
        const seed = year * 10000 + month * 100 + day;
        const random1 = Math.abs(Math.sin(seed * 12.9898)) * 43758.5453;
        const random2 = Math.abs(Math.sin(seed * 78.233)) * 43758.5453;
        const random3 = Math.abs(Math.sin(seed * 45.164)) * 43758.5453;
        
        activityMap[dateStr] = {
            posts: Math.floor((random1 % 1) * 4), // 0-3 posts
            campaigns: Math.floor((random2 % 1) * 3), // 0-2 campaigns
            revenue: Math.floor((random3 % 1) * 8000) + 500 // $500-$8500
        };
    }
    
    return activityMap;
}

function getIntensityLevel(posts, campaigns, revenue) {
    const totalEvents = posts + campaigns;
    
    if (totalEvents === 0) return 'none';
    if (totalEvents >= 3 || revenue > 5000) return 'high';
    if (totalEvents >= 2 || revenue > 2500) return 'medium';
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
            <div style="font-family: Arial, sans-serif; min-width: 150px;">
                <h4 style="margin: 0 0 0.5rem 0; color: var(--brand-black-blue); font-size: 1.1rem;">${country.flag} ${country.name}</h4>
                <p style="margin: 0.25rem 0; color: #6B7280;"><strong>Sessions:</strong> ${country.sessions.toLocaleString()}</p>
                <p style="margin: 0.25rem 0; color: #6B7280;"><strong>Revenue:</strong> $${country.revenue.toLocaleString()}</p>
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
            <span class="country-name">${country.flag} ${country.name}</span>
            <span class="country-sessions">${country.sessions.toLocaleString()}</span>
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
    
    // Show last 30 days in descending order (newest first)
    const recentData = timeline.slice(-30).reverse();
    
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
