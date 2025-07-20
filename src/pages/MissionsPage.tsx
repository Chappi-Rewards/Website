import React, { useState } from 'react';
import { ShoppingBag, Camera, CheckCircle, Gift, Star, MapPin, Filter, Search } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { COLORS, ICON_SIZES } from '../utils/constants';

interface Mission {
  id: string;
  title: string;
  description: string;
  reward: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  icon: React.ReactNode;
  location: string;
  category: string;
  timeEstimate: string;
}

const missions: Mission[] = [
  {
    id: '1',
    title: 'Buy Groceries at Local Market',
    description: 'Purchase any groceries worth ₦500 or more at participating local markets',
    reward: '10 Chapps',
    difficulty: 'Easy',
    icon: <ShoppingBag className={ICON_SIZES.large} />,
    location: 'Lagos, Nigeria',
    category: 'Shopping',
    timeEstimate: '15 mins'
  },
  {
    id: '2',
    title: 'Try New Product & Share',
    description: 'Purchase a featured product and share your experience via photo',
    reward: '25 Chapps',
    difficulty: 'Medium',
    icon: <Camera className={ICON_SIZES.large} />,
    location: 'Accra, Ghana',
    category: 'Social',
    timeEstimate: '30 mins'
  },
  {
    id: '3',
    title: 'Weekly Shopping Challenge',
    description: 'Complete 5 purchases in different categories within one week',
    reward: '50 Chapps',
    difficulty: 'Hard',
    icon: <Star className={ICON_SIZES.large} />,
    location: 'Nairobi, Kenya',
    category: 'Challenge',
    timeEstimate: '1 week'
  },
  {
    id: '4',
    title: 'Visit New Store',
    description: 'Make your first purchase at a newly partnered retail location',
    reward: '15 Chapps',
    difficulty: 'Easy',
    icon: <MapPin className={ICON_SIZES.large} />,
    location: 'Abidjan, Ivory Coast',
    category: 'Discovery',
    timeEstimate: '20 mins'
  },
  {
    id: '5',
    title: 'Product Review Mission',
    description: 'Write a detailed review of your recent purchase and help other shoppers',
    reward: '20 Chapps',
    difficulty: 'Medium',
    icon: <CheckCircle className={ICON_SIZES.large} />,
    location: 'Dar es Salaam, Tanzania',
    category: 'Social',
    timeEstimate: '25 mins'
  },
  {
    id: '6',
    title: 'Loyalty Milestone',
    description: 'Complete 10 missions in a single month to unlock bonus rewards',
    reward: '100 Chapps',
    difficulty: 'Hard',
    icon: <Gift className={ICON_SIZES.large} />,
    location: 'All Locations',
    category: 'Challenge',
    timeEstimate: '1 month'
  }
];

