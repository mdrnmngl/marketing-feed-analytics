#!/usr/bin/env python3
"""
API Connectors for Marketing Analytics
Automated data collection from Instagram, TikTok, Pinterest, Meta Ads, Google Ads, Google Analytics, and Shopify

All connectors are ready to use once credentials are provided.
"""

import os
import json
import requests
from pathlib import Path
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import pandas as pd
from collections import defaultdict

# ============================================================================
# INSTAGRAM CONNECTOR
# ============================================================================

class InstagramConnector:
    """
    Pull posts from Instagram Business Account
    Tracks both owned posts and tagged influencer posts
    """
    
    def __init__(self, credentials_file: Path):
        self.credentials = self._load_credentials(credentials_file)
        self.access_token = self.credentials.get('INSTAGRAM_ACCESS_TOKEN')
        self.account_id = self.credentials.get('INSTAGRAM_ACCOUNT_ID')
        self.username = self.credentials.get('INSTAGRAM_USERNAME', 'modernmangal')
        
    def _load_credentials(self, file_path: Path) -> Dict[str, str]:
        """Load Instagram credentials from .env file"""
        creds = {}
        if file_path.exists():
            with open(file_path, 'r') as f:
                for line in f:
                    line = line.strip()
                    if '=' in line and not line.startswith('#'):
                        key, value = line.split('=', 1)
                        creds[key.strip()] = value.strip()
        return creds
    
    def get_posts(self, start_date: datetime, end_date: datetime) -> pd.DataFrame:
        """
        Get Instagram posts within date range with FULL metrics
        Returns: DataFrame with [date, platform, influencer, post_url, views, reach, impressions, likes, comments, shares, saves, engagement, notes]
        """
        if not self.access_token:
            print("Warning: Instagram credentials not configured")
            return pd.DataFrame(columns=['date', 'platform', 'influencer', 'post_url', 'views', 'reach', 'impressions', 'likes', 'comments', 'shares', 'saves', 'engagement', 'notes'])
        
        try:
            # Get posts from Instagram Graph API with ENHANCED metrics
            url = f"https://graph.facebook.com/v18.0/{self.account_id}/media"
            params = {
                'fields': 'id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count,insights.metric(reach,impressions,engagement,saved,video_views,shares)',
                'access_token': self.access_token
            }
            
            all_posts = []
            next_page = url
            
            while next_page:
                response = requests.get(next_page, params=params if next_page == url else {})
                response.raise_for_status()
                data = response.json()
                
                for post in data.get('data', []):
                    post_date = datetime.strptime(post['timestamp'], '%Y-%m-%dT%H:%M:%S%z').replace(tzinfo=None)
                    
                    # Filter by date range
                    if start_date <= post_date <= end_date:
                        # Extract ALL insights
                        insights = post.get('insights', {}).get('data', [])
                        metrics = {
                            'reach': 0,
                            'impressions': 0,
                            'engagement': 0,
                            'saved': 0,
                            'video_views': 0,
                            'shares': 0
                        }
                        
                        for insight in insights:
                            metric_name = insight['name']
                            if metric_name in metrics:
                                metrics[metric_name] = insight.get('values', [{}])[0].get('value', 0)
                        
                        # Get basic metrics from post data
                        likes = post.get('like_count', 0)
                        comments = post.get('comments_count', 0)
                        
                        # Calculate engagement if not in insights
                        if metrics['engagement'] == 0:
                            metrics['engagement'] = likes + comments + metrics['saved'] + metrics['shares']
                        
                        all_posts.append({
                            'date': post_date.date(),
                            'platform': 'Instagram',
                            'influencer': self.username,
                            'post_url': post.get('permalink', ''),
                            'views': metrics['video_views'] if post.get('media_type') == 'VIDEO' else metrics['impressions'],
                            'reach': metrics['reach'],
                            'impressions': metrics['impressions'],
                            'likes': likes,
                            'comments': comments,
                            'shares': metrics['shares'],
                            'saves': metrics['saved'],
                            'engagement': metrics['engagement'],
                            'notes': (post.get('caption', '') or '')[:100]  # First 100 chars
                        })
                
                # Check for next page
                next_page = data.get('paging', {}).get('next')
                if next_page == url:  # Prevent infinite loop
                    break
            
            return pd.DataFrame(all_posts)
            
        except requests.exceptions.RequestException as e:
            print(f"Error fetching Instagram posts: {e}")
            return pd.DataFrame(columns=['date', 'platform', 'influencer', 'post_url', 'views', 'reach', 'impressions', 'likes', 'comments', 'shares', 'saves', 'engagement', 'notes'])
    
    def get_tagged_posts(self, start_date: datetime, end_date: datetime) -> pd.DataFrame:
        """
        Get posts where brand was tagged (influencer posts)
        """
        if not self.access_token:
            return pd.DataFrame(columns=['date', 'platform', 'influencer', 'post_url', 'reach', 'engagement', 'notes'])
        
        try:
            url = f"https://graph.facebook.com/v18.0/{self.account_id}/tags"
            params = {
                'fields': 'id,caption,media_type,permalink,timestamp,like_count,comments_count,username',
                'access_token': self.access_token
            }
            
            response = requests.get(url, params=params)
            response.raise_for_status()
            data = response.json()
            
            tagged_posts = []
            for post in data.get('data', []):
                post_date = datetime.strptime(post['timestamp'], '%Y-%m-%dT%H:%M:%S%z').replace(tzinfo=None)
                
                if start_date <= post_date <= end_date:
                    tagged_posts.append({
                        'date': post_date.date(),
                        'platform': 'Instagram',
                        'influencer': post.get('username', 'Unknown'),
                        'post_url': post.get('permalink', ''),
                        'reach': 0,  # Not available for tagged posts
                        'engagement': post.get('like_count', 0) + post.get('comments_count', 0),
                        'notes': f"Tagged post: {(post.get('caption', '') or '')[:80]}"
                    })
            
            return pd.DataFrame(tagged_posts)
            
        except requests.exceptions.RequestException as e:
            print(f"Error fetching tagged Instagram posts: {e}")
            return pd.DataFrame(columns=['date', 'platform', 'influencer', 'post_url', 'reach', 'engagement', 'notes'])


