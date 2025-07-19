import React from 'react';
import { MessageCircle, QrCode, ArrowRight } from 'lucide-react';
import { Button } from './ui/Button';
import { COLORS, CARD_STYLES, ICON_SIZES } from '../utils/constants';

export const CallToAction: React.FC = () => {
  const handleGetStarted = () => {
    // Navigate to user sign-up page for account creation
    window.location.href = '/user-signup';
  };

  const handleLearnMore = () => {
    // Navigate to brands page for partnership information
    window.location.href = '/brands';
  };

  const handleWhatsAppJoin = () => {
    // Open WhatsApp with pre-filled message (in production, this would be a real WhatsApp link)
    const message = encodeURIComponent("Hi! I'm interested in joining Chappi and starting my first mission.");
    const whatsappUrl = `https://wa.me/2348001234567?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section className="py-8 md:py-20 px-4 md:px-6 relative overflow-hidden" style={{ backgroundColor: COLORS.primary }}>
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 md:mb-8 leading-tight">
          Are You Ready to
          <span className="block" style={{ color: COLORS.secondary }}>Join the Network?</span>
        </h2>

        <p className="text-lg md:text-xl text-blue-100 mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed">
          Start earning rewards today or partner with us to reach millions of consumers across Africa
        </p>

        {/* Main CTAs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-16">
          <div className="rounded-lg p-6 md:p-8 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 group">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-lg flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:scale-110 transition-transform" style={{ backgroundColor: COLORS.secondary }}>
              <ArrowRight className={`w-6 h-6 md:${ICON_SIZES.large}`} style={{ color: COLORS.primary }} />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4">Earn Chapps</h3>
            <p className="text-blue-100 mb-4 md:mb-6 text-sm md:text-base">Start your first mission and earn rewards today</p>
            <Button 
              variant="secondary" 
              className="w-full min-h-[44px] touch-manipulation"
              onClick={handleGetStarted}
            >
              Get Started
            </Button>
          </div>

          <div className="rounded-lg p-6 md:p-8 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 group">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-lg flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:scale-110 transition-transform">
              <MessageCircle className={`w-6 h-6 md:${ICON_SIZES.large}`} style={{ color: COLORS.primary }} />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4">Partner With Us</h3>
            <p className="text-blue-100 mb-4 md:mb-6 text-sm md:text-base">Connect with millions of engaged consumers</p>
            <Button 
              variant="outline" 
              className="w-full min-h-[44px] touch-manipulation"
              onClick={handleLearnMore}
            >
              Learn More
            </Button>
          </div>

          <div className="rounded-lg p-6 md:p-8 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 group">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-lg flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:scale-110 transition-transform" style={{ backgroundColor: COLORS.accent }}>
              <QrCode className={`w-6 h-6 md:${ICON_SIZES.large} text-white`} />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4">Quick Access</h3>
            <p className="text-blue-100 mb-4 md:mb-6 text-sm md:text-base">Scan to join instantly via WhatsApp</p>
            <div className="w-16 h-16 md:w-24 md:h-24 bg-white rounded-lg mx-auto flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
              <QrCode className={`w-6 h-6 md:${ICON_SIZES.large}`} style={{ color: COLORS.text.primary }} />
            </div>
          </div>
        </div>

        {/* WhatsApp integration */}
        <div 
          className="rounded-lg p-4 md:p-6 inline-flex items-center space-x-3 md:space-x-4 transition-colors cursor-pointer transform hover:scale-105 w-full max-w-sm mx-auto md:w-auto md:max-w-none" 
          style={{ backgroundColor: COLORS.accent }}
          onClick={handleWhatsAppJoin}
        >
          <MessageCircle className={`w-6 h-6 md:${ICON_SIZES.large} text-white flex-shrink-0`} />
          <div className="text-left">
            <div className="text-white font-bold text-sm md:text-base">Join via WhatsApp</div>
            <div className="text-green-100 text-xs md:text-sm">Get instant access to missions</div>
          </div>
        </div>
      </div>
    </section>
  );
};