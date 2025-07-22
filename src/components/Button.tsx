import React from 'react';
import { COLORS } from '../utils/constants';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  className = '',
  disabled = false,
  type = 'button'
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-4 focus:ring-opacity-50 touch-manipulation cursor-pointer';
  
  const variantClasses = {
    primary: `bg-blue-600 text-white hover:bg-blue-700 hover:shadow-xl focus:ring-blue-300 border-2 border-blue-600`,
    secondary: `text-blue-900 hover:shadow-xl focus:ring-amber-300 border-2`,
    outline: `border-2 text-white hover:text-blue-900 hover:shadow-xl focus:ring-amber-300 bg-transparent backdrop-blur-sm hover:bg-white`,
    ghost: 'text-white hover:bg-white/10 focus:ring-white/30'
  };

  // Apply colors from constants
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: COLORS.secondary,
          borderColor: COLORS.secondary,
          color: COLORS.text.primary
        };
      case 'outline':
        return {
          borderColor: COLORS.secondary,
          color: COLORS.text.light
        };
      default:
        return {
          backgroundColor: COLORS.primary,
          borderColor: COLORS.primary,
          color: COLORS.text.light
        };
    }
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm min-h-[36px]',
    md: 'px-4 md:px-6 py-3 text-sm md:text-base min-h-[44px]',
    lg: 'px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-bold min-h-[44px] md:min-h-[48px]'
  };

  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      style={getVariantStyles()}
    >
      {children}
    </button>
  );
};