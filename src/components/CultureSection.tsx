import React, { useEffect, useRef, useState } from 'react';
import { Heart, Smile, Star, Store, Smartphone, Target, DollarSign, Globe } from 'lucide-react';
import { COLORS, CARD_STYLES, ICON_SIZES } from '../utils/constants';

interface Testimonial {
  id: string;
  name: string;
  location: string;
  quote: string;
  icon: React.ReactNode;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Amina',
    location: 'Lagos, Nigeria',
    quote: 'Chappi makes every shopping trip rewarding. I earned enough Chapps to buy airtime for the whole month!',
    icon: <Smile className={ICON_SIZES.large} />
  },
  {
    id: '2',
    name: 'Kwame',
    location: 'Accra, Ghana',
    quote: 'As a small retailer, Chappi brings more customers to my shop. They love earning rewards!',
    icon: <Store className={ICON_SIZES.large} />
  },
  {
    id: '3',
    name: 'Fatima',
    location: 'Nairobi, Kenya',
    quote: 'The missions are so simple and fun. My daughter helps me complete them after school.',
    icon: <Heart className={ICON_SIZES.large} />
  }
];

const cultureItems = [
  { icon: <Store className={ICON_SIZES.standalone} />, label: 'Local Shops' },
  { icon: <Smartphone className={ICON_SIZES.standalone} />, label: 'Digital Rewards' },
  { icon: <Heart className={ICON_SIZES.standalone} />, label: 'Community' },
  { icon: <Star className={ICON_SIZES.standalone} />, label: 'Opportunities' },
  { icon: <Target className={ICON_SIZES.standalone} />, label: 'Smart Missions' },
  { icon: <DollarSign className={ICON_SIZES.standalone} />, label: 'Instant Earnings' },
  { icon: <Globe className={ICON_SIZES.standalone} />, label: 'Pan-African' },
  { icon: <Smile className={ICON_SIZES.standalone} />, label: 'Daily Shopping' }
];

export const CultureSection: React.FC = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="py-8 md:py-20 px-4 md:px-6 relative overflow-hidden"
      style={{ backgroundColor: COLORS.background.light }}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-8 md:mb-16">
          <div className="flex justify-center space-x-2 mb-4 md:mb-6">
            <Heart className={`${ICON_SIZES.large} animate-pulse`} style={{ color: COLORS.accent }} />
            <Smile className={`${ICON_SIZES.large} animate-bounce`} style={{ color: COLORS.secondary }} />
            <Star className={`${ICON_SIZES.large} animate-pulse`} style={{ color: COLORS.primary }} />
          </div>
          
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6" style={{ color: COLORS.text.primary }}>
            The Joy of Hustle
          </h2>
          
          <p className="text-lg md:text-2xl max-w-4xl mx-auto font-medium italic leading-relaxed" style={{ color: COLORS.text.secondary }}>
            "Chappi isn't just a platform. It's a culture of reward, recognition, and digital dignity."
          </p>
        </div>

        {/* Culture Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-16">
          {cultureItems.map((item, index) => (
            <div
              key={index}
              className={`
                rounded-lg p-4 md:p-8 text-center shadow-lg hover:shadow-xl 
                transition-all duration-500 transform hover:-translate-y-2
                ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
              `}
              style={{ 
                backgroundColor: COLORS.background.light,
                transitionDelay: `${index * 100}ms`,
                border: `1px solid ${COLORS.neutral}20`
              }}
            >
              <div className="mb-2 md:mb-4 flex justify-center" style={{ color: COLORS.primary }}>
                {item.icon}
              </div>
              <div className="text-sm md:text-base font-semibold" style={{ color: COLORS.text.primary }}>
                {item.label}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonial Carousel */}
        <div className="max-w-4xl mx-auto">
          <div className="rounded-lg p-6 md:p-12 shadow-2xl relative overflow-hidden" style={{ backgroundColor: COLORS.background.light }}>
            <div className="absolute top-0 left-0 w-full h-2" style={{ background: `linear-gradient(to right, ${COLORS.primary}, ${COLORS.secondary}, ${COLORS.accent})` }}></div>
            
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`
                  transition-all duration-700 transform text-center
                  ${index === currentTestimonial 
                    ? 'translate-x-0 opacity-100' 
                    : index < currentTestimonial 
                      ? '-translate-x-full opacity-0 absolute inset-0' 
                      : 'translate-x-full opacity-0 absolute inset-0'
                  }
                `}
              >
                <div className="mb-4 md:mb-6 flex justify-center" style={{ color: COLORS.primary }}>
                  {testimonial.icon}
                </div>
                <blockquote className="text-lg md:text-2xl mb-4 md:mb-6 italic leading-relaxed" style={{ color: COLORS.text.secondary }}>
                  "{testimonial.quote}"
                </blockquote>
                <div className="text-base md:text-lg font-semibold" style={{ color: COLORS.primary }}>
                  {testimonial.name}
                </div>
                <div className="text-sm md:text-base" style={{ color: COLORS.text.secondary }}>
                  {testimonial.location}
                </div>
              </div>
            ))}

            {/* Dots indicator */}
            <div className="flex justify-center space-x-2 mt-6 md:mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`
                    w-3 h-3 rounded-full transition-all duration-300 touch-manipulation
                    ${index === currentTestimonial 
                      ? 'scale-125' 
                      : 'hover:bg-gray-400'
                    }
                  `}
                  style={{
                    backgroundColor: index === currentTestimonial ? COLORS.primary : COLORS.neutral
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};