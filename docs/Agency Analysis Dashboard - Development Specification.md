```markdown
# Agency Analysis Dashboard - Development Specification

**Project:** JamWATHQ Agency Review System  
**Document Version:** 1.0  
**Last Updated:** November 1, 2025  
**Developer:** Claude Code AI

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Data Schema](#data-schema)
3. [Page Requirements](#page-requirements)
4. [Visual Design Specifications](#visual-design-specifications)
5. [Technical Implementation](#technical-implementation)
6. [Statistical Calculations](#statistical-calculations)
7. [File Structure](#file-structure)
8. [Database Optimization](#database-optimization)
9. [Testing Requirements](#testing-requirements)
10. [Development Phases](#development-phases)

---

## Project Overview

### Objective
Build a dedicated page that displays real-time, dynamic analysis of agency performance based on user review data. The page should automatically update as new reviews are submitted and provide actionable insights into agency quality across multiple dimensions.

### Purpose
Enable JamWATHQ users to make informed decisions about J-1 visa program agencies by providing transparent, data-driven performance metrics based on peer reviews.

---

## Data Schema

### Review Data Fields

| Field Name | Type | Range | Required | Description |
|------------|------|-------|----------|-------------|
| `application_process` | Integer | 1-5 stars | Yes | How smooth and transparent was the process of applying for placements? |
| `customer_service` | Integer | 1-5 stars | Yes | Were inquiries handled efficiently and professionally? |
| `communication` | Integer | 1-5 stars | Yes | Are the placements aligned with expectations and qualifications? |
| `support_services` | Integer | 1-5 stars | Yes | How well does the agency assist users before, during, and after placements? |
| `overall_experience` | Integer | 1-5 stars | Yes | Would you recommend this agency to others? |
| `usage_frequency` | String | Dropdown | Yes | How many times have you used this agency? |
| `comments` | Text | Unlimited | Yes | Open-ended feedback |
| `agency_id` | String | - | Yes | Agency identifier |
| `created_at` | Timestamp | - | Yes | Review submission date |
| `user_id` | String | - | Yes | Reviewer identifier (anonymized in public view) |

### Usage Frequency Options
- First time (1)
- 2-3 times
- 4-5 times
- 6-10 times
- More than 10 times

---

## Page Requirements

### 1. Visual Dashboard Components

#### Primary Display Elements
- **Overall Agency Score**: Average of all 5 metrics, displayed as X.X/5.0 with large star visualization
- **Individual Metric Breakdown**: 5 separate cards, each showing average rating with star display and bar chart
- **Star Rating Distribution**: Histogram showing how many 1-star, 2-star, 3-star, 4-star, 5-star reviews for each metric
- **Trend Analysis Graph**: Plot average rating over time for each metric
- **Review Volume Indicator**: Total reviews, reviews this month, reviews this week
- **User Loyalty Metric**: Derived from usage frequency: % first-time vs. repeat users
- **Sentiment Analysis**: Analyze comments for positive/negative/neutral sentiment with word cloud

### 2. Dynamic Features

#### Filter Options
- **Date Range**: Last 7 days, 30 days, 90 days, all time
- **Usage Frequency**: First-time users only, repeat users only, all users
- **Minimum Rating Threshold**: Show only 4+ star reviews, etc.
- **Sort Agencies By**: Overall score, specific metric, review count, recent activity

#### Interactive Elements
- Auto-refresh when new reviews are submitted to database (or manual refresh button)
- Drill-down capability: Click any metric card to see:
  - All individual ratings for that metric
  - Related comments mentioning that metric
  - Rating distribution breakdown

### 3. Alert & Flag System

Automatically flag agencies with:

| Flag Type | Trigger Condition | Visual Indicator |
|-----------|------------------|------------------|
| Insufficient Data Warning | < 10 reviews total | Yellow badge |
| High Variance Alert | Standard deviation > 1.5 on any metric | Orange badge |
| Declining Trend Warning | Average rating dropped > 0.5 stars in last 30 days | Red badge |
| Low Recommendation Rate | < 60% of users gave 4-5 stars on "Overall Experience" | Red badge |

---

## Visual Design Specifications

### Color Coding for Ratings

```css
/* Rating Color Scale */
4.5 - 5.0 stars: #059669 (Dark Green)
4.0 - 4.4 stars: #10B981 (Light Green)
3.5 - 3.9 stars: #F59E0B (Yellow)
3.0 - 3.4 stars: #F97316 (Orange)
Below 3.0 stars: #DC2626 (Red)
```

### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│  AGENCY NAME                              [Export] [Filter]  │
│  Overall Score: 4.2/5.0 ★★★★☆                               │
│  Based on 127 reviews | Last updated: 2 hours ago           │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│  │ Application  │ │   Customer   │ │Communication │        │
│  │   Process    │ │   Service    │ │              │        │
│  │   4.3/5.0    │ │   4.1/5.0    │ │   4.4/5.0    │  ...   │
│  │  ★★★★☆       │ │  ★★★★☆       │ │  ★★★★☆       │        │
│  │  [Bar Chart] │ │  [Bar Chart] │ │  [Bar Chart] │        │
│  └──────────────┘ └──────────────┘ └──────────────┘        │
├─────────────────────────────────────────────────────────────┤
│  Rating Distribution              │  Trend Over Time        │
│  ┌─────────────────────────────┐ │  ┌────────────────────┐ │
│  │ 5★ ████████████████ (45%)   │ │  │  [Line Graph]      │ │
│  │ 4★ ████████████ (32%)       │ │  │  showing ratings   │ │
│  │ 3★ ████ (15%)               │ │  │  over 6 months     │ │
│  │ 2★ ██ (5%)                  │ │  │                    │ │
│  │ 1★ █ (3%)                   │ │  │                    │ │
│  └─────────────────────────────┘ │  └────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  Recent Comments                  │  Sentiment Analysis     │
│  ┌─────────────────────────────┐ │  ┌────────────────────┐ │
│  │ "Great experience with..."  │ │  │  Positive: 65%     │ │
│  │ ★★★★★ - 2 days ago         │ │  │  Neutral: 25%      │ │
│  │                             │ │  │  Negative: 10%     │ │
│  │ "Customer service was..."   │ │  │  [Pie Chart]       │ │
│  │ ★★★☆☆ - 5 days ago         │ │  │  [Word Cloud]      │ │
│  └─────────────────────────────┘ │  └────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  Key Insights                                                │
│  • 78% of users would recommend this agency                  │
│  • Repeat users rate 0.3 stars higher than first-time users │
│  • Most praised: "professional", "helpful", "responsive"     │
│  • Areas for improvement: "waiting time", "documentation"    │
└─────────────────────────────────────────────────────────────┘
```

