import { useState, useEffect } from 'react';
import { userAPI, settingsAPI } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';
import { useCurrency } from '../contexts/CurrencyContext';
import toast from 'react-hot-toast';

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { currency, updateCurrency } = useCurrency();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [budgetLimit, setBudgetLimit] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profileRes, settingsRes] = await Promise.all([
        userAPI.getProfile(),
        settingsAPI.getSettings(),
      ]);

      const user = profileRes.data.data.user;
      const settings = settingsRes.data.data.settings;

      setName(user.name);
      setEmail(user.email);
      updateCurrency(settings.currency || 'USD');
      setBudgetLimit(settings.budget_limit || '');
    } catch (error) {
      toast.error('Failed to load settings');
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await userAPI.updateProfile({ name, email, current_password: currentPassword, new_password: newPassword });
      toast.success('Profile updated');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await settingsAPI.updateSettings({
        currency,
        budget_limit: parseFloat(budgetLimit) || 0,
        theme,
      });
      updateCurrency(currency);
      toast.success('Settings updated');
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      {/* Profile Settings */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Profile</h2>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input border border-gray-600"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input border border-gray-600"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="input border border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="input border border-gray-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>

      {/* App Settings */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Preferences</h2>
        <form onSubmit={handleUpdateSettings} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Currency</label>
            <select
              value={currency}
              onChange={(e) => updateCurrency(e.target.value)}
              className="input border border-gray-600"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="INR">INR (₹)</option>
              <option value="JPY">JPY (¥)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Monthly Budget Limit
            </label>
            <input
              type="number"
              step="0.01"
              value={budgetLimit}
              onChange={(e) => setBudgetLimit(e.target.value)}
              className="input border border-gray-600"
              placeholder="0.00"
            />
            <p className="text-xs text-gray-500 mt-1">
              Set to 0 to disable budget alerts
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Theme</label>
            <button
              type="button"
              onClick={toggleTheme}
              className="btn-secondary"
            >
              Current: {theme === 'light' ? 'Light' : 'Dark'} Mode (Click to toggle)
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Updating...' : 'Update Settings'}
          </button>
        </form>
      </div>
    </div>
  );
}
