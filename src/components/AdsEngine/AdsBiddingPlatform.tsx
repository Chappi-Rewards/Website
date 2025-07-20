import React, { useState, useEffect } from 'react';
import { 
  Target, 
  Zap, 
  BarChart3, 
  Globe, 
  Smartphone, 
  Radio, 
  MessageCircle,
  TrendingUp,
  Shield,
  Users,
  MapPin,
  Clock,
  DollarSign,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { Button } from '../ui/Button';
import { COLORS, ICON_SIZES } from '../../utils/constants';

interface BidRequest {
  id: string;
  userId: string;
  location: {
    country: string;
    city: string;
    coordinates: [number, number];
  };
  demographics: {
    age: number;
    gender: string;
    language: string;
    deviceType: 'smartphone' | 'feature_phone';
  };
  context: {
    channel: 'whatsapp' | 'ussd' | 'radio' | 'physical';
    timeOfDay: string;
    previousActions: string[];
  };
  budget: number;
  timestamp: string;
}

interface Campaign {
  id: string;
  name: string;
  brandId: string;
  targetCriteria: {
    countries: string[];
    ageRange: [number, number];
    languages: string[];
    channels: string[];
  };
  bidStrategy: {
    type: 'cpva' | 'roas' | 'completion_rate';
    maxBid: number;
    targetMetric: number;
  };
  budget: {
    daily: number;
    total: number;
    spent: number;
  };
  performance: {
    impressions: number;
    actions: number;
    verifiedActions: number;
    cost: number;
    roas: number;
  };
  status: 'active' | 'paused' | 'completed';
}

interface VerificationResult {
  actionId: string;
  userId: string;
  verificationMethod: 'blockchain' | 'geolocation' | 'human_review' | 'ai_analysis';
  confidence: number;
  verified: boolean;
  timestamp: string;
  metadata: {
    location?: [number, number];
    deviceFingerprint?: string;
    behaviorScore?: number;
  };
}

export const AdsBiddingPlatform: React.FC = () => {
  const [activeCampaigns, setActiveCampaigns] = useState<Campaign[]>([]);
  const [bidRequests, setBidRequests] = useState<BidRequest[]>([]);
  const [verificationResults, setVerificationResults] = useState<VerificationResult[]>([]);
  const [realTimeMetrics, setRealTimeMetrics] = useState({
    totalBids: 0,
    winRate: 0,
    avgCPVA: 0,
    verificationRate: 0
  });

  // AI-Powered Bidding Algorithm
  const calculateOptimalBid = (request: BidRequest, campaign: Campaign): number => {
    let baseBid = campaign.bidStrategy.maxBid;
    
    // Location scoring
    const locationScore = campaign.targetCriteria.countries.includes(request.location.country) ? 1.2 : 0.8;
    
    // Demographics scoring
    const ageInRange = request.demographics.age >= campaign.targetCriteria.ageRange[0] && 
                      request.demographics.age <= campaign.targetCriteria.ageRange[1];
    const ageScore = ageInRange ? 1.3 : 0.7;
    
    // Language preference
    const languageScore = campaign.targetCriteria.languages.includes(request.demographics.language) ? 1.1 : 0.9;
    
    // Channel optimization
    const channelScore = campaign.targetCriteria.channels.includes(request.context.channel) ? 1.4 : 0.6;
    
    // Time-based optimization
    const timeScore = getTimeScore(request.context.timeOfDay);
    
    // Historical performance
    const performanceScore = campaign.performance.verifiedActions > 0 ? 
      (campaign.performance.verifiedActions / campaign.performance.actions) : 0.5;
    
    const finalBid = baseBid * locationScore * ageScore * languageScore * channelScore * timeScore * performanceScore;
    
    return Math.min(finalBid, campaign.bidStrategy.maxBid);
  };

  const getTimeScore = (timeOfDay: string): number => {
    const hour = parseInt(timeOfDay.split(':')[0]);
    // Peak hours: 7-9 AM, 12-2 PM, 6-9 PM
    if ((hour >= 7 && hour <= 9) || (hour >= 12 && hour <= 14) || (hour >= 18 && hour <= 21)) {
      return 1.2;
    }
    return 0.9;
  };

  // Real-time bidding simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate incoming bid requests
      const newBidRequest: BidRequest = {
        id: `bid_${Date.now()}`,
        userId: `user_${Math.random().toString(36).substr(2, 9)}`,
        location: {
          country: ['Nigeria', 'Kenya', 'Ghana', 'South Africa'][Math.floor(Math.random() * 4)],
          city: ['Lagos', 'Nairobi', 'Accra', 'Cape Town'][Math.floor(Math.random() * 4)],
          coordinates: [Math.random() * 180 - 90, Math.random() * 360 - 180]
        },
        demographics: {
          age: Math.floor(Math.random() * 50) + 18,
          gender: Math.random() > 0.5 ? 'male' : 'female',
          language: ['English', 'Swahili', 'French', 'Arabic'][Math.floor(Math.random() * 4)],
          deviceType: Math.random() > 0.3 ? 'smartphone' : 'feature_phone'
        },
        context: {
          channel: ['whatsapp', 'ussd', 'radio', 'physical'][Math.floor(Math.random() * 4)] as any,
          timeOfDay: new Date().toLocaleTimeString(),
          previousActions: []
        },
        budget: Math.random() * 100 + 10,
        timestamp: new Date().toISOString()
      };

      setBidRequests(prev => [newBidRequest, ...prev.slice(0, 9)]);
      
      // Update metrics
      setRealTimeMetrics(prev => ({
        totalBids: prev.totalBids + 1,
        winRate: Math.random() * 100,
        avgCPVA: Math.random() * 5 + 1,
        verificationRate: Math.random() * 20 + 80
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Blockchain verification simulation
  const verifyAction = async (actionId: string): Promise<VerificationResult> => {
    // Simulate verification process
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const confidence = Math.random() * 100;
    const verified = confidence > 70;
    
    return {
      actionId,
      userId: `user_${Math.random().toString(36).substr(2, 9)}`,
      verificationMethod: ['blockchain', 'geolocation', 'human_review', 'ai_analysis'][Math.floor(Math.random() * 4)] as any,
      confidence,
      verified,
      timestamp: new Date().toISOString(),
      metadata: {
        location: [Math.random() * 180 - 90, Math.random() * 360 - 180],
        deviceFingerprint: Math.random().toString(36).substr(2, 16),
        behaviorScore: Math.random() * 100
      }
    };
  };

  const mockCampaigns: Campaign[] = [
    {
      id: 'camp_1',
      name: 'Mobile Money Adoption',
      brandId: 'brand_mtn',
      targetCriteria: {
        countries: ['Nigeria', 'Ghana'],
        ageRange: [18, 45],
        languages: ['English'],
        channels: ['whatsapp', 'ussd']
      },
      bidStrategy: {
        type: 'cpva',
        maxBid: 2.5,
        targetMetric: 1.8
      },
      budget: {
        daily: 1000,
        total: 30000,
        spent: 12500
      },
      performance: {
        impressions: 45000,
        actions: 3200,
        verifiedActions: 2880,
        cost: 5760,
        roas: 3.2
      },
      status: 'active'
    },
    {
      id: 'camp_2',
      name: 'FMCG Product Trial',
      brandId: 'brand_unilever',
      targetCriteria: {
        countries: ['Kenya', 'Tanzania'],
        ageRange: [25, 55],
        languages: ['English', 'Swahili'],
        channels: ['physical', 'whatsapp']
      },
      bidStrategy: {
        type: 'roas',
        maxBid: 3.0,
        targetMetric: 4.0
      },
      budget: {
        daily: 1500,
        total: 45000,
        spent: 18750
      },
      performance: {
        impressions: 62000,
        actions: 4100,
        verifiedActions: 3690,
        cost: 11070,
        roas: 4.8
      },
      status: 'active'
    }
  ];

  useEffect(() => {
    setActiveCampaigns(mockCampaigns);
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.background.light }}>
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold" style={{ color: COLORS.text.primary }}>
                Africa Ads Engine
              </h1>
              <p className="text-sm md:text-base" style={{ color: COLORS.text.secondary }}>
                Real-time bidding platform for verified consumer actions
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium" style={{ color: COLORS.text.primary }}>
                  Live Bidding
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Real-time Metrics Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          {[
            { 
              label: 'Total Bids', 
              value: realTimeMetrics.totalBids.toLocaleString(), 
              change: '+12%', 
              icon: <Target className={ICON_SIZES.large} />,
              color: COLORS.primary
            },
            { 
              label: 'Win Rate', 
              value: `${realTimeMetrics.winRate.toFixed(1)}%`, 
              change: '+5.2%', 
              icon: <TrendingUp className={ICON_SIZES.large} />,
              color: COLORS.accent
            },
            { 
              label: 'Avg CPVA', 
              value: `$${realTimeMetrics.avgCPVA.toFixed(2)}`, 
              change: '-8%', 
              icon: <DollarSign className={ICON_SIZES.large} />,
              color: COLORS.secondary
            },
            { 
              label: 'Verification Rate', 
              value: `${realTimeMetrics.verificationRate.toFixed(1)}%`, 
              change: '+2.1%', 
              icon: <Shield className={ICON_SIZES.large} />,
              color: COLORS.accent
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
                  metric.change.startsWith('+') ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Real-time Bid Requests */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Zap className={ICON_SIZES.large} style={{ color: COLORS.primary }} />
                <h3 className="text-lg font-bold" style={{ color: COLORS.text.primary }}>
                  Live Bid Requests
                </h3>
              </div>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {bidRequests.map((request) => (
                  <div
                    key={request.id}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium" style={{ color: COLORS.text.primary }}>
                        {request.location.country}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full" style={{ 
                        backgroundColor: `${COLORS.secondary}20`,
                        color: COLORS.secondary
                      }}>
                        {request.context.channel}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs" style={{ color: COLORS.text.secondary }}>
                      <div>Age: {request.demographics.age}</div>
                      <div>Device: {request.demographics.deviceType}</div>
                      <div>Lang: {request.demographics.language}</div>
                      <div>Budget: ${request.budget.toFixed(2)}</div>
                    </div>
                    
                    <div className="mt-3 flex justify-between items-center">
                      <span className="text-xs" style={{ color: COLORS.text.secondary }}>
                        {new Date(request.timestamp).toLocaleTimeString()}
                      </span>
                      <Button variant="primary" size="sm">
                        Bid
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Active Campaigns */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <BarChart3 className={ICON_SIZES.large} style={{ color: COLORS.primary }} />
                  <h3 className="text-lg font-bold" style={{ color: COLORS.text.primary }}>
                    Active Campaigns
                  </h3>
                </div>
                <Button variant="primary">
                  Create Campaign
                </Button>
              </div>
              
              <div className="space-y-6">
                {activeCampaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="border border-gray-200 rounded-lg p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold" style={{ color: COLORS.text.primary }}>
                          {campaign.name}
                        </h4>
                        <p className="text-sm" style={{ color: COLORS.text.secondary }}>
                          {campaign.targetCriteria.countries.join(', ')} • {campaign.bidStrategy.type.toUpperCase()}
                        </p>
                      </div>
                      <span
                        className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                        style={{ backgroundColor: campaign.status === 'active' ? COLORS.accent : COLORS.neutral }}
                      >
                        {campaign.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                      <div>
                        <p className="text-xs font-medium mb-1" style={{ color: COLORS.text.secondary }}>
                          Impressions
                        </p>
                        <p className="text-sm font-semibold" style={{ color: COLORS.text.primary }}>
                          {campaign.performance.impressions.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium mb-1" style={{ color: COLORS.text.secondary }}>
                          Actions
                        </p>
                        <p className="text-sm font-semibold" style={{ color: COLORS.text.primary }}>
                          {campaign.performance.actions.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium mb-1" style={{ color: COLORS.text.secondary }}>
                          Verified
                        </p>
                        <p className="text-sm font-semibold" style={{ color: COLORS.text.primary }}>
                          {campaign.performance.verifiedActions.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium mb-1" style={{ color: COLORS.text.secondary }}>
                          ROAS
                        </p>
                        <p className="text-sm font-semibold" style={{ color: COLORS.text.primary }}>
                          {campaign.performance.roas.toFixed(1)}x
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium mb-1" style={{ color: COLORS.text.secondary }}>
                          Spent
                        </p>
                        <p className="text-sm font-semibold" style={{ color: COLORS.text.primary }}>
                          ${campaign.budget.spent.toLocaleString()}
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

                    {/* Channel Distribution */}
                    <div className="flex items-center gap-4 text-xs">
                      <span style={{ color: COLORS.text.secondary }}>Channels:</span>
                      {campaign.targetCriteria.channels.map((channel, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 rounded-full"
                          style={{ 
                            backgroundColor: `${COLORS.primary}10`,
                            color: COLORS.primary
                          }}
                        >
                          {channel}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Verification System */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Shield className={ICON_SIZES.large} style={{ color: COLORS.accent }} />
              <h3 className="text-lg font-bold" style={{ color: COLORS.text.primary }}>
                Hybrid Verification System
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                {
                  method: 'Blockchain',
                  icon: <Shield className={ICON_SIZES.large} />,
                  confidence: 95,
                  description: 'Immutable transaction recording',
                  color: COLORS.primary
                },
                {
                  method: 'Geolocation',
                  icon: <MapPin className={ICON_SIZES.large} />,
                  confidence: 88,
                  description: 'GPS and location validation',
                  color: COLORS.accent
                },
                {
                  method: 'AI Analysis',
                  icon: <Zap className={ICON_SIZES.large} />,
                  confidence: 92,
                  description: 'Behavioral pattern analysis',
                  color: COLORS.secondary
                },
                {
                  method: 'Human Review',
                  icon: <Users className={ICON_SIZES.large} />,
                  confidence: 98,
                  description: 'Expert verification team',
                  color: COLORS.primary
                }
              ].map((method, index) => (
                <div
                  key={index}
                  className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="mb-3 flex justify-center" style={{ color: method.color }}>
                    {method.icon}
                  </div>
                  <h4 className="font-semibold mb-2" style={{ color: COLORS.text.primary }}>
                    {method.method}
                  </h4>
                  <div className="text-2xl font-bold mb-2" style={{ color: method.color }}>
                    {method.confidence}%
                  </div>
                  <p className="text-xs" style={{ color: COLORS.text.secondary }}>
                    {method.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};