### Component Specifications

#### Star Visualization
- Use filled stars (★) and empty stars (☆)
- For partial ratings (e.g., 4.3), show 4 filled stars + 30% filled star
- Size variations:
  - Overall score: 32px
  - Metric cards: 24px
  - Comments: 16px

#### Typography
- **Headings**: Bold, 24px (agency name), 18px (section headers)
- **Metrics**: Semi-bold, 20px for scores
- **Body Text**: Regular, 14px
- **Comments**: Regular, 14px with line-height 1.6

---

## Technical Implementation

### 3.1 Data Processing Logic

#### Overall Score Calculation

```javascript
/**
 * Calculate overall agency score (simple average of 5 metrics)
 * @param {Array} reviews - Array of review objects
 * @returns {Object} - Overall score and metric breakdown
 */
const calculateOverallScore = (reviews) => {
  if (reviews.length === 0) return null;
  
  const totals = reviews.reduce((acc, review) => ({
    applicationProcess: acc.applicationProcess + review.applicationProcess,
    customerService: acc.customerService + review.customerService,
    communication: acc.communication + review.communication,
    supportServices: acc.supportServices + review.supportServices,
    overallExperience: acc.overallExperience + review.overallExperience
  }), { 
    applicationProcess: 0, 
    customerService: 0, 
    communication: 0, 
    supportServices: 0, 
    overallExperience: 0 
  });
  
  const count = reviews.length;
  const avgPerMetric = Object.values(totals).map(sum => sum / count);
  const overallAvg = avgPerMetric.reduce((a, b) => a + b, 0) / 5;
  
  return {
    overall: overallAvg.toFixed(2),
    breakdown: {
      applicationProcess: (totals.applicationProcess / count).toFixed(2),
      customerService: (totals.customerService / count).toFixed(2),
      communication: (totals.communication / count).toFixed(2),
      supportServices: (totals.supportServices / count).toFixed(2),
      overallExperience: (totals.overallExperience / count).toFixed(2)
    },
    reviewCount: count
  };
};
```

#### Star Distribution Calculation

