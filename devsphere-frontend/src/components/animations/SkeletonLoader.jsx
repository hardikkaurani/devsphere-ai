import React from 'react';
import { motion } from 'framer-motion';

/**
 * Skeleton Loader Component
 * Shows animated loading placeholders while content loads
 * Production-grade with multiple variations
 */

const SkeletonLoader = ({ count = 3, height = 'h-12', className = '' }) => {
  const pulseVariants = {
    initial: { opacity: 0.6 },
    animate: {
      opacity: 1,
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: 'reverse'
      }
    }
  }

  return (
    <motion.div
      className={`space-y-4 p-4 ${className}`}
      initial="initial"
      animate="animate"
    >
      {Array.from({ length: count }).map((i) => (
        <motion.div
          key={i}
          variants={pulseVariants}
          className={`${height} bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded-2xl`}
        />
      ))}
    </motion.div>
  );
};

/**
 * ProfileCardSkeleton Component
 * Skeleton specifically for profile card loading
 */
export const ProfileCardSkeleton = () => {
  const pulseVariants = {
    initial: { opacity: 0.6 },
    animate: {
      opacity: 1,
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: 'reverse'
      }
    }
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 p-8"
    >
      {/* Avatar Section */}
      <div className="flex items-center gap-8 mb-8 pb-8 border-b border-gray-700">
        <motion.div
          variants={pulseVariants}
          className="w-24 h-24 rounded-full bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700"
        />
        <div className="flex-1 space-y-3">
          <motion.div
            variants={pulseVariants}
            className="h-8 w-1/2 rounded-lg bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700"
          />
          <motion.div
            variants={pulseVariants}
            className="h-4 w-1/3 rounded-lg bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700"
          />
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        <motion.div
          variants={pulseVariants}
          className="h-10 rounded-lg bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700"
        />
        <motion.div
          variants={pulseVariants}
          className="h-24 rounded-lg bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              variants={pulseVariants}
              className="h-10 rounded-lg bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700"
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default SkeletonLoader;
