import React, { useState } from 'react';
import { auth, googleProvider, githubProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';

function Login({ onLogin, onSkip }) {
  const [error, setError] = useState('');

  const handleGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      onLogin(result.user);
    } catch (err) {
      setError('Google sign-in failed. Please try again.');
    }
  };

  const handleGithub = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      onLogin(result.user);
    } catch (err) {
      setError('GitHub sign-in failed. Please try again.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card glass-card">
        <div className="login-logo">AMAT AI</div>
        <p className="login-tag">PRECISION ACCOUNT INTELLIGENCE</p>
        <h2>Welcome Back</h2>
        <p className="login-sub">Sign in to save your data and access full features</p>
        {error && <p className="login-error">{error}</p>}
        <button className="login-btn google-btn" onClick={handleGoogle}>
          <span>G</span> Continue with Google
        </button>
        <button className="login-btn github-btn" onClick={handleGithub}>
          <span>⌥</span> Continue with GitHub
        </button>
        <div className="login-divider">or</div>
        <button className="login-btn skip-btn" onClick={onSkip}>
          Continue without signing in →
        </button>
      </div>
    </div>
  );
}

export default Login;