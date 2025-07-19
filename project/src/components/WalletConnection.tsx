import React, { useState } from 'react';
import { Wallet, Shield, CheckCircle, AlertCircle, Loader, Upload, Plus, ArrowRight } from 'lucide-react';
import { Button } from './ui/Button';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { WalletCreation } from './StellarWallet/WalletCreation';
import { WalletDashboard } from './StellarWallet/WalletDashboard';
import { stellarWalletService, StellarWallet } from '../services/stellarWallet';
import { COLORS, ICON_SIZES } from '../utils/constants';
import { debugLog } from '../utils/debug';

interface WalletConnectionProps {
  onSuccess: () => void;
  onError: (error: string) => void;
}

export const WalletConnection: React.FC<WalletConnectionProps> = ({ onSuccess, onError }) => {
  const [connectionStep, setConnectionStep] = useState<'select' | 'create' | 'import' | 'connected'>('select');
  const [connectedWallet, setConnectedWallet] = useState<StellarWallet | null>(null);
  const [importForm, setImportForm] = useState({
    secretKey: '',
    username: ''
  });
  const [isImporting, setIsImporting] = useState(false);

  const handleWalletCreated = (wallet: StellarWallet) => {
    setConnectedWallet(wallet);
    setConnectionStep('connected');
    
    // Store wallet info in localStorage
    localStorage.setItem('chappi_stellar_wallet', JSON.stringify({
      publicKey: wallet.publicKey,
      username: wallet.username,
      federatedAddress: wallet.federatedAddress,
      connected: true,
      connectedAt: new Date().toISOString()
    }));
    
    debugLog('WalletConnection', 'Stellar wallet created and connected', wallet);
    onSuccess();
  };

  const handleWalletError = (error: string) => {
    debugLog('WalletConnection', 'Wallet error', error);
    onError(error);
  };

  const handleImportWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importForm.secretKey.trim()) {
      onError('Secret key is required');
      return;
    }

    setIsImporting(true);
    
    try {
      const wallet = await stellarWalletService.importWallet(
        importForm.secretKey.trim(),
        importForm.username.trim() || undefined
      );
      
      handleWalletCreated(wallet);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to import wallet';
      onError(errorMessage);
    } finally {
      setIsImporting(false);
    }
  };

  const handleCreateNewWallet = () => {
    setConnectionStep('create');
  };

  const handleImportExistingWallet = () => {
    setConnectionStep('import');
  };

  const handleBackToSelection = () => {
    setConnectionStep('select');
    setImportForm({ secretKey: '', username: '' });
  };

  const handleCreateChappsAccount = () => {
    // Navigate to the dedicated Chapps account creation page
    window.location.href = '/create-account';
  };

  if (connectionStep === 'connected' && connectedWallet) {
    return <WalletDashboard wallet={connectedWallet} />;
  }

  if (connectionStep === 'create') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold" style={{ color: COLORS.text.primary }}>
            Create Stellar Wallet
          </h3>
          <Button variant="ghost" onClick={handleBackToSelection}>
            ← Back
          </Button>
        </div>
        <WalletCreation 
          onWalletCreated={handleWalletCreated}
          onError={handleWalletError}
        />
      </div>
    );
  }

  if (connectionStep === 'import') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold" style={{ color: COLORS.text.primary }}>
            Import Existing Wallet
          </h3>
          <Button variant="ghost" onClick={handleBackToSelection}>
            ← Back
          </Button>
        </div>

        <form onSubmit={handleImportWallet} className="space-y-4">
          <div>
            <label htmlFor="secretKey" className="block text-sm font-medium mb-2" style={{ color: COLORS.text.primary }}>
              Secret Key *
            </label>
            <textarea
              id="secretKey"
              value={importForm.secretKey}
              onChange={(e) => setImportForm(prev => ({ ...prev, secretKey: e.target.value }))}
              placeholder="Enter your Stellar secret key (starts with S)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              rows={3}
              required
            />
          </div>

          <div>
            <label htmlFor="importUsername" className="block text-sm font-medium mb-2" style={{ color: COLORS.text.primary }}>
              Username (Optional)
            </label>
            <input
              type="text"
              id="importUsername"
              value={importForm.username}
              onChange={(e) => setImportForm(prev => ({ ...prev, username: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '') }))}
              placeholder="Choose a username for federated addressing"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs mt-1" style={{ color: COLORS.text.secondary }}>
              If you had a username before, enter it to restore federated addressing
            </p>
          </div>

          <Button
            type="submit"
            variant="primary"
            disabled={isImporting || !importForm.secretKey.trim()}
            className="w-full flex items-center gap-2"
          >
            {isImporting ? (
              <>
                <LoadingSpinner size="sm" color="white" />
                Importing Wallet...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Import Wallet
              </>
            )}
          </Button>
        </form>

        {/* Security Warning */}
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-red-800 mb-1">Security Warning</h4>
              <p className="text-sm text-red-700">
                Only import wallets you trust. Never share your secret key with anyone. 
                Make sure you're on the correct website before entering sensitive information.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-xl font-bold mb-4" style={{ color: COLORS.text.primary }}>
          Connect Your Wallet
        </h3>
        <p className="text-sm" style={{ color: COLORS.text.secondary }}>
          Choose how you'd like to manage your Chapps and rewards
        </p>
      </div>

      <div className="space-y-4">
        {/* Create Chapps Account - Featured Option */}
        <div
          className="p-6 border-2 border-blue-500 rounded-lg cursor-pointer transition-all duration-300 hover:border-blue-600 hover:bg-blue-50 bg-blue-25"
          onClick={handleCreateChappsAccount}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg" style={{ backgroundColor: COLORS.primary }}>
              <Plus className="w-6 h-6 text-white" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-semibold" style={{ color: COLORS.text.primary }}>
                  Create Chapps Account
                </h4>
                <span className="px-2 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                  RECOMMENDED
                </span>
              </div>
              <p className="text-sm mb-3" style={{ color: COLORS.text.secondary }}>
                Complete account setup with username, secure wallet, and instant Chapps earning
              </p>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs" style={{ color: COLORS.accent }}>
                  <CheckCircle className="w-3 h-3" />
                  <span>Easy username-based payments</span>
                </div>
                <div className="flex items-center gap-2 text-xs" style={{ color: COLORS.accent }}>
                  <CheckCircle className="w-3 h-3" />
                  <span>Secure Stellar blockchain wallet</span>
                </div>
                <div className="flex items-center gap-2 text-xs" style={{ color: COLORS.accent }}>
                  <CheckCircle className="w-3 h-3" />
                  <span>Instant mission access</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="primary" className="flex items-center gap-2">
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Advanced Options */}
        <div className="border-t border-gray-200 pt-4">
          <p className="text-sm font-medium mb-3" style={{ color: COLORS.text.secondary }}>
            Advanced Options:
          </p>
          
          {/* Create New Wallet Option */}
          <div
            className="p-4 border border-gray-300 rounded-lg cursor-pointer transition-all duration-300 hover:border-gray-400 hover:bg-gray-50 mb-3"
            onClick={handleCreateNewWallet}
          >
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-gray-100">
                <Wallet className="w-5 h-5 text-gray-600" />
              </div>
              
              <div className="flex-1">
                <h4 className="font-semibold text-sm" style={{ color: COLORS.text.primary }}>
                  Create Stellar Wallet Only
                </h4>
                <p className="text-xs" style={{ color: COLORS.text.secondary }}>
                  Generate a new Stellar wallet without full account setup
                </p>
              </div>

              <Button variant="outline" size="sm">
                Create
              </Button>
            </div>
          </div>

          {/* Import Existing Wallet Option */}
          <div
            className="p-4 border border-gray-300 rounded-lg cursor-pointer transition-all duration-300 hover:border-gray-400 hover:bg-gray-50"
            onClick={handleImportExistingWallet}
          >
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-gray-100">
                <Upload className="w-5 h-5 text-gray-600" />
              </div>
              
              <div className="flex-1">
                <h4 className="font-semibold text-sm" style={{ color: COLORS.text.primary }}>
                  Import Existing Wallet
                </h4>
                <p className="text-xs" style={{ color: COLORS.text.secondary }}>
                  Import your existing Stellar wallet using your secret key
                </p>
              </div>

              <Button variant="outline" size="sm">
                Import
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="p-4 rounded-lg" style={{ backgroundColor: `${COLORS.accent}10` }}>
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 mt-0.5" style={{ color: COLORS.accent }} />
          <div>
            <h4 className="font-semibold mb-1" style={{ color: COLORS.text.primary }}>
              Stellar Network Security
            </h4>
            <p className="text-sm" style={{ color: COLORS.text.secondary }}>
              Your wallet uses the Stellar blockchain network for secure, fast, and low-cost transactions. 
              All wallets are created on the testnet for development purposes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};