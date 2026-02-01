'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

interface ToastProps {
  isVisible: boolean;
  message: string;
  onClose: () => void;
}

export default function Toast({ isVisible, message, onClose }: ToastProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg px-6 py-4 flex items-center gap-3 z-40"
          onAnimationComplete={() => {
            if (isVisible) {
              const timeout = setTimeout(onClose, 3000);
              return () => clearTimeout(timeout);
            }
          }}
        >
          <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
          <span className="text-gray-800 font-medium">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
