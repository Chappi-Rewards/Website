import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChappsAccountCreation } from '../components/ChappsAccountCreation';
import { WalletDashboard } from '../components/StellarWallet/WalletDashboard';
import { StellarWallet } from '../services/stellarWallet';
import { COLORS } from '../utils/constants';
import { debugLog } from '../utils/debug';

export const ChappsAccountPage: React.FC = () => {
  const navigate = useNavigate();
  const [createdWallet, setCreatedWallet] = useState<StellarWallet | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAccountCreated = (wallet: StellarWallet) => {
    setCreatedWallet(wallet);
    debugLog('ChappsAccountPage', 'Account created successfully', wallet);
    
    // Redirect to missions page after a short delay
    setTimeout(() => {
      navigate('/missions');
    }, 3000);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    debugLog('ChappsAccountPage', 'Account creation error', errorMessage);
    
    // Clear error after 5 seconds
    setTimeout(() => {
      setError(null);
    }, 5000);
  };

  return (
    <div className="pt-16 md:pt-20 min-h-screen" style={{ backgroundColor: COLORS.background.light }}>
      {/* Hero Section */}
      <section className="py-8 md:py-12 px-4 md:px-6" style={{ backgroundColor: COLORS.primary }}>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6 leading-tight">
            Join the Future of
            <span className="block" style={{ color: COLORS.secondary }}>African Rewards</span>
          </h1>
          <p className="text-base md:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Create your secure Chapps account and start earning rewards for your everyday purchases across Africa
          </p>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-center">{error}</p>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-xl border border-gray-100 p-6 md:p-8">
          {createdWallet ? (
            <WalletDashboard wallet={createdWallet} />
          ) : (
            <ChappsAccountCreation 
              onAccountCreated={handleAccountCreated}
              onError={handleError}
            />
          )}
        </div>

        {/* Additional Information */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
            <h4 className="font-semibold mb-2" style={{ color: COLORS.text.primary }}>
              Secure & Private
            </h4>
            <p className="text-sm" style={{ color: COLORS.text.secondary }}>
              Your wallet is secured by Stellar blockchain technology
            </p>
          </div>
          
          <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
            <h4 className="font-semibold mb-2" style={{ color: COLORS.text.primary }}>
              Easy Payments
            </h4>
            <p className="text-sm" style={{ color: COLORS.text.secondary }}>
              Use your username for simple, memorable transactions
            </p>
          </div>
          
          <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
            <h4 className="font-semibold mb-2" style={{ color: COLORS.text.primary }}>
              Instant Rewards
            </h4>
            <p className="text-sm" style={{ color: COLORS.text.secondary }}>
              Start earning Chapps immediately with your first mission
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};