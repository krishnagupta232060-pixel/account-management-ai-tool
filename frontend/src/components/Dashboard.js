import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
  const [metrics, setMetrics] = useState({});
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/api/accounts/')
      .then(res => {
        setMetrics(res.data.metrics);
        setAccounts(res.data.accounts);
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="dashboard">
      <h2>Dashboard Overview</h2>
      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Total Revenue</h3>
          <p>{metrics.total_revenue || '$0.00'}</p>
        </div>
        <div className="metric-card">
          <h3>Total Accounts</h3>
          <p>{metrics.total_accounts || 0}</p>
        </div>
        <div className="metric-card">
          <h3>Avg Gross Margin</h3>
          <p>{metrics.average_margin || 0}%</p>
        </div>
        <div className="metric-card">
          <h3>Avg Customer Score</h3>
          <p>{metrics.average_customer_score || 0}</p>
        </div>
      </div>
      <div className="accounts-table">
        <h2>Active Accounts</h2>
        {accounts.length === 0 ? (
          <p>No accounts yet. Add one in the Accounts tab!</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Company</th>
                <th>Revenue</th>
                <th>Margin</th>
                <th>Score</th>
                <th>Risk</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((acc, i) => (
                <tr key={i}>
                  <td>{acc.company_name}</td>
                  <td>${acc.revenue}</td>
                  <td>{acc.gross_margin}%</td>
                  <td>{acc.customer_score}</td>
                  <td className={`risk-${acc.risk_level}`}>{acc.risk_level}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Dashboard;