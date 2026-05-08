import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import AITools from './components/AITools';

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const homeRef = useRef(null);
  const dashboardRef = useRef(null);
  const toolsRef = useRef(null);
  const aboutRef = useRef(null);
  const helpRef = useRef(null);
  const contactRef = useRef(null);

  const scrollTo = (ref) => {
    ref.current.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-logo">AMAT AI</div>
        <div className="nav-links">
          <button onClick={() => scrollTo(homeRef)}>Home</button>
          <button onClick={() => scrollTo(dashboardRef)}>Dashboard</button>
          <button onClick={() => scrollTo(toolsRef)}>AI Tools</button>
          <button onClick={() => scrollTo(aboutRef)}>About</button>
          <button onClick={() => scrollTo(helpRef)}>Help</button>
          <button onClick={() => scrollTo(contactRef)}>Contact</button>
        </div>
      </nav>

      <section ref={homeRef} className="hero-section">
        <div className="hero-content reveal">
          <p className="hero-tag">PRECISION ACCOUNT INTELLIGENCE</p>
          <h1 className="hero-title">AMAT AI</h1>
          <p className="hero-sub">Enterprise-grade AI instrumentation for client brief translation, automated QBRs, and structural process optimization.</p>
          <button className="hero-btn" onClick={() => scrollTo(toolsRef)}>Launch AI Tools →</button>
        </div>
        <div className="hero-grid"></div>
      </section>

      <section ref={dashboardRef} className="section">
        <div className="section-header reveal">
          <p className="section-tag">LIVE TELEMETRY</p>
          <h2>System Dashboard</h2>
        </div>
        <Dashboard />
      </section>

      <section ref={toolsRef} className="section dark-section">
        <div className="section-header reveal">
          <p className="section-tag">AI INSTRUMENTS</p>
          <h2>Cognitive Tools</h2>
        </div>
        <AITools />
      </section>

      <section ref={aboutRef} className="section">
        <div className="about-content reveal">
          <p className="section-tag">ABOUT</p>
          <h2>Krishna Gupta</h2>
          <p className="about-text">AMAT AI is a precision-engineered account management intelligence platform built to handle enterprise-level client operations, financial analysis, and process optimization using cutting-edge AI.</p>
          <div className="about-stats">
            <div className="stat-item">
              <h3>3</h3>
              <p>AI Modules</p>
            </div>
            <div className="stat-item">
              <h3>100%</h3>
              <p>AI Powered</p>
            </div>
            <div className="stat-item">
              <h3>∞</h3>
              <p>Scalable</p>
            </div>
          </div>
        </div>
      </section>

      <section ref={helpRef} className="section dark-section">
        <div className="help-content reveal">
          <p className="section-tag">HELP</p>
          <h2>How to Use AMAT AI</h2>
          <div className="help-grid">
            <div className="help-card glass-card">
              <h3>01. Client Brief Translator</h3>
              <p>Paste any unstructured client email or note. AI will extract key requirements, risks, and action items into a structured brief.</p>
            </div>
            <div className="help-card glass-card">
              <h3>02. QBR Generator</h3>
              <p>Enter your account performance data. AI generates a complete Quarterly Business Review with insights and recommendations.</p>
            </div>
            <div className="help-card glass-card">
              <h3>03. Process Optimizer</h3>
              <p>Describe your current workflow. AI identifies bottlenecks and provides step-by-step optimization recommendations.</p>
            </div>
          </div>
        </div>
      </section>

      <section ref={contactRef} className="section contact-section">
        <div className="contact-content reveal">
          <p className="section-tag">CONTACT</p>
          <h2>Get In Touch</h2>
          <p className="contact-text">For enterprise inquiries, collaborations, or support:</p>
          <a href="mailto:krishnagupta232060@gmail.com" className="contact-email">krishnagupta232060@gmail.com</a>
        </div>
      </section>

      <footer className="footer">
        <p>© 2026 AMAT AI — Krishna Gupta. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;