```javascript
/**
 * Calculate star distribution for a specific metric
 * @param {Array} reviews - Array of review objects
 * @param {String} metric - Metric name (e.g., 'applicationProcess')
 * @returns {Object} - Distribution of 1-5 star ratings
 */
const getStarDistribution = (reviews, metric) => {
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  
  reviews.forEach(review => {
    const rating = review[metric];
    if (rating >= 1 && rating <= 5) {
      distribution[rating]++;
    }
  });
  
  // Calculate percentages
  const total = reviews.length;
  const percentages = {};
  Object.keys(distribution).forEach(star => {
    percentages[star] = ((distribution[star] / total) * 100).toFixed(1);
  });
  
  return { counts: distribution, percentages };
};
```

#### Repeat User Analysis

```javascript
/**
 * Analyze satisfaction difference between first-time and repeat users
 * @param {Array} reviews - Array of review objects
 * @returns {Object} - Comparative analysis
 */
const analyzeRepeatUsers = (reviews) => {
  const firstTime = reviews.filter(r => 
    r.usageFrequency === 'First time (1)' || r.usageFrequency === '1'
  );
  const repeat = reviews.filter(r => 
    r.usageFrequency !== 'First time (1)' && r.usageFrequency !== '1'
  );
  
  const firstTimeScore = firstTime.length > 0 
    ? calculateOverallScore(firstTime).overall 
    : null;
  const repeatScore = repeat.length > 0 
    ? calculateOverallScore(repeat).overall 
    : null;
  
  return {
    firstTimeAvg: firstTimeScore,
    repeatUserAvg: repeatScore,
    loyaltyRate: ((repeat.length / reviews.length) * 100).toFixed(1),
    totalFirstTime: firstTime.length,
    totalRepeat: repeat.length,
    scoreDifference: repeatScore && firstTimeScore 
      ? (repeatScore - firstTimeScore).toFixed(2) 
      : null
  };
};
```

#### Trend Detection

```javascript
/**
 * Detect rating trends over time
 * @param {Array} reviews - Array of review objects with timestamps
 * @param {Number} daysPast - Number of days to analyze (default: 30)
 * @returns {Object} - Trend analysis
 */
const detectTrend = (reviews, daysPast = 30) => {
  const now = new Date();
  const cutoffDate = new Date(now.getTime() - (daysPast * 24 * 60 * 60 * 1000));
  
  const recentReviews = reviews.filter(r => 
    new Date(r.created_at) >= cutoffDate
  );
  const olderReviews = reviews.filter(r => 
    new Date(r.created_at) < cutoffDate
  );
  
  if (recentReviews.length === 0 || olderReviews.length === 0) {
    return { trend: 'insufficient_data', change: 0 };
  }
  
  const recentAvg = calculateOverallScore(recentReviews).overall;
  const olderAvg = calculateOverallScore(olderReviews).overall;
  const change = (recentAvg - olderAvg).toFixed(2);
  
  let trend = 'stable';
  if (change > 0.5) trend = 'improving';
  if (change < -0.5) trend = 'declining';
  
  return {
    trend,
    change,
    recentAvg,
    olderAvg,
    recentCount: recentReviews.length,
    olderCount: olderReviews.length
  };
};
```

#### Standard Deviation (Consistency Metric)

```javascript
/**
 * Calculate standard deviation to measure rating consistency
 * @param {Array} reviews - Array of review objects
 * @param {String} metric - Metric to analyze
 * @returns {Number} - Standard deviation
 */
const calculateStdDev = (reviews, metric) => {
  if (reviews.length === 0) return 0;
  
  const values = reviews.map(r => r[metric]);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const squaredDiffs = values.map(value => Math.pow(value - mean, 2));
  const variance = squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
  
  return Math.sqrt(variance).toFixed(2);
};
```

#### Sentiment Analysis (Basic)

