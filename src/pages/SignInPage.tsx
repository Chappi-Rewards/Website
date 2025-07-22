import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  CheckCircle,
  Zap,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';
import { COLORS } from '../utils/constants';
import { debugLog } from '../utils/debug';

export const SignInPage: React.FC = () => {
  const navigate = useNavigate();
  const { signin, sendOtp, verifyOtp, resetPassword, isLoading } = useAuth();
  const [accountType, setAccountType] = useState<'brand' | 'user'>('brand');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'signin' | 'otp' | 'reset'>('signin');
  const [attempts, setAttempts] = useState(0);
  const [otp, setOtp] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      return setError('Email is required');
    }
    if (step === 'signin' && !password) {
      return setError('Password is required');
    }

    try {
      if (step === 'signin') {
        debugLog('SignInPage', 'Signing in', { accountType, email });
        const result = await signin({ accountType, email, password, rememberMe });
        if (result.success) {
          debugLog('SignInPage', 'Signin successful', result);
          return navigate(accountType === 'brand' ? '/brand-dashboard' : '/missions');
        } else {
          setAttempts(attempts + 1);
          if (attempts + 1 >= 3) {
            setStep('otp');
            await sendOtp(email);
            return setError('Too many attempts—OTP sent to your email');
          }
          return setError(result.message || 'Invalid credentials');
        }
      }

      if (step === 'otp') {
        debugLog('SignInPage', 'Verifying OTP', { email, otp });
        const ok = await verifyOtp(email, otp);
        if (ok) {
          setStep('reset');
          return setError('OTP verified—please set a new password');
        }
        return setError('Invalid OTP, please try again');
      }

      if (step === 'reset') {
        debugLog('SignInPage', 'Resetting password', { email });
        const ok = await resetPassword(email, password);
        if (ok) {
          setStep('signin');
          setPassword('');
          setAttempts(0);
          return setError('Password reset—please sign in with your new password');
        }
        return setError('Reset failed—please try again');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'An error occurred';
      setError(msg);
      debugLog('SignInPage', 'Error', err);
    }
  };

  return (
    <div className="pt-16 md:pt-20 min-h-screen" style={{ backgroundColor: COLORS.background.light }}>
      {/* Hero */}
      <section className="py-8 md:py-12 px-4 md:px-6" style={{ backgroundColor: COLORS.primary }}>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Welcome Back to Chappi
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            {step === 'signin' && 'Sign in to access your dashboard, manage campaigns, or start earning Chapps'}
            {step === 'otp' && 'Enter the OTP sent to your email to continue'}
            {step === 'reset' && 'Set a new password to finish resetting your account'}
          </p>
        </div>
      </section>

      <div className="max-w-md mx-auto px-4 md:px-6 py-12">
        {/* Error */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 'signin' && (
              <>
                {/* Account Type */}
                <div>
                  <label htmlFor="accountType" className="block text-sm font-medium mb-2" style={{ color: COLORS.text.primary }}>
                    Account Type
                  </label>
                  <select
                    id="accountType"
                    value={accountType}
                    onChange={e => setAccountType(e.target.value as any)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="brand">Brand / Agency</option>
                    <option value="user">Consumer</option>
                  </select>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: COLORS.text.primary }}>
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium mb-2" style={{ color: COLORS.text.primary }}>
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full px-4 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="rememberMe" className="ml-2 block text-sm" style={{ color: COLORS.text.secondary }}>
                    Remember me
                  </label>
                </div>
              </>
            )}

            {step === 'otp' && (
              <div>
                <label htmlFor="otp" className="block text-sm font-medium mb-2" style={{ color: COLORS.text.primary }}>
                  One-Time Code
                </label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  required
                  placeholder="Enter the OTP"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {step === 'reset' && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2" style={{ color: COLORS.text.primary }}>
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full px-4 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" color="white" /> {step === 'signin' ? 'Signing In...' : step === 'otp' ? 'Verifying...' : 'Resetting...'}
                </>
              ) : (
                <>
                  {step === 'signin' && 'Sign In'}  
                  {step === 'otp' && 'Verify Code'}  
                  {step === 'reset' && 'Set Password'}  
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>

            {step === 'signin' && (
              <div className="flex justify-between text-sm text-blue-600">
                <Link to="/forgot-password" className="hover:underline">
                  Forgot password?
                </Link>
                <Link to={accountType === 'brand' ? '/signup-brand' : '/signup-user'} className="hover:underline">
                  Create Account
                </Link>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
 
