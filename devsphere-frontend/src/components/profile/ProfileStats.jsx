import { motion } from 'framer-motion';
import { Zap, Calendar, Target } from 'lucide-react';

/**
 * ProfileStats Component
 * Displays profile completion stats and account info
 * Production-grade analytics display
 */
function ProfileStats({ stats, profile }) {
  if (!stats) return null

  const completionColor = stats.completionPercentage >= 75 ? 'from-green-500 to-emerald-600'
    : stats.completionPercentage >= 50 ? 'from-blue-500 to-indigo-600'
    : 'from-orange-500 to-red-600'

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getCompletionMessage = (percentage) => {
    if (percentage >= 100) return "Perfect! Your profile is complete"
    if (percentage >= 75) return "Almost there! Just a few fields to go"
    if (percentage >= 50) return "Good progress! Keep filling out your profile"
    return "Get started by filling out your profile"
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Completion Card */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="text-indigo-400" size={20} />
            <h3 className="text-lg font-semibold text-white">Profile Completion</h3>
          </div>
          <span className={`text-xl font-bold bg-gradient-to-r ${completionColor} bg-clip-text text-transparent`}>
            {stats.completionPercentage}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${stats.completionPercentage}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={`h-full bg-gradient-to-r ${completionColor} rounded-full`}
          />
        </div>

        <p className="text-sm text-gray-400 mt-3">
          {getCompletionMessage(stats.completionPercentage)}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {stats.fieldsCompleted} of {stats.totalFields} fields completed
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* Joined Date */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="text-blue-400" size={16} />
            <p className="text-sm text-gray-400">Member Since</p>
          </div>
          <p className="text-white font-semibold">
            {formatDate(stats.joinedDate)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {stats.accountAgeInDays} days ago
          </p>
        </div>

        {/* Last Updated */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="text-green-400" size={16} />
            <p className="text-sm text-gray-400">Last Updated</p>
          </div>
          <p className="text-white font-semibold">
            {stats.lastUpdated ? formatDate(stats.lastUpdated) : 'Not yet'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Profile modifications tracked
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ProfileStats
