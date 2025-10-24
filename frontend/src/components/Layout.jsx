import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Home, DollarSign, BarChart3, Settings, LogOut } from 'lucide-react';

export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/transactions', icon: DollarSign, label: 'Transactions' },
    { path: '/reports', icon: BarChart3, label: 'Reports' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-background-card flex flex-col">
        <div className="p-4 border-b border-border-color">
          <h1 className="text-2xl font-bold text-text-primary">budzz</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary text-background-card'
                    : 'text-text-secondary hover:bg-gray-700'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border-color">
          <div className="flex items-center space-x-4">
            <img src="https://i.pravatar.cc/40" alt="User Avatar" className="w-10 h-10 rounded-full" />
            <div>
              <p className="font-semibold text-text-primary">{user?.name}</p>
              <p className="text-sm text-text-secondary">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full mt-4 flex items-center justify-center space-x-2 px-4 py-2 text-red-500 border border-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
