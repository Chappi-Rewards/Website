import React from 'react';
import { Users, Target, Globe, Award, Heart, TrendingUp, Shield, Zap } from 'lucide-react';
import { COLORS, ICON_SIZES } from '../utils/constants';

export const AboutPage: React.FC = () => {
  return (
    <div className="pt-16 md:pt-20">
      {/* Hero Section */}
      <section className="py-12 md:py-20 px-4 md:px-6" style={{ backgroundColor: COLORS.primary }}>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 md:mb-8 leading-tight">
            Empowering Africa Through
            <span className="block" style={{ color: COLORS.secondary }}>Everyday Commerce</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            We're building the future of rewards and commerce across Africa, connecting millions of consumers, 
            retailers, and brands in a vibrant network of trust and opportunity.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-12 md:py-20 px-4 md:px-6" style={{ backgroundColor: COLORS.background.light }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              {
                icon: <Users className={ICON_SIZES.large} />,
                title: 'Our Mission',
                description: 'Connecting millions of consumers, retailers, and brands across Africa in a vibrant network of trust and opportunity.'
              },
              {
                icon: <Target className={ICON_SIZES.large} />,
                title: 'Our Vision',
                description: 'To become Africa\'s leading platform for rewarding everyday commerce and building digital dignity.'
              },
              {
                icon: <Globe className={ICON_SIZES.large} />,
                title: 'Our Reach',
                description: 'Operating across 54 African countries, serving millions of users with localized solutions.'
              },
              {
                icon: <Award className={ICON_SIZES.large} />,
                title: 'Our Impact',
                description: 'Empowering communities through accessible rewards, financial inclusion, and economic opportunity.'
              }
            ].map((item, index) => (
              <div
                key={index}
                className="text-center p-6 md:p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                style={{ backgroundColor: COLORS.background.light, border: `1px solid ${COLORS.neutral}20` }}
              >
                <div className="mb-4 md:mb-6 flex justify-center" style={{ color: COLORS.primary }}>
                  {item.icon}
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4" style={{ color: COLORS.text.primary }}>
                  {item.title}
                </h3>
                <p className="text-sm md:text-base leading-relaxed" style={{ color: COLORS.text.secondary }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-12 md:py-20 px-4 md:px-6" style={{ backgroundColor: COLORS.background.dark }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-6">Our Story</h2>
          </div>
          
          <div className="space-y-8 md:space-y-12">
            <div className="text-center">
              <p className="text-lg md:text-xl text-blue-100 leading-relaxed mb-6">
                Chappi was born from a simple observation: millions of Africans shop every day, but their loyalty 
                and purchasing power often goes unrecognized and unrewarded.
              </p>
              <p className="text-lg md:text-xl text-blue-100 leading-relaxed mb-6">
                We saw an opportunity to bridge the gap between traditional commerce and digital rewards, 
                creating a platform that works for everyone - from the street vendor to the multinational brand.
              </p>
              <p className="text-lg md:text-xl text-blue-100 leading-relaxed">
                Today, we're proud to be building Africa's most inclusive commerce network, where every purchase 
                matters and every participant benefits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-12 md:py-20 px-4 md:px-6" style={{ backgroundColor: COLORS.background.light }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-bold mb-6" style={{ color: COLORS.text.primary }}>
              Our Values
            </h2>
            <p className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: COLORS.text.secondary }}>
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              {
                icon: <Heart className={ICON_SIZES.large} />,
                title: 'Inclusivity',
                description: 'Every African deserves access to digital rewards and economic opportunity.'
              },
              {
                icon: <Shield className={ICON_SIZES.large} />,
                title: 'Trust',
                description: 'Building transparent, secure relationships between all network participants.'
              },
              {
                icon: <Zap className={ICON_SIZES.large} />,
                title: 'Innovation',
                description: 'Constantly evolving to meet the unique needs of African commerce.'
              },
              {
                icon: <TrendingUp className={ICON_SIZES.large} />,
                title: 'Growth',
                description: 'Empowering individuals and communities to thrive in the digital economy.'
              }
            ].map((value, index) => (
              <div
                key={index}
                className="text-center p-6 md:p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                style={{ backgroundColor: COLORS.background.light, border: `1px solid ${COLORS.neutral}20` }}
              >
                <div className="mb-4 md:mb-6 flex justify-center" style={{ color: COLORS.accent }}>
                  {value.icon}
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4" style={{ color: COLORS.text.primary }}>
                  {value.title}
                </h3>
                <p className="text-sm md:text-base leading-relaxed" style={{ color: COLORS.text.secondary }}>
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 md:py-20 px-4 md:px-6" style={{ backgroundColor: COLORS.primary }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-6">
              Our Impact in Numbers
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { number: '2.5M+', label: 'Active Users' },
              { number: '45K+', label: 'Retail Partners' },
              { number: '150+', label: 'Brand Partners' },
              { number: '54', label: 'African Countries' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-5xl font-bold text-white mb-2" style={{ color: COLORS.secondary }}>
                  {stat.number}
                </div>
                <div className="text-base md:text-lg text-blue-100">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};