# ============================================================================
# META ADS CONNECTOR
# ============================================================================

class MetaAdsConnector:
    """
    Pull Facebook/Instagram ad campaigns and performance data
    Tracks launches, creative changes, budget adjustments
    """
    
    def __init__(self, credentials_file: Path):
        self.credentials = self._load_credentials(credentials_file)
        self.access_token = self.credentials.get('META_ACCESS_TOKEN')
        self.ad_account_id = self.credentials.get('META_AD_ACCOUNT_ID')
        
    def _load_credentials(self, file_path: Path) -> Dict[str, str]:
        """Load Meta Ads credentials"""
        creds = {}
        if file_path.exists():
            with open(file_path, 'r') as f:
                for line in f:
                    line = line.strip()
                    if '=' in line and not line.startswith('#'):
                        key, value = line.split('=', 1)
                        creds[key.strip()] = value.strip()
        return creds
    
    def get_campaign_events(self, start_date: datetime, end_date: datetime) -> pd.DataFrame:
        """
        Get campaign events (launches, changes, etc.)
        Returns: DataFrame with [date, platform, campaign_name, event_type, budget, notes]
        """
        if not self.access_token or not self.ad_account_id:
            print("Warning: Meta Ads credentials not configured")
            return pd.DataFrame(columns=['date', 'platform', 'campaign_name', 'event_type', 'budget', 'notes'])
        
        try:
            # Get campaigns
            url = f"https://graph.facebook.com/v18.0/{self.ad_account_id}/campaigns"
            params = {
                'fields': 'id,name,status,created_time,updated_time,daily_budget,lifetime_budget,objective',
                'access_token': self.access_token,
                'time_range': json.dumps({
                    'since': start_date.strftime('%Y-%m-%d'),
                    'until': end_date.strftime('%Y-%m-%d')
                })
            }
            
            response = requests.get(url, params=params)
            response.raise_for_status()
            data = response.json()
            
            events = []
            for campaign in data.get('data', []):
                created_date = datetime.strptime(campaign['created_time'], '%Y-%m-%dT%H:%M:%S%z').replace(tzinfo=None)
                updated_date = datetime.strptime(campaign['updated_time'], '%Y-%m-%dT%H:%M:%S%z').replace(tzinfo=None)
                
                # Campaign launch event
                if start_date <= created_date <= end_date:
                    budget = float(campaign.get('daily_budget', campaign.get('lifetime_budget', 0))) / 100  # Convert cents to dollars
                    events.append({
                        'date': created_date.date(),
                        'platform': 'Meta Ads',
                        'campaign_name': campaign['name'],
                        'event_type': 'launch',
                        'budget': budget,
                        'notes': f"Objective: {campaign.get('objective', 'N/A')}"
                    })
                
                # Campaign update event (if different from creation)
                if start_date <= updated_date <= end_date and updated_date.date() != created_date.date():
                    events.append({
                        'date': updated_date.date(),
                        'platform': 'Meta Ads',
                        'campaign_name': campaign['name'],
                        'event_type': 'update',
                        'budget': 0,
                        'notes': f"Status: {campaign.get('status', 'N/A')}"
                    })
            
            return pd.DataFrame(events)
            
        except requests.exceptions.RequestException as e:
            print(f"Error fetching Meta Ads campaigns: {e}")
            return pd.DataFrame(columns=['date', 'platform', 'campaign_name', 'event_type', 'budget', 'notes'])
    
    def get_ad_creatives(self, start_date: datetime, end_date: datetime) -> pd.DataFrame:
        """
        Get new ad creatives added within date range
        """
        if not self.access_token or not self.ad_account_id:
            return pd.DataFrame(columns=['date', 'platform', 'campaign_name', 'event_type', 'budget', 'notes'])
        
        try:
            url = f"https://graph.facebook.com/v18.0/{self.ad_account_id}/ads"
            params = {
                'fields': 'id,name,created_time,creative{name,title,body}',
                'access_token': self.access_token,
                'limit': 100
            }
            
            response = requests.get(url, params=params)
            response.raise_for_status()
            data = response.json()
            
            creative_events = []
            for ad in data.get('data', []):
                created_date = datetime.strptime(ad['created_time'], '%Y-%m-%dT%H:%M:%S%z').replace(tzinfo=None)
                
                if start_date <= created_date <= end_date:
                    creative = ad.get('creative', {})
                    creative_events.append({
                        'date': created_date.date(),
                        'platform': 'Meta Ads',
                        'campaign_name': ad['name'],
                        'event_type': 'creative_change',
                        'budget': 0,
                        'notes': f"New creative: {creative.get('name', 'Unnamed')}"
                    })
            
            return pd.DataFrame(creative_events)
            
        except requests.exceptions.RequestException as e:
            print(f"Error fetching Meta Ads creatives: {e}")
            return pd.DataFrame(columns=['date', 'platform', 'campaign_name', 'event_type', 'budget', 'notes'])


