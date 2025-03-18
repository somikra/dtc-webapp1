import React, { useState } from 'react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignUp: (email: string, password: string) => Promise<void>;
  noCreditCardRequired?: boolean; // Optional prop
}

export default function AuthModal({
  isOpen,
  onClose,
  onSignIn,
  onSignUp,
  noCreditCardRequired = false,
}: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        await onSignUp(email, password);
      } else {
        await onSignIn(email, password);
      }
      onClose();
    } catch (err) {
      setError((err as Error).message || 'Authentication failed');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-4">
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </h2>
        {noCreditCardRequired && (
          <p className="text-green-400 mb-4 text-sm">
            🎉 Free for a Limited Time! No Credit Card Required! 🎉
          </p>
        )}
        {error && <p className="text-red-400 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300"
            required
          />
          <button
            type="submit"
            className="w-full px-4 py-2 bg-yellow-300 text-gray-900 font-semibold rounded-lg hover:bg-yellow-400 transition-all duration-300"
          >
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-yellow-300 hover:underline"
          >
            {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
          </button>
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-all duration-300"
        >
          Close
        </button>
      </div>
    </div>
  );
}