import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { success, error } = await login(email, password);
    if (success) {
      navigate('/dashboard');
    } else {
      setErrors({ form: error });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background dark:bg-dark-background px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-text-primary dark:text-dark-text-primary">budzz</h2>
          <p className="mt-2 text-text-secondary dark:text-dark-text-secondary">Welcome back!</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card dark:bg-dark-card p-8 rounded-lg shadow-md space-y-6">
          {errors.form && <p className="text-red-500 text-sm">{errors.form}</p>}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2 text-text-primary dark:text-dark-text-primary">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md bg-transparent border-border dark:border-dark-border"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2 text-text-primary dark:text-dark-text-primary">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md bg-transparent border-border dark:border-dark-border"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-md hover:bg-opacity-90 transition-colors"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="text-center text-sm text-text-secondary dark:text-dark-text-secondary">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
