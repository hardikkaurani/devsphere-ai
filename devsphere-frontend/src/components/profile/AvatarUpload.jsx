import { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Upload } from 'lucide-react';

/**
 * AvatarUpload Component
 * Handles avatar display and upload with initials fallback
 * Production-grade with proper error handling
 */
function AvatarUpload({
  avatar,
  name,
  isEditing,
  onAvatarChange,
  isLoading = false,
  size = 'lg' // 'sm', 'md', 'lg'
}) {
  const [previewError, setPreviewError] = useState(false)

  const sizeClasses = {
    sm: 'w-12 h-12 text-xs',
    md: 'w-20 h-20 text-sm',
    lg: 'w-24 h-24 text-lg'
  }

  const getInitials = (fullName) => {
    if (!fullName) return 'U'
    return fullName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handleImageError = () => {
    setPreviewError(true)
  }

  const handleImageLoad = () => {
    setPreviewError(false)
  }

  const initials = getInitials(name)

  return (
    <div className="relative inline-block">
      {/* Avatar Container */}
      <motion.div
        whileHover={isEditing ? { scale: 1.05 } : {}}
        className={`${sizeClasses[size]} rounded-full border-2 border-indigo-500 
                     flex items-center justify-center overflow-hidden 
                     bg-gradient-to-br from-indigo-500 to-purple-600 
                     relative group transition-all duration-300
                     ${isEditing ? 'cursor-pointer' : ''}`}
      >
        {avatar && !previewError ? (
          <img
            src={avatar}
            alt={name}
            className="w-full h-full object-cover"
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        ) : (
          <span className="font-bold text-white">
            {initials}
          </span>
        )}

        {/* Edit Overlay */}
        {isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <Upload size={size === 'sm' ? 16 : size === 'md' ? 20 : 24} className="text-white" />
          </motion.div>
        )}
      </motion.div>

      {/* Edit Button */}
      {isEditing && (
        <label
          className={`absolute -bottom-1 -right-1 ${size === 'sm' ? 'w-5 h-5' : 'w-6 h-6'} 
                       bg-indigo-600 hover:bg-indigo-700 text-white rounded-full 
                       flex items-center justify-center cursor-pointer transition-colors duration-200
                       shadow-lg`}
        >
          <Edit2 size={size === 'sm' ? 12 : 14} />
          <input
            type="file"
            accept="image/*"
            onChange={onAvatarChange}
            className="hidden"
            disabled={isLoading}
          />
        </label>
      )}

      {/* Loading Indicator */}
      {isLoading && (
        <div className={`absolute inset-0 rounded-full border-2 border-transparent border-t-indigo-500 animate-spin`} />
      )}
    </div>
  )
}

export default AvatarUpload
