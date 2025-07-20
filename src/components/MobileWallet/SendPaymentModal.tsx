import React, { useState } from 'react';
import { X, Send, User, QrCode, Contact as Contacts, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { stellarWalletService, StellarWallet } from '../../services/stellarWallet';
import { COLORS } from '../../utils/constants';

interface SendPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: StellarWallet;
  onSuccess: (txHash: string) => void;
  onError: (error: string) => void;
}

export const SendPaymentModal: React.FC<SendPaymentModalProps> = ({
  isOpen,
  onClose,
  wallet,
  onSuccess,
  onError
}) => {
  const [step, setStep] = useState<'recipient' | 'amount' | 'confirm' | 'sending' | 'success'>('recipient');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [txHash, setTxHash] = useState('');

  const quickContacts = [
    { id: '1', name: 'John Doe', username: 'john_doe', avatar: '👨' },
    { id: '2', name: 'Alice Smith', username: 'alice_smith', avatar: '👩' },
    { id: '3', name: 'Bob Wilson', username: 'bob_wilson', avatar: '👨‍💼' },
    { id: '4', name: 'Sarah Johnson', username: 'sarah_j', avatar: '👩‍💻' }
  ];

  const handleSendPayment = async () => {
    if (!recipient || !amount) return;

    setIsSending(true);
    setStep('sending');

    try {
      const hash = await stellarWalletService.sendPayment(
        wallet,
        recipient,
        amount,
        'XLM',
        memo || undefined
      );

      setTxHash(hash);
      setStep('success');
      onSuccess(hash);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Payment failed');
      setStep('confirm');
    } finally {
      setIsSending(false);
    }
  };

  const resetModal = () => {
    setStep('recipient');
    setRecipient('');
    setAmount('');
    setMemo('');
    setTxHash('');
    setIsSending(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
      <div className="bg-white rounded-t-3xl w-full max-w-md max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Send Payment</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Step 1: Recipient Selection */}
          {step === 'recipient' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Send to
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="@username or stellar address"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 flex items-center gap-2">
                  <QrCode className="w-4 h-4" />
                  Scan QR
                </Button>
                <Button variant="outline" className="flex-1 flex items-center gap-2">
                  <Contacts className="w-4 h-4" />
                  Contacts
                </Button>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Send</h3>
                <div className="grid grid-cols-2 gap-3">
                  {quickContacts.map((contact) => (
                    <button
                      key={contact.id}
                      onClick={() => setRecipient(`@${contact.username}`)}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="text-2xl">{contact.avatar}</div>
                      <div className="text-left">
                        <div className="font-medium text-sm text-gray-900">{contact.name}</div>
                        <div className="text-xs text-gray-600">@{contact.username}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <Button
                variant="primary"
                onClick={() => setStep('amount')}
                disabled={!recipient}
                className="w-full flex items-center gap-2"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Step 2: Amount Entry */}
          {step === 'amount' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-2">Sending to</div>
                <div className="font-semibold text-gray-900">{recipient}</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (CHAPP)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 text-2xl text-center border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message (Optional)
                </label>
                <input
                  type="text"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  placeholder="What's this for?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  maxLength={28}
                />
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep('recipient')} className="flex-1">
                  Back
                </Button>
                <Button
                  variant="primary"
                  onClick={() => setStep('confirm')}
                  disabled={!amount}
                  className="flex-1"
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 'confirm' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-2xl mb-2">💸</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Confirm Payment</h3>
                <p className="text-sm text-gray-600">Review the details before sending</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">To</span>
                  <span className="font-medium text-gray-900">{recipient}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount</span>
                  <span className="font-medium text-gray-900">{amount} CHAPP</span>
                </div>
                {memo && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Message</span>
                    <span className="font-medium text-gray-900">{memo}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Network Fee</span>
                  <span className="font-medium text-gray-900">0.00001 XLM</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep('amount')} className="flex-1">
                  Back
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSendPayment}
                  disabled={isSending}
                  className="flex-1 flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Payment
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Sending */}
          {step === 'sending' && (
            <div className="text-center py-12">
              <LoadingSpinner size="lg" />
              <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Sending Payment</h3>
              <p className="text-sm text-gray-600">Please wait while we process your transaction...</p>
            </div>
          )}

          {/* Step 5: Success */}
          {step === 'success' && (
            <div className="text-center py-12 space-y-6">
              <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Sent!</h3>
                <p className="text-sm text-gray-600">Your payment has been successfully sent</p>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4 text-left">
                <div className="text-xs text-gray-600 mb-1">Transaction ID</div>
                <div className="font-mono text-xs text-gray-900 break-all">
                  {txHash.substring(0, 32)}...
                </div>
              </div>

              <Button variant="primary" onClick={handleClose} className="w-full">
                Done
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};