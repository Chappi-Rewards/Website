import React, { useEffect, useRef, useState } from 'react';
import { Search, CheckCircle, Gift } from 'lucide-react';
import { COLORS, CARD_STYLES, ICON_SIZES } from '../utils/constants';

interface Panel {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  bgColor: string;
}

const panels: Panel[] = [
  {
    id: 'discover',
    title: 'Discover',
    description: 'Receive simple, rewarding missions tailored to your everyday shopping.',
    icon: <Search className={ICON_SIZES.large} />,
    bgColor: COLORS.primary
  },
  {
    id: 'verify',
    title: 'Declare & Verify',
    description: 'Quickly declare your purchase. We verify, you earn instantly.',
    icon: <CheckCircle className={ICON_SIZES.large} />,
    bgColor: COLORS.secondary
  },
  {
    id: 'earn',
    title: 'Earn & Redeem',
    description: 'Redeem your Chapps for airtime, goods, and more — anytime, anywhere.',
    icon: <Gift className={ICON_SIZES.large} />,
    bgColor: COLORS.accent
  }
];

export const ChappiWay: React.FC = () => {
  const [visiblePanels, setVisiblePanels] = useState<Set<string>>(new Set());
  const panelRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisiblePanels(prev => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.3 }
    );

    Object.values(panelRefs.current).forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="chappi-way" className="py-8 md:py-20 px-4 md:px-6" style={{ backgroundColor: COLORS.background.light }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6" style={{ color: COLORS.text.primary }}>
            The Chappi Way
          </h2>
          <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed" style={{ color: COLORS.text.secondary }}>
            Three simple steps to transform your everyday purchases into rewarding experiences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 justify-items-center">
          {panels.map((panel, index) => (
            <div
              key={panel.id}
              id={panel.id}
              ref={el => panelRefs.current[panel.id] = el}
              className={`
                w-full max-w-sm md:max-w-none rounded-lg p-6 md:p-8 mx-4 md:mx-0
                text-center transform transition-all duration-700 text-white
                ${visiblePanels.has(panel.id) 
                  ? 'translate-y-0 opacity-100 scale-100' 
                  : 'translate-y-12 opacity-0 scale-95'
                }
                hover:scale-105 hover:shadow-2xl group cursor-pointer
              `}
              style={{ 
                backgroundColor: panel.bgColor,
                transitionDelay: `${index * 200}ms`,
                minHeight: '280px'
              }}
            >
              <div className="mb-6 md:mb-8 flex justify-center">
                <div className="transform transition-transform duration-300 group-hover:scale-110">
                  {panel.icon}
                </div>
              </div>
              
              <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">
                {panel.title}
              </h3>
              
              <p className="text-sm md:text-base leading-relaxed opacity-90">
                {panel.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};