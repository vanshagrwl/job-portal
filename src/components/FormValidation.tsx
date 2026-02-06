import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface FormValidationState {
  isValid?: boolean;
  isInvalid?: boolean;
  touched?: boolean;
  message?: string;
}

interface FormValidationProps {
  state: FormValidationState;
  className?: string;
}

/**
 * FormValidation Component
 * Displays inline validation feedback with icons and animations
 */
export const FormValidationFeedback: React.FC<FormValidationProps> = ({ state, className = '' }) => {
  if (!state.touched) return null;

  const isValid = state.isValid && !state.isInvalid;
  const isInvalid = state.isInvalid && !state.isValid;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex items-center gap-2 mt-1 text-sm ${className}`}
    >
      {isValid && (
        <>
          <CheckCircle className="w-4 h-4 text-emerald-500" />
          <span className="text-emerald-400">{state.message || 'Looks good!'}</span>
        </>
      )}
      {isInvalid && (
        <>
          <XCircle className="w-4 h-4 text-rose-500" />
          <span className="text-rose-400">{state.message || 'Invalid input'}</span>
        </>
      )}
      {!isValid && !isInvalid && state.message && (
        <>
          <AlertCircle className="w-4 h-4 text-amber-500" />
          <span className="text-amber-400">{state.message}</span>
        </>
      )}
    </motion.div>
  );
};

/**
 * Input wrapper with built-in validation styling
 */
interface ValidatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  validation?: FormValidationState;
  helpText?: string;
  showValidationIcon?: boolean;
}

export const ValidatedInput: React.FC<ValidatedInputProps> = ({
  label,
  validation,
  helpText,
  showValidationIcon = true,
  className = '',
  ...props
}) => {
  const isValid = validation?.isValid && !validation?.isInvalid;
  const isInvalid = validation?.isInvalid && !validation?.isValid;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-200 mb-2">
          {label}
          {props.required && <span className="text-rose-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          className={`
            w-full px-4 py-2.5 rounded-lg
            border-2 transition-all duration-300
            bg-white/5 text-white placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-gray-900/50
            ${isValid ? 'border-emerald-500/50 focus:border-emerald-500 focus:ring-emerald-500/30' : ''}
            ${isInvalid ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/30' : 'border-white/20 focus:border-blue-500'}
            ${className}
          `}
          {...props}
        />
        {showValidationIcon && isValid && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          </motion.div>
        )}
        {showValidationIcon && isInvalid && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <XCircle className="w-5 h-5 text-rose-500" />
          </motion.div>
        )}
      </div>
      {validation && <FormValidationFeedback state={validation} />}
      {helpText && !validation && (
        <p className="text-xs text-gray-500 mt-1.5">{helpText}</p>
      )}
    </div>
  );
};

/**
 * Common validation rules
 */
export const ValidationRules = {
  email: (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return {
      isValid: emailRegex.test(value),
      message: 'Please enter a valid email address',
    };
  },

  password: (value: string) => {
    if (value.length < 8) {
      return {
        isInvalid: true,
        message: 'Password must be at least 8 characters',
      };
    }
    if (!/[A-Z]/.test(value)) {
      return {
        isInvalid: true,
        message: 'Password must contain an uppercase letter',
      };
    }
    if (!/[0-9]/.test(value)) {
      return {
        isInvalid: true,
        message: 'Password must contain a number',
      };
    }
    return {
      isValid: true,
      message: 'Password is strong',
    };
  },

  phone: (value: string) => {
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
    return {
      isValid: phoneRegex.test(value),
      message: 'Please enter a valid phone number',
    };
  },

  required: (value: string) => ({
    isValid: value.trim().length > 0,
    message: 'This field is required',
  }),

  minLength: (value: string, length: number) => ({
    isValid: value.length >= length,
    message: `Must be at least ${length} characters`,
  }),

  maxLength: (value: string, length: number) => ({
    isValid: value.length <= length,
    message: `Cannot exceed ${length} characters`,
  }),

  match: (value: string, compareValue: string, fieldName: string = 'field') => ({
    isValid: value === compareValue,
    message: `${fieldName} does not match`,
  }),

  url: (value: string) => {
    try {
      new URL(value);
      return {
        isValid: true,
        message: 'Valid URL',
      };
    } catch {
      return {
        isInvalid: true,
        message: 'Please enter a valid URL',
      };
    }
  },

  number: (value: string) => ({
    isValid: !isNaN(Number(value)),
    message: 'Please enter a valid number',
  }),
};

export default FormValidationFeedback;
