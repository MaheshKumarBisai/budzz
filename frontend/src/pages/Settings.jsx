import { useState, useEffect } from 'react';
import { userAPI } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';
import { useSettings } from '../contexts/SettingsContext';
import toast from 'react-hot-toast';
import Button from '../components/Button';

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { settings, updateSettings } = useSettings();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await userAPI.getProfile();
        const user = response.data.data.user;
        setName(user.name);
        setEmail(user.email);
      } catch (error) {
        toast.error('Failed to load profile');
      }
    };

    fetchProfile();
  }, []);

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
      await updateSettings({
        ...settings,
        budget_limit: parseFloat(settings.budget_limit) || 0,
      });
      toast.success('Settings updated');
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-text-primary dark:text-dark-text-primary">Settings</h1>

      {/* Profile Settings */}
      <div className="bg-card dark:bg-dark-card p-8 rounded-2xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-text-primary dark:text-dark-text-primary">Profile</h2>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-text-primary dark:text-dark-text-primary">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-md bg-transparent border-border dark:border-dark-border"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-text-primary dark:text-dark-text-primary">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md bg-transparent border-border dark:border-dark-border"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-text-primary dark:text-dark-text-primary">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md bg-transparent border-border dark:border-dark-border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-text-primary dark:text-dark-text-primary">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md bg-transparent border-border dark:border-dark-border"
            />
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Profile'}
          </Button>
        </form>
      </div>

      {/* App Settings */}
      <div className="bg-card dark:bg-dark-card p-8 rounded-2xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-text-primary dark:text-dark-text-primary">Preferences</h2>
        <form onSubmit={handleUpdateSettings} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-text-primary dark:text-dark-text-primary">Currency</label>
            <select
              value={settings.currency}
              onChange={(e) => updateSettings({ ...settings, currency: e.target.value })}
              className="w-full px-4 py-2 border rounded-md bg-transparent border-border dark:border-dark-border"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="INR">INR (₹)</option>
              <option value="JPY">JPY (¥)</option>
            </select>
          </div>

          {/* <div>
            <label className="block text-sm font-medium mb-2 text-text-primary dark:text-dark-text-primary">
              Monthly Budget Limit
            </label>
            <input
              type="number"
              // step=""
              value={settings.budget_limit}
              onChange={(e) => updateSettings({ ...settings, budget_limit: e.target.value })}
              className="w-full px-4 py-2 border rounded-md bg-transparent border-border dark:border-dark-border"
              placeholder="0.00"
            />
            <p className="text-xs text-gray-500 mt-1">
              Set to 0 to disable budget alerts
            </p>
          </div> */}

          <Button type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Settings'}
          </Button>
        </form>
      </div>
    </div>
  );
}
