import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Terminal, Code, Palette } from 'lucide-react';

const LoadingSpinner = ({ 
  size = 'md', 
  variant = 'default',
  text = '',
  fullScreen = false,
  className = '' 
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  };

  // Different spinner variants
  const SpinnerVariant = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-accent-primary rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.5, 1]
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
        );
      
      case 'pulse':
        return (
          <motion.div
            className={`bg-accent-primary rounded-full ${sizes[size]}`}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [1, 0.3, 1]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        );
      
      case 'creative':
        return (
          <div className="relative">
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Terminal className={`text-accent-primary ${sizes[size]}`} />
            </motion.div>
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: -360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Code className={`text-accent-secondary ${sizes[size]} opacity-60`} />
            </motion.div>
          </div>
        );
      
      case 'orbit':
        return (
          <div className={`relative ${sizes[size]}`}>
            <motion.div
              className="absolute top-0 left-1/2 w-1 h-1 bg-accent-primary rounded-full"
              style={{ originX: 0.5, originY: '200%' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute top-1/2 right-0 w-1 h-1 bg-accent-secondary rounded-full"
              style={{ originX: '-100%', originY: 0.5 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute bottom-0 left-1/2 w-1 h-1 bg-accent-light rounded-full"
              style={{ originX: 0.5, originY: '-100%' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </div>
        );
      
      default:
        return (
          <Loader2 className={`animate-spin text-accent-primary ${sizes[size]}`} />
        );
    }
  };

  const content = (
    <div className={`flex flex-col items-center space-y-3 ${className}`}>
      <SpinnerVariant />
      
      {text && (
        <motion.p
          className={`text-secondary font-inter ${textSizes[size]}`}
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-primary/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-secondary rounded-2xl p-8 border border-primary shadow-large">
          {content}
        </div>
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;