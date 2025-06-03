import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled = false, 
  icon: Icon, 
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  onClick,
  ...props 
}) => {
  const variants = {
    primary: 'btn-accent text-primary font-semibold',
    secondary: 'bg-surface border-2 border-secondary text-secondary hover:border-accent hover:text-accent',
    outline: 'bg-transparent border-2 border-accent text-accent hover:bg-accent hover:text-primary',
    ghost: 'bg-transparent text-secondary hover:bg-hover-overlay hover:text-accent',
    danger: 'bg-red-500 hover:bg-red-600 text-white font-semibold',
    success: 'bg-green-500 hover:bg-green-600 text-white font-semibold'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  };

  const baseClasses = [
    'inline-flex items-center justify-center',
    'rounded-xl',
    'font-inter font-medium',
    'transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-primary',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'relative overflow-hidden',
    fullWidth ? 'w-full' : '',
    variants[variant],
    sizes[size],
    className
  ].filter(Boolean).join(' ');

  const content = (
    <>
      {loading && (
        <Loader2 className="w-4 h-4 animate-spin mr-2" />
      )}
      
      {Icon && !loading && iconPosition === 'left' && (
        <Icon className="w-4 h-4 mr-2" />
      )}
      
      <span>{children}</span>
      
      {Icon && !loading && iconPosition === 'right' && (
        <Icon className="w-4 h-4 ml-2" />
      )}
    </>
  );

  return (
    <motion.button
      className={baseClasses}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ 
        scale: disabled || loading ? 1 : 1.02,
        y: disabled || loading ? 0 : -1 
      }}
      whileTap={{ 
        scale: disabled || loading ? 1 : 0.98 
      }}
      {...props}
    >
      {content}
      
      {/* Ripple effect overlay */}
      <motion.div
        className="absolute inset-0 bg-white/20 rounded-xl"
        initial={{ scale: 0, opacity: 0 }}
        whileTap={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.1 }}
      />
    </motion.button>
  );
};

export default Button;