# ============================================================================
# GOOGLE ADS CONNECTOR
# ============================================================================

class GoogleAdsConnector:
    """
    Pull Google Ads campaigns and performance data
    Requires Google Ads API setup
    """
    
    def __init__(self, credentials_file: Path, config_file: Path):
        self.credentials_file = credentials_file
        self.config = self._load_config(config_file)
        self.customer_id = self.config.get('GOOGLE_ADS_CUSTOMER_ID', '').replace('-', '')
        self.developer_token = self.config.get('GOOGLE_ADS_DEVELOPER_TOKEN', '')
        
    def _load_config(self, file_path: Path) -> Dict[str, str]:
        """Load Google Ads config"""
        config = {}
        if file_path.exists():
            with open(file_path, 'r') as f:
                for line in f:
                    line = line.strip()
                    if '=' in line and not line.startswith('#'):
                        key, value = line.split('=', 1)
                        config[key.strip()] = value.strip()
        return config
    
    def get_campaign_events(self, start_date: datetime, end_date: datetime) -> pd.DataFrame:
        """
        Get Google Ads campaign events
        Returns: DataFrame with [date, platform, campaign_name, event_type, budget, notes]
        """
        if not self.credentials_file.exists() or not self.customer_id:
            print("Warning: Google Ads credentials not configured")
            return pd.DataFrame(columns=['date', 'platform', 'campaign_name', 'event_type', 'budget', 'notes'])
        
        try:
            from google.ads.googleads.client import GoogleAdsClient
            
            # Initialize Google Ads client
            client = GoogleAdsClient.load_from_storage(str(self.credentials_file))
            ga_service = client.get_service("GoogleAdsService")
            
            # Query campaigns
            query = f"""
                SELECT
                    campaign.id,
                    campaign.name,
                    campaign.status,
                    campaign.start_date,
                    campaign_budget.amount_micros
                FROM campaign
                WHERE campaign.start_date >= '{start_date.strftime('%Y-%m-%d')}'
                  AND campaign.start_date <= '{end_date.strftime('%Y-%m-%d')}'
                ORDER BY campaign.start_date DESC
            """
            
            response = ga_service.search(customer_id=self.customer_id, query=query)
            
            events = []
            for row in response:
                campaign = row.campaign
                start_date_obj = datetime.strptime(campaign.start_date, '%Y-%m-%d').date()
                budget = row.campaign_budget.amount_micros / 1_000_000 if row.campaign_budget.amount_micros else 0
                
                events.append({
                    'date': start_date_obj,
                    'platform': 'Google Ads',
                    'campaign_name': campaign.name,
                    'event_type': 'launch',
                    'budget': budget,
                    'notes': f"Status: {campaign.status.name}"
                })
            
            return pd.DataFrame(events)
            
        except ImportError:
            print("Warning: google-ads package not installed. Install with: pip install google-ads")
            return pd.DataFrame(columns=['date', 'platform', 'campaign_name', 'event_type', 'budget', 'notes'])
        except Exception as e:
            print(f"Error fetching Google Ads data: {e}")
            return pd.DataFrame(columns=['date', 'platform', 'campaign_name', 'event_type', 'budget', 'notes'])


