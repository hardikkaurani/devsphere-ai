import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

/**
 * Modern Button Component
 * Supports multiple variants and sizes with smooth animations
 */

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  icon: Icon,
  ...props
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-lg shadow-blue-500/30',
    secondary: 'bg-slate-700/50 text-white border border-slate-600/50 hover:bg-slate-600/50 hover:border-slate-500/50',
    outline: 'border-2 border-slate-500 text-slate-200 hover:border-slate-400 hover:text-white',
    ghost: 'text-slate-300 hover:text-white hover:bg-slate-700/30'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={clsx(
        'relative font-medium rounded-lg transition-all duration-200',
        'backdrop-blur-sm',
        'flex items-center gap-2 justify-center',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
        />
      ) : (
        Icon && <Icon className="w-4 h-4" />
      )}
      <span>{children}</span>
    </motion.button>
  );
};

export default Button;
