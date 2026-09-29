import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000';

export default function AuthModal({ mode, onModeChange, onAuthenticated, onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const isChoosing = mode === 'choice';
  const isRegistering = mode === 'register';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint = isRegistering ? '/auth/register' : '/auth/login';
      const response = await axios.post(`${API_URL}${endpoint}`, { email, password });
      onAuthenticated(response.data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onMouseDown={onClose}>
      <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-950 p-7 shadow-2xl" onMouseDown={(event) => event.stopPropagation()}>
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">DuelBench account</p>
            <h2 className="text-2xl font-bold text-neutral-100">{isChoosing ? 'Unlock your battle record.' : isRegistering ? 'Keep your battles close.' : 'Welcome back.'}</h2>
            <p className="mt-2 text-sm text-neutral-500">{isChoosing ? 'Sign in or create an account to view history and leaderboard rankings.' : 'Sign in to unlock your battle history and leaderboard.'}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="text-xl text-neutral-500 hover:text-neutral-100">&times;</button>
        </div>

        {isChoosing ? (
          <div className="space-y-3">
            <button type="button" onClick={() => onModeChange('login')} className="w-full rounded-lg bg-neutral-100 px-4 py-3 font-semibold text-neutral-950 transition hover:bg-white">Sign in</button>
            <button type="button" onClick={() => onModeChange('register')} className="w-full rounded-lg border border-neutral-700 px-4 py-3 font-semibold text-neutral-200 transition hover:border-neutral-500 hover:text-white">Register</button>
          </div>
        ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm text-neutral-400">
            Email
            <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-3 text-neutral-100 outline-none transition focus:border-neutral-500" placeholder="you@example.com" />
          </label>
          <label className="block text-sm text-neutral-400">
            Password
            <input required minLength={6} type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-3 text-neutral-100 outline-none transition focus:border-neutral-500" placeholder="At least 6 characters" />
          </label>
          {error && <p className="text-sm text-red-400" role="alert">{error}</p>}
          <button disabled={loading} className="w-full rounded-lg bg-neutral-100 px-4 py-3 font-semibold text-neutral-950 transition hover:bg-white disabled:cursor-wait disabled:opacity-60">
            {loading ? 'Working...' : isRegistering ? 'Create account' : 'Log in'}
          </button>
        </form>
        )}

        {!isChoosing && <p className="mt-5 text-center text-sm text-neutral-500">
          {isRegistering ? 'Already have an account?' : 'New to DuelBench?'}{' '}
          <button type="button" onClick={() => { setError(''); onModeChange(isRegistering ? 'login' : 'register'); }} className="font-semibold text-neutral-200 hover:text-white">
            {isRegistering ? 'Log in' : 'Register'}
          </button>
        </p>}
      </div>
    </div>
  );
}
