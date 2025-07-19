import React, { useState, useEffect } from 'react';
import { 
  User, 
  Wallet, 
  CheckCircle, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Copy, 
  Download,
  Shield,
  Key,
  Globe,
  Loader,
  ArrowRight,
  Info
} from 'lucide-react';
import { Button } from './ui/Button';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { stellarWalletService, StellarWallet, UsernameValidation } from '../services/stellarWallet';
import { COLORS, ICON_SIZES } from '../utils/constants';
import { debugLog } from '../utils/debug';

interface ChappsAccountCreationProps {
  onAccountCreated: (wallet: StellarWallet) => void;
  onError: (error: string) => void;
}

export const ChappsAccountCreation: React.FC<ChappsAccountCreationProps> = ({ 
  onAccountCreated, 
  onError 
}) => {
  const [step, setStep] = useState<'username' | 'creating' | 'backup' | 'completed'>('username');
  const [username, setUsername] = useState('');
  const [usernameValidation, setUsernameValidation] = useState<UsernameValidation | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createdWallet, setCreatedWallet] = useState<StellarWallet | null>(null);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [secretKeyCopied, setSecretKeyCopied] = useState(false);
  const [backupConfirmed, setBackupConfirmed] = useState(false);
  const [validationTimeout, setValidationTimeout] = useState<NodeJS.Timeout | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (validationTimeout) {
        clearTimeout(validationTimeout);
      }
    };
  }, [validationTimeout]);

  const validateUsername = async (value: string) => {
    if (!value.trim()) {
      setUsernameValidation(null);
      return;
    }

    setIsValidating(true);
    try {
      const validation = await stellarWalletService.validateUsername(value);
      setUsernameValidation(validation);
      debugLog('ChappsAccountCreation', 'Username validation result', validation);
    } catch (error) {
      console.error('Username validation error:', error);
      setUsernameValidation({
        isValid: false,
        isAvailable: false,
        errors: ['Failed to validate username. Please try again.']
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '');
    setUsername(value);
    
    // Clear previous timeout
    if (validationTimeout) {
      clearTimeout(validationTimeout);
    }
    
    // Set new timeout for validation
    if (value.length >= 3) {
      const timeout = setTimeout(() => validateUsername(value), 800);
      setValidationTimeout(timeout);
    } else {
      setUsernameValidation(null);
    }
  };

  const createChappsAccount = async () => {
    if (!usernameValidation?.isValid || !usernameValidation?.isAvailable) {
      onError('Please choose a valid and available username');
      return;
    }

    setIsCreating(true);
    setStep('creating');

    try {
      debugLog('ChappsAccountCreation', 'Creating Chapps account', { username });
      
      const wallet = await stellarWalletService.generateWallet(username);
      setCreatedWallet(wallet);
      setStep('backup');
      
      debugLog('ChappsAccountCreation', 'Chapps account created successfully', wallet);
    } catch (error) {
      console.error('Account creation error:', error);
      onError(error instanceof Error ? error.message : 'Failed to create account');
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
        setTimeout(() => setSecretKeyCopied(false), 3000);
        debugLog('ChappsAccountCreation', 'Secret key copied to clipboard');
      } catch (error) {
        console.error('Failed to copy secret key:', error);
        onError('Failed to copy secret key to clipboard');
      }
    }
  };

  const downloadBackupFile = () => {
    if (!createdWallet) return;

    const backupData = {
      username: createdWallet.username,
      publicKey: createdWallet.publicKey,
      secretKey: createdWallet.secretKey,
      federatedAddress: createdWallet.federatedAddress,
      network: 'testnet',
      platform: 'Chappi',
      createdAt: new Date().toISOString(),
      instructions: {
        secretKey: 'Keep this secret key secure. Anyone with access to it can control your wallet.',
        federatedAddress: 'Use your federated address for easy payments: ' + createdWallet.federatedAddress,
        recovery: 'To recover your wallet, import the secret key into any Stellar-compatible wallet.'
      }
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chappi-wallet-backup-${createdWallet.username}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    debugLog('ChappsAccountCreation', 'Backup file downloaded');
  };

  const completeAccountCreation = () => {
    if (!backupConfirmed) {
      onError('Please confirm that you have backed up your wallet information');
      return;
    }

    if (createdWallet) {
      setStep('completed');
      
      // Store account info in localStorage
      localStorage.setItem('chappi_account', JSON.stringify({
        username: createdWallet.username,
        publicKey: createdWallet.publicKey,
        federatedAddress: createdWallet.federatedAddress,
        createdAt: new Date().toISOString()
      }));

      setTimeout(() => {
        onAccountCreated(createdWallet);
      }, 2000);
    }
  };

  // Creating step
  if (step === 'creating') {
    return (
      <div className="text-center py-12 space-y-6">
        <div className="relative">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <Wallet className="w-10 h-10 text-white" />
          </div>
          <div className="absolute inset-0 w-20 h-20 mx-auto rounded-full border-4 border-blue-200 animate-ping"></div>
        </div>
        
        <h3 className="text-2xl font-bold" style={{ color: COLORS.text.primary }}>
          Creating Your Chapps Account
        </h3>
        <div className="space-y-3">
          <p className="text-lg" style={{ color: COLORS.text.secondary }}>
            Setting up your secure digital wallet...
          </p>
          <div className="flex items-center justify-center gap-2 text-sm" style={{ color: COLORS.primary }}>
            <Loader className="w-4 h-4 animate-spin" />
            <span>Generating secure keypair</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm" style={{ color: COLORS.primary }}>
            <Loader className="w-4 h-4 animate-spin" />
            <span>Registering username: @{username}</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm" style={{ color: COLORS.primary }}>
            <Loader className="w-4 h-4 animate-spin" />
            <span>Funding testnet account</span>
          </div>
        </div>
      </div>
    );
  }

  // Backup step
  if (step === 'backup' && createdWallet) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 mx-auto mb-4" style={{ color: COLORS.accent }} />
          <h3 className="text-2xl font-bold mb-2" style={{ color: COLORS.text.primary }}>
            Account Created Successfully!
          </h3>
          <p className="text-lg" style={{ color: COLORS.text.secondary }}>
            Your Chapps account is ready. Please backup your wallet information.
          </p>
        </div>

        {/* Account Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
          <h4 className="font-bold mb-4 text-center" style={{ color: COLORS.text.primary }}>
            Your Chapps Account Details
          </h4>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5" style={{ color: COLORS.primary }} />
              <div>
                <p className="font-semibold" style={{ color: COLORS.text.primary }}>Username</p>
                <p className="text-lg font-mono" style={{ color: COLORS.secondary }}>@{createdWallet.username}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5" style={{ color: COLORS.secondary }} />
              <div>
                <p className="font-semibold" style={{ color: COLORS.text.primary }}>Easy Payment Address</p>
                <p className="text-sm font-mono" style={{ color: COLORS.text.secondary }}>
                  {createdWallet.federatedAddress}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Critical Backup Section */}
        <div className="border-2 border-red-300 rounded-lg p-6 bg-red-50">
          <div className="flex items-start gap-3 mb-4">
            <Shield className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-red-800 mb-2">Critical: Backup Your Secret Key</h4>
              <p className="text-sm text-red-700 mb-4">
                Your secret key is the only way to recover your wallet. If you lose it, you'll lose access to your Chapps forever.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-red-200">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-red-800">Secret Key</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowSecretKey(!showSecretKey)}
                  className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                  title={showSecretKey ? 'Hide secret key' : 'Show secret key'}
                >
                  {showSecretKey ? <EyeOff className="w-4 h-4 text-red-600" /> : <Eye className="w-4 h-4 text-red-600" />}
                </button>
                <button
                  onClick={copySecretKey}
                  className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                  title="Copy to clipboard"
                >
                  <Copy className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
            
            <div className="font-mono text-xs break-all text-red-700 bg-red-50 p-3 rounded border">
              {showSecretKey ? createdWallet.secretKey : '•'.repeat(56)}
            </div>
            
            {secretKeyCopied && (
              <p className="text-xs text-green-600 font-semibold mt-2 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Secret key copied to clipboard!
              </p>
            )}
          </div>

          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={downloadBackupFile}
              className="flex items-center gap-2 border-red-300 text-red-700 hover:bg-red-100"
            >
              <Download className="w-4 h-4" />
              Download Backup File
            </Button>
          </div>
        </div>

        {/* Backup Confirmation */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-yellow-800 mb-2">Backup Confirmation Required</h4>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={backupConfirmed}
                  onChange={(e) => setBackupConfirmed(e.target.checked)}
                  className="mt-1 w-4 h-4 text-yellow-600 border-yellow-300 rounded focus:ring-yellow-500"
                />
                <span className="text-sm text-yellow-700">
                  I have securely backed up my secret key and understand that losing it means losing access to my Chapps account permanently. I take full responsibility for keeping this information safe.
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <Button
          variant="primary"
          onClick={completeAccountCreation}
          disabled={!backupConfirmed}
          className="w-full flex items-center gap-2 text-lg py-4"
        >
          <ArrowRight className="w-5 h-5" />
          Complete Account Setup
        </Button>
      </div>
    );
  }

  // Completed step
  if (step === 'completed') {
    return (
      <div className="text-center py-12 space-y-6">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        
        <h3 className="text-2xl font-bold" style={{ color: COLORS.text.primary }}>
          Welcome to Chappi!
        </h3>
        <p className="text-lg" style={{ color: COLORS.text.secondary }}>
          Your account is ready. Redirecting you to start earning Chapps...
        </p>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Username selection step
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
          <User className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold mb-4" style={{ color: COLORS.text.primary }}>
          Create Your Chapps Account
        </h3>
        <p className="text-lg" style={{ color: COLORS.text.secondary }}>
          Enter a username to set up your secure digital wallet and start managing your Chapps collection.
        </p>
      </div>

      {/* Username Requirements */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold mb-3 text-blue-800">Username Requirements:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• 3-20 characters long</li>
          <li>• Letters (a-z, A-Z), numbers (0-9), and underscores (_) only</li>
          <li>• No spaces or special characters</li>
          <li>• Case-sensitive</li>
        </ul>
        <p className="text-sm text-blue-600 mt-3 font-medium">
          Your unique username will be your identity across the Chapps platform. Choose wisely, as this cannot be changed later.
        </p>
      </div>

      {/* Username Input */}
      <div className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-lg font-semibold mb-3" style={{ color: COLORS.text.primary }}>
            Enter your desired username:
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
              <User className="w-5 h-5 text-gray-400" />
              <span className="text-gray-400 font-mono">@</span>
            </div>
            <input
              type="text"
              id="username"
              value={username}
              onChange={handleUsernameChange}
              placeholder="your_username"
              className="w-full pl-16 pr-12 py-4 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 font-mono"
              maxLength={20}
            />
            {isValidating && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <LoadingSpinner size="sm" />
              </div>
            )}
          </div>
          
          {/* Real-time character count */}
          <div className="flex justify-between items-center mt-2">
            <div className="text-sm" style={{ color: COLORS.text.secondary }}>
              {username.length}/20 characters
            </div>
            {username.length >= 3 && (
              <div className="text-sm" style={{ color: COLORS.primary }}>
                Checking availability...
              </div>
            )}
          </div>
        </div>

        {/* Username Validation Feedback */}
        {usernameValidation && (
          <div className="space-y-2">
            {usernameValidation.isValid && usernameValidation.isAvailable ? (
              <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-semibold text-green-800">Username is available!</p>
                  <p className="text-sm text-green-600">
                    Your federated address will be: <span className="font-mono">@{username}*chappi.com</span>
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {usernameValidation.errors.map((error, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <span className="text-sm text-red-700">{error}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Federated Address Preview */}
        {username && usernameValidation?.isValid && usernameValidation?.isAvailable && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-semibold text-purple-800 mb-2">Your Chapps Identity:</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-purple-700">Username: </span>
                <span className="font-mono text-purple-800">@{username}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-purple-700">Payment Address: </span>
                <span className="font-mono text-purple-800">{username}*chappi.com</span>
              </div>
            </div>
            <p className="text-xs text-purple-600 mt-2">
              Others can send you Chapps using your easy-to-remember payment address!
            </p>
          </div>
        )}
      </div>

      {/* Security Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-yellow-800 mb-1">Security Notice</h4>
            <p className="text-sm text-yellow-700">
              A secure wallet will be automatically generated upon successful registration. 
              You'll receive backup instructions to protect your assets.
            </p>
          </div>
        </div>
      </div>

      {/* Create Account Button */}
      <Button
        variant="primary"
        onClick={createChappsAccount}
        disabled={!username || !usernameValidation?.isValid || !usernameValidation?.isAvailable || isValidating}
        className="w-full flex items-center gap-3 text-lg py-4 font-bold"
      >
        <Wallet className="w-6 h-6" />
        Create My Chapps Account
        <ArrowRight className="w-5 h-5" />
      </Button>

      {/* Additional Info */}
      <div className="text-center text-sm" style={{ color: COLORS.text.secondary }}>
        <p>
          By creating an account, you agree to our{' '}
          <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a>{' '}
          and{' '}
          <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
};