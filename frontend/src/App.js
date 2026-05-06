import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import AccountForm from './components/AccountForm';
import AIAnalysis from './components/AIAnalysis';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="App">
      <nav className="navbar">
        <h1>🏢 Account Management AI</h1>
        <div className="nav-links">
          <button onClick={() => setActiveTab('dashboard')} className={activeTab === 'dashboard' ? 'active' : ''}>Dashboard</button>
          <button onClick={() => setActiveTab('accounts')} className={activeTab === 'accounts' ? 'active' : ''}>Accounts</button>
          <button onClick={() => setActiveTab('ai')} className={activeTab === 'ai' ? 'active' : ''}>AI Analysis</button>
        </div>
      </nav>
      <main className="main-content">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'accounts' && <AccountForm />}
        {activeTab === 'ai' && <AIAnalysis />}
      </main>
    </div>
  );
}

export default App;