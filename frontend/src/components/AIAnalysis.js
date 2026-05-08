import React, { useState } from 'react';
import axios from 'axios';

function AIAnalysis() {
  const [accountData, setAccountData] = useState('');
  const [accountId, setAccountId] = useState('');
  const [issueType, setIssueType] = useState('revenue');
  const [analysis, setAnalysis] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAnalyze = () => {
    setLoading(true);
    axios.post('https://account-management-ai-tool.onrender.com/api/ai/analyze', { data: accountData })
      .then(res => {
        setAnalysis(res.data.analysis);
        setLoading(false);
      })
      .catch(err => {
        setAnalysis('Error getting analysis.');
        setLoading(false);
      });
  };

  const handleRecommend = () => {
    setLoading(true);
    axios.post('https://account-management-ai-tool.onrender.com/api/ai/recommend', {
      account_id: accountId,
      issue_type: issueType
    })
      .then(res => {
        setRecommendations(res.data.recommendations);
        setLoading(false);
      })
      .catch(err => {
        setRecommendations('Error getting recommendations.');
        setLoading(false);
      });
  };

  return (
    <div className="ai-analysis">
      <h2>AI Analysis</h2>

      <div className="analysis-section">
        <h3>Analyze Account Data</h3>
        <textarea
          placeholder="Paste account data here (e.g. revenue trends, customer feedback, issues...)"
          value={accountData}
          onChange={(e) => setAccountData(e.target.value)}
          rows={5}
        />
        <button onClick={handleAnalyze} disabled={loading} className="submit-btn">
          {loading ? 'Analyzing...' : 'Get AI Analysis'}
        </button>
        {analysis && (
          <div className="result-box">
            <h4>Analysis Result:</h4>
            <p>{analysis}</p>
          </div>
        )}
      </div>

      <div className="analysis-section">
        <h3>Get Recommendations</h3>
        <input
          placeholder="Account ID"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
        />
        <select value={issueType} onChange={(e) => setIssueType(e.target.value)}>
          <option value="revenue">Revenue Protection</option>
          <option value="margin">Gross Margin</option>
          <option value="customer">Customer Experience</option>
          <option value="process">Process Optimization</option>
        </select>
        <button onClick={handleRecommend} disabled={loading} className="submit-btn">
          {loading ? 'Loading...' : 'Get Recommendations'}
        </button>
        {recommendations && (
          <div className="result-box">
            <h4>Recommendations:</h4>
            <p>{recommendations}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AIAnalysis;