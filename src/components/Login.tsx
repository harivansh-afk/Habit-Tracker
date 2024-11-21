import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useThemeContext } from '../contexts/ThemeContext';

export function Login({ onSwitchToSignUp }: { onSwitchToSignUp: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signIn } = useAuth();
  const { theme } = useThemeContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      await signIn(email, password);
    } catch (error) {
      setError('Failed to sign in');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className={`max-w-md w-full p-6 rounded-lg shadow-lg ${theme.cardBackground}`}>
        <h2 className={`text-2xl font-bold mb-6 ${theme.text}`}>Log In</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className={`w-full px-4 py-2 rounded-lg ${theme.input}`}
              required
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className={`w-full px-4 py-2 rounded-lg ${theme.input}`}
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full py-2 rounded-lg ${theme.button.primary}`}
          >
            Log In
          </button>
        </form>
        <p className={`mt-4 text-center ${theme.text}`}>
          Don't have an account?{' '}
          <button
            onClick={onSwitchToSignUp}
            className="text-blue-500 hover:underline"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
} 