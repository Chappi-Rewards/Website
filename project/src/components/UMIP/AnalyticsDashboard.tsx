import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Target, 
  DollarSign, 
  Clock, 
  Globe, 
  Smartphone,
  Eye,
  Download,
  Filter,
  Calendar,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { Button } from '../ui/Button';
import { COLORS, ICON_SIZES } from '../../utils/constants';

interface AnalyticsMetric {
  id: string;
  name: string;
  value: number;
  previousValue: number;
  change: number;
  changeType: 'increase' | 'decrease';
  unit: string;
  icon: React.ReactNode;
  color: string;
}

interface CustomerSegmentAnalytics {
  segmentId: string;
  segmentName: string;
  size: number;
  ltv: number;
  cac: number;
  ltvCacRatio: number;
  churnRate: number;
  engagementScore: number;
  conversionRate: number;
  revenueContribution: number;
}

interface ChannelPerformance {
  channel: string;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  conversionRate: number;
  cost: number;
  roas: number;
  icon: React.ReactNode;
}

interface PredictiveInsight {
  id: string;
  type: 'opportunity' | 'risk' | 'optimization';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  recommendedAction: string;
  estimatedValue: number;
}

export const AnalyticsDashboard: React.FC = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [selectedSegment, setSelectedSegment] = useState('all');
  const [isRealTime, setIsRealTime] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const [metrics, setMetrics] = useState<AnalyticsMetric[]>([]);
  const [segmentAnalytics, setSegmentAnalytics] = useState<CustomerSegmentAnalytics[]>([]);
  const [channelPerformance, setChannelPerformance] = useState<ChannelPerformance[]>([]);
  const [predictiveInsights, setPredictiveInsights] = useState<PredictiveInsight[]>([]);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (isRealTime) {
        setLastUpdated(new Date());
        // Update metrics with small random changes
        setMetrics(prev => prev.map(metric => ({
          ...metric,
          previousValue: metric.value,
          value: metric.value + (Math.random() - 0.5) * metric.value * 0.1,
          change: Math.random() * 20 - 10,
          changeType: Math.random() > 0.5 ? 'increase' : 'decrease'
        })));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isRealTime]);

  // Initialize mock data
  useEffect(() => {
    const mockMetrics: AnalyticsMetric[] = [
      {
        id: 'total_users',
        name: 'Total Active Users',
        value: 125000,
        previousValue: 118000,
        change: 5.9,
        changeType: 'increase',
        unit: '',
        icon: <Users className={ICON_SIZES.large} />,
        color: COLORS.primary
      },
      {
        id: 'revenue',
        name: 'Total Revenue',
        value: 2450000,
        previousValue: 2280000,
        change: 7.5,
        changeType: 'increase',
        unit: '$',
        icon: <DollarSign className={ICON_SIZES.large} />,
        color: COLORS.accent
      },
      {
        id: 'avg_ltv_cac',
        name: 'Avg LTV:CAC Ratio',
        value: 4.2,
        previousValue: 3.8,
        change: 10.5,
        changeType: 'increase',
        unit: ':1',
        icon: <TrendingUp className={ICON_SIZES.large} />,
        color: COLORS.secondary
      },
      {
        id: 'conversion_rate',
        name: 'Conversion Rate',
        value: 8.7,
        previousValue: 8.2,
        change: 6.1,
        changeType: 'increase',
        unit: '%',
        icon: <Target className={ICON_SIZES.large} />,
        color: COLORS.primary
      },
      {
        id: 'avg_response_time',
        name: 'Avg Response Time',
        value: 45,
        previousValue: 52,
        change: -13.5,
        changeType: 'decrease',
        unit: 'ms',
        icon: <Clock className={ICON_SIZES.large} />,
        color: COLORS.accent
      },
      {
        id: 'data_freshness',
        name: 'Data Freshness',
        value: 2.3,
        previousValue: 3.1,
        change: -25.8,
        changeType: 'decrease',
        unit: 'min',
        icon: <RefreshCw className={ICON_SIZES.large} />,
        color: COLORS.secondary
      }
    ];

    const mockSegmentAnalytics: CustomerSegmentAnalytics[] = [
      {
        segmentId: 'high_value',
        segmentName: 'High-Value Customers',
        size: 25000,
        ltv: 450.00,
        cac: 12.50,
        ltvCacRatio: 36.0,
        churnRate: 5.2,
        engagementScore: 92,
        conversionRate: 15.8,
        revenueContribution: 65.2
      },
      {
        segmentId: 'regular',
        segmentName: 'Regular Customers',
        size: 75000,
        ltv: 180.00,
        cac: 8.20,
        ltvCacRatio: 21.95,
        churnRate: 12.5,
        engagementScore: 78,
        conversionRate: 8.4,
        revenueContribution: 28.7
      },
      {
        segmentId: 'new_users',
        segmentName: 'New Users',
        size: 25000,
        ltv: 45.00,
        cac: 5.50,
        ltvCacRatio: 8.18,
        churnRate: 25.8,
        engagementScore: 65,
        conversionRate: 3.2,
        revenueContribution: 6.1
      }
    ];

    const mockChannelPerformance: ChannelPerformance[] = [
      {
        channel: 'WhatsApp',
        impressions: 1250000,
        clicks: 87500,
        conversions: 8750,
        ctr: 7.0,
        conversionRate: 10.0,
        cost: 32000,
        roas: 4.8,
        icon: <Smartphone className="w-5 h-5" />
      },
      {
        channel: 'Digital Display',
        impressions: 2100000,
        clicks: 126000,
        conversions: 10080,
        ctr: 6.0,
        conversionRate: 8.0,
        cost: 45000,
        roas: 3.6,
        icon: <Globe className="w-5 h-5" />
      },
      {
        channel: 'Radio',
        impressions: 850000,
        clicks: 42500,
        conversions: 3400,
        ctr: 5.0,
        conversionRate: 8.0,
        cost: 18000,
        roas: 2.8,
        icon: <Target className="w-5 h-5" />
      },
      {
        channel: 'Physical Media',
        impressions: 650000,
        clicks: 26000,
        conversions: 1820,
        ctr: 4.0,
        conversionRate: 7.0,
        cost: 15000,
        roas: 2.2,
        icon: <Eye className="w-5 h-5" />
      }
    ];

    const mockPredictiveInsights: PredictiveInsight[] = [
      {
        id: 'insight_1',
        type: 'opportunity',
        title: 'WhatsApp Channel Optimization',
        description: 'Increasing WhatsApp campaign budget by 30% could yield 25% more conversions',
        impact: 'high',
        confidence: 87,
        recommendedAction: 'Increase WhatsApp budget allocation',
        estimatedValue: 125000
      },
      {
        id: 'insight_2',
        type: 'risk',
        title: 'High Churn Risk in New Users',
        description: 'New user segment showing 25% churn rate, 8% above industry average',
        impact: 'medium',
        confidence: 92,
        recommendedAction: 'Implement onboarding optimization',
        estimatedValue: -85000
      },
      {
        id: 'insight_3',
        type: 'optimization',
        title: 'Cross-Channel Attribution',
        description: 'Users exposed to both WhatsApp and Radio show 40% higher conversion rates',
        impact: 'high',
        confidence: 78,
        recommendedAction: 'Create cross-channel campaigns',
        estimatedValue: 200000
      }
    ];

    setMetrics(mockMetrics);
    setSegmentAnalytics(mockSegmentAnalytics);
    setChannelPerformance(mockChannelPerformance);
    setPredictiveInsights(mockPredictiveInsights);
  }, []);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <TrendingUp className="w-5 h-5" />;
      case 'risk': return <AlertTriangle className="w-5 h-5" />;
      case 'optimization': return <Target className="w-5 h-5" />;
      default: return <BarChart3 className="w-5 h-5" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'opportunity': return COLORS.accent;
      case 'risk': return '#EF4444';
      case 'optimization': return COLORS.primary;
      default: return COLORS.neutral;
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.background.light }}>
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold" style={{ color: COLORS.text.primary }}>
                Analytics Dashboard
              </h1>
              <p className="text-sm md:text-base" style={{ color: COLORS.text.secondary }}>
                Real-time insights and predictive analytics
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isRealTime ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                <span className="text-sm font-medium" style={{ color: COLORS.text.primary }}>
                  {isRealTime ? 'Live' : 'Paused'}
                </span>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setIsRealTime(!isRealTime)}
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                {isRealTime ? 'Pause' : 'Resume'}
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-4 mt-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" style={{ color: COLORS.text.secondary }} />
              <select 
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="1d">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" style={{ color: COLORS.text.secondary }} />
              <select 
                value={selectedSegment}
                onChange={(e) => setSelectedSegment(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="all">All Segments</option>
                <option value="high_value">High-Value Customers</option>
                <option value="regular">Regular Customers</option>
                <option value="new_users">New Users</option>
              </select>
            </div>

            <div className="flex items-center gap-2 text-sm" style={{ color: COLORS.text.secondary }}>
              <Clock className="w-4 h-4" />
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 mb-8">
          {metrics.map((metric) => (
            <div
              key={metric.id}
              className="bg-white p-4 md:p-6 rounded-lg shadow-lg border border-gray-100"
            >
              <div className="flex items-center justify-between mb-3">
                <div style={{ color: metric.color }}>
                  {metric.icon}
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded ${
                  (metric.changeType === 'increase' && metric.id !== 'avg_response_time' && metric.id !== 'data_freshness') ||
                  (metric.changeType === 'decrease' && (metric.id === 'avg_response_time' || metric.id === 'data_freshness'))
                    ? 'text-green-600 bg-green-50' 
                    : 'text-red-600 bg-red-50'
                }`}>
                  {((metric.changeType === 'increase' && metric.id !== 'avg_response_time' && metric.id !== 'data_freshness') ||
                    (metric.changeType === 'decrease' && (metric.id === 'avg_response_time' || metric.id === 'data_freshness'))) ? (
                    <ArrowUp className="w-3 h-3" />
                  ) : (
                    <ArrowDown className="w-3 h-3" />
                  )}
                  {Math.abs(metric.change).toFixed(1)}%
                </div>
              </div>
              <div className="text-xl md:text-2xl font-bold mb-1" style={{ color: COLORS.text.primary }}>
                {metric.unit === '$' ? formatCurrency(metric.value) : formatNumber(metric.value)}{metric.unit !== '$' ? metric.unit : ''}
              </div>
              <div className="text-xs md:text-sm" style={{ color: COLORS.text.secondary }}>
                {metric.name}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8">
          {/* Customer Segment Analytics */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-bold mb-6" style={{ color: COLORS.text.primary }}>
              Customer Segment Performance
            </h3>
            <div className="space-y-4">
              {segmentAnalytics.map((segment) => (
                <div key={segment.segmentId} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold" style={{ color: COLORS.text.primary }}>
                      {segment.segmentName}
                    </h4>
                    <div className="text-right">
                      <div className="text-lg font-bold" style={{ color: COLORS.accent }}>
                        {segment.ltvCacRatio.toFixed(1)}:1
                      </div>
                      <div className="text-xs" style={{ color: COLORS.text.secondary }}>
                        LTV:CAC
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <div className="text-xs" style={{ color: COLORS.text.secondary }}>Size</div>
                      <div className="font-semibold" style={{ color: COLORS.text.primary }}>
                        {formatNumber(segment.size)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs" style={{ color: COLORS.text.secondary }}>Churn Rate</div>
                      <div className="font-semibold" style={{ color: COLORS.text.primary }}>
                        {segment.churnRate.toFixed(1)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-xs" style={{ color: COLORS.text.secondary }}>Engagement</div>
                      <div className="font-semibold" style={{ color: COLORS.text.primary }}>
                        {segment.engagementScore}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs" style={{ color: COLORS.text.secondary }}>Revenue %</div>
                      <div className="font-semibold" style={{ color: COLORS.text.primary }}>
                        {segment.revenueContribution.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Channel Performance */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-bold mb-6" style={{ color: COLORS.text.primary }}>
              Channel Performance
            </h3>
            <div className="space-y-4">
              {channelPerformance.map((channel, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div style={{ color: COLORS.primary }}>
                        {channel.icon}
                      </div>
                      <h4 className="font-semibold" style={{ color: COLORS.text.primary }}>
                        {channel.channel}
                      </h4>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold" style={{ color: COLORS.accent }}>
                        {channel.roas.toFixed(1)}x
                      </div>
                      <div className="text-xs" style={{ color: COLORS.text.secondary }}>
                        ROAS
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <div className="text-xs" style={{ color: COLORS.text.secondary }}>Impressions</div>
                      <div className="font-semibold" style={{ color: COLORS.text.primary }}>
                        {formatNumber(channel.impressions)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs" style={{ color: COLORS.text.secondary }}>CTR</div>
                      <div className="font-semibold" style={{ color: COLORS.text.primary }}>
                        {channel.ctr.toFixed(1)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-xs" style={{ color: COLORS.text.secondary }}>Conv. Rate</div>
                      <div className="font-semibold" style={{ color: COLORS.text.primary }}>
                        {channel.conversionRate.toFixed(1)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-xs" style={{ color: COLORS.text.secondary }}>Cost</div>
                      <div className="font-semibold" style={{ color: COLORS.text.primary }}>
                        {formatCurrency(channel.cost)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Predictive Insights */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-bold mb-6" style={{ color: COLORS.text.primary }}>
            AI-Powered Predictive Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {predictiveInsights.map((insight) => (
              <div
                key={insight.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div style={{ color: getInsightColor(insight.type) }}>
                      {getInsightIcon(insight.type)}
                    </div>
                    <div>
                      <span
                        className="px-2 py-1 rounded-full text-xs font-semibold text-white"
                        style={{ backgroundColor: getInsightColor(insight.type) }}
                      >
                        {insight.type}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold" style={{ color: COLORS.text.primary }}>
                      {insight.confidence}%
                    </div>
                    <div className="text-xs" style={{ color: COLORS.text.secondary }}>
                      Confidence
                    </div>
                  </div>
                </div>
                
                <h4 className="font-semibold mb-2" style={{ color: COLORS.text.primary }}>
                  {insight.title}
                </h4>
                
                <p className="text-sm mb-3" style={{ color: COLORS.text.secondary }}>
                  {insight.description}
                </p>
                
                <div className="mb-3">
                  <div className="text-xs font-medium mb-1" style={{ color: COLORS.text.secondary }}>
                    Recommended Action
                  </div>
                  <div className="text-sm font-semibold" style={{ color: COLORS.text.primary }}>
                    {insight.recommendedAction}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs" style={{ color: COLORS.text.secondary }}>
                      Estimated Impact
                    </div>
                    <div className={`text-sm font-bold ${
                      insight.estimatedValue >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {insight.estimatedValue >= 0 ? '+' : ''}{formatCurrency(insight.estimatedValue)}
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Apply
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};