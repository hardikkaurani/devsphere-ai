import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertCircle, Info, X } from 'lucide-react';
import { useEffect, useState } from 'react';

/**
 * Toast Component
 * Displays temporary notifications
 * Production-grade with auto-dismiss and animations
 */
function Toast({
  message,
  type = 'info', // 'success', 'error', 'info', 'warning'
  duration = 4000,
  onClose
}) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onClose && onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const typeConfig = {
    success: {
      icon: Check,
      bg: 'from-green-500/20 to-emerald-500/20',
      border: 'border-green-500/30',
      text: 'text-green-400',
      iconBg: 'bg-green-500/20'
    },
    error: {
      icon: AlertCircle,
      bg: 'from-red-500/20 to-rose-500/20',
      border: 'border-red-500/30',
      text: 'text-red-400',
      iconBg: 'bg-red-500/20'
    },
    info: {
      icon: Info,
      bg: 'from-blue-500/20 to-indigo-500/20',
      border: 'border-blue-500/30',
      text: 'text-blue-400',
      iconBg: 'bg-blue-500/20'
    },
    warning: {
      icon: AlertCircle,
      bg: 'from-orange-500/20 to-amber-500/20',
      border: 'border-orange-500/30',
      text: 'text-orange-400',
      iconBg: 'bg-orange-500/20'
    }
  }

  const config = typeConfig[type] || typeConfig.info
  const IconComponent = config.icon

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${config.border} 
                       bg-gradient-to-r ${config.bg} backdrop-blur-sm shadow-lg`}
        >
          <div className={`p-1.5 rounded-full ${config.iconBg}`}>
            <IconComponent size={18} className={config.text} />
          </div>
          <span className={`${config.text} text-sm font-medium flex-1`}>
            {message}
          </span>
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={16} className={config.text} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/**
 * ToastContainer Component
 * Container for managing multiple toasts
 */
export function ToastContainer({ toasts = [] }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={toast.onClose}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

/**
 * useToast Hook
 * Custom hook for managing toast notifications
 */
export function useToast() {
  const [toasts, setToasts] = useState([])

  const addToast = (message, type = 'info', duration = 4000) => {
    const id = Date.now()
    const toast = { id, message, type, duration }

    setToasts((prev) => [...prev, toast])

    return id
  }

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  const success = (message, duration) =>
    addToast(message, 'success', duration)

  const error = (message, duration) =>
    addToast(message, 'error', duration)

  const info = (message, duration) =>
    addToast(message, 'info', duration)

  const warning = (message, duration) =>
    addToast(message, 'warning', duration)

  return {
    toasts: toasts.map((t) => ({
      ...t,
      onClose: () => removeToast(t.id)
    })),
    addToast,
    removeToast,
    success,
    error,
    info,
    warning
  }
}

export default Toast
