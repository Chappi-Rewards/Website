import React, { useState } from 'react';
import { ShoppingBag, TrendingUp } from 'lucide-react';
import { Button } from './ui/Button';
import { COLORS, ICON_SIZES } from '../utils/constants';

export const ToggleSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'consumer' | 'brand'>('consumer');

  const handleConsumerAction = () => {
    // Navigate to user sign-up for consumers
    window.location.href = '/user-signup';
  };

  const handleBrandAction = () => {
    // Navigate to brand sign-up for businesses
    window.location.href = '/signup';
  };

  return (
    <section className="py-8 md:py-20 px-4 md:px-6" style={{ backgroundColor: COLORS.background.light }}>
      <div className="max-w-7xl mx-auto">
        {/* Mobile-Optimized Toggle Switch */}
        <div className="flex justify-center mb-8 md:mb-16">
          <div className="bg-gray-100 p-1 md:p-2 rounded-lg w-full max-w-md md:max-w-none md:w-auto">
            {/* Mobile: Stacked Buttons */}
            <div className="flex flex-col md:flex-row gap-2 md:gap-0">
              <button
                onClick={() => setActiveTab('consumer')}
                className={`
                  w-full md:w-auto px-4 md:px-8 py-4 md:py-3 rounded-lg font-semibold transition-all duration-300
                  text-base md:text-base min-h-[44px] touch-manipulation
                  ${activeTab === 'consumer' 
                    ? 'text-white shadow-lg' 
                    : 'hover:text-orange-500'
                  }
                `}
                style={{
                  backgroundColor: activeTab === 'consumer' ? COLORS.accent : 'transparent',
                  color: activeTab === 'consumer' ? COLORS.text.light : COLORS.text.secondary
                }}
              >
                For Consumers
              </button>
              <button
                onClick={() => setActiveTab('brand')}
                className={`
                  w-full md:w-auto px-4 md:px-8 py-4 md:py-3 rounded-lg font-semibold transition-all duration-300
                  text-base md:text-base min-h-[44px] touch-manipulation
                  ${activeTab === 'brand' 
                    ? 'text-white shadow-lg' 
                    : 'hover:text-blue-600'
                  }
                `}
                style={{
                  backgroundColor: activeTab === 'brand' ? COLORS.primary : 'transparent',
                  color: activeTab === 'brand' ? COLORS.text.light : COLORS.text.secondary
                }}
              >
                For Brands
              </button>
            </div>
          </div>
        </div>

        {/* Content Panels - Mobile Optimized */}
        <div className="relative min-h-[400px] md:h-96 overflow-hidden">
          {/* Consumer Panel */}
          <div className={`
            absolute inset-0 transition-all duration-700 transform
            ${activeTab === 'consumer' 
              ? 'translate-x-0 opacity-100' 
              : '-translate-x-full opacity-0'
            }
          `}>
            <div className="flex flex-col md:grid md:grid-cols-2 gap-8 md:gap-12 items-center h-full">
              <div className="order-2 md:order-1">
                <div className="text-center md:text-left">
                  <div className="w-16 h-16 rounded-lg flex items-center justify-center mb-6 mx-auto md:mx-0" style={{ backgroundColor: `${COLORS.accent}20` }}>
                    <ShoppingBag className={`${ICON_SIZES.large} text-green-600`} />
                  </div>
                  <h3 className="text-2xl md:text-4xl font-bold mb-6 leading-tight" style={{ color: COLORS.text.primary }}>
                    Earn for Every Purchase. No Receipts. No Stress.
                  </h3>
                  <p className="text-lg md:text-xl mb-8 leading-relaxed" style={{ color: COLORS.text.secondary }}>
                    Chappi is loyalty for real life — whether you shop in a store, stall, or street corner.
                  </p>
                  <div className="w-full md:w-auto">
                    <Button 
                      variant="secondary" 
                      className="w-full md:w-auto min-h-[44px] px-8 py-4"
                      onClick={handleConsumerAction}
                    >
                      Start Your First Mission
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="relative order-1 md:order-2 w-full">
                <div className="rounded-lg p-6 md:p-8 text-white transform hover:rotate-0 transition-transform duration-300 mx-4 md:mx-0 md:rotate-3" style={{ backgroundColor: COLORS.accent }}>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-white rounded-full animate-pulse flex-shrink-0"></div>
                      <span className="text-base md:text-lg">Buy groceries, earn 10 Chapps</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-white rounded-full animate-pulse flex-shrink-0" style={{ animationDelay: '0.5s' }}></div>
                      <span className="text-base md:text-lg">Redeem for airtime instantly</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-white rounded-full animate-pulse flex-shrink-0" style={{ animationDelay: '1s' }}></div>
                      <span className="text-base md:text-lg">No receipts needed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Brand Panel */}
          <div className={`
            absolute inset-0 transition-all duration-700 transform
            ${activeTab === 'brand' 
              ? 'translate-x-0 opacity-100' 
              : 'translate-x-full opacity-0'
            }
          `}>
            <div className="flex flex-col md:grid md:grid-cols-2 gap-8 md:gap-12 items-center h-full">
              <div className="order-2 md:order-1">
                <div className="text-center md:text-left">
                  <div className="w-16 h-16 rounded-lg flex items-center justify-center mb-6 mx-auto md:mx-0" style={{ backgroundColor: `${COLORS.primary}20` }}>
                    <TrendingUp className={`${ICON_SIZES.large}`} style={{ color: COLORS.primary }} />
                  </div>
                  <h3 className="text-2xl md:text-4xl font-bold mb-6 leading-tight" style={{ color: COLORS.text.primary }}>
                    Know Your Customer Like Never Before
                  </h3>
                  <p className="text-lg md:text-xl mb-8 leading-relaxed" style={{ color: COLORS.text.secondary }}>
                    Chappi shows you real behavior in real time — from street to shelf.
                  </p>
                  <div className="w-full md:w-auto">
                    <Button 
                      variant="primary" 
                      className="w-full md:w-auto min-h-[44px] px-8 py-4"
                      onClick={handleBrandAction}
                    >
                      Book a Brand Pilot
                    </Button>
                  </div>
                </div>
              </div>

              <div className="relative order-1 md:order-2 w-full">
                <div className="rounded-lg p-6 md:p-8 text-white transform hover:rotate-0 transition-transform duration-300 mx-4 md:mx-0 md:-rotate-3" style={{ backgroundColor: COLORS.primary }}>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-white rounded-full animate-pulse flex-shrink-0"></div>
                      <span className="text-base md:text-lg">Real-time purchase insights</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-white rounded-full animate-pulse flex-shrink-0" style={{ animationDelay: '0.5s' }}></div>
                      <span className="text-base md:text-lg">Direct consumer engagement</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-white rounded-full animate-pulse flex-shrink-0" style={{ animationDelay: '1s' }}></div>
                      <span className="text-base md:text-lg">Measurable ROI tracking</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};