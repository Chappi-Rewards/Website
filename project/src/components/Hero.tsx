import React, { useEffect, useRef } from 'react';
import { Smartphone, Users, Zap } from 'lucide-react';
import { Button } from './ui/Button';
import { COLORS, ICON_SIZES } from '../utils/constants';

export const Hero: React.FC = () => {
  const cityRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const animateElements = () => {
      if (cityRef.current) {
        cityRef.current.style.transform = `translateY(${window.scrollY * 0.3}px)`;
      }
    };

    window.addEventListener('scroll', animateElements);
    return () => window.removeEventListener('scroll', animateElements);
  }, []);

  const handleStartMission = () => {
    // Navigate to missions page to see available missions
    window.location.href = '/missions';
  };

  const handleSeeHowItWorks = () => {
    // Scroll to the ChappiWay section or navigate to about page
    const chappiWaySection = document.getElementById('chappi-way');
    if (chappiWaySection) {
      chappiWaySection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = '/about';
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ backgroundColor: COLORS.primary }}>
      {/* African Skyline Lineart */}
      <div ref={cityRef} className="absolute bottom-0 left-0 right-0 z-10">
        <svg 
          className="w-full h-48 md:h-64 lg:h-80" 
          viewBox="0 0 1200 320" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYEnd meet"
        >
          <g stroke="#FFFFFF" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* Baobab Tree */}
            <path d="M50 280 L50 200 Q50 180 70 180 Q90 180 90 200 L90 280" />
            <path d="M30 200 Q50 190 70 200" />
            <path d="M70 200 Q90 190 110 200" />
            
            {/* Traditional Huts */}
            <circle cx="180" cy="240" r="40" />
            <path d="M140 240 L180 200 L220 240" />
            <rect x="170" y="240" width="20" height="40" />
            
            <circle cx="280" cy="250" r="30" />
            <path d="M250 250 L280 220 L310 250" />
            <rect x="275" y="250" width="10" height="30" />
            
            {/* Modern Buildings */}
            <rect x="350" y="180" width="40" height="100" />
            <rect x="355" y="185" width="8" height="8" />
            <rect x="367" y="185" width="8" height="8" />
            <rect x="377" y="185" width="8" height="8" />
            <rect x="355" y="200" width="8" height="8" />
            <rect x="367" y="200" width="8" height="8" />
            <rect x="377" y="200" width="8" height="8" />
            
            <rect x="420" y="160" width="50" height="120" />
            <rect x="425" y="170" width="10" height="10" />
            <rect x="440" y="170" width="10" height="10" />
            <rect x="455" y="170" width="10" height="10" />
            <rect x="425" y="190" width="10" height="10" />
            <rect x="440" y="190" width="10" height="10" />
            <rect x="455" y="190" width="10" height="10" />
            
            {/* Mosque/Religious Building */}
            <rect x="500" y="200" width="60" height="80" />
            <path d="M500 200 L530 170 L560 200" />
            <circle cx="530" cy="180" r="8" />
            <path d="M530 172 L530 150" />
            <path d="M525 155 Q530 150 535 155" />
            
            {/* Market Stalls */}
            <path d="M600 250 L620 230 L640 250 L600 250" />
            <path d="M610 250 L610 280" />
            <path d="M630 250 L630 280" />
            
            <path d="M660 260 L680 240 L700 260 L660 260" />
            <path d="M670 260 L670 280" />
            <path d="M690 260 L690 280" />
            
            {/* Acacia Trees */}
            <path d="M750 280 L750 220" />
            <path d="M720 240 Q750 220 780 240" />
            <path d="M730 250 Q750 235 770 250" />
            
            {/* City Skyline */}
            <rect x="820" y="140" width="35" height="140" />
            <rect x="870" y="120" width="45" height="160" />
            <rect x="930" y="100" width="40" height="180" />
            <rect x="985" y="130" width="50" height="150" />
            <rect x="1050" y="110" width="35" height="170" />
            
            {/* Windows for city buildings */}
            <rect x="825" y="150" width="6" height="6" />
            <rect x="835" y="150" width="6" height="6" />
            <rect x="845" y="150" width="6" height="6" />
            <rect x="825" y="165" width="6" height="6" />
            <rect x="835" y="165" width="6" height="6" />
            <rect x="845" y="165" width="6" height="6" />
            
            <rect x="875" y="130" width="8" height="8" />
            <rect x="890" y="130" width="8" height="8" />
            <rect x="905" y="130" width="8" height="8" />
            <rect x="875" y="150" width="8" height="8" />
            <rect x="890" y="150" width="8" height="8" />
            <rect x="905" y="150" width="8" height="8" />
            
            {/* Mountains in background */}
            <path d="M1100 200 L1120 160 L1140 180 L1160 140 L1180 170 L1200 150" />
            
            {/* Ground line */}
            <path d="M0 280 L1200 280" />
          </g>
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-20 text-center max-w-5xl mx-auto px-4 md:px-6 pt-20 md:pt-16 pb-24 md:pb-32">
        {/* Icon Section - 24px as requested */}
        <div className="mb-8 md:mb-12 flex justify-center space-x-4 md:space-x-6">
          <div className="p-2 md:p-3 bg-white/10 rounded-lg backdrop-blur-sm animate-bounce shadow-lg">
            <Smartphone className={`${ICON_SIZES.standalone} text-white`} />
          </div>
          <div className="p-2 md:p-3 bg-white/10 rounded-lg backdrop-blur-sm animate-bounce shadow-lg" style={{ animationDelay: '0.2s' }}>
            <Users className={`${ICON_SIZES.standalone} text-white`} />
          </div>
          <div className="p-2 md:p-3 bg-white/10 rounded-lg backdrop-blur-sm animate-bounce shadow-lg" style={{ animationDelay: '0.4s' }}>
            <Zap className={`${ICON_SIZES.standalone} text-white`} />
          </div>
        </div>

        {/* Title */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight">
            <span className="block mb-2 md:mb-4">The Future of Rewards</span>
            <span className="block" style={{ color: COLORS.secondary }}>in Africa Is Here</span>
          </h1>
        </div>

        {/* Subtitle */}
        <div className="mb-12 md:mb-16">
          <p className="text-base md:text-lg lg:text-xl xl:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed px-4">
            Chappi connects millions of consumers, retailers, and brands in a vibrant network of everyday commerce.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center px-4">
          <Button 
            size="lg" 
            variant="secondary"
            onClick={handleStartMission}
            className="w-full sm:w-auto font-bold text-base md:text-lg px-8 md:px-10 py-4 min-h-[44px] touch-manipulation"
          >
            Start a Mission
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={handleSeeHowItWorks}
            className="w-full sm:w-auto font-bold text-base md:text-lg px-8 md:px-10 py-4 min-h-[44px] touch-manipulation"
          >
            See How It Works
          </Button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 md:bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
        <div className="w-5 h-8 md:w-6 md:h-10 border-2 border-white/50 rounded-full flex justify-center shadow-lg">
          <div className="w-1 h-2 md:h-3 bg-white/50 rounded-full mt-1 md:mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};