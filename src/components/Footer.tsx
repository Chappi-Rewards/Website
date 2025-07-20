import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Linkedin, MessageCircle, Mail } from 'lucide-react';
import { COLORS, ICON_SIZES } from '../utils/constants';

export const Footer: React.FC = () => {
  return (
    <footer className="relative overflow-hidden px-4 md:px-6" style={{ backgroundColor: COLORS.background.dark }}>
      <div className="max-w-7xl mx-auto pt-8 md:pt-16 pb-6 md:pb-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand Section with Logo */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4 md:mb-6">
              <img 
                src="/Frame 3.png" 
                alt="Chappi - The Future of Rewards in Africa" 
                className="h-8 md:h-10 w-auto object-contain"
                style={{ filter: 'brightness(0) invert(1)' }} // Makes the logo white for dark background
              />
            </div>
            
            <p className="text-gray-300 text-base md:text-lg mb-6 md:mb-8 max-w-md leading-relaxed">
              Connecting millions of consumers, retailers, and brands in Africa's vibrant network of everyday commerce.
            </p>

            {/* Newsletter */}
            <div className="space-y-3 md:space-y-4">
              <h3 className="text-white font-semibold text-base md:text-lg">Stay Updated</h3>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 md:px-4 py-3 bg-slate-800 text-white rounded-lg border border-slate-700 focus:outline-none focus:border-yellow-400 text-sm md:text-base min-h-[44px]"
                />
                <button className="px-4 md:px-6 py-3 rounded-lg font-semibold transition-colors min-h-[44px] touch-manipulation" style={{ backgroundColor: COLORS.secondary, color: COLORS.text.primary }}>
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 md:mb-6 text-base md:text-lg">Quick Links</h3>
            <ul className="space-y-2 md:space-y-3">
              <li>
                <Link 
                  to="/about"
                  className="text-gray-300 transition-colors hover:text-yellow-400 text-sm md:text-base min-h-[44px] py-2 block touch-manipulation"
                >
                  About
                </Link>
              </li>
              <li>
                <Link 
                  to="/missions"
                  className="text-gray-300 transition-colors hover:text-yellow-400 text-sm md:text-base min-h-[44px] py-2 block touch-manipulation"
                >
                  Missions
                </Link>
              </li>
              <li>
                <Link 
                  to="/brands"
                  className="text-gray-300 transition-colors hover:text-yellow-400 text-sm md:text-base min-h-[44px] py-2 block touch-manipulation"
                >
                  Brands
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact"
                  className="text-gray-300 transition-colors hover:text-yellow-400 text-sm md:text-base min-h-[44px] py-2 block touch-manipulation"
                >
                  Contact
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 transition-colors hover:text-yellow-400 text-sm md:text-base min-h-[44px] py-2 block touch-manipulation">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Social & Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 md:mb-6 text-base md:text-lg">Connect</h3>
            
            {/* Social Icons */}
            <div className="flex flex-wrap gap-3 md:gap-4 mb-6 md:mb-8">
              {[
                { Icon: Instagram, href: '#' },
                { Icon: Twitter, href: '#' },
                { Icon: Linkedin, href: '#' },
                { Icon: MessageCircle, href: '#' }
              ].map(({ Icon, href }, index) => (
                <a
                  key={index}
                  href={href}
                  className="w-10 h-10 md:w-12 md:h-12 bg-slate-800 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110 touch-manipulation"
                  style={{ color: COLORS.secondary }}
                >
                  <Icon className={`w-5 h-5 md:${ICON_SIZES.inline}`} />
                </a>
              ))}
            </div>

            {/* Contact Info */}
            <div className="space-y-2 md:space-y-3">
              <div className="flex items-center space-x-3 text-gray-300">
                <Mail className={`w-4 h-4 md:${ICON_SIZES.inline} flex-shrink-0`} />
                <span className="text-sm md:text-base">hello@chappi.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <MessageCircle className={`w-4 h-4 md:${ICON_SIZES.inline} flex-shrink-0`} />
                <span className="text-sm md:text-base">WhatsApp Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-8 md:mt-12 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-xs md:text-sm text-center md:text-left">
            © 2024 Chappi. All rights reserved. Empowering African commerce.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
            <a href="#" className="text-gray-400 hover:text-white text-xs md:text-sm transition-colors text-center min-h-[44px] py-2 touch-manipulation">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-xs md:text-sm transition-colors text-center min-h-[44px] py-2 touch-manipulation">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};