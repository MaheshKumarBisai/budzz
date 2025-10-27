import { createContext, useContext, useState, useEffect } from 'react';
import { settingsAPI } from '../services/api';
import { useAuth } from './AuthContext';

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [settings, setSettings] = useState({
    currency: 'USD',
    budget_limit: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const response = await settingsAPI.getSettings();
        if (response.data && response.data.data) {
          setSettings(response.data.data.settings);
        }
      } catch (error) {
        if (error.response?.status !== 401) {
          console.error('Error fetching settings:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchSettings();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const updateSettings = async (newSettings) => {
    try {
      const response = await settingsAPI.updateSettings(newSettings);
      setSettings(response.data.data.settings);
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  };

  const value = { settings, setSettings, updateSettings, loading };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
