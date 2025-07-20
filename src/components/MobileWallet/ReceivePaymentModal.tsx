import React, { useState } from 'react';
import { 
  X, 
  QrCode, 
  Copy, 
  Share, 
  CheckCircle,
  User,
  Globe
} from 'lucide-react';
import { Button } from '../ui/Button';
import { StellarWallet } from '../../services/stellarWallet';
import { COLORS } from '../../utils/constants';

interface ReceivePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: StellarWallet;
}

export const ReceivePaymentModal: React.FC<ReceivePaymentModalProps> = ({
  isOpen,
  onClose,
  wallet
}) => {
  const [copied, setCopied] = useState<'username' | 'address' | null>(null);
  const [requestAmount, setRequestAmount] = useState('');

  const copyToClipboard = async (text: string, type: 'username' | 'address') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const sharePaymentRequest = async () => {
    const shareData = {
      title: 'Send me Chapps',
      text: `Send me Chapps using my address: ${wallet.federatedAddress || wallet.publicKey}`,
      url: `https://chappi.com/pay/${wallet.username || wallet.publicKey}`
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback to copying link
      copyToClipboard(shareData.url, 'address');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
      <div className="bg-white rounded-t-3xl w-full max-w-md max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Receive Payment</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* QR Code Section */}
          <div className="text-center">
            <div className="w-48 h-48 mx-auto bg-white border-2 border-gray-200 rounded-2xl flex items-center justify-center mb-4">
              <div className="text-center">
                <QrCode className="w-16 h-16 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">QR Code</p>
                <p className="text-xs text-gray-400">Coming Soon</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Share this QR code for others to send you Chapps
            </p>
          </div>

          {/* Request Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Request Amount (Optional)
            </label>
            <input
              type="number"
              value={requestAmount}
              onChange={(e) => setRequestAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-3 text-center border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Address Options */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">Share your address</h3>
            
            {/* Federated Address */}
            {wallet.federatedAddress && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Globe className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-900">Easy Address</span>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    Recommended
                  </span>
                </div>
                <div className="font-mono text-sm text-blue-800 mb-3">
                  {wallet.federatedAddress}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(wallet.federatedAddress!, 'username')}
                    className="flex-1 flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-100"
                  >
                    {copied === 'username' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied === 'username' ? 'Copied!' : 'Copy'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={sharePaymentRequest}
                    className="flex-1 flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-100"
                  >
                    <Share className="w-4 h-4" />
                    Share
                  </Button>
                </div>
              </div>
            )}

            {/* Public Key */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <User className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-900">Stellar Address</span>
              </div>
              <div className="font-mono text-xs text-gray-700 mb-3 break-all">
                {wallet.publicKey}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(wallet.publicKey, 'address')}
                className="flex items-center gap-2"
              >
                {copied === 'address' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied === 'address' ? 'Copied!' : 'Copy Address'}
              </Button>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <h4 className="font-medium text-yellow-800 mb-2">How to receive payments:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Share your easy address or QR code</li>
              <li>• Others can send Chapps instantly</li>
              <li>• Payments appear in your wallet immediately</li>
              <li>• No fees for receiving payments</li>
            </ul>
          </div>

          <Button variant="primary" onClick={onClose} className="w-full">
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};