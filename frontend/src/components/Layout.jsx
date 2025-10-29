import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Home, DollarSign, BarChart3, Settings, LogOut } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import Avatar from './Avatar';
import Button from './Button';

export default function Layout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/transactions', icon: DollarSign, label: 'Transactions' },
    { path: '/reports', icon: BarChart3, label: 'Reports' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen flex bg-background dark:bg-dark-background">
      {/* Sidebar */}
      <aside className="w-64 bg-card dark:bg-dark-card flex flex-col shadow-lg">
        <div className="p-4 border-b border-border dark:border-dark-border">
          <Link to="/dashboard">
            <h1 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary">budzz</h1>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-text-secondary dark:text-dark-text-secondary hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border dark:border-dark-border">
          <div className="flex items-center space-x-4">
            <Avatar name={user?.name} />
            <div>
              <p className="font-semibold text-text-primary dark:text-dark-text-primary">{user?.name}</p>
              <p className="text-sm text-text-secondary dark:text-dark-text-secondary">{user?.email}</p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="accent"
            className="w-full mt-4 flex items-center justify-center space-x-2"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </Button>
          <Button
            onClick={toggleTheme}
            variant="secondary"
            className="w-full mt-4 flex items-center justify-center space-x-2"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
