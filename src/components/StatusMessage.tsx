'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';
import { clsx } from 'clsx';
import { Button } from '@/components/ui/button';

interface StatusMessageProps {
  type: 'success' | 'error' | 'warning';
  message: string;
  onClose?: () => void;
  className?: string;
}

const statusConfig = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    iconColor: 'text-green-500',
    textColor: 'text-green-800',
    closeButtonColor: 'text-green-500 hover:text-green-700'
  },
  error: {
    icon: XCircle,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    iconColor: 'text-red-500',
    textColor: 'text-red-800',
    closeButtonColor: 'text-red-500 hover:text-red-700'
  },
  warning: {
    icon: AlertCircle,
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    iconColor: 'text-yellow-500',
    textColor: 'text-yellow-800',
    closeButtonColor: 'text-yellow-500 hover:text-yellow-700'
  }
};

export function StatusMessage({ type, message, onClose, className }: StatusMessageProps) {
  const config = statusConfig[type];
  const Icon = config.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className={clsx(
          'relative p-4 rounded-lg border',
          config.bgColor,
          config.borderColor,
          className
        )}
      >
        <div className="flex items-start gap-3">
          <motion.div
            initial={{ rotate: -180 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Icon className={clsx('w-5 h-5 flex-shrink-0', config.iconColor)} />
          </motion.div>
          
          <div className="flex-1">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className={clsx('text-sm font-medium', config.textColor)}
            >
              {message}
            </motion.p>
          </div>

          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className={clsx(
                'h-auto p-1 -mt-1 -mr-1',
                config.closeButtonColor
              )}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

interface SuccessMessageProps {
  show: boolean;
  onClose?: () => void;
  className?: string;
}

export function SuccessMessage({ show, onClose, className }: SuccessMessageProps) {
  if (!show) return null;

  return (
    <StatusMessage
      type="success"
      message="¡Registro exitoso! Serás redirigido al login en unos segundos..."
      onClose={onClose}
      className={className}
    />
  );
}

interface ErrorMessageProps {
  error: string;
  onClose?: () => void;
  className?: string;
}

export function ErrorMessage({ error, onClose, className }: ErrorMessageProps) {
  if (!error) return null;

  return (
    <StatusMessage
      type="error"
      message={error}
      onClose={onClose}
      className={className}
    />
  );
}