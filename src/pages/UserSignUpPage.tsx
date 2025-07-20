import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Eye, 
  EyeOff, 
  CheckCircle,
  ArrowRight,
  Shield,
  Zap,
  Gift,
  Smartphone,
  AlertCircle
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { WalletConnection } from '../components/WalletConnection';
import { useAuth } from '../hooks/useAuth';
import { COLORS, ICON_SIZES } from '../utils/constants';
import { debugLog } from '../utils/debug';

interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
  subscribeNewsletter: boolean;
}

export const UserSignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup, isLoading } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState<UserFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    subscribeNewsletter: true
  });

  const totalSteps = 3;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    setError(null);
    debugLog('UserSignUpPage', 'Input changed', { name, value: newValue });
  };

  const validateStep = (step: number): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    switch (step) {
      case 1:
        if (!formData.firstName.trim()) errors.push('First name is required');
        if (!formData.lastName.trim()) errors.push('Last name is required');
        if (!formData.email.trim()) errors.push('Email is required');
        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) errors.push('Valid email is required');
        if (!formData.phone.trim()) errors.push('Phone number is required');
        break;
      case 2:
        if (!formData.country) errors.push('Country is required');
        if (!formData.password) errors.push('Password is required');
        if (formData.password.length < 6) errors.push('Password must be at least 6 characters');
        if (formData.password !== formData.confirmPassword) errors.push('Passwords do not match');
        if (!formData.agreeToTerms) errors.push('You must agree to the terms and conditions');
        break;
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const handleNext = () => {
    const validation = validateStep(currentStep);
    
    if (!validation.isValid) {
      setError(validation.errors.join(', '));
      debugLog('UserSignUpPage', 'Validation failed', validation.errors);
      return;
    }
    
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      setError(null);
      debugLog('UserSignUpPage', 'Next step', currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError(null);
      debugLog('UserSignUpPage', 'Previous step', currentStep - 1);
    }
  };

  const handleAccountCreation = async () => {
    const validation = validateStep(2);
    if (!validation.isValid) {
      setError(validation.errors.join(', '));
      return;
    }

    try {
      debugLog('UserSignUpPage', 'Creating account', formData);
      
      const result = await signup({
        ...formData,
        accountType: 'user'
      });
      
      if (result.success) {
        setSuccess(true);
        setCurrentStep(3); // Move to wallet connection step
        debugLog('UserSignUpPage', 'Account creation successful', result);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Account creation failed. Please try again.';
      setError(errorMessage);
      debugLog('UserSignUpPage', 'Account creation failed', error);
    }
  };

  const handleWalletSuccess = () => {
    debugLog('UserSignUpPage', 'Wallet connection successful');
    // Redirect to missions page
    navigate('/missions');
  };

  const handleWalletError = (error: string) => {
    setError(error);
    debugLog('UserSignUpPage', 'Wallet connection failed', error);
  };

  const countries = [
    'Nigeria', 'Kenya', 'Ghana', 'South Africa', 'Egypt', 'Morocco', 'Tanzania', 'Uganda',
    'Ethiopia', 'Ivory Coast', 'Senegal', 'Cameroon', 'Zimbabwe', 'Zambia', 'Botswana'
  ];

  return (
    <div className="pt-16 md:pt-20 min-h-screen" style={{ backgroundColor: COLORS.background.light }}>
      {/* Hero Section */}
      <section className="py-8 md:py-12 px-4 md:px-6" style={{ backgroundColor: COLORS.primary }}>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6 leading-tight">
            Start Earning Rewards
            <span className="block" style={{ color: COLORS.secondary }}>With Every Purchase</span>
          </h1>
          <p className="text-base md:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Join millions of users already earning Chapps for their everyday shopping across Africa
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          {/* Benefits Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <h3 className="text-lg md:text-xl font-bold mb-6" style={{ color: COLORS.text.primary }}>
                Why Join Chappi?
              </h3>
              
              <div className="space-y-6">
                {[
                  {
                    icon: <Gift className={ICON_SIZES.large} />,
                    title: 'Instant Rewards',
                    description: 'Earn Chapps with every purchase and redeem for airtime, goods, and more'
                  },
                  {
                    icon: <Smartphone className={ICON_SIZES.large} />,
                    title: 'Mobile-First',
                    description: 'Complete missions anywhere using just your smartphone'
                  },
                  {
                    icon: <Zap className={ICON_SIZES.large} />,
                    title: 'Quick & Easy',
                    description: 'Simple missions that fit into your daily shopping routine'
                  }
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="p-2 rounded-lg flex-shrink-0" style={{ backgroundColor: `${COLORS.accent}10` }}>
                      <div style={{ color: COLORS.accent }}>
                        {benefit.icon}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2" style={{ color: COLORS.text.primary }}>
                        {benefit.title}
                      </h4>
                      <p className="text-sm leading-relaxed" style={{ color: COLORS.text.secondary }}>
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Trust Indicators */}
              <div className="mt-8 p-4 rounded-lg" style={{ backgroundColor: `${COLORS.primary}10` }}>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5" style={{ color: COLORS.primary }} />
                  <span className="font-semibold" style={{ color: COLORS.text.primary }}>
                    2.5M+ Active Users
                  </span>
                </div>
                <p className="text-sm" style={{ color: COLORS.text.secondary }}>
                  Join millions already earning rewards across Africa
                </p>
              </div>
            </div>
          </div>

          {/* Sign Up Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6 md:p-8">
              {/* Progress Indicator */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium" style={{ color: COLORS.text.secondary }}>
                    Step {currentStep} of {totalSteps}
                  </span>
                  <span className="text-sm font-medium" style={{ color: COLORS.text.secondary }}>
                    {Math.round((currentStep / totalSteps) * 100)}% Complete
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(currentStep / totalSteps) * 100}%`,
                      backgroundColor: COLORS.accent
                    }}
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold mb-6" style={{ color: COLORS.text.primary }}>
                      Personal Information
                    </h3>
                  </div>

                  {/* Name Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium mb-2" style={{ color: COLORS.text.primary }}>
                        First Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[44px]"
                          placeholder="Enter your first name"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium mb-2" style={{ color: COLORS.text.primary }}>
                        Last Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[44px]"
                          placeholder="Enter your last name"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: COLORS.text.primary }}>
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[44px]"
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2" style={{ color: COLORS.text.primary }}>
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[44px]"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Security & Location */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold mb-6" style={{ color: COLORS.text.primary }}>
                      Security & Location
                    </h3>
                  </div>

                  {/* Country */}
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium mb-2" style={{ color: COLORS.text.primary }}>
                      Country *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <select
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none min-h-[44px]"
                      >
                        <option value="">Select your country</option>
                        {countries.map((country) => (
                          <option key={country} value={country}>
                            {country}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium mb-2" style={{ color: COLORS.text.primary }}>
                      Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[44px]"
                        placeholder="Create a strong password"
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

                  {/* Confirm Password */}
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2" style={{ color: COLORS.text.primary }}>
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[44px]"
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="space-y-4">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={handleInputChange}
                        required
                        className="mt-1 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                      <span className="text-sm" style={{ color: COLORS.text.secondary }}>
                        I agree to the{' '}
                        <Link to="/terms" className="text-green-600 hover:underline">
                          Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link to="/privacy" className="text-green-600 hover:underline">
                          Privacy Policy
                        </Link>
                      </span>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="subscribeNewsletter"
                        checked={formData.subscribeNewsletter}
                        onChange={handleInputChange}
                        className="mt-1 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                      <span className="text-sm" style={{ color: COLORS.text.secondary }}>
                        Subscribe to mission updates and reward notifications
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Step 3: Wallet Connection */}
              {currentStep === 3 && (
                <div>
                  <WalletConnection 
                    onSuccess={handleWalletSuccess}
                    onError={handleWalletError}
                  />
                </div>
              )}

              {/* Navigation Buttons */}
              {currentStep < 3 && (
                <div className="flex flex-col md:flex-row justify-between gap-4 mt-8 pt-6 border-t border-gray-200">
                  <div>
                    {currentStep > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handlePrevious}
                        className="w-full md:w-auto"
                        disabled={isLoading}
                      >
                        Previous
                      </Button>
                    )}
                  </div>

                  <div className="flex gap-3">
                    {currentStep < 2 ? (
                      <Button
                        type="button"
                        variant="primary"
                        onClick={handleNext}
                        className="w-full md:w-auto flex items-center gap-2"
                        disabled={isLoading}
                      >
                        Next Step
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="primary"
                        onClick={handleAccountCreation}
                        className="w-full md:w-auto flex items-center gap-2"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <LoadingSpinner size="sm" color="white" />
                            Creating Account...
                          </>
                        ) : (
                          <>
                            Create Account
                            <CheckCircle className="w-4 h-4" />
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Sign In Link */}
              <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                <p className="text-sm" style={{ color: COLORS.text.secondary }}>
                  Already have an account?{' '}
                  <Link to="/signin" className="font-medium text-green-600 hover:underline">
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};