import React, { useState } from 'react';
import { 
  Globe, 
  Smartphone, 
  Radio, 
  MessageCircle, 
  Store, 
  CreditCard,
  BarChart3,
  Shield,
  Zap,
  CheckCircle,
  AlertTriangle,
  Settings,
  Plus,
  Download,
  Upload,
  Key,
  Link,
  Code,
  Database,
  Webhook,
  RefreshCw
} from 'lucide-react';
import { Button } from '../ui/Button';
import { COLORS, ICON_SIZES } from '../../utils/constants';

interface Integration {
  id: string;
  name: string;
  description: string;
  category: 'channels' | 'analytics' | 'payments' | 'retail' | 'verification';
  status: 'connected' | 'pending' | 'error' | 'available';
  icon: React.ReactNode;
  features: string[];
  lastSync?: string;
  dataVolume?: number;
  apiCalls?: number;
  config?: {
    [key: string]: any;
  };
}

interface APIEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  description: string;
  rateLimit: string;
  authentication: string;
}

export const IntegrationHub: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);
  const [showAPIDocumentation, setShowAPIDocumentation] = useState(false);

  const integrations: Integration[] = [
    {
      id: 'whatsapp_business',
      name: 'WhatsApp Business API',
      description: 'Send campaigns and collect responses via WhatsApp',
      category: 'channels',
      status: 'connected',
      icon: <MessageCircle className={ICON_SIZES.large} />,
      features: ['Message Broadcasting', 'Interactive Messages', 'Media Support', 'Webhook Integration'],
      lastSync: '2 minutes ago',
      dataVolume: 125000,
      apiCalls: 45000
    },
    {
      id: 'ussd_gateway',
      name: 'USSD Gateway',
      description: 'Reach feature phone users through USSD codes',
      category: 'channels',
      status: 'connected',
      icon: <Smartphone className={ICON_SIZES.large} />,
      features: ['USSD Sessions', 'Menu Navigation', 'Data Collection', 'Multi-language Support'],
      lastSync: '5 minutes ago',
      dataVolume: 85000,
      apiCalls: 32000
    },
    {
      id: 'radio_broadcasting',
      name: 'Radio Broadcasting Network',
      description: 'Integrate with radio stations for audio campaigns',
      category: 'channels',
      status: 'connected',
      icon: <Radio className={ICON_SIZES.large} />,
      features: ['Audio Ad Placement', 'Scheduling', 'Reach Analytics', 'Regional Targeting'],
      lastSync: '1 hour ago',
      dataVolume: 45000,
      apiCalls: 12000
    },
    {
      id: 'retail_pos',
      name: 'Retail POS Systems',
      description: 'Connect with point-of-sale systems for purchase verification',
      category: 'retail',
      status: 'pending',
      icon: <Store className={ICON_SIZES.large} />,
      features: ['Transaction Sync', 'Product Catalog', 'Inventory Tracking', 'Receipt Verification']
    },
    {
      id: 'mobile_money',
      name: 'Mobile Money APIs',
      description: 'Integrate with mobile money providers for payments',
      category: 'payments',
      status: 'connected',
      icon: <CreditCard className={ICON_SIZES.large} />,
      features: ['Payment Processing', 'Balance Inquiry', 'Transaction History', 'Webhook Notifications'],
      lastSync: '30 seconds ago',
      dataVolume: 95000,
      apiCalls: 28000
    },
    {
      id: 'blockchain_verification',
      name: 'Blockchain Verification',
      description: 'Immutable transaction recording and verification',
      category: 'verification',
      status: 'connected',
      icon: <Shield className={ICON_SIZES.large} />,
      features: ['Smart Contracts', 'Transaction Recording', 'Proof of Purchase', 'Fraud Prevention'],
      lastSync: '1 minute ago',
      dataVolume: 75000,
      apiCalls: 18000
    },
    {
      id: 'analytics_platforms',
      name: 'Analytics Platforms',
      description: 'Export data to external analytics tools',
      category: 'analytics',
      status: 'connected',
      icon: <BarChart3 className={ICON_SIZES.large} />,
      features: ['Data Export', 'Custom Dashboards', 'Real-time Streaming', 'API Access'],
      lastSync: '3 minutes ago',
      dataVolume: 200000,
      apiCalls: 65000
    },
    {
      id: 'geolocation_services',
      name: 'Geolocation Services',
      description: 'GPS and location-based verification services',
      category: 'verification',
      status: 'connected',
      icon: <Globe className={ICON_SIZES.large} />,
      features: ['GPS Tracking', 'Geofencing', 'Location Verification', 'Regional Analytics'],
      lastSync: '45 seconds ago',
      dataVolume: 110000,
      apiCalls: 35000
    }
  ];

  const apiEndpoints: APIEndpoint[] = [
    {
      method: 'GET',
      endpoint: '/api/v1/campaigns',
      description: 'Retrieve all campaigns',
      rateLimit: '1000/hour',
      authentication: 'Bearer Token'
    },
    {
      method: 'POST',
      endpoint: '/api/v1/campaigns',
      description: 'Create a new campaign',
      rateLimit: '100/hour',
      authentication: 'Bearer Token'
    },
    {
      method: 'GET',
      endpoint: '/api/v1/analytics/metrics',
      description: 'Get real-time metrics',
      rateLimit: '5000/hour',
      authentication: 'API Key'
    },
    {
      method: 'POST',
      endpoint: '/api/v1/missions',
      description: 'Create a new mission',
      rateLimit: '500/hour',
      authentication: 'Bearer Token'
    },
    {
      method: 'GET',
      endpoint: '/api/v1/users/segments',
      description: 'Retrieve customer segments',
      rateLimit: '2000/hour',
      authentication: 'Bearer Token'
    },
    {
      method: 'POST',
      endpoint: '/api/v1/webhooks',
      description: 'Register webhook endpoint',
      rateLimit: '50/hour',
      authentication: 'Bearer Token'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Integrations', count: integrations.length },
    { id: 'channels', label: 'Distribution Channels', count: integrations.filter(i => i.category === 'channels').length },
    { id: 'analytics', label: 'Analytics', count: integrations.filter(i => i.category === 'analytics').length },
    { id: 'payments', label: 'Payments', count: integrations.filter(i => i.category === 'payments').length },
    { id: 'retail', label: 'Retail Systems', count: integrations.filter(i => i.category === 'retail').length },
    { id: 'verification', label: 'Verification', count: integrations.filter(i => i.category === 'verification').length }
  ];

  const filteredIntegrations = selectedCategory === 'all' 
    ? integrations 
    : integrations.filter(integration => integration.category === selectedCategory);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return COLORS.accent;
      case 'pending': return COLORS.secondary;
      case 'error': return '#EF4444';
      case 'available': return COLORS.neutral;
      default: return COLORS.neutral;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'error': return <AlertTriangle className="w-4 h-4" />;
      case 'available': return <Plus className="w-4 h-4" />;
      default: return <Plus className="w-4 h-4" />;
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.background.light }}>
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold" style={{ color: COLORS.text.primary }}>
                Integration Hub
              </h1>
              <p className="text-sm md:text-base" style={{ color: COLORS.text.secondary }}>
                Connect with external platforms and services
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowAPIDocumentation(!showAPIDocumentation)}
                className="flex items-center gap-2"
              >
                <Code className="w-4 h-4" />
                API Docs
              </Button>
              <Button variant="primary" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Integration
              </Button>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex space-x-1 mt-6 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 whitespace-nowrap
                  ${selectedCategory === category.id 
                    ? 'text-white shadow-lg' 
                    : 'text-gray-600 hover:bg-gray-100'
                  }
                `}
                style={{
                  backgroundColor: selectedCategory === category.id ? COLORS.primary : 'transparent'
                }}
              >
                {category.label}
                <span className={`px-2 py-1 rounded-full text-xs ${
                  selectedCategory === category.id 
                    ? 'bg-white/20 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {!showAPIDocumentation ? (
          <>
            {/* Integration Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredIntegrations.map((integration) => (
                <div
                  key={integration.id}
                  className="bg-white rounded-lg shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow cursor-pointer"
                  onClick={() => setSelectedIntegration(integration.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div style={{ color: COLORS.primary }}>
                        {integration.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold" style={{ color: COLORS.text.primary }}>
                          {integration.name}
                        </h3>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div style={{ color: getStatusColor(integration.status) }}>
                        {getStatusIcon(integration.status)}
                      </div>
                      <span
                        className="px-2 py-1 rounded-full text-xs font-semibold text-white"
                        style={{ backgroundColor: getStatusColor(integration.status) }}
                      >
                        {integration.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm mb-4" style={{ color: COLORS.text.secondary }}>
                    {integration.description}
                  </p>

                  {/* Features */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {integration.features.slice(0, 3).map((feature, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 rounded-full text-xs"
                          style={{ 
                            backgroundColor: `${COLORS.primary}10`,
                            color: COLORS.primary
                          }}
                        >
                          {feature}
                        </span>
                      ))}
                      {integration.features.length > 3 && (
                        <span
                          className="px-2 py-1 rounded-full text-xs"
                          style={{ 
                            backgroundColor: `${COLORS.neutral}10`,
                            color: COLORS.neutral
                          }}
                        >
                          +{integration.features.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stats for connected integrations */}
                  {integration.status === 'connected' && (
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                      <div>
                        <div className="text-xs" style={{ color: COLORS.text.secondary }}>
                          Data Volume
                        </div>
                        <div className="text-sm font-semibold" style={{ color: COLORS.text.primary }}>
                          {formatNumber(integration.dataVolume || 0)}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs" style={{ color: COLORS.text.secondary }}>
                          API Calls
                        </div>
                        <div className="text-sm font-semibold" style={{ color: COLORS.text.primary }}>
                          {formatNumber(integration.apiCalls || 0)}
                        </div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-xs" style={{ color: COLORS.text.secondary }}>
                          Last Sync: {integration.lastSync}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="mt-4">
                    <Button 
                      variant={integration.status === 'connected' ? 'outline' : 'primary'}
                      className="w-full"
                    >
                      {integration.status === 'connected' ? 'Configure' : 
                       integration.status === 'pending' ? 'View Status' : 'Connect'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Integration Details Modal */}
            {selectedIntegration && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div style={{ color: COLORS.primary }}>
                          {integrations.find(i => i.id === selectedIntegration)?.icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold" style={{ color: COLORS.text.primary }}>
                            {integrations.find(i => i.id === selectedIntegration)?.name}
                          </h3>
                          <p className="text-sm" style={{ color: COLORS.text.secondary }}>
                            {integrations.find(i => i.id === selectedIntegration)?.description}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedIntegration(null)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <Settings className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-6 max-h-96 overflow-y-auto">
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold mb-3" style={{ color: COLORS.text.primary }}>
                          Features
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          {integrations.find(i => i.id === selectedIntegration)?.features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4" style={{ color: COLORS.accent }} />
                              <span className="text-sm" style={{ color: COLORS.text.primary }}>
                                {feature}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3" style={{ color: COLORS.text.primary }}>
                          Configuration
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium mb-1" style={{ color: COLORS.text.primary }}>
                              API Key
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="password"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter API key"
                              />
                              <Button variant="outline" size="sm">
                                <Key className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1" style={{ color: COLORS.text.primary }}>
                              Webhook URL
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="url"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="https://your-domain.com/webhook"
                              />
                              <Button variant="outline" size="sm">
                                <Webhook className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 border-t border-gray-200">
                    <div className="flex gap-3">
                      <Button variant="outline" onClick={() => setSelectedIntegration(null)}>
                        Cancel
                      </Button>
                      <Button variant="primary">
                        Save Configuration
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          /* API Documentation */
          <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold" style={{ color: COLORS.text.primary }}>
                API Documentation
              </h3>
              <div className="flex items-center gap-3">
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download SDK
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  Postman Collection
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3" style={{ color: COLORS.text.primary }}>
                  Base URL
                </h4>
                <div className="bg-gray-100 p-3 rounded-lg font-mono text-sm">
                  https://api.chappi.com/v1
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3" style={{ color: COLORS.text.primary }}>
                  Authentication
                </h4>
                <p className="text-sm mb-3" style={{ color: COLORS.text.secondary }}>
                  All API requests require authentication using either Bearer tokens or API keys.
                </p>
                <div className="bg-gray-100 p-3 rounded-lg font-mono text-sm">
                  Authorization: Bearer YOUR_ACCESS_TOKEN
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3" style={{ color: COLORS.text.primary }}>
                  Endpoints
                </h4>
                <div className="space-y-3">
                  {apiEndpoints.map((endpoint, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className="px-2 py-1 rounded text-xs font-semibold text-white"
                          style={{
                            backgroundColor: endpoint.method === 'GET' ? COLORS.accent : 
                                           endpoint.method === 'POST' ? COLORS.primary : 
                                           endpoint.method === 'PUT' ? COLORS.secondary : '#EF4444'
                          }}
                        >
                          {endpoint.method}
                        </span>
                        <code className="font-mono text-sm" style={{ color: COLORS.text.primary }}>
                          {endpoint.endpoint}
                        </code>
                      </div>
                      <p className="text-sm mb-2" style={{ color: COLORS.text.secondary }}>
                        {endpoint.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs" style={{ color: COLORS.text.secondary }}>
                        <span>Rate Limit: {endpoint.rateLimit}</span>
                        <span>Auth: {endpoint.authentication}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3" style={{ color: COLORS.text.primary }}>
                  SDKs & Libraries
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { name: 'JavaScript/Node.js', version: 'v2.1.0' },
                    { name: 'Python', version: 'v1.8.0' },
                    { name: 'PHP', version: 'v1.5.0' }
                  ].map((sdk, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h5 className="font-semibold mb-2" style={{ color: COLORS.text.primary }}>
                        {sdk.name}
                      </h5>
                      <p className="text-sm mb-3" style={{ color: COLORS.text.secondary }}>
                        Version {sdk.version}
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};