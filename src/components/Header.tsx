import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, Wallet, Building, User, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const toggleMobileMenu = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setIsMobileMenuOpen(!isMobileMenuOpen);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.user-menu') && !target.closest('.user-button')) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
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
    navigate('/user-signup');
    setIsUserMenuOpen(false);
  };

  const handleBrandLogin = () => {
    navigate('/brand-dashboard');
    setIsUserMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 shadow-lg header-glow">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-2 md:py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center logo-hover">
              <img 
                src="/Frame 4 copy.png" 
                alt="Chappi - The Future of Rewards in Africa" 
                className="h-8 md:h-10 w-auto object-contain transition-transform duration-300 hover:scale-110"
              />
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            {menuItems.map((item) => (
              <Link 
                key={item.path}
                to={item.path}
                className={`nav-link font-medium text-sm relative ${isActive(item.path) ? 'nav-link-active' : ''}`}>
                {item.label}
                <span className="nav-sparkle"></span>
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              {isAuthenticated ? (
                <div>
                  <button
                    onClick={toggleUserMenu}
                    className={`user-button flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 transform hover:scale-105 min-h-[44px] touch-manipulation ${isUserMenuOpen ? 'bg-blue-700 text-white shadow-lg' : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'}`}>
                    <User className="w-4 h-4" />
                    <span>{user?.firstName || 'Account'}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isUserMenuOpen && (
                    <div className="user-menu absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">Welcome, {user?.firstName}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 min-h-[44px] touch-manipulation">
                        <LogOut className="w-4 h-4 text-red-500" />
                        <div>
                          <div className="font-medium text-gray-900">Logout</div>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <button
                    onClick={toggleUserMenu}
                    className={`signin-button flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 transform hover:scale-105 min-h-[44px] touch-manipulation ${isUserMenuOpen ? 'bg-blue-700 text-white shadow-lg' : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'}`}>
                    <User className="w-4 h-4" />
                    Sign In
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isUserMenuOpen && (
                    <div className="signin-dropdown absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">Choose your account type</p>
                      </div>
                      <button
                        onClick={handleWalletConnect}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 min-h-[44px] touch-manipulation">
                        <div className="p-2 rounded-lg bg-green-100">
                          <Wallet className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Connect Wallet</div>
                          <div className="text-sm text-gray-500">Access your Chappi points & missions</div>
                        </div>
                      </button>
                      <button
                        onClick={() =>{
                          handleBrandLogin();
                          navigate('/brand-dashboard')
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 min-h-[44px] touch-manipulation">
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
              )}
            </div>
          </div>

          <button 
            className={`md:hidden hamburger-btn p-3 touch-manipulation rounded-lg transition-all duration-300 ${isMobileMenuOpen ? 'hamburger-open' : ''}`}
            onClick={toggleMobileMenu}
            disabled={isAnimating}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}>
            <div className="hamburger-icon">
              <span className="hamburger-line hamburger-line-1"></span>
              <span className="hamburger-line hamburger-line-2"></span>
              <span className="hamburger-line hamburger-line-3"></span>
            </div>
          </button>
        </div>

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
                  className={`mobile-menu-item ${isActive(item.path) ? 'mobile-menu-item-active' : ''} ${isMobileMenuOpen ? 'mobile-menu-item-visible' : ''}`}
                  style={{ animationDelay: isMobileMenuOpen ? item.delay : '0s', transitionDelay: isMobileMenuOpen ? item.delay : `${0.4 - index * 0.1}s` }}
                  onClick={toggleMobileMenu}>
                  <span className="mobile-menu-item-text">{item.label}</span>
                  <span className="mobile-menu-item-indicator"></span>
                  <div className="mobile-menu-item-ripple"></div>
                </Link>
              ))}
              <div className="border-t border-white/20 mt-4 pt-4">
                {isAuthenticated ? (
                  <button
                    onClick={() => { handleLogout(); toggleMobileMenu(); }}
                    className="mobile-menu-item mobile-menu-item-visible w-full text-left"
                    style={{ animationDelay: '0.5s' }}>
                    <div className="flex items-center gap-3">
                      <LogOut className="w-5 h-5" />
                      <span className="mobile-menu-item-text">Logout</span>
                    </div>
                    <div className="mobile-menu-item-ripple"></div>
                  </button>
                ) : (
                  <>
                    <div className="px-4 mb-3">
                      <p className="text-sm font-medium text-blue-800">Sign In Options</p>
                    </div>
                    <button
                      onClick={() => { handleWalletConnect(); toggleMobileMenu(); }}
                      className="mobile-menu-item mobile-menu-item-visible w-full text-left"
                      style={{ animationDelay: '0.5s' }}>
                      <div className="flex items-center gap-3">
                        <Wallet className="w-5 h-5" />
                        <span className="mobile-menu-item-text">Connect Wallet</span>
                      </div>
                      <div className="mobile-menu-item-ripple"></div>
                    </button>
                    <button
                      onClick={() => { handleBrandLogin(); toggleMobileMenu(); }}
                      className="mobile-menu-item mobile-menu-item-visible w-full text-left"
                      style={{ animationDelay: '0.6s' }}>
                      <div className="flex items-center gap-3">
                        <Building className="w-5 h-5" />
                        <span className="mobile-menu-item-text">Brand Login</span>
                      </div>
                      <div className="mobile-menu-item-ripple"></div>
                    </button>
                  </>
                )}
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