```javascript
/**
 * Basic sentiment analysis of comments
 * @param {Array} comments - Array of comment strings
 * @returns {Object} - Sentiment breakdown
 */
const analyzeSentiment = (comments) => {
  // Positive keywords
  const positiveWords = [
    'excellent', 'great', 'amazing', 'helpful', 'professional', 
    'responsive', 'recommend', 'smooth', 'easy', 'friendly',
    'efficient', 'supportive', 'transparent', 'reliable', 'satisfied'
  ];
  
  // Negative keywords
  const negativeWords = [
    'poor', 'terrible', 'slow', 'unprofessional', 'rude', 
    'disappointing', 'avoid', 'worst', 'difficult', 'confusing',
    'unresponsive', 'dishonest', 'frustrating', 'waste', 'scam'
  ];
  
  let positive = 0;
  let negative = 0;
  let neutral = 0;
  
  const wordFrequency = { positive: {}, negative: {} };
  
  comments.forEach(comment => {
    const lowerComment = comment.toLowerCase();
    let positiveCount = 0;
    let negativeCount = 0;
    
    // Count positive words
    positiveWords.forEach(word => {
      const matches = (lowerComment.match(new RegExp(word, 'g')) || []).length;
      if (matches > 0) {
        positiveCount += matches;
        wordFrequency.positive[word] = (wordFrequency.positive[word] || 0) + matches;
      }
    });
    
    // Count negative words
    negativeWords.forEach(word => {
      const matches = (lowerComment.match(new RegExp(word, 'g')) || []).length;
      if (matches > 0) {
        negativeCount += matches;
        wordFrequency.negative[word] = (wordFrequency.negative[word] || 0) + matches;
      }
    });
    
    // Classify comment
    if (positiveCount > negativeCount) positive++;
    else if (negativeCount > positiveCount) negative++;
    else neutral++;
  });
  
  const total = comments.length;
  
  return {
    positive: ((positive / total) * 100).toFixed(1),
    negative: ((negative / total) * 100).toFixed(1),
    neutral: ((neutral / total) * 100).toFixed(1),
    topPositiveWords: Object.entries(wordFrequency.positive)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word, count]) => ({ word, count })),
    topNegativeWords: Object.entries(wordFrequency.negative)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word, count]) => ({ word, count }))
  };
};
```

### 3.2 Real-Time Update Strategy

#### Option 1: Polling (Simpler Implementation)

```javascript
import { useEffect, useState } from 'react';

const AgencyDashboard = ({ agencyId }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchLatestReviews = async () => {
    try {
      const response = await fetch(`/api/agencies/${agencyId}/reviews`);
      const data = await response.json();
      setDashboardData(data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchLatestReviews();
    
    // Poll every 30 seconds
    const interval = setInterval(() => {
      fetchLatestReviews();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [agencyId]);

  return (
    <div>
      {lastUpdate && (
        <p>Last updated: {lastUpdate.toLocaleTimeString()}</p>
      )}
      {/* Dashboard components */}
    </div>
  );
};
```

#### Option 2: WebSocket (Real-Time)

```javascript
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const AgencyDashboard = ({ agencyId }) => {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_WS_URL);
    
    // Subscribe to agency review updates
    socket.emit('subscribe', `agency:${agencyId}`);
    
    // Listen for new reviews
    socket.on('new_review', (review) => {
      console.log('New review received:', review);
      // Update dashboard data
      setDashboardData(prevData => ({
        ...prevData,
        reviews: [...prevData.reviews, review]
      }));
    });
    
    return () => {
      socket.emit('unsubscribe', `agency:${agencyId}`);
      socket.disconnect();
    };
  }, [agencyId]);

  return <div>{/* Dashboard components */}</div>;
};
```

### 3.3 Export Functionality

```javascript
/**
 * Export dashboard data to PDF
 * Uses jsPDF and html2canvas libraries
 */
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const exportToPDF = async (agencyName, elementId) => {
  const element = document.getElementById(elementId);
  
  // Capture dashboard as image
  const canvas = await html2canvas(element, {
    scale: 2,
    logging: false,
    useCORS: true
  });
  
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');
  
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;
  const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
  
  const imgX = (pdfWidth - imgWidth * ratio) / 2;
  const imgY = 10;
  
  pdf.addImage(
    imgData, 
    'PNG', 
    imgX, 
    imgY, 
    imgWidth * ratio, 
    imgHeight * ratio
  );
  
  pdf.save(`${agencyName}_Analysis_Report.pdf`);
};

/**
 * Export raw review data to CSV
 */
const exportToCSV = (reviews, agencyName) => {
  const headers = [
    'Date',
    'Application Process',
    'Customer Service',
    'Communication',
    'Support Services',
    'Overall Experience',
    'Usage Frequency',
    'Comment'
  ];
  
  const csvContent = [
    headers.join(','),
    ...reviews.map(review => [
      new Date(review.created_at).toLocaleDateString(),
      review.applicationProcess,
      review.customerService,
      review.communication,
      review.supportServices,
      review.overallExperience,
      `"${review.usageFrequency}"`,
      `"${review.comments.replace(/"/g, '""')}"`
    ].join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${agencyName}_Reviews.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
