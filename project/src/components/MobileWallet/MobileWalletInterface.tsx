import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  Send, 
  QrCode, 
  History, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Eye, 
  EyeOff,
  RefreshCw,
  Settings,
  Bell,
  Gift,
  ShoppingCart,
  Coffee,
  Fuel,
  Sparkles,
  ChevronRight,
  Copy,
  CheckCircle,
  User,
  CreditCard,
  Smartphone
} from 'lucide-react';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { stellarWalletService, StellarWallet } from '../../services/stellarWallet';
import { COLORS, ICON_SIZES } from '../../utils/constants';

interface MobileWalletProps {
  wallet: StellarWallet;
  onSendPayment?: () => void;
  onReceivePayment?: () => void;
}

interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'reward';
  amount: string;
  asset: string;
  timestamp: string;
  description: string;
  status: 'completed' | 'pending' | 'failed';
}

interface Offer {
  id: string;
  category: 'groceries' | 'food' | 'beauty' | 'fuel';
  title: string;
  description: string;
  points: number;
  icon: React.ReactNode;
  color: string;
}

export const MobileWalletInterface: React.FC<MobileWalletProps> = ({ 
  wallet, 
  onSendPayment, 
  onReceivePayment 
}) => {
  const [balance, setBalance] = useState('20,000');
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [shoppingList, setShoppingList] = useState([
    { id: '1', name: 'Sagai Dates', size: '300g', quantity: 1, points: 10, image: '🍯' },
    { id: '2', name: 'Almarai Milk', size: '1GL', quantity: 1, points: 15, image: '🥛' },
    { id: '3', name: 'Lulu White Oats', size: '1Kg', quantity: 1, points: 10, image: '🥣' },
    { id: '4', name: 'Lulu Peanut Butter', size: '340g', quantity: 1, points: 10, image: '🥜' }
  ]);

  useEffect(() => {
    loadWalletData();
    loadOffers();
    loadRecentTransactions();
  }, [wallet]);

  const loadWalletData = async () => {
    try {
      const balanceData = await stellarWalletService.getWalletBalance(wallet.publicKey);
      if (balanceData.length > 0) {
        const xlmBalance = balanceData.find(b => b.asset === 'XLM');
        if (xlmBalance) {
          setBalance(parseFloat(xlmBalance.balance).toLocaleString());
        }
      }
    } catch (error) {
      console.error('Error loading wallet data:', error);
    }
  };

  const loadOffers = () => {
    const mockOffers: Offer[] = [
      {
        id: '1',
        category: 'groceries',
        title: 'Groceries',
        description: 'Earn points on grocery shopping',
        points: 50,
        icon: <ShoppingCart className="w-6 h-6" />,
        color: COLORS.primary
      },
      {
        id: '2',
        category: 'food',
        title: 'Food',
        description: 'Dining and food delivery rewards',
        points: 30,
        icon: <Coffee className="w-6 h-6" />,
        color: COLORS.secondary
      },
      {
        id: '3',
        category: 'beauty',
        title: 'Beauty',
        description: 'Beauty and personal care',
        points: 25,
        icon: <Sparkles className="w-6 h-6" />,
        color: COLORS.accent
      },
      {
        id: '4',
        category: 'fuel',
        title: 'Fuel/EV',
        description: 'Fuel and electric vehicle charging',
        points: 40,
        icon: <Fuel className="w-6 h-6" />,
        color: '#FF6B35'
      }
    ];
    setOffers(mockOffers);
  };

  const loadRecentTransactions = () => {
    const mockTransactions: Transaction[] = [
      {
        id: '1',
        type: 'reward',
        amount: '50',
        asset: 'CHAPP',
        timestamp: new Date().toISOString(),
        description: 'Grocery shopping reward',
        status: 'completed'
      },
      {
        id: '2',
        type: 'send',
        amount: '25',
        asset: 'CHAPP',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        description: 'Payment to @john_doe',
        status: 'completed'
      },
      {
        id: '3',
        type: 'receive',
        amount: '100',
        asset: 'CHAPP',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        description: 'Received from @alice_smith',
        status: 'completed'
      }
    ];
    setRecentTransactions(mockTransactions);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadWalletData();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'send': return <ArrowUpRight className="w-4 h-4" />;
      case 'receive': return <ArrowDownLeft className="w-4 h-4" />;
      case 'reward': return <Gift className="w-4 h-4" />;
      default: return <Wallet className="w-4 h-4" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'send': return '#EF4444';
      case 'receive': return COLORS.accent;
      case 'reward': return COLORS.secondary;
      default: return COLORS.neutral;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-6 text-white">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">
                {wallet.username ? `@${wallet.username}` : 'Chappi Wallet'}
              </h1>
              <p className="text-blue-100 text-sm">It's a beautiful day, today</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Points Balance Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/80 text-sm font-medium">Points Balance</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setBalanceVisible(!balanceVisible)}
                className="p-1 hover:bg-white/10 rounded transition-colors"
              >
                {balanceVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-1 hover:bg-white/10 rounded transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
              <button className="flex items-center gap-1 text-white/80 hover:text-white transition-colors">
                <span className="text-sm">History</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {balanceVisible ? `${balance} pts` : '••••• pts'}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-6">
        <div className="grid grid-cols-4 gap-3">
          <button
            onClick={onSendPayment}
            className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Send className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">Send</span>
          </button>

          <button
            onClick={onReceivePayment}
            className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <QrCode className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">Receive</span>
          </button>

          <button className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <History className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">History</span>
          </button>

          <button className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">Cards</span>
          </button>
        </div>
      </div>

      {/* Your Offers Section */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Your Offers</h2>
          </div>
          <button className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">
            View All
          </button>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {offers.map((offer) => (
            <button
              key={offer.id}
              className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${offer.color}20` }}
              >
                <div style={{ color: offer.color }}>
                  {offer.icon}
                </div>
              </div>
              <span className="text-sm font-medium text-gray-700">{offer.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Shopping List Section */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Shopping List</h2>
          </div>
          <button className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">
            View All
          </button>
        </div>

        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Today's Shopping</h3>
            <Button
              variant="primary"
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Items
            </Button>
          </div>

          <div className="space-y-3">
            {shoppingList.map((item) => (
              <div key={item.id} className="bg-white rounded-xl p-4 flex items-center gap-3">
                <div className="text-2xl">{item.image}</div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{item.name}</h4>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{item.size}</span>
                    <span>Qty - {item.quantity}</span>
                  </div>
                </div>
                <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                  + {item.points} pts
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          <button className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">
            View All
          </button>
        </div>

        <div className="space-y-3">
          {recentTransactions.map((transaction) => (
            <div key={transaction.id} className="bg-white rounded-xl p-4 flex items-center gap-3 shadow-sm border border-gray-100">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${getTransactionColor(transaction.type)}20` }}
              >
                <div style={{ color: getTransactionColor(transaction.type) }}>
                  {getTransactionIcon(transaction.type)}
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{transaction.description}</h4>
                <p className="text-sm text-gray-600">{formatTime(transaction.timestamp)}</p>
              </div>
              <div className="text-right">
                <div 
                  className="font-semibold"
                  style={{ color: getTransactionColor(transaction.type) }}
                >
                  {transaction.type === 'send' ? '-' : '+'}{transaction.amount} {transaction.asset}
                </div>
                <div className="text-xs text-gray-500 capitalize">{transaction.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex items-center justify-around">
          <button className="flex flex-col items-center gap-1 p-2 text-blue-600">
            <Wallet className="w-6 h-6" />
            <span className="text-xs font-medium">Home</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 text-gray-400">
            <Smartphone className="w-6 h-6" />
            <span className="text-xs">Locations</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 text-gray-400">
            <RefreshCw className="w-6 h-6" />
            <span className="text-xs">Redeem</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 text-gray-400">
            <CreditCard className="w-6 h-6" />
            <span className="text-xs">Card</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 text-gray-400">
            <User className="w-6 h-6" />
            <span className="text-xs">Account</span>
          </button>
        </div>
      </div>

      {/* Bottom padding to account for fixed navigation */}
      <div className="h-20"></div>
    </div>
  );
};