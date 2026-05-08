import React, { useState } from 'react';
import { auth, googleProvider, githubProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';

function Login({ onLogin }) {
  const [error, setError] = useState('');

  const handleGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      onLogin(result.user);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGithub = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      onLogin(result.user);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card glass-card">
        <div className="login-logo">AMAT AI</div>
        <p className="login-tag">PRECISION ACCOUNT INTELLIGENCE</p>
        <h2>Welcome Back</h2>
        <p className="login-sub">Sign in to access your account management dashboard</p>
        {error && <p className="login-error">{error}</p>}
        <button className="login-btn google-btn" onClick={handleGoogle}>
          <span>G</span> Continue with Google
        </button>
        <button className="login-btn github-btn" onClick={handleGithub}>
          <span>⌥</span> Continue with GitHub
        </button>
        <p className="login-footer">By signing in you agree to AMAT AI terms of service</p>
      </div>
    </div>
  );
}

export default Login;