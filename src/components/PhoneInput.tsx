import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, X } from 'lucide-react';
import { COUNTRIES, findCountriesByName } from '../lib/countries';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export default function PhoneInput({ value, onChange, placeholder = 'Enter phone number', label = 'Contact Phone' }: PhoneInputProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [selectedCountry, setSelectedCountry] = useState<any>(null);

  // Detect country from input
  useEffect(() => {
    const phoneWithoutPlus = inputValue.replace(/^\+/, '');
    const matchedCountry = COUNTRIES.find(c => phoneWithoutPlus.startsWith(c.phoneCode.replace('+', '')));
    setSelectedCountry(matchedCountry || null);
  }, [inputValue]);

  // Extract country name from input
  const extractedCountryQuery = useMemo(() => {
    const words = inputValue.split(' ').filter(word => isNaN(Number(word)) && word !== '+' && word !== '-');
    return words.slice(0, 2).join(' ');
  }, [inputValue]);

  // Generate suggestions
  const allSuggestions = useMemo(() => {
    const countrySuggestions = findCountriesByName(extractedCountryQuery);
    return countrySuggestions;
  }, [extractedCountryQuery]);

  const handleCountrySelect = (country: any) => {
    const newValue = country.phoneCode;
    setInputValue(newValue);
    onChange(newValue);
    setShowDropdown(false);
    setSelectedCountry(country);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    onChange(val);

    if (val.length > 1) {
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleClear = () => {
    setInputValue('');
    onChange('');
    setSelectedCountry(null);
    setShowDropdown(false);
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <div className="relative">
        <div className="relative flex items-center">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="tel"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => inputValue.length > 1 && setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
            placeholder={placeholder}
            className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
          {inputValue && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Selected Country Display */}
        {selectedCountry && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg"
          >
            <p className="text-sm text-blue-400">
              <span className="text-lg mr-2">{selectedCountry.flag}</span>
              {selectedCountry.name}
              <span className="ml-2 font-semibold text-blue-300">{selectedCountry.phoneCode}</span>
            </p>
          </motion.div>
        )}

        {/* Country Dropdown Suggestions */}
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full left-0 right-0 mt-2 bg-gray-900/95 backdrop-blur border border-white/10 rounded-lg shadow-xl z-[9999] max-h-64 overflow-y-auto"
          >
            {allSuggestions.length > 0 ? (
              allSuggestions.map((country, idx) => (
                <button
                  key={idx}
                  onClick={() => handleCountrySelect(country)}
                  className={`w-full text-left px-4 py-3 hover:bg-blue-500/20 transition-colors border-b border-white/5 last:border-b-0 flex items-center justify-between ${
                    selectedCountry?.code === country.code ? 'bg-blue-500/30' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{country.flag}</span>
                    <div>
                      <p className="text-white font-medium">{country.name}</p>
                      <p className="text-xs text-gray-400">{country.code}</p>
                    </div>
                  </div>
                  <span className="text-blue-400 font-semibold">{country.phoneCode}</span>
                </button>
              ))
            ) : inputValue.length > 1 ? (
              <div className="px-4 py-3 text-gray-400 text-sm">
                No matching countries found
              </div>
            ) : (
              <div className="px-4 py-3 text-gray-400 text-sm">
                Start typing to search countries...
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
