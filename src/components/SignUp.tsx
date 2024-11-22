import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useThemeContext } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import { Circle } from 'lucide-react';

export function SignUp({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signUp } = useAuth();
  const { theme } = useThemeContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      await signUp(email, password);
    } catch {
      setError('Failed to create an account');
    }
  };

  return (
    <div className="min-h-screen w-full flex">
      <div className="hidden md:flex md:w-1/2 bg-black p-12 flex-col justify-center relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <motion.div 
            className="absolute w-96 h-96"
            animate={{ 
              rotate: 360,
              scale: [1, 1.2, 1],
            }}
            transition={{ 
              duration: 15,
              repeat: Infinity,
              ease: "linear" 
            }}
          >
            <Circle className="w-full h-full text-white" />
          </motion.div>
        </div>

        <div className="relative z-10">
          <h1 className="text-white text-4xl font-bold mb-6">
            track<br />your habit.
          </h1>
          <p className="text-gray-400 text-lg">
            Build better habits, one day at a time.
          </p>
        </div>
      </div>

      <div className={`w-full md:w-1/2 flex items-center justify-center p-6 md:p-24 relative ${theme.background}`}>
        <div className="absolute top-0 left-0 w-full p-6 md:hidden">
          <h1 className="text-3xl font-bold mb-2">track your habit.</h1>
          <p className={`text-gray-600 dark:text-gray-400`}>
            Build better habits, one day at a time.
          </p>
        </div>

        <div className="absolute inset-0 md:hidden overflow-hidden">
          <motion.div 
            className="absolute top-[-30%] right-[-20%] w-[80%] h-[80%] opacity-[0.07]"
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{ 
              duration: 12,
              repeat: Infinity,
              ease: "linear" 
            }}
          >
            <Circle className="w-full h-full" />
          </motion.div>
          <motion.div 
            className="absolute bottom-[-40%] left-[-30%] w-[90%] h-[90%] opacity-[0.05]"
            animate={{ 
              rotate: -360,
              scale: [1, 1.2, 1],
            }}
            transition={{ 
              duration: 15,
              repeat: Infinity,
              ease: "linear" 
            }}
          >
            <Circle className="w-full h-full" />
          </motion.div>
        </div>

        <div className="w-full max-w-md relative mt-24 md:mt-0">
          <div className={`w-full p-6 md:p-8 rounded-2xl backdrop-blur-sm ${theme.cardBackground} relative z-10 
            border border-gray-100 dark:border-gray-800 shadow-xl`}>
            <h2 className={`text-2xl font-bold mb-6 ${theme.text} md:block hidden`}>Sign Up</h2>
            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 text-red-500 px-4 py-2 rounded-lg mb-4">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className={`w-full px-4 py-3 rounded-xl ${theme.input} transition-all duration-200 
                    focus:ring-2 focus:ring-black dark:focus:ring-white border-gray-200 dark:border-gray-700`}
                  required
                />
              </div>
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className={`w-full px-4 py-3 rounded-xl ${theme.input} transition-all duration-200 
                    focus:ring-2 focus:ring-black dark:focus:ring-white border-gray-200 dark:border-gray-700`}
                  required
                />
              </div>
              <button
                type="submit"
                className={`w-full py-3 rounded-xl bg-black text-white hover:bg-gray-800 
                  transition-all duration-200 shadow-lg hover:shadow-xl`}
              >
                Create Account
              </button>
            </form>
            <p className={`mt-6 text-center ${theme.text}`}>
              Already have an account?{' '}
              <button
                onClick={onSwitchToLogin}
                className="text-black dark:text-white hover:underline font-medium"
              >
                Log In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 