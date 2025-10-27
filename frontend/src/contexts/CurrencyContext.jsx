import { createContext, useContext, useState, useEffect } from 'react';
import { settingsAPI } from '../services/api';

const CurrencyContext = createContext(null);

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState('USD');

  useEffect(() => {
    const fetchCurrency = async () => {
      try {
        const response = await settingsAPI.getSettings();
        setCurrency(response.data.data.settings.currency || 'USD');
      } catch (error) {
        console.error('Error fetching currency:', error);
      }
    };

    fetchCurrency();
  }, []);

  const updateCurrency = async (newCurrency) => {
    try {
      await settingsAPI.updateSettings({ currency: newCurrency });
      setCurrency(newCurrency);
    } catch (error) {
      console.error('Error updating currency:', error);
    }
  };

  return (
    <CurrencyContext.Provider value={{ currency, updateCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within CurrencyProvider');
  }
  return context;
}
