import React, { useState } from 'react';
import { X, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { authActions } from '../services/supabase';

const AuthOverlay = ({ isOpen, onClose, onAuthSuccess }) => {
  const [mode, setMode] = useState('login'); // 'login', 'signup', 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        const { data, error } = await authActions.signUp(email, password, displayName);
        if (error) throw error;

        if (data?.session) {
          onAuthSuccess();
          onClose();
        } else {
          setMessage("Check your email for the confirmation link!");
        }
      } else if (mode === 'login') {
        const { error } = await authActions.signIn(email, password);
        if (error) throw error;
        onAuthSuccess();
        onClose();
      } else if (mode === 'forgot') {
        const { error } = await authActions.resetPassword(email);
        if (error) throw error;
        setMessage("Password reset link sent to your email!");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="auth-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="auth-card"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          <button className="auth-close" onClick={onClose}><X size={24} /></button>

          <div className="auth-header">
            <img src="/logo.png" alt="Logo" className="auth-logo" />
            <h2>
              {mode === 'login' && 'Welcome Back'}
              {mode === 'signup' && 'Create Account'}
              {mode === 'forgot' && 'Reset Password'}
            </h2>
            <p className="auth-subtitle">
              {mode === 'login' && 'Sign in to sync your watch history'}
              {mode === 'signup' && 'Join WatchParty to start your journey'}
              {mode === 'forgot' && 'Wait, I remember it now! Sign in instead'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {mode === 'signup' && (
              <div className="input-group">
                <User className="input-icon" size={18} />
                <input
                  type="text"
                  placeholder="Display Name"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>
            )}

            <div className="input-group">
              <Mail className="input-icon" size={18} />
              <input
                type="email"
                placeholder="Email Address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {mode !== 'forgot' && (
              <div className="input-group">
                <Lock className="input-icon" size={18} />
                <input
                  type="password"
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            )}

            {error && <p className="auth-error">{error}</p>}
            {message && <p className="auth-message">{message}</p>}

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" size={20} /> : (
                <>
                  {mode === 'login' && 'Sign In'}
                  {mode === 'signup' && 'Sign Up'}
                  {mode === 'forgot' && 'Send Reset Link'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            {mode === 'login' && (
              <>
                <button onClick={() => setMode('forgot')} className="auth-link">Forgot password?</button>
                <p>New to WatchParty? <button onClick={() => setMode('signup')} className="auth-link-bold">Sign up now</button></p>
              </>
            )}
            {mode === 'signup' && (
              <p>Already have an account? <button onClick={() => setMode('login')} className="auth-link-bold">Sign in</button></p>
            )}
            {mode === 'forgot' && (
              <button onClick={() => setMode('login')} className="auth-link-bold">Back to Login</button>
            )}
          </div>
        </motion.div>

        <style>{`
          .auth-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.85);
            backdrop-filter: blur(8px);
            z-index: 2000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }

          .auth-card {
            background: #0a0a0a;
            width: 100%;
            max-width: 420px;
            max-height: 90vh;
            overflow-y: auto;
            padding: clamp(20px, 5vw, 40px);
            border-radius: 24px;
            position: relative;
            border: 1px solid rgba(255,255,255,0.05);
            box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
          }
          .auth-card::-webkit-scrollbar { width: 0px; }

          .auth-close {
            position: absolute;
            top: 20px;
            right: 20px;
            background: none;
            border: none;
            color: #666;
            cursor: pointer;
            transition: 0.3s;
            z-index: 10;
          }
          .auth-close:hover { color: white; transform: rotate(90deg); }

          .auth-header {
            text-align: center;
            margin-bottom: 30px;
          }

          .auth-logo {
            height: clamp(32px, 8vw, 48px);
            margin-bottom: 16px;
          }

          .auth-header h2 {
            font-size: clamp(1.4rem, 5vw, 1.8rem);
            font-weight: 800;
            margin-bottom: 8px;
          }

          .auth-subtitle {
            color: #888;
            font-size: clamp(0.85rem, 2vw, 0.95rem);
          }

          .auth-form {
            display: flex;
            flex-direction: column;
            gap: clamp(12px, 3vw, 16px);
          }

          .input-group {
            position: relative;
            display: flex;
            align-items: center;
          }

          .input-icon {
            position: absolute;
            left: 16px;
            color: #555;
          }

          .input-group input {
            width: 100%;
            padding: clamp(12px, 3vw, 14px) 14px 14px 48px;
            background: #141414;
            border: 1px solid #222;
            border-radius: 12px;
            color: white;
            font-size: 1rem;
            transition: 0.3s;
          }

          .input-group input:focus {
            border-color: #e50914;
            outline: none;
            background: #1a1a1a;
          }

          .auth-submit {
            background: #e50914;
            color: white;
            padding: clamp(12px, 3vw, 14px);
            border-radius: 12px;
            border: none;
            font-weight: 700;
            font-size: 1rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            transition: 0.3s;
            margin-top: 10px;
          }

          .auth-submit:hover {
            background: #ff0f1a;
            transform: translateY(-2px);
          }

          .auth-submit:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }

          .auth-error {
            color: #ff4d4d;
            font-size: 0.85rem;
            text-align: center;
          }

          .auth-message {
            color: #4ade80;
            font-size: 0.85rem;
            text-align: center;
          }

          .auth-footer {
            margin-top: clamp(20px, 5vw, 30px);
            text-align: center;
            font-size: 0.9rem;
            color: #888;
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          .auth-link {
            background: none;
            border: none;
            color: #666;
            cursor: pointer;
            transition: 0.3s;
          }
          .auth-link:hover { color: white; }

          .auth-link-bold {
            background: none;
            border: none;
            color: #e50914;
            font-weight: 700;
            cursor: pointer;
          }
          .auth-link-bold:hover { text-decoration: underline; }

          .animate-spin {
            animation: spin 1s linear infinite;
          }

          @media (max-width: 480px) {
              .auth-card { padding: 30px 20px; border-radius: 0; height: 100%; max-height: 100%; }
              .auth-overlay { padding: 0; }
          }

          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </motion.div>
    </AnimatePresence>
  );
};

export default AuthOverlay;
