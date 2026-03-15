import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

/**
 * Glass-morphism Card Component
 * Modern frosted glass effect with gradient border
 */

const Card = ({
  children,
  className = '',
  hover = true,
  gradient = false,
  ...props
}) => {
  return (
    <motion.div
      whileHover={hover ? { y: -4 } : {}}
      className={clsx(
        'rounded-2xl backdrop-blur-xl',
        'bg-gradient-to-br from-slate-900/50 to-slate-900/20',
        'border border-slate-700/30',
        'shadow-xl shadow-black/20',
        gradient && 'bg-gradient-to-br from-blue-500/10 to-purple-500/10',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
