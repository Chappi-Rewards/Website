import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Target, 
  Calendar, 
  DollarSign, 
  Users, 
  MapPin, 
  Clock, 
  Save, 
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Plus,
  X,
  Search,
  Package
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { COLORS, ICON_SIZES } from '../utils/constants';

interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  image?: string;
}

interface MissionFormData {
  missionName: string;
  missionDescription: string;
  missionPoints: number;
  missionStartDate: string;
  missionEndDate: string;
  selectedMissionProducts: Product[];
  targetAudience: string;
  targetCountries: string[];
  missionType: 'purchase' | 'review' | 'social' | 'visit';
  budget: number;
}

interface FormErrors {
  [key: string]: string;
}

export const CreateMissionPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [showProductSelector, setShowProductSelector] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const [formData, setFormData] = useState<MissionFormData>({
    missionName: '',
    missionDescription: '',
    missionPoints: 10,
    missionStartDate: '',
    missionEndDate: '',
    selectedMissionProducts: [],
    targetAudience: 'all',
    targetCountries: [],
    missionType: 'purchase',
    budget: 1000,
  });

  const availableCountries = [
    'Nigeria', 'Kenya', 'Ghana', 'South Africa', 'Egypt', 'Morocco', 
    'Tanzania', 'Uganda', 'Ethiopia', 'Ivory Coast', 'Senegal', 'Cameroon'
  ];

  const missionTypes = [
    { value: 'purchase', label: 'Product Purchase', description: 'Users purchase specific products' },
    { value: 'review', label: 'Product Review', description: 'Users review products they\'ve purchased' },
    { value: 'social', label: 'Social Sharing', description: 'Users share content on social media' },
    { value: 'visit', label: 'Store Visit', description: 'Users visit specific retail locations' }
  ];

  // Load products on component mount
  useEffect(() => {
    loadBrandProducts();
  }, []);

  // Filter products based on search term
  useEffect(() => {
    if (productSearchTerm.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(productSearchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [productSearchTerm, products]);

  const loadBrandProducts = async () => {
    setIsLoading(true);
    try {
      // Simulate API call to load brand's own products
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock brand products - in real implementation, this would fetch from API based on brand ID
      const brandProducts: Product[] = [
        { id: '1', name: 'Premium Chocolate Bar 100g', brand: 'Your Brand', category: 'Confectionery', price: 850 },
        { id: '2', name: 'Organic Green Tea 50g', brand: 'Your Brand', category: 'Beverages', price: 1200 },
        { id: '3', name: 'Natural Body Lotion 250ml', brand: 'Your Brand', category: 'Personal Care', price: 2500 },
        { id: '4', name: 'Vitamin C Tablets 30ct', brand: 'Your Brand', category: 'Health', price: 3200 },
        { id: '5', name: 'Coconut Oil 500ml', brand: 'Your Brand', category: 'Food', price: 1800 },
        { id: '6', name: 'Face Wash Gel 150ml', brand: 'Your Brand', category: 'Personal Care', price: 1500 }
      ];
      
      setProducts(brandProducts);
      setFilteredProducts(brandProducts);
    } catch (error) {
      console.error('Error loading products:', error);
      setErrors({ products: 'Failed to load your products. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCountryToggle = (country: string) => {
    setFormData(prev => ({
      ...prev,
      targetCountries: prev.targetCountries.includes(country)
        ? prev.targetCountries.filter(c => c !== country)
        : [...prev.targetCountries, country]
    }));
  };

  const handleProductSelect = (product: Product) => {
    if (!formData.selectedMissionProducts.find(p => p.id === product.id)) {
      setFormData(prev => ({
        ...prev,
        selectedMissionProducts: [...prev.selectedMissionProducts, product]
      }));
    }
    setShowProductSelector(false);
    setProductSearchTerm('');
  };

  const handleProductRemove = (productId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedMissionProducts: prev.selectedMissionProducts.filter(p => p.id !== productId)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Required field validation
    if (!formData.missionName.trim()) {
      newErrors.missionName = 'Mission name is required';
    } else if (formData.missionName.length < 3) {
      newErrors.missionName = 'Mission name must be at least 3 characters';
    }

    if (!formData.missionDescription.trim()) {
      newErrors.missionDescription = 'Mission description is required';
    } else if (formData.missionDescription.length < 10) {
      newErrors.missionDescription = 'Mission description must be at least 10 characters';
    }

    if (formData.missionPoints < 1) {
      newErrors.missionPoints = 'Mission points must be at least 1';
    } else if (formData.missionPoints > 1000) {
      newErrors.missionPoints = 'Mission points cannot exceed 1000';
    }

    if (!formData.missionStartDate) {
      newErrors.missionStartDate = 'Start date is required';
    }

    if (!formData.missionEndDate) {
      newErrors.missionEndDate = 'End date is required';
    }

    // Date validation
    if (formData.missionStartDate && formData.missionEndDate) {
      const startDate = new Date(formData.missionStartDate);
      const endDate = new Date(formData.missionEndDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (startDate < today) {
        newErrors.missionStartDate = 'Start date cannot be in the past';
      }

      if (endDate <= startDate) {
        newErrors.missionEndDate = 'End date must be after start date';
      }
    }

    if (formData.targetCountries.length === 0) {
      newErrors.targetCountries = 'At least one target country is required';
    }

    if (formData.budget < 100) {
      newErrors.budget = 'Budget must be at least ₦10,000';
    }


    // Mission type specific validation
    if (formData.missionType === 'purchase' && formData.selectedMissionProducts.length === 0) {
      newErrors.selectedMissionProducts = 'At least one product is required for purchase missions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddMission = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setSubmitStatus('error');
      setSubmitMessage('Please fix the errors above and try again.');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Simulate API call to create mission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, this would be an API call:
      // const response = await fetch('/api/missions', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      
      console.log('Mission created:', formData);
      
      setSubmitStatus('success');
      setSubmitMessage('Mission created successfully! It will be available to all users in your target countries.');
      
      // Redirect to dashboard after success
      setTimeout(() => {
        navigate('/brand-dashboard');
      }, 2000);
      
    } catch (error) {
      console.error('Error creating mission:', error);
      setSubmitStatus('error');
      setSubmitMessage('Failed to create mission. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="pt-16 md:pt-20 min-h-screen" style={{ backgroundColor: COLORS.background.light }}>
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/brand-dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Go back to dashboard"
            >
              <ArrowLeft className="w-5 h-5" style={{ color: COLORS.text.secondary }} />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold" style={{ color: COLORS.text.primary }}>
                Create New Mission
              </h1>
              <p className="text-sm md:text-base" style={{ color: COLORS.text.secondary }}>
                Design engaging missions to connect with your target audience
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
        {/* Status Messages */}
        {submitStatus === 'success' && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-green-800">{submitMessage}</p>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{submitMessage}</p>
          </div>
        )}

        <form onSubmit={handleAddMission} className="space-y-8">
          {/* Mission Basic Information */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Target className={ICON_SIZES.large} style={{ color: COLORS.primary }} />
              <h2 className="text-xl font-bold" style={{ color: COLORS.text.primary }}>
                Mission Details
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="missionName" className="block text-sm font-medium mb-2" style={{ color: COLORS.text.primary }}>
                  Mission Name *
                </label>
                <input
                  type="text"
                  id="missionName"
                  name="missionName"
                  value={formData.missionName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.missionName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter a compelling mission name"
                  aria-describedby={errors.missionName ? 'missionName-error' : undefined}
                />
                {errors.missionName && (
                  <p id="missionName-error" className="mt-1 text-sm text-red-600">{errors.missionName}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label htmlFor="missionDescription" className="block text-sm font-medium mb-2" style={{ color: COLORS.text.primary }}>
                  Mission Description *
                </label>
                <textarea
                  id="missionDescription"
                  name="missionDescription"
                  value={formData.missionDescription}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical ${
                    errors.missionDescription ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Describe what users need to do to complete this mission"
                  aria-describedby={errors.missionDescription ? 'missionDescription-error' : undefined}
                />
                {errors.missionDescription && (
                  <p id="missionDescription-error" className="mt-1 text-sm text-red-600">{errors.missionDescription}</p>
                )}
              </div>

              <div>
                <label htmlFor="missionType" className="block text-sm font-medium mb-2" style={{ color: COLORS.text.primary }}>
                  Mission Type *
                </label>
                <select
                  id="missionType"
                  name="missionType"
                  value={formData.missionType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {missionTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-sm" style={{ color: COLORS.text.secondary }}>
                  {missionTypes.find(t => t.value === formData.missionType)?.description}
                </p>
              </div>

              <div>
                <label htmlFor="missionPoints" className="block text-sm font-medium mb-2" style={{ color: COLORS.text.primary }}>
                  Reward Points *
                </label>
                <div className="relative">
                  <Gift className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    id="missionPoints"
                    name="missionPoints"
                    value={formData.missionPoints}
                    onChange={handleInputChange}
                    min="1"
                    max="1000"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.missionPoints ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="10"
                    aria-describedby={errors.missionPoints ? 'missionPoints-error' : undefined}
                  />
                </div>
                {errors.missionPoints && (
                  <p id="missionPoints-error" className="mt-1 text-sm text-red-600">{errors.missionPoints}</p>
                )}
              </div>
            </div>
          </div>

          {/* Mission Timeline */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className={ICON_SIZES.large} style={{ color: COLORS.secondary }} />
              <h2 className="text-xl font-bold" style={{ color: COLORS.text.primary }}>
                Mission Timeline
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="missionStartDate" className="block text-sm font-medium mb-2" style={{ color: COLORS.text.primary }}>
                  Start Date *
                </label>
                <input
                  type="date"
                  id="missionStartDate"
                  name="missionStartDate"
                  value={formData.missionStartDate}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.missionStartDate ? 'border-red-300' : 'border-gray-300'
                  }`}
                  aria-describedby={errors.missionStartDate ? 'missionStartDate-error' : undefined}
                />
                {errors.missionStartDate && (
                  <p id="missionStartDate-error" className="mt-1 text-sm text-red-600">{errors.missionStartDate}</p>
                )}
              </div>

              <div>
                <label htmlFor="missionEndDate" className="block text-sm font-medium mb-2" style={{ color: COLORS.text.primary }}>
                  End Date *
                </label>
                <input
                  type="date"
                  id="missionEndDate"
                  name="missionEndDate"
                  value={formData.missionEndDate}
                  onChange={handleInputChange}
                  min={formData.missionStartDate || new Date().toISOString().split('T')[0]}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.missionEndDate ? 'border-red-300' : 'border-gray-300'
                  }`}
                  aria-describedby={errors.missionEndDate ? 'missionEndDate-error' : undefined}
                />
                {errors.missionEndDate && (
                  <p id="missionEndDate-error" className="mt-1 text-sm text-red-600">{errors.missionEndDate}</p>
                )}
              </div>
            </div>
          </div>

          {/* Products Selection (for purchase missions) */}
          {formData.missionType === 'purchase' && (
            <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Package className={ICON_SIZES.large} style={{ color: COLORS.accent }} />
                <h2 className="text-xl font-bold" style={{ color: COLORS.text.primary }}>
                  Mission Products
                </h2>
              </div>

              {/* Selected Products */}
              {formData.selectedMissionProducts.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-3" style={{ color: COLORS.text.primary }}>
                    Selected Products ({formData.selectedMissionProducts.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {formData.selectedMissionProducts.map(product => (
                      <div key={product.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div>
                          <h4 className="font-medium" style={{ color: COLORS.text.primary }}>
                            {product.name}
                          </h4>
                          <p className="text-sm" style={{ color: COLORS.text.secondary }}>
                            {product.brand} • {product.category}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleProductRemove(product.id)}
                          className="p-1 hover:bg-red-100 rounded-lg transition-colors"
                          aria-label={`Remove ${product.name}`}
                        >
                          <X className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add Products Button */}
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowProductSelector(true)}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Products
              </Button>

              {errors.selectedMissionProducts && (
                <p className="mt-2 text-sm text-red-600">{errors.selectedMissionProducts}</p>
              )}
            </div>
          )}

          {/* Target Audience */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Users className={ICON_SIZES.large} style={{ color: COLORS.primary }} />
              <h2 className="text-xl font-bold" style={{ color: COLORS.text.primary }}>
                Target Audience
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="targetAudience" className="block text-sm font-medium mb-2" style={{ color: COLORS.text.primary }}>
                  Audience Segment
                </label>
                <select
                  id="targetAudience"
                  name="targetAudience"
                  value={formData.targetAudience}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Users</option>
                  <option value="new">New Users</option>
                  <option value="returning">Returning Users</option>
                  <option value="high-value">High-Value Customers</option>
                  <option value="inactive">Inactive Users</option>
                </select>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-blue-800">Open Mission</span>
                </div>
                <p className="text-sm text-blue-700">
                  This mission will be available to all users in your selected target countries. 
                  There's no limit on the number of participants - the more engagement, the better your reach!
                </p>
              </div>
            </div>

            {/* Target Countries */}
            <div className="mt-6">
              <label className="block text-sm font-medium mb-3" style={{ color: COLORS.text.primary }}>
                Target Countries *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {availableCountries.map(country => (
                  <label key={country} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.targetCountries.includes(country)}
                      onChange={() => handleCountryToggle(country)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm" style={{ color: COLORS.text.primary }}>
                      {country}
                    </span>
                  </label>
                ))}
              </div>
              {errors.targetCountries && (
                <p className="mt-2 text-sm text-red-600">{errors.targetCountries}</p>
              )}
            </div>
          </div>

          {/* Budget & Settings */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <DollarSign className={ICON_SIZES.large} style={{ color: COLORS.secondary }} />
              <h2 className="text-xl font-bold" style={{ color: COLORS.text.primary }}>
                Budget & Settings
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="budget" className="block text-sm font-medium mb-2" style={{ color: COLORS.text.primary }}>
                  Mission Budget *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    min="100"
                    step="100"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.budget ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="1000"
                  />
                </div>
                {errors.budget && (
                  <p className="mt-1 text-sm text-red-600">{errors.budget}</p>
                )}
                <p className="mt-1 text-sm" style={{ color: COLORS.text.secondary }}>
                  Estimated cost: {formatCurrency(formData.missionPoints * formData.maxParticipants * 0.1)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text.primary }}>
                  Mission Summary
                </label>
                <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: COLORS.text.secondary }}>Points per completion:</span>
                    <span style={{ color: COLORS.text.primary }}>{formData.missionPoints}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: COLORS.text.secondary }}>Participation:</span>
                    <span style={{ color: COLORS.text.primary }}>Unlimited</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: COLORS.text.secondary }}>Target countries:</span>
                    <span style={{ color: COLORS.text.primary }}>{formData.targetCountries.length}</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold pt-2 border-t border-gray-200">
                    <span style={{ color: COLORS.text.primary }}>Total budget:</span>
                    <span style={{ color: COLORS.primary }}>{formatCurrency(formData.budget)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col md:flex-row gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/brand-dashboard')}
              disabled={isSubmitting}
              className="w-full md:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="w-full md:w-auto flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" color="white" />
                  Creating Mission...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Create Mission
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Product Selector Modal */}
      {showProductSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold" style={{ color: COLORS.text.primary }}>
                  Select Products
                </h3>
                <button
                  onClick={() => setShowProductSelector(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Product Search */}
              <div className="mt-4 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={productSearchTerm}
                  onChange={(e) => setProductSearchTerm(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="p-6 max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="text-center py-8">
                  <LoadingSpinner size="lg" />
                  <p className="mt-4" style={{ color: COLORS.text.secondary }}>Loading products...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 mx-auto mb-4" style={{ color: COLORS.neutral }} />
                  <p style={{ color: COLORS.text.secondary }}>
                    {productSearchTerm ? 'No products found matching your search.' : 'No products uploaded yet. Please upload your products first.'}
                  </p>
                  {!productSearchTerm && (
                    <button className="mt-3 text-blue-600 hover:text-blue-700 font-medium">
                      Upload Products
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredProducts.map(product => (
                    <div
                      key={product.id}
                      className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors"
                      onClick={() => handleProductSelect(product)}
                    >
                      <h4 className="font-medium mb-1" style={{ color: COLORS.text.primary }}>
                        {product.name}
                      </h4>
                      <p className="text-sm mb-2" style={{ color: COLORS.text.secondary }}>
                        {product.brand} • {product.category}
                      </p>
                      <p className="text-sm font-semibold" style={{ color: COLORS.primary }}>
                        {formatCurrency(product.price)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-200">
              <p className="text-sm" style={{ color: COLORS.text.secondary }}>
                Budget will be distributed as rewards to mission participants based on completion rates
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
