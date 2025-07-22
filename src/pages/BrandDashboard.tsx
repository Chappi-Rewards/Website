import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Package, 
  Users, 
  Target, 
  Plus,
  Play,
  Pause,
  Settings,
  Eye,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { COLORS } from '../utils/constants';
import { http } from '../services/https';

interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed';
  budget: {
    total: number;
    spent: number;
    remaining: number;
  };
  performance: {
    reach: number;
    engagement: number;
    conversions: number;
    roas: number;
  };
  countries: string[];
  startDate: string;
}

interface Product {
  id: string;
  name: string;
  image_url: string;
}

import { AddProductModal } from '../components/AddProductModal';

export const BrandDashboard: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCampaigns = async () => {
    const response = await http.get<any[]>('/missions');
    const missions = response.data;
    if (!Array.isArray(missions)) {
      throw new Error("Fetched campaign data is not an array.");
    }
    return missions.map((mission: any) => {
      const now = new Date();
      const startDate = new Date(mission.start_date);
      const endDate = new Date(mission.end_date);
      let status: 'active' | 'paused' | 'completed' = 'paused';

      if (now >= startDate && now <= endDate) {
        status = 'active';
      } else if (now > endDate) {
        status = 'completed';
      }

      const totalBudget = mission.points * 120; // Mock logic
      const spentBudget = Math.random() * totalBudget;

      return {
        id: mission.id.toString(),
        name: mission.name,
        status: status,
        budget: {
          total: totalBudget,
          spent: spentBudget,
          remaining: totalBudget - spentBudget,
        },
        performance: {
          reach: Math.floor(Math.random() * 110000),
          engagement: Math.floor(Math.random() * 15000),
          conversions: Math.floor(Math.random() * 3000),
          roas: Math.random() * 4 + 1,
        },
        countries: ['Nigeria', 'Kenya', 'Ghana'].slice(0, Math.floor(Math.random() * 2) + 1),
        startDate: mission.start_date,
      };
    });
  };

  const fetchProducts = async () => {
    const response = await http.get<Product[]>('/products');
    return response.data;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [campaignsData, productsData] = await Promise.all([
          fetchCampaigns(),
          fetchProducts(),
        ]);
        setCampaigns(campaignsData);
        setProducts(productsData);
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    const verifyPayment = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const trxref = urlParams.get('trxref');
      const reference = urlParams.get('reference');

      if (trxref && reference) {
        try {
          // Assuming /api/missions/verify-payment expects the reference
          await http.post('/missions/verify-payment', { reference });
          alert('Payment verified successfully!');
        } catch (err: any) {
          console.error('Payment verification failed:', err);
          alert(`Payment verification failed: ${err?.response?.data?.message || err.message}`);
        } finally {
          // Clean the URL after verification attempt
          urlParams.delete('trxref');
          urlParams.delete('reference');
          window.history.replaceState({}, document.title, `${window.location.pathname}${urlParams.toString() ? `?${urlParams.toString()}` : ''}`);
        }
      }
    };

    fetchData();
    verifyPayment();
  }, []);

  const handleProductAdded = (newProduct: Product) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
  };

  const keyMetrics = {
    totalSpend: campaigns.reduce((acc, c) => acc + c.budget.spent, 0),
    totalReach: campaigns.reduce((acc, c) => acc + c.performance.reach, 0),
    avgROAS: campaigns.length > 0 ? campaigns.reduce((acc, c) => acc + c.performance.roas, 0) / campaigns.length : 0,
    activeCampaigns: campaigns.filter(c => c.status === 'active').length
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return COLORS.accent;
      case 'paused': return COLORS.secondary;
      case 'completed': return COLORS.neutral;
      default: return COLORS.neutral;
    }
  };

  return (
    <div className="pt-16 md:pt-20 min-h-screen" style={{ backgroundColor: COLORS.background.light }}>
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold" style={{ color: COLORS.text.primary }}>
                Campaign Dashboard
              </h1>
              <p className="text-sm md:text-base" style={{ color: COLORS.text.secondary }}>
                Manage your campaigns across Africa
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
              <Button variant="primary" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                <a href="/create-mission" className="text-white no-underline">
                  New Campaign
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Simplified Key Metrics - Only 4 Essential Numbers */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6 mb-8">
          <h2 className="text-lg font-bold mb-6" style={{ color: COLORS.text.primary }}>
            Performance Overview
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold mb-2" style={{ color: COLORS.primary }}>
                {formatCurrency(keyMetrics.totalSpend)}
              </div>
              <div className="text-sm" style={{ color: COLORS.text.secondary }}>
                Total Spend
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold mb-2" style={{ color: COLORS.accent }}>
                {formatNumber(keyMetrics.totalReach)}
              </div>
              <div className="text-sm" style={{ color: COLORS.text.secondary }}>
                People Reached
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold mb-2" style={{ color: COLORS.secondary }}>
                {keyMetrics.avgROAS.toFixed(1)}x
              </div>
              <div className="text-sm" style={{ color: COLORS.text.secondary }}>
                Average ROAS
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold mb-2" style={{ color: COLORS.primary }}>
                {keyMetrics.activeCampaigns}
              </div>
              <div className="text-sm" style={{ color: COLORS.text.secondary }}>
                Active Campaigns
              </div>
            </div>
          </div>
        </div>

        {/* Campaign & Product Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Campaign List */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold" style={{ color: COLORS.text.primary }}>
                Your Campaigns
              </h2>
            </div>
            
            <div className="space-y-4">
              {loading && <p>Loading campaigns...</p>}
              {error && <p className="text-red-500">Error: {error}</p>}
              {!loading && !error && campaigns.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">You haven't created any campaigns yet.</p>
                  <Button variant="primary" className="mt-4">
                    <a href="/create-mission" className="text-white no-underline">
                      Create Your First Campaign
                    </a>
                  </Button>
                </div>
              )}
              {!loading && !error && campaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold" style={{ color: COLORS.text.primary }}>
                          {campaign.name}
                        </h3>
                        <span
                          className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                          style={{ backgroundColor: getStatusColor(campaign.status) }}
                        >
                          {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm" style={{ color: COLORS.text.secondary }}>
                        {campaign.countries.join(', ')} • Started {new Date(campaign.startDate).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        {campaign.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  {/* Simplified Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs font-medium mb-1" style={{ color: COLORS.text.secondary }}>
                        Budget Used
                      </p>
                      <p className="text-sm font-semibold" style={{ color: COLORS.text.primary }}>
                        {formatCurrency(campaign.budget.spent)} / {formatCurrency(campaign.budget.total)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium mb-1" style={{ color: COLORS.text.secondary }}>
                        Reach
                      </p>
                      <p className="text-sm font-semibold" style={{ color: COLORS.text.primary }}>
                        {formatNumber(campaign.performance.reach)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium mb-1" style={{ color: COLORS.text.secondary }}>
                        Conversions
                      </p>
                      <p className="text-sm font-semibold" style={{ color: COLORS.text.primary }}>
                        {formatNumber(campaign.performance.conversions)}
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
                  </div>

                  {/* Budget Progress Bar */}
                  <div className="mb-2">
                    <div className="flex justify-between text-xs mb-1" style={{ color: COLORS.text.secondary }}>
                      <span>Budget Progress</span>
                      <span>{campaign.budget.total > 0 ? Math.round((campaign.budget.spent / campaign.budget.total) * 100) : 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${campaign.budget.total > 0 ? Math.min((campaign.budget.spent / campaign.budget.total) * 100, 100) : 0}%`,
                          backgroundColor: (campaign.budget.spent / campaign.budget.total) > 0.8 ? COLORS.secondary : COLORS.accent
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Product List */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold" style={{ color: COLORS.text.primary }}>
                Your Products
              </h2>
              <Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </div>
            <div className="space-y-4">
              {loading && <p>Loading products...</p>}
              {error && <p className="text-red-500">Error: {error}</p>}
              {!loading && !error && products.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">You haven't added any products yet.</p>
                  <Button variant="primary" className="mt-4" onClick={() => setIsModalOpen(true)}>
                    Add Your First Product
                  </Button>
                </div>
              )}
              {!loading && !error && products.map((product) => (
                <div key={product.id} className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-50">
                  <img 
                    src={product.image_url} 
                    alt={product.name} 
                    className="w-16 h-16 rounded-md object-cover bg-gray-200"
                  />
                  <div className="flex-1">
                    <p className="font-semibold" style={{ color: COLORS.text.primary }}>{product.name}</p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Settings className="w-4 h-4 text-gray-500" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6 text-center">
            <Target className="w-12 h-12 mx-auto mb-4" style={{ color: COLORS.primary }} />
            <h3 className="text-lg font-semibold mb-2" style={{ color: COLORS.text.primary }}>
              Create Campaign
            </h3>
            <p className="text-sm mb-4" style={{ color: COLORS.text.secondary }}>
              Launch a new campaign to reach African consumers
            </p>
            <Button variant="primary" className="w-full">
              Get Started
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6 text-center">
            <BarChart3 className="w-12 h-12 mx-auto mb-4" style={{ color: COLORS.accent }} />
            <h3 className="text-lg font-semibold mb-2" style={{ color: COLORS.text.primary }}>
              View Analytics
            </h3>
            <p className="text-sm mb-4" style={{ color: COLORS.text.secondary }}>
              Deep dive into your campaign performance
            </p>
            <Button variant="outline" className="w-full">
              View Reports
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6 text-center">
            <Users className="w-12 h-12 mx-auto mb-4" style={{ color: COLORS.secondary }} />
            <h3 className="text-lg font-semibold mb-2" style={{ color: COLORS.text.primary }}>
              Audience Insights
            </h3>
            <p className="text-sm mb-4" style={{ color: COLORS.text.secondary }}>
              Understand your African audience better
            </p>
            <Button variant="outline" className="w-full">
              Explore
            </Button>
          </div>
        </div>
      </div>
      <AddProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onProductAdded={handleProductAdded} 
      />
    </div>
  );
};
