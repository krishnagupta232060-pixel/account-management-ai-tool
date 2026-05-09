import React, { useState } from 'react';
import axios from 'axios';

const API = 'https://account-management-ai-tool.onrender.com';

function AITools() {
  const [briefInput, setBriefInput] = useState('');
  const [briefResult, setBriefResult] = useState('');
  const [briefLoading, setBriefLoading] = useState(false);

  const [qbrInput, setQbrInput] = useState('');
  const [qbrResult, setQbrResult] = useState('');
  const [qbrLoading, setQbrLoading] = useState(false);

  const [processInput, setProcessInput] = useState('');
  const [processResult, setProcessResult] = useState('');
  const [processLoading, setProcessLoading] = useState(false);

  const handleBrief = async () => {
    setBriefLoading(true);
    try {
      const res = await axios.post(`${API}/api/ai/analyze`, {
        data: `Translate this client brief into structured parameters: ${briefInput}`
      });
      setBriefResult(res.data.analysis);
    } catch {
      setBriefResult('Error. Please try again.');
    }
    setBriefLoading(false);
  };

  const handleQBR = async () => {
    setQbrLoading(true);
    try {
      const res = await axios.post(`${API}/api/ai/analyze`, {
        data: `Generate a complete Quarterly Business Review (QBR) report for: ${qbrInput}`
      });
      setQbrResult(res.data.analysis);
    } catch {
      setQbrResult('Error. Please try again.');
    }
    setQbrLoading(false);
  };

  const handleProcess = async () => {
    setProcessLoading(true);
    try {
      const res = await axios.post(`${API}/api/ai/analyze`, {
        data: `Analyze this business process and identify bottlenecks, inefficiencies, and provide step-by-step optimization recommendations: ${processInput}`
      });
      setProcessResult(res.data.analysis);
    } catch {
      setProcessResult('Error. Please try again.');
    }
    setProcessLoading(false);
  };

  return (
    <div className="ai-tools-grid">

      <div className="tool-card reveal">
        <div className="tool-card-header">
          <span className="tool-tag">MODULE 01</span>
          <h3>Client Brief Translator</h3>
          <p className="tool-desc">Paste unstructured client emails or notes. AI extracts key requirements, risks, and action items into a structured brief.</p>
        </div>
        <div className="tool-card-body">
          <textarea
            rows={4}
            placeholder="Paste client email or notes here..."
            value={briefInput}
            onChange={(e) => setBriefInput(e.target.value)}
          />
          <button className="tool-btn" onClick={handleBrief} disabled={briefLoading}>
            {briefLoading ? 'Translating...' : 'Translate Brief →'}
          </button>
          {briefResult && <div className="tool-result">{briefResult}</div>}
        </div>
      </div>

      <div className="tool-card reveal">
        <div className="tool-card-header">
          <span className="tool-tag">MODULE 02</span>
          <h3>QBR Generator</h3>
          <p className="tool-desc">Enter account performance data and goals. AI generates a complete Quarterly Business Review with insights and next steps.</p>
        </div>
        <div className="tool-card-body">
          <textarea
            rows={4}
            placeholder="Enter account name, revenue, goals, challenges, KPIs..."
            value={qbrInput}
            onChange={(e) => setQbrInput(e.target.value)}
          />
          <button className="tool-btn" onClick={handleQBR} disabled={qbrLoading}>
            {qbrLoading ? 'Generating...' : 'Generate QBR →'}
          </button>
          {qbrResult && <div className="tool-result">{qbrResult}</div>}
        </div>
      </div>

      <div className="tool-card reveal">
        <div className="tool-card-header">
          <span className="tool-tag">MODULE 03</span>
          <h3>Process Optimizer</h3>
          <p className="tool-desc">Describe your current business process or workflow. AI identifies bottlenecks and provides step-by-step optimization recommendations.</p>
        </div>
        <div className="tool-card-body">
          <textarea
            rows={4}
            placeholder="Describe your current business process or workflow..."
            value={processInput}
            onChange={(e) => setProcessInput(e.target.value)}
          />
          <button className="tool-btn" onClick={handleProcess} disabled={processLoading}>
            {processLoading ? 'Optimizing...' : 'Optimize Process →'}
          </button>
          {processResult && <div className="tool-result">{processResult}</div>}
        </div>
      </div>

    </div>
  );
}

export default AITools;