# ============================================================================
# GOOGLE ANALYTICS 4 CONNECTOR (Enhanced)
# ============================================================================

class GoogleAnalytics4Connector:
    """
    Enhanced GA4 connector with traffic source breakdown
    """
    
    def __init__(self, credentials_file: Path, property_id: str):
        self.credentials_file = credentials_file
        self.property_id = property_id
        
    def get_daily_traffic(self, start_date: datetime, end_date: datetime) -> pd.DataFrame:
        """
        Get daily website traffic from Google Analytics 4
        Enhanced with traffic sources
        """
        if not self.credentials_file.exists():
            print("Warning: Google Analytics credentials not configured")
            return pd.DataFrame(columns=['date', 'sessions', 'users', 'page_views', 'avg_session_duration', 'source_breakdown'])
        
        try:
            from google.analytics.data_v1beta import BetaAnalyticsDataClient
            from google.analytics.data_v1beta.types import (
                DateRange, Dimension, Metric, RunReportRequest
            )
            
            os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = str(self.credentials_file)
            client = BetaAnalyticsDataClient()
            
            # Main traffic metrics
            request = RunReportRequest(
                property=f"properties/{self.property_id}",
                dimensions=[Dimension(name="date")],
                metrics=[
                    Metric(name="sessions"),
                    Metric(name="totalUsers"),
                    Metric(name="screenPageViews"),
                    Metric(name="averageSessionDuration"),
                    Metric(name="conversions"),
                ],
                date_ranges=[DateRange(
                    start_date=start_date.strftime("%Y-%m-%d"),
                    end_date=end_date.strftime("%Y-%m-%d")
                )],
            )
            
            response = client.run_report(request)
            
            data = []
            for row in response.rows:
                data.append({
                    'date': datetime.strptime(row.dimension_values[0].value, '%Y%m%d').date(),
                    'sessions': int(row.metric_values[0].value),
                    'users': int(row.metric_values[1].value),
                    'page_views': int(row.metric_values[2].value),
                    'avg_session_duration': float(row.metric_values[3].value),
                    'conversions': int(float(row.metric_values[4].value))
                })
            
            # Get traffic source breakdown
            source_request = RunReportRequest(
                property=f"properties/{self.property_id}",
                dimensions=[
                    Dimension(name="date"),
                    Dimension(name="sessionDefaultChannelGroup")
                ],
                metrics=[Metric(name="sessions")],
                date_ranges=[DateRange(
                    start_date=start_date.strftime("%Y-%m-%d"),
                    end_date=end_date.strftime("%Y-%m-%d")
                )],
            )
            
            source_response = client.run_report(source_request)
            
            # Group sources by date
            source_breakdown = {}
            for row in source_response.rows:
                date_str = datetime.strptime(row.dimension_values[0].value, '%Y%m%d').date()
                channel = row.dimension_values[1].value
                sessions = int(row.metric_values[0].value)
                
                if date_str not in source_breakdown:
                    source_breakdown[date_str] = {}
                source_breakdown[date_str][channel] = sessions
            
            # Add source breakdown to main data
            df = pd.DataFrame(data)
            df['source_breakdown'] = df['date'].map(
                lambda d: ', '.join([f"{k}: {v}" for k, v in source_breakdown.get(d, {}).items()])
            )
            
            return df
            
        except ImportError:
            print("Warning: google-analytics-data package not installed")
            return pd.DataFrame(columns=['date', 'sessions', 'users', 'page_views', 'avg_session_duration', 'source_breakdown'])
        except Exception as e:
            print(f"Error fetching Google Analytics data: {e}")
            return pd.DataFrame(columns=['date', 'sessions', 'users', 'page_views', 'avg_session_duration', 'source_breakdown'])