```

---

## Statistical Calculations

### Key Metrics Summary

| Metric | Formula | Purpose |
|--------|---------|---------|
| Overall Score | (Sum of all 5 metrics) / 5 | Single performance indicator |
| Mean Rating | Σ(ratings) / n | Average performance |
| Median Rating | Middle value when sorted | Central tendency (outlier-resistant) |
| Standard Deviation | √(Σ(x - μ)² / n) | Consistency measure |
| Recommendation Rate | (4-5 star reviews / total reviews) × 100 | Percentage likely to recommend |
| Review Velocity | Reviews in period / days in period | Growth trend |
| Loyalty Score | (Repeat users / total users) × 100 | User retention indicator |

### Advanced Insights

#### 1. Weighted Score (Optional Enhancement)
```javascript
const calculateWeightedScore = (review) => {
  return (
    review.applicationProcess * 0.20 +
    review.customerService * 0.25 +
    review.communication * 0.20 +
    review.supportServices * 0.20 +
    review.overallExperience * 0.15
  );
};
```

#### 2. Confidence Interval
```javascript
/**
 * Calculate 95% confidence interval for rating
 * Helps indicate reliability of average score
 */
const calculateConfidenceInterval = (reviews, metric) => {
  if (reviews.length < 2) return null;
  
  const values = reviews.map(r => r[metric]);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const stdDev = calculateStdDev(reviews, metric);
  const standardError = stdDev / Math.sqrt(values.length);
  
  // 95% confidence (z-score = 1.96)
  const marginOfError = 1.96 * standardError;
  
  return {
    lower: (mean - marginOfError).toFixed(2),
    upper: (mean + marginOfError).toFixed(2),
    mean: mean.toFixed(2)
  };
};
```

---

## File Structure

```
/pages/
  └── agency-analysis/
      ├── index.jsx                    # All agencies list/comparison
      ├── [agencyId].jsx              # Individual agency dashboard
      └── compare.jsx                  # Side-by-side comparison page

/components/
  └── agency-dashboard/
      ├── OverallScoreCard.jsx        # Main score display
      ├── MetricBreakdownCard.jsx     # Reusable metric card
      ├── StarRating.jsx              # Star visualization component
      ├── StarDistributionChart.jsx   # Histogram of rating distribution
      ├── TrendLineChart.jsx          # Time-series trend visualization
      ├── CommentSection.jsx          # Recent comments display
      ├── CommentCard.jsx             # Individual comment card
      ├── SentimentPieChart.jsx       # Sentiment breakdown visualization
      ├── WordCloud.jsx               # Keyword frequency cloud
      ├── FilterControls.jsx          # Date/frequency filters
      ├── ExportButton.jsx            # PDF/CSV export controls
      ├── FlagBadges.jsx              # Warning/alert indicators
      ├── LoadingSkeleton.jsx         # Loading state placeholder
      └── EmptyState.jsx              # No reviews state

/lib/
  └── agency-analytics/
      ├── scoreCalculations.js        # All scoring algorithms
      ├── sentimentAnalysis.js        # Comment sentiment processing
      ├── trendDetection.js           # Time-series analysis
      ├── statisticalMetrics.js       # Advanced statistical calculations
      ├── exportToPDF.js              # PDF generation logic
      ├── exportToCSV.js              # CSV export logic
      └── dataValidation.js           # Input validation & sanitization

/styles/
  ├── agency-dashboard.module.css     # Dashboard-specific styles
  └── charts.module.css               # Chart component styles

/hooks/
  ├── useAgencyReviews.js            # Custom hook for fetching reviews
  ├── useDashboardFilters.js         # Filter state management
  └── useRealtimeUpdates.js          # WebSocket/polling logic

/utils/
  ├── dateHelpers.js                 # Date formatting utilities
  ├── ratingHelpers.js               # Star rating calculations
  └── colorScale.js                  # Rating-to-color mapping

/api/
  └── agencies/
      ├── [agencyId]/
      │   ├── reviews.js             # GET all reviews for agency
      │   └── analytics.js           # GET calculated analytics
      └── reviews/
          └── index.js                # POST new review

/types/
  └── review.d.ts                     # TypeScript type definitions
```

---

## Database Optimization

### 8.1 Index Strategy

```sql
-- Primary indexes for fast query performance
CREATE INDEX idx_agency_reviews 
ON reviews(agency_id, created_at DESC);

CREATE INDEX idx_review_ratings 
ON reviews(
  overall_experience, 
  application_process, 
  customer_service,
  communication,
  support_services
);

CREATE INDEX idx_usage_frequency 
ON reviews(usage_frequency);

CREATE INDEX idx_created_at 
ON reviews(created_at DESC);

