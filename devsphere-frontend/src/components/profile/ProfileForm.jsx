import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Globe, Building2, Briefcase } from 'lucide-react';

/**
 * ProfileForm Component
 * Editable form for profile information
 * Production-grade with proper validation feedback
 */
function ProfileForm({
  formData,
  isEditing,
  onInputChange,
  errors = {}
}) {

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    onInputChange({
      target: {
        name,
        value
      }
    })
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Email Section - Not Editable */}
      <motion.div variants={itemVariants}>
        <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
          <Mail size={16} />
          Email Address
        </label>
        <div className="px-4 py-3 bg-gray-700/50 text-gray-400 rounded-lg border border-gray-600 text-sm">
          {formData.email}
        </div>
        <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
      </motion.div>

      {/* Name - Primary Field */}
      <motion.div variants={itemVariants}>
        <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
          <User size={16} />
          Full Name
          <span className="text-red-400">*</span>
        </label>
        {isEditing ? (
          <motion.div whileFocus={{ scale: 1.01 }}>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className={`w-full px-4 py-3 bg-gray-700 text-white rounded-lg border-2 transition-all duration-200
                          focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30
                          ${errors.name ? 'border-red-500' : 'border-gray-600'}`}
            />
          </motion.div>
        ) : (
          <p className="text-gray-300 font-medium">{formData.name || '—'}</p>
        )}
        {errors.name && (
          <p className="text-red-400 text-xs mt-1">{errors.name}</p>
        )}
      </motion.div>

      {/* Bio Section */}
      <motion.div variants={itemVariants}>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Bio
          {isEditing && formData.bio && (
            <span className="text-gray-500 text-xs ml-2">
              {formData.bio.length}/500
            </span>
          )}
        </label>
        {isEditing ? (
          <motion.div whileFocus={{ scale: 1.01 }}>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself..."
              maxLength={500}
              rows={3}
              className={`w-full px-4 py-3 bg-gray-700 text-white rounded-lg border-2 transition-all duration-200
                          focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30
                          resize-none ${errors.bio ? 'border-red-500' : 'border-gray-600'}`}
            />
          </motion.div>
        ) : (
          <p className="text-gray-300">{formData.bio || '—'}</p>
        )}
        {errors.bio && (
          <p className="text-red-400 text-xs mt-1">{errors.bio}</p>
        )}
      </motion.div>

      {/* Two Column Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
            <Phone size={16} />
            Phone
          </label>
          {isEditing ? (
            <motion.div whileFocus={{ scale: 1.01 }}>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 123-4567"
                className={`w-full px-4 py-3 bg-gray-700 text-white rounded-lg border-2 transition-all duration-200
                            focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30
                            ${errors.phone ? 'border-red-500' : 'border-gray-600'}`}
              />
            </motion.div>
          ) : (
            <p className="text-gray-300">{formData.phone || '—'}</p>
          )}
          {errors.phone && (
            <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
          )}
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
            <MapPin size={16} />
            Location
          </label>
          {isEditing ? (
            <motion.div whileFocus={{ scale: 1.01 }}>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="City, Country"
                className={`w-full px-4 py-3 bg-gray-700 text-white rounded-lg border-2 transition-all duration-200
                            focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30
                            ${errors.location ? 'border-red-500' : 'border-gray-600'}`}
              />
            </motion.div>
          ) : (
            <p className="text-gray-300">{formData.location || '—'}</p>
          )}
          {errors.location && (
            <p className="text-red-400 text-xs mt-1">{errors.location}</p>
          )}
        </div>

        {/* Website */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
            <Globe size={16} />
            Website
          </label>
          {isEditing ? (
            <motion.div whileFocus={{ scale: 1.01 }}>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://example.com"
                className={`w-full px-4 py-3 bg-gray-700 text-white rounded-lg border-2 transition-all duration-200
                            focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30
                            ${errors.website ? 'border-red-500' : 'border-gray-600'}`}
              />
            </motion.div>
          ) : (
            <p className="text-gray-300">
              {formData.website ? (
                <a
                  href={formData.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  {formData.website}
                </a>
              ) : (
                '—'
              )}
            </p>
          )}
          {errors.website && (
            <p className="text-red-400 text-xs mt-1">{errors.website}</p>
          )}
        </div>

        {/* Company */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
            <Building2 size={16} />
            Company
          </label>
          {isEditing ? (
            <motion.div whileFocus={{ scale: 1.01 }}>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Company Name"
                className={`w-full px-4 py-3 bg-gray-700 text-white rounded-lg border-2 transition-all duration-200
                            focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30
                            ${errors.company ? 'border-red-500' : 'border-gray-600'}`}
              />
            </motion.div>
          ) : (
            <p className="text-gray-300">{formData.company || '—'}</p>
          )}
          {errors.company && (
            <p className="text-red-400 text-xs mt-1">{errors.company}</p>
          )}
        </div>

        {/* Job Title */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
            <Briefcase size={16} />
            Job Title
          </label>
          {isEditing ? (
            <motion.div whileFocus={{ scale: 1.01 }}>
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                placeholder="Your job title"
                className={`w-full px-4 py-3 bg-gray-700 text-white rounded-lg border-2 transition-all duration-200
                            focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30
                            ${errors.jobTitle ? 'border-red-500' : 'border-gray-600'}`}
              />
            </motion.div>
          ) : (
            <p className="text-gray-300">{formData.jobTitle || '—'}</p>
          )}
          {errors.jobTitle && (
            <p className="text-red-400 text-xs mt-1">{errors.jobTitle}</p>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ProfileForm
