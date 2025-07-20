import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Users, TrendingUp, Zap } from 'lucide-react';
import { COLORS, ICON_SIZES } from '../utils/constants';

interface NetworkNode {
  id: string;
  x: number;
  y: number;
  type: 'user' | 'retail' | 'brand';
  country: string;
  activity: string;
}

const networkNodes: NetworkNode[] = [
  { id: '1', x: 52, y: 35, type: 'user', country: 'Nigeria', activity: 'Lagos - 2,500 active missions' },
  { id: '2', x: 58, y: 28, type: 'retail', country: 'Nigeria', activity: 'Kano - 450 retail partners' },
  { id: '3', x: 48, y: 42, type: 'brand', country: 'Ghana', activity: 'Accra - 89 brand campaigns' },
  { id: '4', x: 65, y: 45, type: 'user', country: 'Kenya', activity: 'Nairobi - 1,800 daily users' },
  { id: '5', x: 45, y: 38, type: 'retail', country: 'Ivory Coast', activity: 'Abidjan - 320 shops connected' },
  { id: '6', x: 62, y: 52, type: 'brand', country: 'Tanzania', activity: 'Dar es Salaam - 156 missions' },
  { id: '7', x: 55, y: 25, type: 'user', country: 'Chad', activity: "N'Djamena - Growing network" },
  { id: '8', x: 42, y: 48, type: 'retail', country: 'Liberia', activity: 'Monrovia - 78 partners' },
];

export const AfricaNetworkSection: React.FC = () => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [animatedNodes, setAnimatedNodes] = useState<Set<string>>(new Set());
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomNode = networkNodes[Math.floor(Math.random() * networkNodes.length)];
      setAnimatedNodes(prev => new Set([...prev, randomNode.id]));
      
      setTimeout(() => {
        setAnimatedNodes(prev => {
          const newSet = new Set(prev);
          newSet.delete(randomNode.id);
          return newSet;
        });
      }, 2000);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'user': return <Users className="w-2 h-2 md:w-3 md:h-3" />;
      case 'retail': return <MapPin className="w-2 h-2 md:w-3 md:h-3" />;
      case 'brand': return <TrendingUp className="w-2 h-2 md:w-3 md:h-3" />;
      default: return <MapPin className="w-2 h-2 md:w-3 md:h-3" />;
    }
  };

  return (
    <section 
      ref={sectionRef}
      className="py-8 md:py-20 px-4 md:px-6 relative overflow-hidden"
      style={{ backgroundColor: COLORS.background.dark }}
    >
      {/* Accurate Map of Africa as Background */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20">
        <svg 
          className="w-full max-w-2xl md:max-w-4xl h-auto" 
          viewBox="0 0 800 800" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M400 50 
               C420 52 440 55 460 60
               C480 65 500 72 518 80
               C535 88 550 98 565 110
               C580 122 593 136 605 152
               C617 168 627 186 635 205
               C643 224 649 244 653 264
               C657 284 659 304 659 324
               C659 344 657 364 653 384
               C649 404 643 423 635 441
               C627 459 617 476 605 491
               C593 506 580 519 565 530
               C550 541 535 550 518 557
               C500 564 480 569 460 572
               C440 575 420 576 400 576
               C380 576 360 575 340 572
               C320 569 300 564 282 557
               C265 550 250 541 235 530
               C220 519 207 506 195 491
               C183 476 173 459 165 441
               C157 423 151 404 147 384
               C143 364 141 344 141 324
               C141 304 143 284 147 264
               C151 244 157 224 165 205
               C173 186 183 168 195 152
               C207 136 220 122 235 110
               C250 98 265 88 282 80
               C300 72 320 65 340 60
               C360 55 380 52 400 50 Z"
            stroke="#374151"
            strokeWidth="2"
            fill="rgba(55, 65, 81, 0.1)"
            className="transition-all duration-300"
          />
        </svg>
      </div>

      {/* Network connection lines */}
      <div className="absolute inset-0 hidden md:block">
        <svg className="w-full h-full">
          {networkNodes.map((node, i) => 
            networkNodes.slice(i + 1).map((targetNode, j) => (
              <line
                key={`${node.id}-${targetNode.id}`}
                x1={`${node.x}%`}
                y1={`${node.y}%`}
                x2={`${targetNode.x}%`}
                y2={`${targetNode.y}%`}
                stroke={COLORS.secondary}
                strokeWidth="1"
                opacity="0.3"
                className={animatedNodes.has(node.id) || animatedNodes.has(targetNode.id) 
                  ? 'animate-pulse opacity-60' : ''}
              />
            ))
          )}
        </svg>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-8 leading-tight drop-shadow-2xl">
            A Living Network of Trust and Trade
          </h2>
          <p className="text-base md:text-xl max-w-3xl mx-auto font-medium leading-relaxed" style={{ color: COLORS.primary }}>
            See real-time missions, rewards, and connections across Africa's vibrant commerce ecosystem. 
            Our network spans from Lagos to Nairobi, connecting millions in a web of opportunity.
          </p>
        </div>

        {/* Interactive Network Nodes */}
        <div className="relative w-full h-64 md:h-96 mb-8 md:mb-12">
          {networkNodes.map((node) => (
            <div
              key={node.id}
              className={`
                absolute w-4 h-4 md:w-6 md:h-6 rounded-full flex items-center justify-center
                cursor-pointer z-20
                transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300
                hover:scale-150 hover:z-30 shadow-lg
                ${animatedNodes.has(node.id) ? 'animate-ping scale-125' : ''}
              `}
              style={{ 
                left: `${node.x}%`, 
                top: `${node.y}%`,
                backgroundColor: COLORS.secondary,
                color: COLORS.text.primary
              }}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              {getNodeIcon(node.type)}
              
              {/* Enhanced Tooltip */}
              {hoveredNode === node.id && (
                <div className="absolute bottom-full mb-3 left-1/2 transform -translate-x-1/2 bg-black/90 text-white p-3 md:p-4 rounded-lg text-xs md:text-sm whitespace-nowrap z-40 backdrop-blur-sm shadow-2xl max-w-xs" style={{ borderColor: `${COLORS.secondary}30`, borderWidth: '1px' }}>
                  <div className="font-bold mb-1" style={{ color: COLORS.secondary }}>{node.country}</div>
                  <div className="text-xs text-gray-300">{node.activity}</div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/90"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {[
            { number: '2.5M+', label: 'Active Users', icon: <Users className={ICON_SIZES.large} /> },
            { number: '45K+', label: 'Retail Partners', icon: <MapPin className={ICON_SIZES.large} /> },
            { number: '150+', label: 'Brand Partners', icon: <TrendingUp className={ICON_SIZES.large} /> },
            { number: '54', label: 'African Countries', icon: <Zap className={ICON_SIZES.large} /> }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-2 md:mb-4 animate-pulse" style={{ color: COLORS.secondary }}>
                {stat.icon}
              </div>
              <div className="text-2xl md:text-4xl font-bold text-white mb-1 md:mb-2 drop-shadow-lg">{stat.number}</div>
              <div className="text-sm md:text-base font-medium" style={{ color: COLORS.primary }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};