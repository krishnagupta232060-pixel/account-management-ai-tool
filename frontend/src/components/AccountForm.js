import React, { useState } from 'react';
import axios from 'axios';

function AccountForm() {
  const [form, setForm] = useState({
    account_id: '',
    company_name: '',
    revenue: '',
    gross_margin: '',
    customer_score: '',
    status: 'active'
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('https://account-management-ai-tool.onrender.com/api/accounts/', form)
      .then(res => {
        setMessage('✅ Account added successfully!');
        setForm({
          account_id: '',
          company_name: '',
          revenue: '',
          gross_margin: '',
          customer_score: '',
          status: 'active'
        });
      })
      .catch(err => setMessage('❌ Error adding account.'));
  };

  return (
    <div className="account-form">
      <h2>Add New Account</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Account ID</label>
          <input name="account_id" value={form.account_id} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Company Name</label>
          <input name="company_name" value={form.company_name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Revenue ($)</label>
          <input name="revenue" type="number" value={form.revenue} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Gross Margin (%)</label>
          <input name="gross_margin" type="number" value={form.gross_margin} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Customer Score (0-10)</label>
          <input name="customer_score" type="number" value={form.customer_score} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Status</label>
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="active">Active</option>
            <option value="at-risk">At Risk</option>
            <option value="churned">Churned</option>
          </select>
        </div>
        <button type="submit" className="submit-btn">Add Account</button>
      </form>
    </div>
  );
}

export default AccountForm;
