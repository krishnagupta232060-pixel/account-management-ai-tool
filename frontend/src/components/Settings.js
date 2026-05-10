import React, { useState } from 'react';

function Settings({ user, onClose }) {
  const [currency, setCurrency] = useState('USD');
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('English');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem('amat_currency', currency);
    localStorage.setItem('amat_notifications', notifications);
    localStorage.setItem('amat_language', language);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Settings</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="settings-section">
            <p className="settings-label">DEFAULT CURRENCY</p>
            <div className="settings-options">
              {['USD', 'INR', 'EUR', 'GBP'].map(c => (
                <button
                  key={c}
                  className={currency === c ? 'active' : ''}
                  onClick={() => setCurrency(c)}
                >{c}</button>
              ))}
            </div>
          </div>

          <div className="settings-section">
            <p className="settings-label">LANGUAGE</p>
            <select value={language} onChange={e => setLanguage(e.target.value)} className="settings-select">
              <option>English</option>
              <option>Hindi</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>

          <div className="settings-section">
            <p className="settings-label">NOTIFICATIONS</p>
            <div className="settings-toggle">
              <span>Email notifications</span>
              <button
                className={`toggle-btn ${notifications ? 'on' : 'off'}`}
                onClick={() => setNotifications(!notifications)}
              >
                {notifications ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          <div className="settings-section">
            <p className="settings-label">ABOUT</p>
            <div className="settings-info">
              <p>AMAT AI v1.0.0</p>
              <p>Built by Krishna Gupta</p>
              <p>© 2026 All rights reserved</p>
            </div>
          </div>

          <button className="save-btn" onClick={handleSave}>
            {saved ? '✓ Saved!' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
