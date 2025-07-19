import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Target, 
  Users, 
  TrendingUp, 
  Zap, 
  Shield, 
  Globe, 
  Smartphone,
  Radio,
  MessageCircle,
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
  Settings,
  Download,
  Filter,
  Search,
  Bell,
  Plus,
  Eye,
  Edit,
  Play,
  Pause,
  MoreVertical
} from 'lucide-react';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { COLORS, ICON_SIZES } from '../../utils/constants';

interface Campaign {
  id: string;
  name: string;
  type: 'display' | 'video' | 'native' | 'interactive';
  status: 'active' | 'paused' | 'completed' | 'draft';
  channels: ('digital' | 'retail' | 'physical' | 'whatsapp' | 'ussd' | 'radio')[];
  budget: {
    total: number;
    spent: number;
    daily: number;
    remaining: number;
  };
  performance: {
    impressions: number;
    clicks: number;
    conversions: number;
    ctr: number;
    cpc: number;
    roas: number;
    ltv: number;
    cac: number;
  };
  targeting: {
    countries: string[];
    ageRange: [number, number];
    languages: string[];
    interests: string[];
  };
  createdAt: string;
  lastModified: string;
}

interface RealTimeMetrics {
  totalCampaigns: number;
  activeUsers: number;
  totalRevenue: number;
  avgResponseTime: number;
  systemUptime: number;
  dataProcessingVolume: number;
  apiRequestsPerSecond: number;
  verificationRate: number;
}

interface CustomerSegment {
  id: string;
  name: string;
  size: number;
  ltv: number;
  cac: number;
  ltvCacRatio: number;
  characteristics: string[];
  predictedBehavior: {
    churnRisk: number;
    purchaseProbability: number;
    recommendedActions: string[];
  };
}

