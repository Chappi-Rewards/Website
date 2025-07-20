import React from 'react';
import { TrendingUp, Users, BarChart3, Target, Zap, Shield, Globe, Award } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { COLORS, ICON_SIZES } from '../utils/constants';

const brandLogos = [
  { name: 'Coca-Cola', logo: 'https://images.pexels.com/photos/50593/coca-cola-cold-drink-soft-drink-coke-50593.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop' },
  { name: 'MTN', logo: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop' },
  { name: 'Dangote', logo: 'https://images.pexels.com/photos/1267338/pexels-photo-1267338.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop' },
  { name: 'Shoprite', logo: 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop' },
  { name: 'Unilever', logo: 'https://images.pexels.com/photos/4465831/pexels-photo-4465831.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop' },
  { name: 'Nestle', logo: 'https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop' },
  { name: 'Airtel', logo: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop' },
  { name: 'First Bank', logo: 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop' }
];

const benefits = [
  {
    icon: <Users className={ICON_SIZES.large} />,
    title: 'Direct Consumer Access',
    description: 'Reach millions of engaged consumers across 54 African countries with targeted missions and campaigns.'
  },
  {
    icon: <BarChart3 className={ICON_SIZES.large} />,
    title: 'Real-Time Analytics',
    description: 'Get instant insights into consumer behavior, purchase patterns, and campaign performance with detailed dashboards.'
  },
  {
    icon: <Target className={ICON_SIZES.large} />,
    title: 'Precision Targeting',
    description: 'Target specific demographics, locations, and consumer segments with laser precision using our advanced algorithms.'
  },
  {
    icon: <TrendingUp className={ICON_SIZES.large} />,
    title: 'Measurable ROI',
    description: 'Track every interaction, conversion, and outcome with detailed performance metrics and attribution modeling.'
  }
];

const features = [
  {
    icon: <Zap className={ICON_SIZES.large} />,
    title: 'Instant Activation',
    description: 'Launch campaigns in minutes, not weeks. Our platform is designed for speed and agility.'
  },
  {
    icon: <Shield className={ICON_SIZES.large} />,
    title: 'Fraud Protection',
    description: 'Advanced verification systems ensure authentic engagement and protect your brand investment.'
  },
  {
    icon: <Globe className={ICON_SIZES.large} />,
    title: 'Pan-African Reach',
    description: 'Single platform access to consumers across all major African markets with local expertise.'
  },
  {
    icon: <Award className={ICON_SIZES.large} />,
    title: 'Brand Safety',
    description: 'Comprehensive brand safety controls and content moderation to protect your reputation.'
  }
];

export const BrandsPage: React.FC = () => {
  const handleStartMission = () => {
    // Check if user is authenticated (placeholder logic)
    const isAuthenticated = false; // This would come from your auth system
    
    if (isAuthenticated) {
      // Direct to dashboard if already authenticated
      window.location.href = '/brand-dashboard';
    } else {
      // Direct to sign-up flow for new users
      window.location.href = '/signup';
    }
  };

  return (
    <div className="pt-16 md:pt-20">
      {/* Hero Section */}
      <section className="py-12 md:py-20 px-4 md:px-6" style={{ backgroundColor: COLORS.primary }}>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 md:mb-8 leading-tight">
            Connect with African
            <span className="block" style={{ color: COLORS.secondary }}>Consumers Like Never Before</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed mb-8">
            Join hundreds of leading brands already leveraging Chappi's innovative platform to reach, 
            engage, and understand African consumers through authentic, rewarding experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="secondary" 
              size="lg"
              onClick={handleStartMission}
              className="transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Start a Mission
            </Button>
            <Button variant="outline" size="lg">
              Download Brand Kit
            </Button>
          </div>
        </div>
      </section>

      {/* Trusted Brands */}
      <section className="py-12 md:py-16 px-4 md:px-6" style={{ backgroundColor: COLORS.background.light }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: COLORS.text.primary }}>
              Trusted by Leading Brands
            </h2>
            <p className="text-lg" style={{ color: COLORS.text.secondary }}>
              Join the brands already transforming their African market presence
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 md:gap-6">
            {brandLogos.map((brand, index) => (
              <div
                key={index}
                className="flex items-center justify-center p-4 md:p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 grayscale hover:grayscale-0"
                style={{ backgroundColor: COLORS.background.light, border: `1px solid ${COLORS.neutral}20` }}
              >
                <img
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-12 md:py-20 px-4 md:px-6" style={{ backgroundColor: COLORS.background.dark }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-6">
              Why Brands Choose Chappi
            </h2>
            <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Unlock the power of authentic consumer engagement across Africa's most dynamic markets
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6 p-6 md:p-8 rounded-lg"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)' }}
              >
                <div className="flex-shrink-0 p-3 rounded-lg" style={{ backgroundColor: `${COLORS.secondary}20` }}>
                  <div style={{ color: COLORS.secondary }}>
                    {benefit.icon}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-white mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-sm md:text-base text-blue-100 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-12 md:py-20 px-4 md:px-6" style={{ backgroundColor: COLORS.background.light }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold mb-6" style={{ color: COLORS.text.primary }}>
              Platform Features
            </h2>
            <p className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: COLORS.text.secondary }}>
              Everything you need to succeed in African markets, built into one powerful platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 md:p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                style={{ backgroundColor: COLORS.background.light, border: `1px solid ${COLORS.neutral}20` }}
              >
                <div className="mb-4 md:mb-6 flex justify-center" style={{ color: COLORS.primary }}>
                  {feature.icon}
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4" style={{ color: COLORS.text.primary }}>
                  {feature.title}
                </h3>
                <p className="text-sm md:text-base leading-relaxed" style={{ color: COLORS.text.secondary }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-12 md:py-20 px-4 md:px-6" style={{ backgroundColor: COLORS.background.dark }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-6">
              Success Stories
            </h2>
          </div>

          <div className="space-y-8 md:space-y-12">
            <div className="text-center p-8 md:p-12 rounded-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)' }}>
              <blockquote className="text-lg md:text-xl text-blue-100 mb-6 italic leading-relaxed">
                "Chappi helped us reach 2.5 million new consumers across West Africa in just 6 months. 
                The insights we gained transformed our entire regional strategy."
              </blockquote>
              <div className="text-white font-semibold">
                Sarah Johnson, Regional Marketing Director
              </div>
              <div className="text-blue-200">
                Global Consumer Goods Company
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 px-4 md:px-6" style={{ backgroundColor: COLORS.primary }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your African Market Strategy?
          </h2>
          <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join our brand partner program and start creating meaningful connections with millions of consumers across Africa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="secondary" 
              size="lg"
              onClick={handleStartMission}
              className="transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Start a Mission
            </Button>
            <Button variant="outline" size="lg">
              Download Brand Kit
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};