import React from 'react';
import { motion } from 'framer-motion';

/**
 * Typing Indicator Component
 * Shows that the AI assistant is thinking/typing
 */

const TypingIndicator = () => {
  const dotVariants = {
    initial: { y: 0 },
    animate: { 
      y: [-8, 0, -8],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex gap-1.5 p-3"
    >
      <motion.div
        variants={dotVariants}
        initial="initial"
        animate="animate"
        transition={{ delay: 0 }}
        className="w-2.5 h-2.5 bg-blue-400 rounded-full"
      />
      <motion.div
        variants={dotVariants}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.1 }}
        className="w-2.5 h-2.5 bg-blue-400 rounded-full"
      />
      <motion.div
        variants={dotVariants}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.2 }}
        className="w-2.5 h-2.5 bg-blue-400 rounded-full"
      />
    </motion.div>
  );
};

export default TypingIndicator;
