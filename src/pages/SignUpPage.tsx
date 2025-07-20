import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  MapPin, 
  Eye, 
  EyeOff, 
  CheckCircle,
  ArrowRight,
  Shield,
  Zap,
  Users,
  AlertCircle
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';
import { COLORS, ICON_SIZES } from '../utils/constants';
import { debugLog, validateFormData } from '../utils/debug';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  country: string;
  password: string;
  confirmPassword: string;
  accountType: 'brand' | 'agency';
  agreeToTerms: boolean;
  subscribeNewsletter: boolean;
}

export const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup, isLoading } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    country: '',
    password: '',
    confirmPassword: '',
    accountType: 'brand',
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
    debugLog('SignUpPage', 'Input changed', { name, value: newValue });
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
        if (!formData.company.trim()) errors.push('Company name is required');
        if (!formData.position.trim()) errors.push('Position is required');
        if (!formData.country) errors.push('Country is required');
        break;
      case 3:
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
      debugLog('SignUpPage', 'Validation failed', validation.errors);
      return;
    }
    
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      setError(null);
      debugLog('SignUpPage', 'Next step', currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError(null);
      debugLog('SignUpPage', 'Previous step', currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateStep(currentStep);
    if (!validation.isValid) {
      setError(validation.errors.join(', '));
      return;
    }

    try {
      debugLog('SignUpPage', 'Submitting form', formData);
      
      const result = await signup({
        ...formData,
        accountType: 'brand'
      });
      
      if (result.success) {
        setSuccess(true);
        debugLog('SignUpPage', 'Signup successful', result);
        
        // Redirect to dashboard after short delay
        setTimeout(() => {
          navigate('/brand-dashboard');
        }, 2000);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Signup failed. Please try again.';
      setError(errorMessage);
      debugLog('SignUpPage', 'Signup failed', error);
    }
  };

  const countries = [
    'Nigeria', 'Kenya', 'Ghana', 'South Africa', 'Egypt', 'Morocco', 'Tanzania', 'Uganda',
    'Ethiopia', 'Ivory Coast', 'Senegal', 'Cameroon', 'Zimbabwe', 'Zambia', 'Botswana'
  ];

  if (success) {
    return (
      <div className="pt-16 md:pt-20 min-h-screen flex items-center justify-center" style={{ backgroundColor: COLORS.background.light }}>
        <div className="max-w-md mx-auto text-center p-8">
          <CheckCircle className="w-16 h-16 mx-auto mb-6" style={{ color: COLORS.accent }} />
          <h2 className="text-2xl font-bold mb-4" style={{ color: COLORS.text.primary }}>
            Account Created Successfully!
          </h2>
          <p className="text-lg mb-6" style={{ color: COLORS.text.secondary }}>
            Redirecting you to your dashboard...
          </p>
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 md:pt-20 min-h-screen" style={{ backgroundColor: COLORS.background.light }}>
      {/* Hero Section */}
      <section className="py-8 md:py-12 px-4 md:px-6" style={{ backgroundColor: COLORS.primary }}>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6 leading-tight">
            Join Africa's Leading
            <span className="block" style={{ color: COLORS.secondary }}>Campaign Platform</span>
          </h1>
          <p className="text-base md:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Connect with millions of consumers across Africa and create campaigns that drive real results
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          {/* Benefits Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <h3 className="text-lg md:text-xl font-bold mb-6" style={{ color: COLORS.text.primary }}>
                Why Choose Chappi?
              </h3>
              
              <div className="space-y-6">
                {[
                  {
                    icon: <Users className={ICON_SIZES.large} />,
                    title: 'Massive Reach',
                    description: 'Access to 2.5M+ active users across 54 African countries'
                  },
                  {
                    icon: <Zap className={ICON_SIZES.large} />,
                    title: 'Real-Time Results',
                    description: 'Track campaign performance and optimize in real-time'
                  },
                  {
                    icon: <Shield className={ICON_SIZES.large} />,
                    title: 'Fraud Protection',
                    description: 'Advanced verification systems ensure authentic engagement'
                  }
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="p-2 rounded-lg flex-shrink-0" style={{ backgroundColor: `${COLORS.primary}10` }}>
                      <div style={{ color: COLORS.primary }}>
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
              <div className="mt-8 p-4 rounded-lg" style={{ backgroundColor: `${COLORS.accent}10` }}>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5" style={{ color: COLORS.accent }} />
                  <span className="font-semibold" style={{ color: COLORS.text.primary }}>
                    Trusted by 150+ Brands
                  </span>
                </div>
                <p className="text-sm" style={{ color: COLORS.text.secondary }}>
                  Join leading brands already using Chappi to reach African consumers
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
                      backgroundColor: COLORS.primary
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

              <form onSubmit={handleSubmit}>
                {/* Step 1: Account Type & Basic Info */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold mb-6" style={{ color: COLORS.text.primary }}>
                        Account Information
                      </h3>
                    </div>

                    {/* Account Type */}
                    <div>
                      <label className="block text-sm font-medium mb-3" style={{ color: COLORS.text.primary }}>
                        Account Type *
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className={`
                          p-4 border-2 rounded-lg cursor-pointer transition-all duration-300
                          ${formData.accountType === 'brand' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
                        `}>
                          <input
                            type="radio"
                            name="accountType"
                            value="brand"
                            checked={formData.accountType === 'brand'}
                            onChange={handleInputChange}
                            className="sr-only"
                          />
                          <div className="flex items-center gap-3">
                            <Building className="w-5 h-5" style={{ color: COLORS.primary }} />
                            <div>
                              <div className="font-semibold" style={{ color: COLORS.text.primary }}>Brand</div>
                              <div className="text-sm" style={{ color: COLORS.text.secondary }}>Direct brand campaigns</div>
                            </div>
                          </div>
                        </label>

                        <label className={`
                          p-4 border-2 rounded-lg cursor-pointer transition-all duration-300
                          ${formData.accountType === 'agency' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
                        `}>
                          <input
                            type="radio"
                            name="accountType"
                            value="agency"
                            checked={formData.accountType === 'agency'}
                            onChange={handleInputChange}
                            className="sr-only"
                          />
                          <div className="flex items-center gap-3">
                            <Users className="w-5 h-5" style={{ color: COLORS.primary }} />
                            <div>
                              <div className="font-semibold" style={{ color: COLORS.text.primary }}>Agency</div>
                              <div className="text-sm" style={{ color: COLORS.text.secondary }}>Manage multiple brands</div>
                            </div>
                          </div>
                        </label>
                      </div>
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
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
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
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
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
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
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
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Company Information */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold mb-6" style={{ color: COLORS.text.primary }}>
                        Company Information
                      </h3>
                    </div>

                    {/* Company Name */}
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium mb-2" style={{ color: COLORS.text.primary }}>
                        Company Name *
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
                          placeholder="Enter your company name"
                        />
                      </div>
                    </div>

                    {/* Position */}
                    <div>
                      <label htmlFor="position" className="block text-sm font-medium mb-2" style={{ color: COLORS.text.primary }}>
                        Your Position *
                      </label>
                      <input
                        type="text"
                        id="position"
                        name="position"
                        value={formData.position}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
                        placeholder="e.g., Marketing Manager, CMO, etc."
                      />
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
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none min-h-[44px]"
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
                  </div>
                )}

                {/* Step 3: Security & Preferences */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold mb-6" style={{ color: COLORS.text.primary }}>
                        Security & Preferences
                      </h3>
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
                          className="w-full px-4 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
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
                          className="w-full px-4 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
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
                          className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm" style={{ color: COLORS.text.secondary }}>
                          I agree to the{' '}
                          <Link to="/terms" className="text-blue-600 hover:underline">
                            Terms of Service
                          </Link>{' '}
                          and{' '}
                          <Link to="/privacy" className="text-blue-600 hover:underline">
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
                          className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm" style={{ color: COLORS.text.secondary }}>
                          Subscribe to our newsletter for campaign tips and platform updates
                        </span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
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
                    {currentStep < totalSteps ? (
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
                        type="submit"
                        variant="primary"
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
              </form>

              {/* Sign In Link */}
              <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                <p className="text-sm" style={{ color: COLORS.text.secondary }}>
                  Already have an account?{' '}
                  <Link to="/signin" className="font-medium text-blue-600 hover:underline">
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