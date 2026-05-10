import React from 'react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

function UserProfile({ user, onClose }) {
  const handleLogout = async () => {
    await signOut(auth);
    onClose();
    window.location.reload();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Profile</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="profile-hero">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="avatar" className="profile-avatar" />
            ) : (
              <div className="profile-avatar-placeholder">
                {user?.displayName?.[0] || 'U'}
              </div>
            )}
            <h3 className="profile-name">{user?.displayName || 'Guest User'}</h3>
            <p className="profile-email">{user?.email || 'Not signed in'}</p>
          </div>

          <div className="profile-stats">
            <div className="profile-stat">
              <h4>Member Since</h4>
              <p>{user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A'}</p>
            </div>
            <div className="profile-stat">
              <h4>Last Active</h4>
              <p>{user?.metadata?.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleDateString() : 'N/A'}</p>
            </div>
            <div className="profile-stat">
              <h4>Account Type</h4>
              <p>Free Plan</p>
            </div>
          </div>

          <div className="settings-section">
            <p className="settings-label">CONNECTED ACCOUNTS</p>
            <div className="connected-accounts">
              {user?.providerData?.map((provider, i) => (
                <div key={i} className="provider-item">
                  <span>{provider.providerId === 'google.com' ? '🔵 Google' : '⚫ GitHub'}</span>
                  <span className="provider-email">{provider.email}</span>
                </div>
              ))}
            </div>
          </div>

          {user && (
            <button className="logout-modal-btn" onClick={handleLogout}>
              Sign Out
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;