// Chart configurations and rendering
// Uses Chart.js for all visualizations

let charts = {}; // Store chart instances

// Initialize all charts
function initializeCharts() {
    createRevenueTrafficChart();
    createPlatformChart();
    createActivityChart();
    createTrafficSourceChart();
    createTrafficTrendChart();
}

// Revenue & Traffic Trend Chart
function createRevenueTrafficChart() {
    const ctx = document.getElementById('revenueTrafficChart');
    if (!ctx) return;
    
    const labels = analyticsData.timeline.map(d => {
        const date = new Date(d.date);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
    
    charts.revenueTraffic = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Revenue ($)',
                    data: analyticsData.timeline.map(d => d.revenue),
                    borderColor: '#6366F1',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true,
                    yAxisID: 'y'
                },
                {
                    label: 'Sessions',
                    data: analyticsData.timeline.map(d => d.sessions),
                    borderColor: '#10B981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: { size: 14, weight: 'bold' },
                    bodyFont: { size: 13 },
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                if (context.datasetIndex === 0) {
                                    label += '$' + context.parsed.y.toFixed(2);
                                } else {
                                    label += context.parsed.y.toLocaleString();
                                }
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    display: true,
                    grid: { display: false }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: { display: true, text: 'Revenue ($)' },
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toFixed(0);
                        }
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: { display: true, text: 'Sessions' },
                    grid: { drawOnChartArea: false }
                }
            }
        }
    });
}

// Platform Distribution Pie Chart
function createPlatformChart() {
    const ctx = document.getElementById('platformChart');
    if (!ctx) return;
    
    const platformCounts = {};
    analyticsData.socialPosts.forEach(post => {
        platformCounts[post.platform] = (platformCounts[post.platform] || 0) + 1;
    });
    
    charts.platform = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(platformCounts),
            datasets: [{
                label: 'Posts by Platform',
                data: Object.values(platformCounts),
                backgroundColor: [
                    '#E1306C', // Instagram pink
                    '#000000', // TikTok black
                    '#E60023', // Pinterest red
                    '#1877F2', // Facebook blue
                    '#FF0000'  // YouTube red
                ],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            indexAxis: 'y',
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed.x || 0;
                            return `${label}: ${value} posts`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: { stepSize: 1 }
                }
            }
        }
    });
}

// Marketing Activity Impact Chart
function createActivityChart() {
    const ctx = document.getElementById('activityChart');
    if (!ctx) return;
    
    const labels = analyticsData.timeline.map(d => {
        const date = new Date(d.date);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
    
    charts.activity = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Revenue',
                    data: analyticsData.timeline.map(d => d.revenue),
                    backgroundColor: analyticsData.timeline.map(d => 
                        d.hasEvent ? 'rgba(99, 102, 241, 0.8)' : 'rgba(99, 102, 241, 0.3)'
                    ),
                    borderColor: '#6366F1',
                    borderWidth: 1,
                    borderRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    callbacks: {
                        title: function(context) {
                            const idx = context[0].dataIndex;
                            const data = analyticsData.timeline[idx];
                            return new Date(data.date).toLocaleDateString('en-US', { 
                                weekday: 'short', 
                                month: 'short', 
                                day: 'numeric' 
                            });
                        },
                        label: function(context) {
                            const idx = context.dataIndex;
                            const data = analyticsData.timeline[idx];
                            const lines = [`Revenue: $${data.revenue.toFixed(2)}`];
                            if (data.posts > 0) lines.push(`📱 ${data.posts} social post(s)`);
                            if (data.campaigns > 0) lines.push(`📢 ${data.campaigns} campaign(s)`);
                            return lines;
                        }
                    }
                }
            },
            scales: {
                x: { 
                    display: true,
                    grid: { display: false }
                },
                y: {
                    display: true,
                    title: { display: true, text: 'Revenue ($)' },
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toFixed(0);
                        }
                    }
                }
            }
        }
    });
}

// Traffic Source Bar Chart
function createTrafficSourceChart() {
    const ctx = document.getElementById('trafficSourceChart');
    if (!ctx) return;
    
    charts.trafficSource = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(analyticsData.trafficSources).map(s => 
                s.charAt(0).toUpperCase() + s.slice(1)
            ),
            datasets: [{
                label: 'Sessions',
                data: Object.values(analyticsData.trafficSources),
                backgroundColor: [
                    '#E1306C', // Instagram
                    '#4285F4', // Google
                    '#6366F1', // Direct
                    '#1877F2', // Facebook
                    '#000000', // TikTok
                    '#E60023', // Pinterest
                    '#9CA3AF'  // Other
                ],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            indexAxis: 'y',
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed.x || 0;
                            return `${label}: ${value.toLocaleString()} sessions`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true
                }
            }
        }
    });
}
                            return `${label}: ${value.toLocaleString()} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Traffic Trend Over Time
function createTrafficTrendChart() {
    const ctx = document.getElementById('trafficTrendChart');
    if (!ctx) return;
    
    // Aggregate by week for cleaner visualization
    const weeklyData = {};
    analyticsData.timeline.forEach(d => {
        const date = new Date(d.date);
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        const weekKey = weekStart.toISOString().split('T')[0];
        
        if (!weeklyData[weekKey]) {
            weeklyData[weekKey] = { total: 0 };
        }
        weeklyData[weekKey].total += d.sessions;
    });
    
    const labels = Object.keys(weeklyData).map(d => {
        const date = new Date(d);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
    
    charts.trafficTrend = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Weekly Sessions',
                data: Object.values(weeklyData).map(w => w.total),
                borderColor: '#6366F1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12
                }
            },
            scales: {
                x: {
                    display: true,
                    grid: { display: false }
                },
                y: {
                    display: true,
                    title: { display: true, text: 'Sessions' },
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

// Destroy all charts (for cleanup)
function destroyCharts() {
    Object.values(charts).forEach(chart => {
        if (chart) chart.destroy();
    });
    charts = {};
}
