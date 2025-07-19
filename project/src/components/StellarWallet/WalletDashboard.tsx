import React, { useState, useEffect } from 'react';
import { Wallet, Send, RadioReceiver as Receive, History, User, Globe, Copy, RefreshCw, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { stellarWalletService, StellarWallet } from '../../services/stellarWallet';
import { COLORS, ICON_SIZES } from '../../utils/constants';

interface WalletDashboardProps {
  wallet: StellarWallet;
}

interface Balance {
  asset: string;
  balance: string;
}

interface Transaction {
  id: string;
  hash: string;
  created_at: string;
  operation_count: number;
  successful: boolean;
}

export const WalletDashboard: React.FC<WalletDashboardProps> = ({ wallet }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'send' | 'receive' | 'history'>('overview');
  const [balances, setBalances] = useState<Balance[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sendForm, setSendForm] = useState({
    recipient: '',
    amount: '',
    memo: ''
  });
  const [isSending, setIsSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ success: boolean; message: string } | null>(null);
  const [addressCopied, setAddressCopied] = useState(false);

  useEffect(() => {
    loadWalletData();
  }, [wallet.publicKey]);

  const loadWalletData = async () => {
    try {
      setIsLoading(true);
      const [balanceData, transactionData] = await Promise.all([
        stellarWalletService.getWalletBalance(wallet.publicKey),
        stellarWalletService.getTransactionHistory(wallet.publicKey, 10)
      ]);
      
      setBalances(balanceData);
      setTransactions(transactionData);
    } catch (error) {
      console.error('Error loading wallet data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshWalletData = async () => {
    setIsRefreshing(true);
    await loadWalletData();
    setIsRefreshing(false);
  };

  const handleSendPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sendForm.recipient || !sendForm.amount) return;

    setIsSending(true);
    setSendResult(null);

    try {
      const txHash = await stellarWalletService.sendPayment(
        wallet,
        sendForm.recipient,
        sendForm.amount,
        'XLM',
        sendForm.memo || undefined
      );

      setSendResult({
        success: true,
        message: `Payment sent successfully! Transaction: ${txHash.substring(0, 8)}...`
      });

      setSendForm({ recipient: '', amount: '', memo: '' });
      
      // Refresh wallet data after successful payment
      setTimeout(() => {
        refreshWalletData();
      }, 2000);
    } catch (error) {
      setSendResult({
        success: false,
        message: error instanceof Error ? error.message : 'Payment failed'
      });
    } finally {
      setIsSending(false);
    }
  };

  const copyAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setAddressCopied(true);
      setTimeout(() => setAddressCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy address:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatBalance = (balance: string) => {
    const num = parseFloat(balance);
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 7
    });
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-sm" style={{ color: COLORS.text.secondary }}>
          Loading wallet data...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Wallet Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Wallet className="w-8 h-8" />
            <div>
              <h2 className="text-xl font-bold">Stellar Wallet</h2>
              {wallet.username && (
                <p className="text-blue-100">@{wallet.username}</p>
              )}
            </div>
          </div>
          <button
            onClick={refreshWalletData}
            disabled={isRefreshing}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Balance Display */}
        <div className="space-y-2">
          {balances.map((balance, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-blue-100">{balance.asset}</span>
              <span className="text-2xl font-bold">{formatBalance(balance.balance)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'overview', label: 'Overview', icon: <Wallet className="w-4 h-4" /> },
          { id: 'send', label: 'Send', icon: <Send className="w-4 h-4" /> },
          { id: 'receive', label: 'Receive', icon: <Receive className="w-4 h-4" /> },
          { id: 'history', label: 'History', icon: <History className="w-4 h-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 flex-1 justify-center
              ${activeTab === tab.id 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
              }
            `}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold" style={{ color: COLORS.text.primary }}>
              Wallet Overview
            </h3>

            {/* Wallet Addresses */}
            <div className="space-y-4">
              {wallet.federatedAddress && (
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Globe className="w-5 h-5" style={{ color: COLORS.secondary }} />
                    <span className="font-semibold" style={{ color: COLORS.text.primary }}>
                      Federated Address
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-mono flex-1" style={{ color: COLORS.text.secondary }}>
                      {wallet.federatedAddress}
                    </p>
                    <button
                      onClick={() => copyAddress(wallet.federatedAddress!)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <User className="w-5 h-5" style={{ color: COLORS.primary }} />
                  <span className="font-semibold" style={{ color: COLORS.text.primary }}>
                    Public Key
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-xs font-mono flex-1 break-all" style={{ color: COLORS.text.secondary }}>
                    {wallet.publicKey}
                  </p>
                  <button
                    onClick={() => copyAddress(wallet.publicKey)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {addressCopied && (
              <div className="text-center">
                <p className="text-sm text-green-600 font-semibold">Address copied to clipboard!</p>
              </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="primary"
                onClick={() => setActiveTab('send')}
                className="flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send Payment
              </Button>
              <Button
                variant="outline"
                onClick={() => setActiveTab('receive')}
                className="flex items-center gap-2"
              >
                <Receive className="w-4 h-4" />
                Receive Payment
              </Button>
            </div>
          </div>
        )}

        {/* Send Tab */}
        {activeTab === 'send' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold" style={{ color: COLORS.text.primary }}>
              Send Payment
            </h3>

            <form onSubmit={handleSendPayment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text.primary }}>
                  Recipient Address
                </label>
                <input
                  type="text"
                  value={sendForm.recipient}
                  onChange={(e) => setSendForm(prev => ({ ...prev, recipient: e.target.value }))}
                  placeholder="username*chappi.com or Stellar address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="text-xs mt-1" style={{ color: COLORS.text.secondary }}>
                  Enter a federated address (username*domain.com) or Stellar public key
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text.primary }}>
                  Amount (XLM)
                </label>
                <input
                  type="number"
                  step="0.0000001"
                  min="0.0000001"
                  value={sendForm.amount}
                  onChange={(e) => setSendForm(prev => ({ ...prev, amount: e.target.value }))}
                  placeholder="0.00"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text.primary }}>
                  Memo (Optional)
                </label>
                <input
                  type="text"
                  value={sendForm.memo}
                  onChange={(e) => setSendForm(prev => ({ ...prev, memo: e.target.value }))}
                  placeholder="Payment description"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  maxLength={28}
                />
              </div>

              {sendResult && (
                <div className={`p-4 rounded-lg flex items-center gap-3 ${
                  sendResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                }`}>
                  {sendResult.success ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  )}
                  <p className={`text-sm ${sendResult.success ? 'text-green-800' : 'text-red-800'}`}>
                    {sendResult.message}
                  </p>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                disabled={isSending || !sendForm.recipient || !sendForm.amount}
                className="w-full flex items-center gap-2"
              >
                {isSending ? (
                  <>
                    <LoadingSpinner size="sm" color="white" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Payment
                  </>
                )}
              </Button>
            </form>
          </div>
        )}

        {/* Receive Tab */}
        {activeTab === 'receive' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold" style={{ color: COLORS.text.primary }}>
              Receive Payment
            </h3>

            <div className="text-center space-y-4">
              <p style={{ color: COLORS.text.secondary }}>
                Share your address with others to receive payments
              </p>

              {wallet.federatedAddress && (
                <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg">
                  <h4 className="font-semibold mb-2" style={{ color: COLORS.text.primary }}>
                    Easy Address (Recommended)
                  </h4>
                  <p className="text-lg font-mono mb-3" style={{ color: COLORS.secondary }}>
                    {wallet.federatedAddress}
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => copyAddress(wallet.federatedAddress!)}
                    className="flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copy Federated Address
                  </Button>
                </div>
              )}

              <div className="p-6 border border-gray-300 rounded-lg">
                <h4 className="font-semibold mb-2" style={{ color: COLORS.text.primary }}>
                  Stellar Public Key
                </h4>
                <p className="text-xs font-mono mb-3 break-all" style={{ color: COLORS.text.secondary }}>
                  {wallet.publicKey}
                </p>
                <Button
                  variant="outline"
                  onClick={() => copyAddress(wallet.publicKey)}
                  className="flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy Public Key
                </Button>
              </div>

              {addressCopied && (
                <p className="text-sm text-green-600 font-semibold">Address copied to clipboard!</p>
              )}
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold" style={{ color: COLORS.text.primary }}>
              Transaction History
            </h3>

            {transactions.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 mx-auto mb-4" style={{ color: COLORS.neutral }} />
                <p style={{ color: COLORS.text.secondary }}>No transactions yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${tx.successful ? 'bg-green-100' : 'bg-red-100'}`}>
                        {tx.successful ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold" style={{ color: COLORS.text.primary }}>
                          Transaction
                        </p>
                        <p className="text-xs" style={{ color: COLORS.text.secondary }}>
                          {formatDate(tx.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-mono" style={{ color: COLORS.text.secondary }}>
                        {tx.hash.substring(0, 8)}...
                      </p>
                      <p className="text-xs" style={{ color: COLORS.text.secondary }}>
                        {tx.operation_count} operation{tx.operation_count !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};