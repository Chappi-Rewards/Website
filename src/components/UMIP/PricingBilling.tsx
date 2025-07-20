import React, { useState } from 'react';
import { 
  CreditCard, 
  DollarSign, 
  TrendingUp, 
  Users, 
  BarChart3, 
  Zap,
  CheckCircle,
  AlertTriangle,
  Download,
  Calendar,
  Settings,
  Plus,
  Minus,
  Star,
  Shield,
  Clock,
  Globe
} from 'lucide-react';
import { Button } from '../ui/Button';
import { COLORS, ICON_SIZES } from '../../utils/constants';

interface PricingTier {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  features: string[];
  limits: {
    monthlyUsers: number;
    dataProcessing: number; // GB
    apiCalls: number;
    campaigns: number;
    support: string;
  };
  popular?: boolean;
  enterprise?: boolean;
}

interface UsageMetric {
  name: string;
  current: number;
  limit: number;
  unit: string;
  cost: number;
  icon: React.ReactNode;
}

interface BillingHistory {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  description: string;
  downloadUrl?: string;
}

export const PricingBilling: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState('professional');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [showUsageDetails, setShowUsageDetails] = useState(false);

  const pricingTiers: PricingTier[] = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Perfect for small businesses getting started',
      basePrice: 199,
      features: [
        'Up to 10,000 monthly active users',
        '5GB data processing',
        '50,000 API calls',
        '5 active campaigns',
        'Basic analytics',
        'Email support',
        'Standard integrations'
      ],
      limits: {
        monthlyUsers: 10000,
        dataProcessing: 5,
        apiCalls: 50000,
        campaigns: 5,
        support: 'Email'
      }
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Ideal for growing businesses with advanced needs',
      basePrice: 499,
      popular: true,
      features: [
        'Up to 50,000 monthly active users',
        '25GB data processing',
        '250,000 API calls',
        '25 active campaigns',
        'Advanced analytics & AI insights',
        'Priority support',
        'All integrations',
        'Custom mission builder',
        'A/B testing'
      ],
      limits: {
        monthlyUsers: 50000,
        dataProcessing: 25,
        apiCalls: 250000,
        campaigns: 25,
        support: 'Priority'
      }
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'For large organizations with custom requirements',
      basePrice: 1999,
      enterprise: true,
      features: [
        'Unlimited monthly active users',
        'Unlimited data processing',
        'Unlimited API calls',
        'Unlimited campaigns',
        'Custom analytics & reporting',
        'Dedicated account manager',
        'Custom integrations',
        'White-label options',
        'SLA guarantees',
        'On-premise deployment'
      ],
      limits: {
        monthlyUsers: -1, // Unlimited
        dataProcessing: -1,
        apiCalls: -1,
        campaigns: -1,
        support: 'Dedicated'
      }
    }
  ];

  const currentUsage: UsageMetric[] = [
    {
      name: 'Monthly Active Users',
      current: 32500,
      limit: 50000,
      unit: 'users',
      cost: 0.01,
      icon: <Users className="w-5 h-5" />
    },
    {
      name: 'Data Processing',
      current: 18.5,
      limit: 25,
      unit: 'GB',
      cost: 2.50,
      icon: <BarChart3 className="w-5 h-5" />
    },
    {
      name: 'API Calls',
      current: 185000,
      limit: 250000,
      unit: 'calls',
      cost: 0.001,
      icon: <Zap className="w-5 h-5" />
    },
    {
      name: 'Active Campaigns',
      current: 12,
      limit: 25,
      unit: 'campaigns',
      cost: 50,
      icon: <TrendingUp className="w-5 h-5" />
    }
  ];

  const billingHistory: BillingHistory[] = [
    {
      id: 'inv_001',
      date: '2024-12-01',
      amount: 549.99,
      status: 'paid',
      description: 'Professional Plan - December 2024',
      downloadUrl: '/invoices/inv_001.pdf'
    },
    {
      id: 'inv_002',
      date: '2024-11-01',
      amount: 524.50,
      status: 'paid',
      description: 'Professional Plan - November 2024',
      downloadUrl: '/invoices/inv_002.pdf'
    },
    {
      id: 'inv_003',
      date: '2024-10-01',
      amount: 499.00,
      status: 'paid',
      description: 'Professional Plan - October 2024',
      downloadUrl: '/invoices/inv_003.pdf'
    }
  ];

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

  const getUsagePercentage = (current: number, limit: number) => {
    if (limit === -1) return 0; // Unlimited
    return Math.min((current / limit) * 100, 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return '#EF4444';
    if (percentage >= 75) return COLORS.secondary;
    return COLORS.accent;
  };

  const calculateMonthlyTotal = () => {
    const basePlan = pricingTiers.find(tier => tier.id === selectedTier);
    if (!basePlan) return 0;

    let total = basePlan.basePrice;
    
    // Add overage costs
    currentUsage.forEach(metric => {
      if (metric.limit !== -1 && metric.current > metric.limit) {
        const overage = metric.current - metric.limit;
        total += overage * metric.cost;
      }
    });

    return total;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.background.light }}>
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold" style={{ color: COLORS.text.primary }}>
                Pricing & Billing
              </h1>
              <p className="text-sm md:text-base" style={{ color: COLORS.text.secondary }}>
                Manage your subscription and billing preferences
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download Invoice
              </Button>
              <Button variant="primary" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Billing Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Current Plan & Usage */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-8">
          {/* Current Plan */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-bold mb-4" style={{ color: COLORS.text.primary }}>
              Current Plan
            </h3>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2" style={{ color: COLORS.primary }}>
                Professional
              </div>
              <div className="text-lg mb-4" style={{ color: COLORS.text.secondary }}>
                {formatCurrency(calculateMonthlyTotal())}/month
              </div>
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span style={{ color: COLORS.text.secondary }}>Base Plan</span>
                  <span style={{ color: COLORS.text.primary }}>{formatCurrency(499)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: COLORS.text.secondary }}>Overages</span>
                  <span style={{ color: COLORS.text.primary }}>{formatCurrency(calculateMonthlyTotal() - 499)}</span>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                Change Plan
              </Button>
            </div>
          </div>

          {/* Usage Overview */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold" style={{ color: COLORS.text.primary }}>
                Usage Overview
              </h3>
              <Button 
                variant="ghost" 
                onClick={() => setShowUsageDetails(!showUsageDetails)}
              >
                {showUsageDetails ? 'Hide Details' : 'Show Details'}
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentUsage.map((metric, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    
                    <div style={{ color: COLORS.primary }}>
                      {metric.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm" style={{ color: COLORS.text.primary }}>
                        {metric.name}
                      </h4>
                      <div className="text-xs" style={{ color: COLORS.text.secondary }}>
                        {formatNumber(metric.current)} / {metric.limit === -1 ? '∞' : formatNumber(metric.limit)} {metric.unit}
                      </div>
                    </div>
                  </div>
                  
                  {metric.limit !== -1 && (
                    <div className="mb-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${getUsagePercentage(metric.current, metric.limit)}%`,
                            backgroundColor: getUsageColor(getUsagePercentage(metric.current, metric.limit))
                          }}
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center text-xs">
                    <span style={{ color: COLORS.text.secondary }}>
                      {getUsagePercentage(metric.current, metric.limit).toFixed(1)}% used
                    </span>
                    {metric.current > metric.limit && (
                      <span className="text-red-600 font-semibold">
                        Overage: {formatCurrency((metric.current - metric.limit) * metric.cost)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing Tiers */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: COLORS.text.primary }}>
              Choose Your Plan
            </h2>
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className={`font-medium ${billingCycle === 'monthly' ? 'text-blue-600' : 'text-gray-500'}`}>
                Monthly
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  billingCycle === 'annual' ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
                  billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
              <span className={`font-medium ${billingCycle === 'annual' ? 'text-blue-600' : 'text-gray-500'}`}>
                Annual
              </span>
              {billingCycle === 'annual' && (
                <span className="px-2 py-1 bg-green-100 text-green-600 text-xs font-semibold rounded-full">
                  Save 20%
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {pricingTiers.map((tier) => (
              <div
                key={tier.id}
                className={`relative rounded-lg p-6 md:p-8 transition-all duration-300 cursor-pointer ${
                  tier.popular 
                    ? 'border-2 border-blue-500 shadow-xl scale-105' 
                    : 'border border-gray-200 shadow-lg hover:shadow-xl'
                } ${selectedTier === tier.id ? 'ring-4 ring-blue-200' : ''}`}
                style={{ backgroundColor: COLORS.background.light }}
                onClick={() => setSelectedTier(tier.id)}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="px-4 py-1 bg-blue-600 text-white text-sm font-semibold rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl md:text-2xl font-bold mb-2" style={{ color: COLORS.text.primary }}>
                    {tier.name}
                  </h3>
                  <p className="text-sm mb-4" style={{ color: COLORS.text.secondary }}>
                    {tier.description}
                  </p>
                  <div className="text-3xl md:text-4xl font-bold mb-2" style={{ color: COLORS.primary }}>
                    {tier.enterprise ? 'Custom' : formatCurrency(billingCycle === 'annual' ? tier.basePrice * 0.8 : tier.basePrice)}
                  </div>
                  {!tier.enterprise && (
                    <div className="text-sm" style={{ color: COLORS.text.secondary }}>
                      per month, billed {billingCycle}
                    </div>
                  )}
                </div>

                <div className="space-y-3 mb-8">
                  {tier.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: COLORS.accent }} />
                      <span className="text-sm" style={{ color: COLORS.text.primary }}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <Button 
                  variant={tier.popular ? 'primary' : 'outline'}
                  className="w-full"
                >
                  {tier.enterprise ? 'Contact Sales' : selectedTier === tier.id ? 'Current Plan' : 'Upgrade'}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Billing History */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold" style={{ color: COLORS.text.primary }}>
              Billing History
            </h3>
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Filter by Date
            </Button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold" style={{ color: COLORS.text.primary }}>
                    Date
                  </th>
                  <th className="text-left py-3 px-4 font-semibold" style={{ color: COLORS.text.primary }}>
                    Description
                  </th>
                  <th className="text-left py-3 px-4 font-semibold" style={{ color: COLORS.text.primary }}>
                    Amount
                  </th>
                  <th className="text-left py-3 px-4 font-semibold" style={{ color: COLORS.text.primary }}>
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-semibold" style={{ color: COLORS.text.primary }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {billingHistory.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm" style={{ color: COLORS.text.primary }}>
                      {new Date(invoice.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-sm" style={{ color: COLORS.text.primary }}>
                      {invoice.description}
                    </td>
                    <td className="py-3 px-4 text-sm font-semibold" style={{ color: COLORS.text.primary }}>
                      {formatCurrency(invoice.amount)}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          invoice.status === 'paid' 
                            ? 'text-green-600 bg-green-50' 
                            : invoice.status === 'pending'
                            ? 'text-yellow-600 bg-yellow-50'
                            : 'text-red-600 bg-red-50'
                        }`}
                      >
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {invoice.downloadUrl && (
                        <Button variant="ghost" size="sm" className="flex items-center gap-2">
                          <Download className="w-4 h-4" />
                          Download
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};