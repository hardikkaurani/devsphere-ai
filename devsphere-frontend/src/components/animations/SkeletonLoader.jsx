import React from 'react';
import { motion } from 'framer-motion';

/**
 * Skeleton Loader Component
 * Shows animated loading placeholders while content loads
 */

const SkeletonLoader = () => {
  return (
    <div className="space-y-4 p-4">
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="h-12 bg-slate-700/30 rounded-2xl"
        />
      ))}
    </div>
  );
};

export default SkeletonLoader;