export const MissionsPage: React.FC = () => {
  const [selectedMission, setSelectedMission] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const categories = ['All', 'Shopping', 'Social', 'Challenge', 'Discovery'];

  const filteredMissions = missions.filter(mission => {
    const matchesCategory = filterCategory === 'All' || mission.category === filterCategory;
    const matchesSearch = mission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mission.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return COLORS.accent;
      case 'Medium': return COLORS.secondary;
      case 'Hard': return COLORS.primary;
      default: return COLORS.neutral;
    }
  };

  const handleCreateAccount = () => {
    // Navigate to user sign-up flow with wallet creation
    window.location.href = '/user-signup';
  };

  return (
    <div className="pt-16 md:pt-20">
      {/* Hero Section */}
      <section className="py-12 md:py-20 px-4 md:px-6" style={{ backgroundColor: COLORS.background.dark }}>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 md:mb-8 leading-tight">
            Discover Your Next
            <span className="block" style={{ color: COLORS.secondary }}>Rewarding Mission</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed mb-8">
            Choose from hundreds of missions tailored to your location, interests, and schedule. 
            Every mission completed brings you closer to amazing rewards.
          </p>
          
          {/* Prominent Get Started CTA */}
          <div className="mb-8">
            <Button 
              variant="secondary" 
              size="lg"
              onClick={handleCreateAccount}
              className="text-lg px-12 py-4 font-bold shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              Join Chappi - Start Earning Today
            </Button>
            <p className="text-sm text-blue-200 mt-3">
              Create your account with secure wallet integration
            </p>
          </div>
        </div>
      </section>

      {/* Mission Preview Section */}
      <section className="py-8 md:py-12 px-4 md:px-6" style={{ backgroundColor: COLORS.background.light }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: COLORS.text.primary }}>
              Preview Available Missions
            </h2>
            <p className="text-lg" style={{ color: COLORS.text.secondary }}>
              See what's waiting for you once you join the Chappi network
            </p>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-4 md:p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search missions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
                />
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setFilterCategory(category)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 min-h-[44px] touch-manipulation ${
                      filterCategory === category
                        ? 'text-white shadow-lg'
                        : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                    }`}
                    style={{
                      backgroundColor: filterCategory === category ? COLORS.primary : undefined
                    }}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Missions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
            {filteredMissions.map((mission) => (
              <div
                key={mission.id}
                className={`
                  rounded-lg p-6 md:p-8 cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl
                  ${selectedMission === mission.id ? 'ring-4 ring-opacity-50' : ''}
                `}
                style={{ 
                  backgroundColor: COLORS.background.light,
                  border: selectedMission === mission.id ? `2px solid ${COLORS.secondary}` : `1px solid ${COLORS.neutral}20`
                }}
                onClick={() => setSelectedMission(selectedMission === mission.id ? null : mission.id)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div style={{ color: COLORS.primary }}>
                    {mission.icon}
                  </div>
                  <div 
                    className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                    style={{ backgroundColor: getDifficultyColor(mission.difficulty) }}
                  >
                    {mission.difficulty}
                  </div>
                </div>

                <h3 className="text-lg md:text-xl font-bold mb-3" style={{ color: COLORS.text.primary }}>
                  {mission.title}
                </h3>

                <p className="mb-4 text-sm md:text-base leading-relaxed" style={{ color: COLORS.text.secondary }}>
                  {mission.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: COLORS.text.secondary }}>Location:</span>
                    <span style={{ color: COLORS.text.primary }}>{mission.location}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: COLORS.text.secondary }}>Time:</span>
                    <span style={{ color: COLORS.text.primary }}>{mission.timeEstimate}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: COLORS.text.secondary }}>Category:</span>
                    <span style={{ color: COLORS.text.primary }}>{mission.category}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-right">
                    <div className="text-lg font-bold" style={{ color: COLORS.secondary }}>
                      {mission.reward}
                    </div>
                  </div>
                </div>

                {selectedMission === mission.id && (
                  <div className="mt-6 pt-4 border-t" style={{ borderColor: `${COLORS.neutral}20` }}>
                    <Button 
                      variant="secondary" 
                      className="w-full min-h-[44px] touch-manipulation"
                      onClick={handleCreateAccount}
                    >
                      Join Chappi to Start This Mission
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredMissions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg" style={{ color: COLORS.text.secondary }}>
                No missions found matching your criteria. Try adjusting your filters.
              </p>
            </div>
          )}

          {/* Final CTA */}
          <div className="text-center">
            <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-8 md:p-12">
              <h3 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: COLORS.text.primary }}>
                Ready to Start Your First Mission?
              </h3>
              <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ color: COLORS.text.secondary }}>
                Join millions of users already earning rewards through Chappi missions. 
                Create your account with secure wallet integration and start earning immediately.
              </p>
              <Button 
                variant="primary" 
                size="lg"
                onClick={handleCreateAccount}
                className="text-lg px-12 py-4 font-bold transform hover:scale-105 transition-all duration-300 shadow-lg min-h-[44px] touch-manipulation"
              >
                Join Chappi - Create Account & Wallet
              </Button>
              <p className="text-sm mt-4" style={{ color: COLORS.text.secondary }}>
                Secure wallet creation • Instant access • No hidden fees
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};