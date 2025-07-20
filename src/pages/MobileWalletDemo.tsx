import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileWalletInterface } from '../components/MobileWallet/MobileWalletInterface';
import { SendPaymentModal } from '../components/MobileWallet/SendPaymentModal';
import { ReceivePaymentModal } from '../components/MobileWallet/ReceivePaymentModal';
import { StellarWallet } from '../services/stellarWallet';
import { COLORS } from '../utils/constants';

export const MobileWalletDemo: React.FC = () => {
  const navigate = useNavigate();
  const [showSendModal, setShowSendModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);

  // Demo wallet data
  const demoWallet: StellarWallet = {
    publicKey: 'GDXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    secretKey: 'SXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    username: 'babygirlnaya',
    federatedAddress: 'babygirlnaya*chappi.com'
  };

  const handleSendSuccess = (txHash: string) => {
    console.log('Payment sent successfully:', txHash);
    setShowSendModal(false);
  };

  const handleSendError = (error: string) => {
    console.error('Payment failed:', error);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.background.light }}>
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to Main Site
            </button>
            <h1 className="text-lg font-bold" style={{ color: COLORS.text.primary }}>
              Mobile Wallet Demo
            </h1>
            <div className="w-16"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Mobile Wallet Container */}
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl">
        <MobileWalletInterface
          wallet={demoWallet}
          onSendPayment={() => setShowSendModal(true)}
          onReceivePayment={() => setShowReceiveModal(true)}
        />
      </div>

      {/* Modals */}
      <SendPaymentModal
        isOpen={showSendModal}
        onClose={() => setShowSendModal(false)}
        wallet={demoWallet}
        onSuccess={handleSendSuccess}
        onError={handleSendError}
      />

      <ReceivePaymentModal
        isOpen={showReceiveModal}
        onClose={() => setShowReceiveModal(false)}
        wallet={demoWallet}
      />

      {/* Demo Info */}
      <div className="max-w-md mx-auto p-4 bg-blue-50 border-t border-blue-200">
        <div className="text-center">
          <h3 className="font-semibold text-blue-900 mb-2">Mobile Wallet Demo</h3>
          <p className="text-sm text-blue-700 mb-3">
            This is a demonstration of the Chappi mobile wallet interface. 
            The design matches the provided mockup with full functionality.
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs text-blue-600">
            <div>✓ Points Balance Display</div>
            <div>✓ Quick Actions</div>
            <div>✓ Offers Section</div>
            <div>✓ Shopping List</div>
            <div>✓ Transaction History</div>
            <div>✓ Send/Receive Modals</div>
          </div>
        </div>
      </div>
    </div>
  );
};
</parameter>