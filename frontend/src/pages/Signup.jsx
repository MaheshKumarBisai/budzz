import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!name) newErrors.name = 'Name is required';
    if (!email) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    if (!password) newErrors.password = 'Password is required';
    if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    const { success, error } = await signup(name, email, password);
    if (success) {
      navigate('/dashboard');
    } else {
      setErrors({ form: error });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center  px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="flex flex-col items-center justify-center">
          {/* <h2 className="text-3xl font-bold text-text-primary dark:text-dark-text-primary">budzz</h2> */}
          <img src="../images/logo5.png" alt="Logo" className="w-60 h-30 mr-5" />
          <p className="mt-2 text-text-secondary dark:text-dark-text-secondary">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="bg-card dark:bg-dark-card p-8 rounded-2xl shadow-lg space-y-6">
          {errors.form && <p className="text-red-500 text-sm">{errors.form}</p>}
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2 text-text-primary dark:text-dark-text-primary">Name</label>
            <input
              id="name"
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-4 py-2 border rounded-md bg-transparent ${errors.name ? 'border-red-500' : 'border-border dark:border-dark-border'}`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2 text-text-primary dark:text-dark-text-primary">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-2 border rounded-md bg-transparent ${errors.email ? 'border-red-500' : 'border-border dark:border-dark-border'}`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2 text-text-primary dark:text-dark-text-primary">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-2 border rounded-md bg-transparent ${errors.password ? 'border-red-500' : 'border-border dark:border-dark-border'}`}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2 text-text-primary dark:text-dark-text-primary">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full px-4 py-2 border rounded-md bg-transparent ${errors.confirmPassword ? 'border-red-500' : 'border-border dark:border-dark-border'}`}
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Creating account...' : 'Sign Up'}
          </Button>

          <p className="text-center text-sm text-text-secondary dark:text-dark-text-secondary">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
