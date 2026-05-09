import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const API = 'https://account-management-ai-tool.onrender.com';

const CURRENCIES = {
  USD: { symbol: '$', rate: 1 },
  INR: { symbol: '₹', rate: 83.5 },
  EUR: { symbol: '€', rate: 0.92 },
  GBP: { symbol: '£', rate: 0.79 },
};

const revenueData = [
  { month: 'Jan', revenue: 42000 },
  { month: 'Feb', revenue: 48000 },
  { month: 'Mar', revenue: 45000 },
  { month: 'Apr', revenue: 53000 },
  { month: 'May', revenue: 58000 },
  { month: 'Jun', revenue: 62000 },
];

const marginData = [
  { month: 'Jan', margin: 18 },
  { month: 'Feb', margin: 22 },
  { month: 'Mar', margin: 19 },
  { month: 'Apr', margin: 25 },
  { month: 'May', margin: 28 },
  { month: 'Jun', margin: 30 },
];

const riskData = [
  { name: 'Low Risk', value: 60 },
  { name: 'Medium Risk', value: 30 },
  { name: 'High Risk', value: 10 },
];

const COLORS = ['#44ff88', '#ffaa00', '#ff4444'];

function Dashboard({ user }) {
  const [metrics, setMetrics] = useState({});
  const [accounts, setAccounts] = useState([]);
  const [currency, setCurrency] = useState('USD');

  useEffect(() => {
    axios.get(`${API}/api/accounts/`)
      .then(res => {
        setMetrics(res.data.metrics);
        setAccounts(res.data.accounts);
      })
      .catch(err => console.log(err));
  }, []);

  const convert = (amount) => {
    const num = parseFloat(amount) || 0;
    return (num * CURRENCIES[currency].rate).toLocaleString();
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: '#1a1a1a',
          border: '0.5px solid rgba(255,255,255,0.1)',
          borderRadius: '8px',
          padding: '0.75rem 1rem',
          fontSize: '0.8rem',
          color: '#ffffff'
        }}>
          <p>{label}</p>
          <p style={{ color: '#ffffff', fontWeight: 600 }}>
            {payload[0].name === 'revenue'
              ? `${CURRENCIES[currency].symbol}${convert(payload[0].value)}`
              : `${payload[0].value}%`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="dashboard">
      <div className="currency-switcher">
        {Object.keys(CURRENCIES).map(c => (
          <button
            key={c}
            className={currency === c ? 'active' : ''}
            onClick={() => setCurrency(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <h3>TOTAL REVENUE</h3>
          <p>{CURRENCIES[currency].symbol}{convert(metrics.total_revenue?.replace(/[$,]/g, '') || 0)}</p>
        </div>
        <div className="metric-card">
          <h3>TOTAL ACCOUNTS</h3>
          <p>{metrics.total_accounts || 0}</p>
        </div>
        <div className="metric-card">
          <h3>AVG MARGIN</h3>
          <p>{metrics.average_margin || 0}%</p>
        </div>
        <div className="metric-card">
          <h3>AVG SCORE</h3>
          <p>{metrics.average_customer_score || 0}</p>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>REVENUE TREND</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={revenueData}>
              <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="revenue" stroke="#ffffff" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>GROSS MARGIN %</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={marginData}>
              <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="margin" fill="rgba(255,255,255,0.15)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>RISK DISTRIBUTION</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={riskData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value">
                {riskData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#1a1a1a', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#ffffff', fontSize: '0.8rem' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="risk-legend">
            {riskData.map((entry, index) => (
              <span key={index} style={{ color: COLORS[index], fontSize: '0.75rem' }}>
                ● {entry.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="accounts-table">
        <h2>ACTIVE ACCOUNTS</h2>
        {accounts.length === 0 ? (
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.9rem' }}>No accounts yet. Add one in the Accounts tab!</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>COMPANY</th>
                <th>REVENUE</th>
                <th>MARGIN</th>
                <th>SCORE</th>
                <th>RISK</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((acc, i) => (
                <tr key={i}>
                  <td>{acc.company_name}</td>
                  <td>{CURRENCIES[currency].symbol}{convert(acc.revenue)}</td>
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