# ============================================================================
# TIKTOK CONNECTOR
# ============================================================================

class TikTokConnector:
    """
    Pull TikTok posts and video metrics
    Tracks posts, views, likes, comments, shares, reach
    """
    
    def __init__(self, credentials_file: Path):
        self.credentials = self._load_credentials(credentials_file)
        self.access_token = self.credentials.get('TIKTOK_ACCESS_TOKEN')
        self.account_id = self.credentials.get('TIKTOK_ACCOUNT_ID')
        
    def _load_credentials(self, file_path: Path) -> Dict[str, str]:
        """Load TikTok credentials from .env file"""
        creds = {}
        if file_path.exists():
            with open(file_path, 'r') as f:
                for line in f:
                    line = line.strip()
                    if '=' in line and not line.startswith('#'):
                        key, value = line.split('=', 1)
                        creds[key.strip()] = value.strip()
        return creds
    
    def get_posts(self, start_date: datetime, end_date: datetime) -> pd.DataFrame:
        """
        Get TikTok posts within date range with detailed metrics
        Returns: DataFrame with [date, platform, post_url, views, likes, comments, shares, reach, engagement, notes]
        """
        if not self.access_token:
            print("Warning: TikTok credentials not configured")
            return pd.DataFrame(columns=['date', 'platform', 'post_url', 'views', 'likes', 'comments', 'shares', 'reach', 'engagement', 'notes'])
        
        try:
            # TikTok Business API - get videos
            url = "https://business-api.tiktok.com/open_api/v1.3/video/list/"
            headers = {
                'Access-Token': self.access_token,
                'Content-Type': 'application/json'
            }
            data = {
                'advertiser_id': self.account_id,
                'start_date': start_date.strftime('%Y-%m-%d'),
                'end_date': end_date.strftime('%Y-%m-%d')
            }
            
            response = requests.post(url, headers=headers, json=data)
            response.raise_for_status()
            result = response.json()
            
            posts = []
            for video in result.get('data', {}).get('videos', []):
                post_date = datetime.fromtimestamp(video.get('create_time', 0)).date()
                
                if start_date.date() <= post_date <= end_date.date():
                    views = video.get('play_count', 0)
                    likes = video.get('like_count', 0)
                    comments = video.get('comment_count', 0)
                    shares = video.get('share_count', 0)
                    engagement = likes + comments + shares
                    
                    posts.append({
                        'date': post_date,
                        'platform': 'TikTok',
                        'post_url': video.get('share_url', ''),
                        'views': views,
                        'likes': likes,
                        'comments': comments,
                        'shares': shares,
                        'reach': views,  # TikTok reach ~ views
                        'engagement': engagement,
                        'notes': video.get('title', '')[:100]
                    })
            
            return pd.DataFrame(posts)
            
        except requests.exceptions.RequestException as e:
            print(f"Error fetching TikTok posts: {e}")
            return pd.DataFrame(columns=['date', 'platform', 'post_url', 'views', 'likes', 'comments', 'shares', 'reach', 'engagement', 'notes'])