export const UMIPDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'campaigns' | 'analytics' | 'segments' | 'integrations'>('overview');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [realTimeMetrics, setRealTimeMetrics] = useState<RealTimeMetrics>({
    totalCampaigns: 0,
    activeUsers: 0,
    totalRevenue: 0,
    avgResponseTime: 0,
    systemUptime: 99.99,
    dataProcessingVolume: 0,
    apiRequestsPerSecond: 0,
    verificationRate: 0
  });
  const [customerSegments, setCustomerSegments] = useState<CustomerSegment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeMetrics(prev => ({
        totalCampaigns: prev.totalCampaigns + Math.floor(Math.random() * 3),
        activeUsers: Math.floor(Math.random() * 100000) + 50000,
        totalRevenue: prev.totalRevenue + Math.random() * 10000,
        avgResponseTime: Math.random() * 50 + 25,
        systemUptime: 99.99 - Math.random() * 0.01,
        dataProcessingVolume: Math.floor(Math.random() * 1000000) + 500000,
        apiRequestsPerSecond: Math.floor(Math.random() * 1000) + 200,
        verificationRate: Math.random() * 10 + 90
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Mock data initialization
  useEffect(() => {
    const mockCampaigns: Campaign[] = [
      {
        id: 'camp_001',
        name: 'Q4 Mobile Banking Push',
        type: 'interactive',
        status: 'active',
        channels: ['digital', 'whatsapp', 'ussd'],
        budget: {
          total: 50000,
          spent: 32000,
          daily: 2000,
          remaining: 18000
        },
        performance: {
          impressions: 1250000,
          clicks: 87500,
          conversions: 8750,
          ctr: 7.0,
          cpc: 0.37,
          roas: 4.2,
          ltv: 156.80,
          cac: 3.66
        },
        targeting: {
          countries: ['Nigeria', 'Kenya', 'Ghana'],
          ageRange: [25, 45],
          languages: ['English', 'Swahili'],
          interests: ['finance', 'mobile_money', 'savings']
        },
        createdAt: '2024-10-01T00:00:00Z',
        lastModified: '2024-12-28T10:30:00Z'
      },
      {
        id: 'camp_002',
        name: 'FMCG Brand Awareness',
        type: 'video',
        status: 'active',
        channels: ['digital', 'radio', 'physical'],
        budget: {
          total: 75000,
          spent: 45000,
          daily: 3000,
          remaining: 30000
        },
        performance: {
          impressions: 2100000,
          clicks: 126000,
          conversions: 12600,
          ctr: 6.0,
          cpc: 0.36,
          roas: 3.8,
          ltv: 89.50,
          cac: 3.57
        },
        targeting: {
          countries: ['South Africa', 'Tanzania', 'Uganda'],
          ageRange: [18, 55],
          languages: ['English', 'Afrikaans', 'Swahili'],
          interests: ['household_goods', 'shopping', 'family']
        },
        createdAt: '2024-11-15T00:00:00Z',
        lastModified: '2024-12-28T09:15:00Z'
      }
    ];

    const mockSegments: CustomerSegment[] = [
      {
        id: 'seg_001',
        name: 'High-Value Urban Professionals',
        size: 125000,
        ltv: 450.00,
        cac: 12.50,
        ltvCacRatio: 36.0,
        characteristics: ['Urban', 'High Income', 'Tech Savvy', 'Age 25-40'],
        predictedBehavior: {
          churnRisk: 15,
          purchaseProbability: 85,
          recommendedActions: ['Premium product offers', 'Loyalty programs', 'Exclusive access']
        }
      },
      {
        id: 'seg_002',
        name: 'Price-Conscious Families',
        size: 340000,
        ltv: 180.00,
        cac: 8.20,
        ltvCacRatio: 21.95,
        characteristics: ['Suburban/Rural', 'Middle Income', 'Family-oriented', 'Age 30-50'],
        predictedBehavior: {
          churnRisk: 25,
          purchaseProbability: 65,
          recommendedActions: ['Value bundles', 'Family discounts', 'Seasonal promotions']
        }
      }
    ];

    setCampaigns(mockCampaigns);
    setCustomerSegments(mockSegments);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return COLORS.accent;
      case 'paused': return COLORS.secondary;
      case 'completed': return COLORS.neutral;
      case 'draft': return COLORS.primary;
      default: return COLORS.neutral;
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.background.light }}>
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold" style={{ color: COLORS.text.primary }}>
                Marketing Intelligence Platform
              </h1>
              <p className="text-sm md:text-base" style={{ color: COLORS.text.secondary }}>
                Unified advertising, analytics, and customer engagement
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium" style={{ color: COLORS.text.primary }}>
                  {realTimeMetrics.systemUptime.toFixed(2)}% Uptime
                </span>
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Alerts
              </Button>
              <Button variant="primary" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                New Campaign
              </Button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 mt-6 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
              { id: 'campaigns', label: 'Campaigns', icon: <Target className="w-4 h-4" /> },
              { id: 'analytics', label: 'Analytics', icon: <TrendingUp className="w-4 h-4" /> },
              { id: 'segments', label: 'Segments', icon: <Users className="w-4 h-4" /> },
              { id: 'integrations', label: 'Integrations', icon: <Globe className="w-4 h-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 whitespace-nowrap
                  ${activeTab === tab.id 
                    ? 'text-white shadow-lg' 
                    : 'text-gray-600 hover:bg-gray-100'
                  }
                `}
                style={{
                  backgroundColor: activeTab === tab.id ? COLORS.primary : 'transparent'
                }}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6 md:space-y-8">
            {/* Real-time Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[
                { 
                  label: 'Active Users', 
                  value: formatNumber(realTimeMetrics.activeUsers), 
                  change: '+12.5%', 
                  icon: <Users className={ICON_SIZES.large} />,
                  color: COLORS.primary
                },
                { 
                  label: 'Total Revenue', 
                  value: formatCurrency(realTimeMetrics.totalRevenue), 
                  change: '+18.2%', 
                  icon: <DollarSign className={ICON_SIZES.large} />,
                  color: COLORS.accent
                },
                { 
                  label: 'Response Time', 
                  value: `${realTimeMetrics.avgResponseTime.toFixed(0)}ms`, 
                  change: '-5ms', 
                  icon: <Clock className={ICON_SIZES.large} />,
                  color: COLORS.secondary
                },
                { 
                  label: 'API Requests/sec', 
                  value: formatNumber(realTimeMetrics.apiRequestsPerSecond), 
                  change: '+8.1%', 
                  icon: <Zap className={ICON_SIZES.large} />,
                  color: COLORS.primary
                }
              ].map((metric, index) => (
                <div
                  key={index}
                  className="bg-white p-4 md:p-6 rounded-lg shadow-lg border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div style={{ color: metric.color }}>
                      {metric.icon}
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded ${
                      metric.change.startsWith('+') ? 'text-green-600 bg-green-50' : 
                      metric.change.startsWith('-') && metric.label === 'Response Time' ? 'text-green-600 bg-green-50' :
                      'text-red-600 bg-red-50'
                    }`}>
                      {metric.change}
                    </span>
                  </div>
                  <div className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLORS.text.primary }}>
                    {metric.value}
                  </div>
                  <div className="text-sm" style={{ color: COLORS.text.secondary }}>
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>

            {/* System Health */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-bold mb-6" style={{ color: COLORS.text.primary }}>
                System Health & Performance
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center" 
                       style={{ backgroundColor: `${COLORS.accent}20` }}>
                    <Shield className="w-8 h-8" style={{ color: COLORS.accent }} />
                  </div>
                  <div className="text-2xl font-bold mb-2" style={{ color: COLORS.accent }}>
                    {realTimeMetrics.systemUptime.toFixed(3)}%
                  </div>
                  <div className="text-sm" style={{ color: COLORS.text.secondary }}>
                    System Uptime
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center" 
                       style={{ backgroundColor: `${COLORS.primary}20` }}>
                    <BarChart3 className="w-8 h-8" style={{ color: COLORS.primary }} />
                  </div>
                  <div className="text-2xl font-bold mb-2" style={{ color: COLORS.primary }}>
                    {formatNumber(realTimeMetrics.dataProcessingVolume)}
                  </div>
                  <div className="text-sm" style={{ color: COLORS.text.secondary }}>
                    Data Points/Hour
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center" 
                       style={{ backgroundColor: `${COLORS.secondary}20` }}>
                    <CheckCircle className="w-8 h-8" style={{ color: COLORS.secondary }} />
                  </div>
                  <div className="text-2xl font-bold mb-2" style={{ color: COLORS.secondary }}>
                    {realTimeMetrics.verificationRate.toFixed(1)}%
                  </div>
                  <div className="text-sm" style={{ color: COLORS.text.secondary }}>
                    Verification Rate
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-bold mb-4" style={{ color: COLORS.text.primary }}>
                  Recent Campaign Activity
                </h3>
                <div className="space-y-4">
                  {[
                    { action: 'Campaign "Q4 Mobile Banking" reached 1M impressions', time: '2 minutes ago', type: 'success' },
                    { action: 'New A/B test started for "FMCG Brand Awareness"', time: '15 minutes ago', type: 'info' },
                    { action: 'Budget alert: Campaign approaching 80% spend', time: '1 hour ago', type: 'warning' },
                    { action: 'Integration with WhatsApp API completed', time: '3 hours ago', type: 'success' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === 'success' ? 'bg-green-500' :
                        activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium" style={{ color: COLORS.text.primary }}>
                          {activity.action}
                        </p>
                        <p className="text-xs" style={{ color: COLORS.text.secondary }}>
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-bold mb-4" style={{ color: COLORS.text.primary }}>
                  Channel Performance
                </h3>
                <div className="space-y-4">
                  {[
                    { channel: 'WhatsApp', performance: 92, color: COLORS.accent },
                    { channel: 'Digital Display', performance: 87, color: COLORS.primary },
                    { channel: 'Radio', performance: 78, color: COLORS.secondary },
                    { channel: 'Physical Media', performance: 71, color: COLORS.neutral }
                  ].map((channel, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium" style={{ color: COLORS.text.primary }}>
                        {channel.channel}
                      </span>
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${channel.performance}%`,
                              backgroundColor: channel.color
                            }}
                          />
                        </div>
                        <span className="text-sm font-semibold w-8" style={{ color: channel.color }}>
                          {channel.performance}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Campaigns Tab */}
        {activeTab === 'campaigns' && (
          <div className="space-y-6">
            {/* Campaign Controls */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-4 md:p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search campaigns..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Filter
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export
                  </Button>
                </div>
              </div>
            </div>

            {/* Campaigns List */}
            <div className="space-y-4">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="bg-white rounded-lg shadow-lg border border-gray-100 p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold" style={{ color: COLORS.text.primary }}>
                          {campaign.name}
                        </h3>
                        <span
                          className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                          style={{ backgroundColor: getStatusColor(campaign.status) }}
                        >
                          {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                        </span>
                        <span
                          className="px-2 py-1 rounded text-xs font-medium"
                          style={{ 
                            backgroundColor: `${COLORS.primary}10`,
                            color: COLORS.primary
                          }}
                        >
                          {campaign.type}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {campaign.channels.map((channel, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 rounded-full text-xs"
                            style={{ 
                              backgroundColor: `${COLORS.secondary}10`,
                              color: COLORS.secondary
                            }}
                          >
                            {channel}
                          </span>
                        ))}
                      </div>
                      <p className="text-sm" style={{ color: COLORS.text.secondary }}>
                        {campaign.targeting.countries.join(', ')} • Created {new Date(campaign.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        {campaign.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
                    <div>
                      <p className="text-xs font-medium mb-1" style={{ color: COLORS.text.secondary }}>Impressions</p>
                      <p className="text-sm font-semibold" style={{ color: COLORS.text.primary }}>
                        {formatNumber(campaign.performance.impressions)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium mb-1" style={{ color: COLORS.text.secondary }}>CTR</p>
                      <p className="text-sm font-semibold" style={{ color: COLORS.text.primary }}>
                        {campaign.performance.ctr.toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium mb-1" style={{ color: COLORS.text.secondary }}>CPC</p>
                      <p className="text-sm font-semibold" style={{ color: COLORS.text.primary }}>
                        ${campaign.performance.cpc.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium mb-1" style={{ color: COLORS.text.secondary }}>ROAS</p>
                      <p className="text-sm font-semibold" style={{ color: COLORS.text.primary }}>
                        {campaign.performance.roas.toFixed(1)}x
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium mb-1" style={{ color: COLORS.text.secondary }}>LTV:CAC</p>
                      <p className="text-sm font-semibold" style={{ color: COLORS.text.primary }}>
                        {(campaign.performance.ltv / campaign.performance.cac).toFixed(1)}:1
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium mb-1" style={{ color: COLORS.text.secondary }}>Spent</p>
                      <p className="text-sm font-semibold" style={{ color: COLORS.text.primary }}>
                        {formatCurrency(campaign.budget.spent)}
                      </p>
                    </div>
                  </div>

                  {/* Budget Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1" style={{ color: COLORS.text.secondary }}>
                      <span>Budget Progress</span>
                      <span>{Math.round((campaign.budget.spent / campaign.budget.total) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min((campaign.budget.spent / campaign.budget.total) * 100, 100)}%`,
                          backgroundColor: (campaign.budget.spent / campaign.budget.total) > 0.8 ? COLORS.secondary : COLORS.accent
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6 md:p-8">
              <h3 className="text-lg md:text-xl font-bold mb-6" style={{ color: COLORS.text.primary }}>
                Advanced Analytics Dashboard
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { title: 'Predictive Analytics', description: 'AI-powered customer behavior predictions', icon: <TrendingUp className={ICON_SIZES.large} /> },
                  { title: 'Attribution Modeling', description: 'Multi-touch attribution across channels', icon: <Target className={ICON_SIZES.large} /> },
                  { title: 'Real-time Dashboards', description: 'Live performance monitoring', icon: <BarChart3 className={ICON_SIZES.large} /> },
                  { title: 'Cohort Analysis', description: 'Customer lifecycle insights', icon: <Users className={ICON_SIZES.large} /> },
                  { title: 'A/B Testing', description: 'Statistical significance tracking', icon: <Zap className={ICON_SIZES.large} /> },
                  { title: 'Custom Reports', description: 'Automated reporting and alerts', icon: <Download className={ICON_SIZES.large} /> }
                ].map((feature, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="mb-3" style={{ color: COLORS.primary }}>
                      {feature.icon}
                    </div>
                    <h4 className="font-semibold mb-2" style={{ color: COLORS.text.primary }}>
                      {feature.title}
                    </h4>
                    <p className="text-sm" style={{ color: COLORS.text.secondary }}>
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Customer Segments Tab */}
        {activeTab === 'segments' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold" style={{ color: COLORS.text.primary }}>
                  AI-Powered Customer Segments
                </h3>
                <Button variant="primary">
                  Create Segment
                </Button>
              </div>
              
              <div className="space-y-4">
                {customerSegments.map((segment) => (
                  <div key={segment.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold" style={{ color: COLORS.text.primary }}>
                          {segment.name}
                        </h4>
                        <p className="text-sm" style={{ color: COLORS.text.secondary }}>
                          {formatNumber(segment.size)} customers
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold" style={{ color: COLORS.accent }}>
                          {segment.ltvCacRatio.toFixed(1)}:1
                        </div>
                        <div className="text-xs" style={{ color: COLORS.text.secondary }}>
                          LTV:CAC Ratio
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs font-medium mb-1" style={{ color: COLORS.text.secondary }}>
                          Avg LTV
                        </p>
                        <p className="text-sm font-semibold" style={{ color: COLORS.text.primary }}>
                          {formatCurrency(segment.ltv)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium mb-1" style={{ color: COLORS.text.secondary }}>
                          Avg CAC
                        </p>
                        <p className="text-sm font-semibold" style={{ color: COLORS.text.primary }}>
                          {formatCurrency(segment.cac)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium mb-1" style={{ color: COLORS.text.secondary }}>
                          Churn Risk
                        </p>
                        <p className="text-sm font-semibold" style={{ color: COLORS.text.primary }}>
                          {segment.predictedBehavior.churnRisk}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium mb-1" style={{ color: COLORS.text.secondary }}>
                          Purchase Probability
                        </p>
                        <p className="text-sm font-semibold" style={{ color: COLORS.text.primary }}>
                          {segment.predictedBehavior.purchaseProbability}%
                        </p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs font-medium mb-2" style={{ color: COLORS.text.secondary }}>
                        Characteristics
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {segment.characteristics.map((char, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 rounded-full text-xs"
                            style={{ 
                              backgroundColor: `${COLORS.primary}10`,
                              color: COLORS.primary
                            }}
                          >
                            {char}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-medium mb-2" style={{ color: COLORS.text.secondary }}>
                        Recommended Actions
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {segment.predictedBehavior.recommendedActions.map((action, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 rounded-full text-xs"
                            style={{ 
                              backgroundColor: `${COLORS.accent}10`,
                              color: COLORS.accent
                            }}
                          >
                            {action}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Integrations Tab */}
        {activeTab === 'integrations' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-bold mb-6" style={{ color: COLORS.text.primary }}>
                Platform Integrations
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: 'WhatsApp Business API', status: 'connected', icon: <MessageCircle className={ICON_SIZES.large} /> },
                  { name: 'USSD Gateway', status: 'connected', icon: <Smartphone className={ICON_SIZES.large} /> },
                  { name: 'Radio Broadcasting', status: 'connected', icon: <Radio className={ICON_SIZES.large} /> },
                  { name: 'Retail POS Systems', status: 'pending', icon: <Target className={ICON_SIZES.large} /> },
                  { name: 'Mobile Money APIs', status: 'connected', icon: <DollarSign className={ICON_SIZES.large} /> },
                  { name: 'Analytics Platforms', status: 'connected', icon: <BarChart3 className={ICON_SIZES.large} /> }
                ].map((integration, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div style={{ color: COLORS.primary }}>
                        {integration.icon}
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          integration.status === 'connected' 
                            ? 'text-green-600 bg-green-50' 
                            : 'text-yellow-600 bg-yellow-50'
                        }`}
                      >
                        {integration.status}
                      </span>
                    </div>
                    <h4 className="font-semibold mb-2" style={{ color: COLORS.text.primary }}>
                      {integration.name}
                    </h4>
                    <Button variant="outline" size="sm" className="w-full">
                      {integration.status === 'connected' ? 'Configure' : 'Connect'}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};