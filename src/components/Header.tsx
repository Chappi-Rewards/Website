import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Wallet, Building, User } from 'lucide-react';

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSignInDropdownOpen, setIsSignInDropdownOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const toggleMobileMenu = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setIsMobileMenuOpen(!isMobileMenuOpen);
      
      // Reset animation state after transition completes
      setTimeout(() => {
        setIsAnimating(false);
      }, 500);
    }
  };

  const toggleSignInDropdown = () => {
    setIsSignInDropdownOpen(!isSignInDropdownOpen);
  };

  // Close dropdowns when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSignInDropdownOpen(false);
  }, [location.pathname]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.signin-dropdown') && !target.closest('.signin-button')) {
        setIsSignInDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const menuItems = [
    { path: '/about', label: 'About', delay: '0.1s' },
    { path: '/missions', label: 'Missions', delay: '0.2s' },
    { path: '/brands', label: 'Brands', delay: '0.3s' },
    { path: '/contact', label: 'Contact', delay: '0.4s' }
  ];

  const handleWalletConnect = () => {
    // Navigate to user sign-up page with wallet connection
    window.location.href = '/user-signup';
    setIsSignInDropdownOpen(false);
  };

  const handleBrandLogin = () => {
    // Navigate to brand dashboard or login
    window.location.href = '/brand-dashboard';
    setIsSignInDropdownOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 shadow-lg header-glow">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-2 md:py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center logo-hover">
              <img 
                src="/Frame 4 copy.png" 
                alt="Chappi - The Future of Rewards in Africa" 
                className="h-8 md:h-10 w-auto object-contain transition-transform duration-300 hover:scale-110"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {menuItems.map((item) => (
              <Link 
                key={item.path}
                to={item.path}
                className={`nav-link font-medium text-sm relative ${
                  isActive(item.path) 
                    ? 'nav-link-active' 
                    : ''
                }`}
              >
                {item.label}
                <span className="nav-sparkle"></span>
              </Link>
            ))}
          </nav>

          {/* Desktop Sign In Button */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={toggleSignInDropdown}
                className={`
                  signin-button flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm
                  transition-all duration-300 transform hover:scale-105 min-h-[44px] touch-manipulation
                  ${isSignInDropdownOpen 
                    ? 'bg-blue-700 text-white shadow-lg' 
                    : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
                  }
                `}
                aria-expanded={isSignInDropdownOpen}
                aria-haspopup="true"
              >
                <User className="w-4 h-4" />
                Sign In
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
                  isSignInDropdownOpen ? 'rotate-180' : ''
                }`} />
              </button>

              {/* Dropdown Menu */}
              {isSignInDropdownOpen && (
                <div className="signin-dropdown absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">Choose your account type</p>
                  </div>
                  
                  <button
                    onClick={handleWalletConnect}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 min-h-[44px] touch-manipulation"
                  >
                    <div className="p-2 rounded-lg bg-green-100">
                      <Wallet className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Connect Wallet</div>
                      <div className="text-sm text-gray-500">Access your Chappi points & missions</div>
                    </div>
                  </button>

                  <button
                    onClick={handleBrandLogin}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 min-h-[44px] touch-manipulation"
                  >
                    <div className="p-2 rounded-lg bg-blue-100">
                      <Building className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Brand Login</div>
                      <div className="text-sm text-gray-500">Access your campaign dashboard</div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Hamburger Button */}
          <button 
            className={`md:hidden hamburger-btn p-3 touch-manipulation rounded-lg transition-all duration-300 ${
              isMobileMenuOpen ? 'hamburger-open' : ''
            }`}
            onClick={toggleMobileMenu}
            disabled={isAnimating}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            <div className="hamburger-icon">
              <span className="hamburger-line hamburger-line-1"></span>
              <span className="hamburger-line hamburger-line-2"></span>
              <span className="hamburger-line hamburger-line-3"></span>
            </div>
          </button>
        </div>

        {/* Mobile Navigation Overlay */}
        <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
          <div className="mobile-menu-backdrop" onClick={toggleMobileMenu}></div>
          
          <nav className={`mobile-menu-content ${isMobileMenuOpen ? 'mobile-menu-content-open' : ''}`}>
            <div className="mobile-menu-header">
              <h2 className="mobile-menu-title">Navigation</h2>
              <div className="mobile-menu-decoration"></div>
            </div>
            
            <div className="mobile-menu-items">
              {menuItems.map((item, index) => (
                <Link 
                  key={item.path}
                  to={item.path}
                  className={`mobile-menu-item ${
                    isActive(item.path) ? 'mobile-menu-item-active' : ''
                  } ${isMobileMenuOpen ? 'mobile-menu-item-visible' : ''}`}
                  style={{ 
                    animationDelay: isMobileMenuOpen ? item.delay : '0s',
                    transitionDelay: isMobileMenuOpen ? item.delay : `${0.4 - index * 0.1}s`
                  }}
                  onClick={toggleMobileMenu}
                >
                  <span className="mobile-menu-item-text">{item.label}</span>
                  <span className="mobile-menu-item-indicator"></span>
                  <div className="mobile-menu-item-ripple"></div>
                </Link>
              ))}

              {/* Mobile Sign In Options */}
              <div className="border-t border-white/20 mt-4 pt-4">
                <div className="px-4 mb-3">
                  <p className="text-sm font-medium text-blue-800">Sign In Options</p>
                </div>
                
                <button
                  onClick={() => {
                    handleWalletConnect();
                    toggleMobileMenu();
                  }}
                  className="mobile-menu-item mobile-menu-item-visible w-full text-left"
                  style={{ animationDelay: '0.5s' }}
                >
                  <div className="flex items-center gap-3">
                    <Wallet className="w-5 h-5" />
                    <span className="mobile-menu-item-text">Connect Wallet</span>
                  </div>
                  <div className="mobile-menu-item-ripple"></div>
                </button>

                <button
                  onClick={() => {
                    handleBrandLogin();
                    toggleMobileMenu();
                  }}
                  className="mobile-menu-item mobile-menu-item-visible w-full text-left"
                  style={{ animationDelay: '0.6s' }}
                >
                  <div className="flex items-center gap-3">
                    <Building className="w-5 h-5" />
                    <span className="mobile-menu-item-text">Brand Login</span>
                  </div>
                  <div className="mobile-menu-item-ripple"></div>
                </button>
              </div>
            </div>
            
            <div className="mobile-menu-footer">
              <div className="mobile-menu-social">
                <div className="social-icon"></div>
                <div className="social-icon"></div>
                <div className="social-icon"></div>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};