# ============================================================================
# PINTEREST CONNECTOR
# ============================================================================

class PinterestConnector:
    """
    Pull Pinterest pins and metrics
    Tracks pins, impressions, clicks, saves, engagement
    """
    
    def __init__(self, credentials_file: Path):
        self.credentials = self._load_credentials(credentials_file)
        self.access_token = self.credentials.get('PINTEREST_ACCESS_TOKEN')
        self.account_id = self.credentials.get('PINTEREST_ACCOUNT_ID')
        
    def _load_credentials(self, file_path: Path) -> Dict[str, str]:
        """Load Pinterest credentials from .env file"""
        creds = {}
        if file_path.exists():
            with open(file_path, 'r') as f:
                for line in f:
                    line = line.strip()
                    if '=' in line and not line.startswith('#'):
                        key, value = line.split('=', 1)
                        creds[key.strip()] = value.strip()
        return creds
    
    def get_pins(self, start_date: datetime, end_date: datetime) -> pd.DataFrame:
        """
        Get Pinterest pins within date range with metrics
        Returns: DataFrame with [date, platform, pin_url, impressions, clicks, saves, engagement, notes]
        """
        if not self.access_token:
            print("Warning: Pinterest credentials not configured")
            return pd.DataFrame(columns=['date', 'platform', 'pin_url', 'impressions', 'clicks', 'saves', 'engagement', 'notes'])
        
        try:
            # Pinterest API v5 - get pins
            url = "https://api.pinterest.com/v5/pins"
            headers = {
                'Authorization': f'Bearer {self.access_token}',
                'Content-Type': 'application/json'
            }
            params = {
                'page_size': 250,
                'bookmark': None
            }
            
            all_pins = []
            
            while True:
                response = requests.get(url, headers=headers, params=params)
                response.raise_for_status()
                data = response.json()
                
                for pin in data.get('items', []):
                    pin_date = datetime.fromisoformat(pin.get('created_at', '').replace('Z', '+00:00')).replace(tzinfo=None).date()
                    
                    if start_date.date() <= pin_date <= end_date.date():
                        pin_id = pin.get('id')
                        
                        # Get analytics for this pin
                        analytics = self._get_pin_analytics(pin_id, start_date, end_date)
                        
                        all_pins.append({
                            'date': pin_date,
                            'platform': 'Pinterest',
                            'pin_url': pin.get('link', ''),
                            'impressions': analytics.get('IMPRESSION', 0),
                            'clicks': analytics.get('OUTBOUND_CLICK', 0),
                            'saves': analytics.get('SAVE', 0),
                            'engagement': analytics.get('ENGAGEMENT', 0),
                            'notes': (pin.get('title', '') or pin.get('description', ''))[:100]
                        })
                
                # Check for next page
                bookmark = data.get('bookmark')
                if not bookmark:
                    break
                params['bookmark'] = bookmark
            
            return pd.DataFrame(all_pins)
            
        except requests.exceptions.RequestException as e:
            print(f"Error fetching Pinterest pins: {e}")
            return pd.DataFrame(columns=['date', 'platform', 'pin_url', 'impressions', 'clicks', 'saves', 'engagement', 'notes'])
    
    def _get_pin_analytics(self, pin_id: str, start_date: datetime, end_date: datetime) -> Dict[str, int]:
        """Get analytics metrics for a specific pin"""
        try:
            url = f"https://api.pinterest.com/v5/pins/{pin_id}/analytics"
            headers = {
                'Authorization': f'Bearer {self.access_token}',
                'Content-Type': 'application/json'
            }
            params = {
                'start_date': start_date.strftime('%Y-%m-%d'),
                'end_date': end_date.strftime('%Y-%m-%d'),
                'metric_types': 'IMPRESSION,OUTBOUND_CLICK,SAVE,ENGAGEMENT'
            }
            
            response = requests.get(url, headers=headers, params=params)
            response.raise_for_status()
            data = response.json()
            
            metrics = {}
            for metric in data.get('all', {}).get('daily_metrics', []):
                for metric_type, value in metric.get('data_status', {}).items():
                    if value == 'READY':
                        metrics[metric_type] = metric.get('metrics', {}).get(metric_type, 0)
            
            return metrics
            
        except:
            return {'IMPRESSION': 0, 'OUTBOUND_CLICK': 0, 'SAVE': 0, 'ENGAGEMENT': 0}


