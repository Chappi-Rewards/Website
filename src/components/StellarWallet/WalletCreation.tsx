import React, { useState } from 'react';
import { 
  Wallet, 
  User, 
  CheckCircle, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Copy, 
  Download,
  Shield,
  Key,
  Globe
} from 'lucide-react';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { stellarWalletService, StellarWallet, UsernameValidation } from '../../services/stellarWallet';
import { COLORS, ICON_SIZES } from '../../utils/constants';

interface WalletCreationProps {
  onWalletCreated: (wallet: StellarWallet) => void;
  onError: (error: string) => void;
}

export const WalletCreation: React.FC<WalletCreationProps> = ({ onWalletCreated, onError }) => {
  const [step, setStep] = useState<'username' | 'creating' | 'created'>('username');
  const [username, setUsername] = useState('');
  const [usernameValidation, setUsernameValidation] = useState<UsernameValidation | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createdWallet, setCreatedWallet] = useState<StellarWallet | null>(null);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [secretKeyCopied, setSecretKeyCopied] = useState(false);

  const validateUsername = async (value: string) => {
    if (!value.trim()) {
      setUsernameValidation(null);
      return;
    }

    setIsValidating(true);
    try {
      const validation = await stellarWalletService.validateUsername(value);
      setUsernameValidation(validation);
    } catch (error) {
      console.error('Username validation error:', error);
      setUsernameValidation({
        isValid: false,
        isAvailable: false,
        errors: ['Failed to validate username']
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '');
    setUsername(value);
    
    // Debounce validation
    const timeoutId = setTimeout(() => validateUsername(value), 500);
    return () => clearTimeout(timeoutId);
  };

  const createWallet = async () => {
    if (!usernameValidation?.isValid || !usernameValidation?.isAvailable) {
      onError('Please choose a valid and available username');
      return;
    }

    setIsCreating(true);
    setStep('creating');

    try {
      const wallet = await stellarWalletService.generateWallet(username);
      setCreatedWallet(wallet);
      setStep('created');
      onWalletCreated(wallet);
    } catch (error) {
      console.error('Wallet creation error:', error);
      onError(error instanceof Error ? error.message : 'Failed to create wallet');
      setStep('username');
    } finally {
      setIsCreating(false);
    }
  };

  const createWalletWithoutUsername = async () => {
    setIsCreating(true);
    setStep('creating');

    try {
      const wallet = await stellarWalletService.generateWallet();
      setCreatedWallet(wallet);
      setStep('created');
      onWalletCreated(wallet);
    } catch (error) {
      console.error('Wallet creation error:', error);
      onError(error instanceof Error ? error.message : 'Failed to create wallet');
      setStep('username');
    } finally {
      setIsCreating(false);
    }
  };

  const copySecretKey = async () => {
    if (createdWallet?.secretKey) {
      try {
        await navigator.clipboard.writeText(createdWallet.secretKey);
        setSecretKeyCopied(true);
        setTimeout(() => setSecretKeyCopied(false), 2000);
      } catch (error) {
        console.error('Failed to copy secret key:', error);
      }
    }
  };

  const downloadWalletInfo = () => {
    if (!createdWallet) return;

    const walletInfo = {
      publicKey: createdWallet.publicKey,
      secretKey: createdWallet.secretKey,
      username: createdWallet.username,
      federatedAddress: createdWallet.federatedAddress,
      network: 'testnet',
      createdAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(walletInfo, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chappi-wallet-${createdWallet.username || 'anonymous'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (step === 'creating') {
    return (
      <div className="text-center py-12">
        <div className="mb-6">
          <LoadingSpinner size="lg" />
        </div>
        <h3 className="text-xl font-bold mb-4" style={{ color: COLORS.text.primary }}>
          Creating Your Stellar Wallet
        </h3>
        <p className="text-sm" style={{ color: COLORS.text.secondary }}>
          Generating secure keypair and registering on the Stellar network...
        </p>
      </div>
    );
  }

  if (step === 'created' && createdWallet) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <CheckCircle className="w-12 h-12 mx-auto mb-4" style={{ color: COLORS.accent }} />
          <h3 className="text-xl font-bold mb-2" style={{ color: COLORS.text.primary }}>
            Wallet Created Successfully!
          </h3>
          <p className="text-sm" style={{ color: COLORS.text.secondary }}>
            Your Stellar wallet has been created and funded on the testnet
          </p>
        </div>

        {/* Wallet Information */}
        <div className="space-y-4">
          {/* Username & Federated Address */}
          {createdWallet.username && (
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <User className="w-5 h-5" style={{ color: COLORS.primary }} />
                <span className="font-semibold" style={{ color: COLORS.text.primary }}>
                  Username
                </span>
              </div>
              <p className="text-sm font-mono" style={{ color: COLORS.text.secondary }}>
                {createdWallet.username}
              </p>
              
              <div className="flex items-center gap-3 mt-3 mb-2">
                <Globe className="w-5 h-5" style={{ color: COLORS.secondary }} />
                <span className="font-semibold" style={{ color: COLORS.text.primary }}>
                  Federated Address
                </span>
              </div>
              <p className="text-sm font-mono" style={{ color: COLORS.text.secondary }}>
                {createdWallet.federatedAddress}
              </p>
            </div>
          )}

          {/* Public Key */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Key className="w-5 h-5" style={{ color: COLORS.primary }} />
              <span className="font-semibold" style={{ color: COLORS.text.primary }}>
                Public Key (Account ID)
              </span>
            </div>
            <p className="text-xs font-mono break-all" style={{ color: COLORS.text.secondary }}>
              {createdWallet.publicKey}
            </p>
          </div>

          {/* Secret Key */}
          <div className="p-4 border-2 border-red-200 rounded-lg bg-red-50">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-5 h-5 text-red-600" />
              <span className="font-semibold text-red-800">
                Secret Key (Keep Private!)
              </span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex-1">
                <p className="text-xs font-mono break-all text-red-700">
                  {showSecretKey ? createdWallet.secretKey : '•'.repeat(56)}
                </p>
              </div>
              <button
                onClick={() => setShowSecretKey(!showSecretKey)}
                className="p-2 hover:bg-red-100 rounded-lg transition-colors"
              >
                {showSecretKey ? <EyeOff className="w-4 h-4 text-red-600" /> : <Eye className="w-4 h-4 text-red-600" />}
              </button>
              <button
                onClick={copySecretKey}
                className="p-2 hover:bg-red-100 rounded-lg transition-colors"
              >
                <Copy className="w-4 h-4 text-red-600" />
              </button>
            </div>
            {secretKeyCopied && (
              <p className="text-xs text-green-600 font-semibold">Secret key copied to clipboard!</p>
            )}
            <div className="mt-3 p-3 bg-red-100 rounded-lg">
              <p className="text-xs text-red-800 font-semibold">
                ⚠️ IMPORTANT: Save your secret key securely. Anyone with access to it can control your wallet!
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={downloadWalletInfo}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Wallet Info
          </Button>
          <Button
            variant="primary"
            onClick={() => window.location.href = '/missions'}
            className="flex items-center gap-2"
          >
            <Wallet className="w-4 h-4" />
            Start Using Wallet
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold mb-4" style={{ color: COLORS.text.primary }}>
          Create Your Stellar Wallet
        </h3>
        <p className="text-sm" style={{ color: COLORS.text.secondary }}>
          Choose a unique username for easy payments and transactions
        </p>
      </div>

      {/* Username Input */}
      <div className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium mb-2" style={{ color: COLORS.text.primary }}>
            Choose Username (Optional)
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              id="username"
              value={username}
              onChange={handleUsernameChange}
              placeholder="e.g., john_doe"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
            />
            {isValidating && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <LoadingSpinner size="sm" />
              </div>
            )}
          </div>
          
          {/* Username Validation Feedback */}
          {usernameValidation && (
            <div className="mt-2">
              {usernameValidation.isValid && usernameValidation.isAvailable ? (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">Username is available!</span>
                </div>
              ) : (
                <div className="space-y-1">
                  {usernameValidation.errors.map((error, index) => (
                    <div key={index} className="flex items-center gap-2 text-red-600">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">{error}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Federated Address Preview */}
          {username && usernameValidation?.isValid && usernameValidation?.isAvailable && (
            <div className="mt-2 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-semibold text-blue-800 mb-1">Your Federated Address:</p>
              <p className="text-sm font-mono text-blue-600">{username}*chappi.com</p>
              <p className="text-xs text-blue-600 mt-1">
                Others can send you payments using this easy-to-remember address!
              </p>
            </div>
          )}
        </div>

        {/* Username Benefits */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-2" style={{ color: COLORS.text.primary }}>
            Benefits of choosing a username:
          </h4>
          <ul className="text-sm space-y-1" style={{ color: COLORS.text.secondary }}>
            <li>• Easy-to-remember address for receiving payments</li>
            <li>• Share your username instead of long Stellar addresses</li>
            <li>• Enhanced user experience for transactions</li>
            <li>• Compatible with Stellar federation protocol</li>
          </ul>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="primary"
          onClick={createWallet}
          disabled={!username || !usernameValidation?.isValid || !usernameValidation?.isAvailable || isValidating}
          className="flex items-center gap-2"
        >
          <Wallet className="w-4 h-4" />
          Create Wallet with Username
        </Button>
        <Button
          variant="outline"
          onClick={createWalletWithoutUsername}
          className="flex items-center gap-2"
        >
          <Key className="w-4 h-4" />
          Create Wallet (No Username)
        </Button>
      </div>

      {/* Security Notice */}
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-yellow-800 mb-1">Security Notice</h4>
            <p className="text-sm text-yellow-700">
              Your wallet will be created on the Stellar testnet for development purposes. 
              Keep your secret key secure and never share it with anyone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};