-- Composite index for filtered queries
CREATE INDEX idx_agency_date_rating 
ON reviews(agency_id, created_at, overall_experience);
```

### 8.2 Optimized Query Examples

#### Get Agency Analytics
```sql
-- Single query to fetch all necessary data
SELECT 
  agency_id,
  COUNT(*) as total_reviews,
  AVG(application_process) as avg_app_process,
  AVG(customer_service) as avg_cust_service,
  AVG(communication) as avg_communication,
  AVG(support_services) as avg_support,
  AVG(overall_experience) as avg_overall,
  STDDEV(overall_experience) as rating_variance,
  COUNT(CASE WHEN overall_experience >= 4 THEN 1 END) as high_ratings,
  COUNT(CASE WHEN usage_frequency != 'First time (1)' THEN 1 END) as repeat_users
FROM reviews
WHERE agency_id = ?
GROUP BY agency_id;
```

#### Get Recent Reviews with Pagination
```sql
SELECT 
  id,
  application_process,
  customer_service,
  communication,
  support_services,
  overall_experience,
  usage_frequency,
  comments,
  created_at
FROM reviews
WHERE agency_id = ?
ORDER BY created_at DESC
LIMIT ? OFFSET ?;
```

#### Get Trend Data
```sql
-- Monthly average ratings for trend chart
SELECT 
  DATE_TRUNC('month', created_at) as month,
  AVG(application_process) as avg_app_process,
  AVG(customer_service) as avg_cust_service,
  AVG(communication) as avg_communication,
  AVG(support_services) as avg_support,
  AVG(overall_experience) as avg_overall,
  COUNT(*) as review_count
FROM reviews
WHERE agency_id = ?
  AND created_at >= NOW() - INTERVAL '6 months'
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month ASC;
```

### 8.3 Caching Strategy

```javascript
// Redis caching for frequently accessed data
import redis from 'redis';

const CACHE_TTL = 300; // 5 minutes

const getCachedAnalytics = async (agencyId) => {
  const cacheKey = `agency:${agencyId}:analytics`;
  const cached = await redis.get(cacheKey);
  
  if (cached) {
    return JSON.parse(cached);
  }
  
  // Fetch from database
  const analytics = await fetchAgencyAnalytics(agencyId);
  
  // Cache the result
  await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(analytics));
  
  return analytics;
};