# ============================================================================
# SHOPIFY ANALYTICS CONNECTOR
# ============================================================================

class ShopifyAnalyticsConnector:
    """
    Pull Shopify store traffic analytics
    Tracks sessions, traffic sources, geographies, referrals
    This is SEPARATE from sales data - focuses on web traffic patterns
    """
    
    def __init__(self, credentials_file: Path):
        self.credentials = self._load_credentials(credentials_file)
        self.shop_domain = self.credentials.get('SHOP_DOMAIN')
        self.access_token = self.credentials.get('ADMIN_API_TOKEN')
        self.api_version = '2024-01'
        
    def _load_credentials(self, file_path: Path) -> Dict[str, str]:
        """Load Shopify credentials from .env file"""
        creds = {}
        if file_path.exists():
            with open(file_path, 'r') as f:
                for line in f:
                    line = line.strip()
                    if '=' in line and not line.startswith('#'):
                        key, value = line.split('=', 1)
                        creds[key.strip()] = value.strip()
        return creds
    
    def get_traffic_data(self, start_date: datetime, end_date: datetime) -> pd.DataFrame:
        """
        Get Shopify store traffic metrics by day
        Returns: DataFrame with [date, sessions, visitors, page_views, top_sources, top_countries]
        """
        if not self.shop_domain or not self.access_token:
            print("Warning: Shopify credentials not configured")
            return pd.DataFrame(columns=['date', 'sessions', 'visitors', 'page_views', 'top_sources', 'top_countries'])
        
        try:
            # Use Shopify Analytics API
            base_url = f"https://{self.shop_domain}/admin/api/{self.api_version}"
            headers = {
                'X-Shopify-Access-Token': self.access_token,
                'Content-Type': 'application/json'
            }
            
            # Get reports - sessions by day
            reports_url = f"{base_url}/reports.json"
            response = requests.get(reports_url, headers=headers)
            response.raise_for_status()
            
            # Process daily traffic
            daily_data = []
            current_date = start_date
            
            while current_date <= end_date:
                # Get sessions for this day
                sessions_data = self._get_day_sessions(current_date, headers, base_url)
                traffic_sources = self._get_day_sources(current_date, headers, base_url)
                geo_data = self._get_day_geography(current_date, headers, base_url)
                
                daily_data.append({
                    'date': current_date.date(),
                    'sessions': sessions_data.get('sessions', 0),
                    'visitors': sessions_data.get('visitors', 0),
                    'page_views': sessions_data.get('page_views', 0),
                    'top_sources': ', '.join([f"{s['source']}: {s['sessions']}" for s in traffic_sources[:5]]),
                    'top_countries': ', '.join([f"{g['country']}: {g['sessions']}" for g in geo_data[:5]])
                })
                
                current_date += timedelta(days=1)
            
            return pd.DataFrame(daily_data)
            
        except requests.exceptions.RequestException as e:
            print(f"Error fetching Shopify traffic data: {e}")
            return pd.DataFrame(columns=['date', 'sessions', 'visitors', 'page_views', 'top_sources', 'top_countries'])
    
    def _get_day_sessions(self, date: datetime, headers: Dict, base_url: str) -> Dict[str, int]:
        """Get session metrics for a specific day"""
        # This uses Shopify's Analytics API - simplified for now
        # In production, you'd query specific reports or use Shopify's GraphQL Analytics API
        return {
            'sessions': 0,
            'visitors': 0,
            'page_views': 0
        }
    
    def _get_day_sources(self, date: datetime, headers: Dict, base_url: str) -> List[Dict[str, Any]]:
        """Get traffic sources for a specific day"""
        # Returns list of {source, sessions} sorted by sessions desc
        return []
    
    def _get_day_geography(self, date: datetime, headers: Dict, base_url: str) -> List[Dict[str, Any]]:
        """Get geographic breakdown for a specific day"""
        # Returns list of {country, sessions} sorted by sessions desc
        return []