// Invalidate cache when new review is submitted
const invalidateAgencyCache = async (agencyId) => {
  const cacheKey = `agency:${agencyId}:analytics`;
  await redis.del(cacheKey);
};
```

---

## Testing Requirements

### 9.1 Unit Tests

```javascript
// Example test suite for score calculations
describe('Score Calculations', () => {
  test('calculateOverallScore returns correct average', () => {
    const mockReviews = [
      { applicationProcess: 5, customerService: 4, communication: 5, 
        supportServices: 4, overallExperience: 5 },
      { applicationProcess: 3, customerService: 4, communication: 3, 
        supportServices: 4, overallExperience: 4 }
    ];
    
    const result = calculateOverallScore(mockReviews);
    expect(result.overall).toBe('4.20');
  });
  
  test('handles empty reviews array', () => {
    const result = calculateOverallScore([]);
    expect(result).toBeNull();
  });
  
  test('star distribution calculates percentages correctly', () => {
    const mockReviews = [
      { overallExperience: 5 },
      { overallExperience: 5 },
      { overallExperience: 4 },
      { overallExperience: 3 }
    ];
    
    const result = getStarDistribution(mockReviews, 'overallExperience');
    expect(result.percentages['5']).toBe('50.0');
    expect(result.percentages['4']).toBe('25.0');
  });
});
```

### 9.2 Integration Tests

```javascript
describe('Agency Dashboard API', () => {
  test('GET /api/agencies/:id/reviews returns reviews', async () => {
    const response = await fetch('/api/agencies/test-agency-123/reviews');
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(Array.isArray(data.reviews)).toBe(true);
  });
  
  test('POST /api/reviews creates new review', async () => {
    const newReview = {
      agencyId: 'test-agency-123',
      applicationProcess: 5,
      customerService: 4,
      communication: 5,
      supportServices: 4,
      overallExperience: 5,
      usageFrequency: 'First time (1)',
      comments: 'Great experience!'
    };
    
    const response = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newReview)
    });
    
    expect(response.status).toBe(201);
  });
});
```

### 9.3 Testing Checklist

| Test Case | Status | Priority |
|-----------|--------|----------|
| Dashboard displays correctly with 0 reviews (empty state) | ☐ | High |
| Dashboard displays correctly with 1-9 reviews (insufficient data warning) | ☐ | High |
| Dashboard displays correctly with 100+ reviews | ☐ | High |
| Star visualizations render accurately (4.3 shows correctly) | ☐ | High |
| Filters apply correctly and update charts | ☐ | High |
| Trend graph shows meaningful patterns over time | ☐ | Medium |
| Comment sentiment analysis produces reasonable results | ☐ | Medium |
| Export to PDF includes all key metrics | ☐ | Medium |
| Mobile responsive (test on 375px width minimum) | ☐ | High |
| Page loads in < 2 seconds with 500+ reviews | ☐ | High |
| Real-time updates trigger without page refresh | ☐ | Medium |
| Database queries execute in < 500ms | ☐ | High |
| Cache invalidation works correctly | ☐ | Medium |
| Error states display appropriately | ☐ | High |
| Accessibility: keyboard navigation works | ☐ | Medium |
| Accessibility: screen readers can navigate | ☐ | Medium |

### 9.4 Performance Benchmarks

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Initial page load | < 2 seconds | Lighthouse Performance Score > 90 |
| Time to Interactive | < 3 seconds | Chrome DevTools Performance tab |
| Chart render time | < 500ms | React Profiler |
| Filter application | < 300ms | console.time() benchmarks |
| Database query execution | < 500ms | Query explain plans |
| Export PDF generation | < 5 seconds | End-to-end timing |

---

## Development Phases

### Phase 1: MVP (Week 1-2)
**Goal:** Basic functional dashboard with core metrics

#### Tasks:
- [ ] Set up project structure and dependencies
- [ ] Create database schema and seed test data
- [ ] Build API endpoints for fetching reviews
- [ ] Implement `calculateOverallScore()` function
- [ ] Create `OverallScoreCard` component
- [ ] Create 5 `MetricBreakdownCard` components
- [ ] Build basic `StarRating` visualization component
- [ ] Implement simple bar charts for each metric
- [ ] Create `CommentSection` with recent reviews
- [ ] Style with basic responsive CSS
- [ ] Deploy to staging environment

#### Acceptance Criteria:
- Dashboard displays overall score and 5 metric breakdowns
- Star ratings render correctly
- Recent comments appear in chronological order
- Page is mobile responsive
- All data fetches from actual database

---

### Phase 2: Enhanced Analytics (Week 3-4)
**Goal:** Add advanced visualizations and filtering

#### Tasks:
- [ ] Implement `StarDistributionChart` (histogram)
- [ ] Build `TrendLineChart` for time-series data
- [ ] Create `FilterControls` component
- [ ] Add date range filtering
- [ ] Add usage frequency filtering
- [ ] Implement `detectTrend()` function
- [ ] Build `FlagBadges` for warnings
- [ ] Add `calculateStdDev()` for consistency metrics
- [ ] Implement `analyzeRepeatUsers()` function
- [ ] Create loyalty metrics display
- [ ] Add export to PDF functionality
- [ ] Add export to CSV functionality
- [ ] Optimize database queries with indexes

#### Acceptance Criteria:
- Users can filter by date range and usage frequency
- Trend charts show meaningful patterns
- Warning badges appear for flagged conditions
- Export functions generate valid PDF/CSV files
- Page performance remains under 2 seconds load time

---

### Phase 3: Real-Time & Advanced Features (Week 5-6)
**Goal:** Real-time updates, sentiment analysis, and polish

#### Tasks:
- [ ] Implement WebSocket or polling for real-time updates
- [ ] Build `analyzeSentiment()` function
- [ ] Create `SentimentPieChart` component
- [ ] Build `WordCloud` component
- [ ] Add drill-down interactions (click metric to see details)
- [ ] Create multi-agency comparison page
- [ ] Build radar chart for agency comparison
- [ ] Implement cache layer (Redis)
- [ ] Add loading skeletons
- [ ] Create empty state designs
- [ ] Add error boundary components
- [ ] Conduct full accessibility audit
- [ ] Write comprehensive test suite
- [ ] Performance optimization pass
- [ ] Final UI polish and animations

#### Acceptance Criteria:
- Dashboard updates in real-time when new reviews submitted
- Sentiment analysis produces reasonable results
- Word cloud highlights key themes
- Comparison page allows side-by-side agency analysis
- All accessibility standards met (WCAG 2.1 AA)
- Test coverage > 80%
- Lighthouse score > 90 across all metrics

---

### Phase 4: Admin & Maintenance (Ongoing)
**Goal:** Tools for content moderation and system monitoring

#### Tasks:
- [ ] Build admin panel for review moderation
- [ ] Create flag management interface
- [ ] Add review reporting system
- [ ] Implement spam detection
- [ ] Set up error logging and monitoring
- [ ] Create analytics dashboard for platform usage
- [ ] Build automated backup system
- [ ] Document API endpoints
- [ ] Create user documentation
- [ ] Set up CI/CD pipeline
- [ ] Establish monitoring alerts

#### Acceptance Criteria:
- Admins can moderate flagged reviews
- Automated alerts for system issues
- Complete API documentation available
- Automated tests run on every commit

---

## Additional Considerations

### 10.1 Security

#### Input Validation
```javascript
const validateReview = (reviewData) => {
  const errors = [];
  
  // Validate star ratings (1-5)
  const ratingFields = [
    'applicationProcess', 
    'customerService', 
    'communication', 
    'supportServices', 
    'overallExperience'
  ];
  
  ratingFields.forEach(field => {
    if (!reviewData[field] || reviewData[field] < 1 || reviewData[field] > 5) {
      errors.push(`${field} must be between 1 and 5`);
    }
  });
  
  // Validate comment (required, max length)
  if (!reviewData.comments || reviewData.comments.trim().length === 0) {
    errors.push('Comment is required');
  }
  if (reviewData.comments.length > 5000) {
    errors.push('Comment must be less than 5000 characters');
  }
  
  // Sanitize comment (prevent XSS)
  reviewData.comments = sanitizeHtml(reviewData.comments, {
    allowedTags: [],
    allowedAttributes: {}
  });
  
  return { isValid: errors.length === 0, errors };
};
```

#### Rate Limiting
```javascript
// Prevent spam reviews from single user
import rateLimit from 'express-rate-limit';

const reviewLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Max 3 reviews per hour per user
  message: 'Too many reviews submitted. Please try again later.'
});

app.post('/api/reviews', reviewLimiter, async (req, res) => {
  // Review submission logic
});
```

### 10.2 Accessibility

```jsx
// Example accessible metric card
const MetricBreakdownCard = ({ metric, score, distribution }) => {
  return (
    <div 
      className="metric-card"
      role="region"
      aria-label={`${metric} rating: ${score} out of 5 stars`}
    >
      <h3 id={`${metric}-heading`}>{metric}</h3>
      
      <div 
        aria-labelledby={`${metric}-heading`}
        aria-describedby={`${metric}-description`}
      >
        <StarRating rating={score} />
        <span className="sr-only">{score} out of 5 stars</span>
      </div>
      
      <p id={`${metric}-description`}>
        Based on {distribution.total} reviews
      </p>
      
      <button 
        aria-label={`View detailed breakdown for ${metric}`}
        onClick={() => showDetails(metric)}
      >
        View Details
      </button>
    </div>
  );
};
```

### 10.3 Privacy & GDPR Compliance

- **Anonymize user data** in public displays
- **Obtain consent** before collecting reviews
- **Provide data deletion** upon user request
- **Secure storage** of personal information
- **Clear privacy policy** linked on review form

---

## Appendix

### A. Technology Stack Recommendations

| Layer | Recommended Technology | Alternative |
|-------|----------------------|-------------|
| Frontend Framework | Next.js 14+ | React 18 + Vite |
| UI Components | Tailwind CSS + shadcn/ui | Material-UI |
| Charts | Recharts | Chart.js |
| Database | PostgreSQL | MongoDB |
| ORM | Prisma | Drizzle ORM |
| Caching | Redis | In-memory cache |
| Real-time | Socket.io | Server-Sent Events |
| API | Next.js API Routes | Express.js |
| Testing | Jest + React Testing Library | Vitest |
| Deployment | Vercel | AWS / Railway |

### B. Environment Variables

```bash
# .env.local
DATABASE_URL="postgresql://user:password@localhost:5432/jamwathq"
REDIS_URL="redis://localhost:6379"
NEXT_PUBLIC_WS_URL="ws://localhost:3001"
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
```

### C. Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "recharts": "^2.10.0",
    "jspdf": "^2.5.1",
    "html2canvas": "^1.4.1",
    "socket.io-client": "^4.6.0",
    "date-fns": "^2.30.0",
    "prisma": "^5.0.0",
    "@prisma/client": "^5.0.0",
    "redis": "^4.6.0",
    "sanitize-html": "^2.11.0"
  },
  "devDependencies": {
    "jest": "^29.7.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.1.0",
    "eslint": "^8.50.0",
    "typescript": "^5.2.0"
  }
}
```

---

## Document History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | Nov 1, 2025 | Initial specification | Claude |

---

**END OF SPECIFICATION DOCUMENT**

For questions or clarifications, refer to JamWATHQ project documentation or contact the development team.
```