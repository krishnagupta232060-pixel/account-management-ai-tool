import React, { useState, useEffect, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { db } from '../firebase';
import { collection, addDoc, query, where, orderBy, getDocs } from 'firebase/firestore';
import axios from 'axios';

const API = 'https://account-management-ai-tool.onrender.com';

function AIChat({ user }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [aiModel, setAiModel] = useState('llama');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef(null);

  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) setInput(transcript);
  }, [transcript]);

  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (user) loadChatHistory();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadChatHistory = async () => {
    if (!user) return;
    try {
      const q = query(
        collection(db, 'chats'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const chatList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setChats(chatList);
    } catch (err) {
      console.log(err);
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setCurrentChat(null);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    resetTranscript();
    setLoading(true);

    try {
      const res = await axios.post(`${API}/api/ai/chat`, {
        message: input,
        model: aiModel
      });
      const aiMsg = { role: 'assistant', content: res.data.response };
      setMessages(prev => [...prev, aiMsg]);

      if (user) {
        await addDoc(collection(db, 'chats'), {
          userId: user.uid,
          messages: [...messages, userMsg, aiMsg],
          createdAt: new Date(),
          title: input.slice(0, 40) + '...'
        });
        loadChatHistory();
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Error getting response. Please try again.';
      setMessages(prev => [...prev, { role: 'assistant', content: errorMsg }]);
    }
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleVoice = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening({ continuous: true });
    }
  };

  return (
    <div className="aichat-page">
      {/* Sidebar */}
      <div className={`aichat-sidebar ${sidebarOpen ? '' : 'collapsed'}`}>
        <div className="aichat-sidebar-header">
          <span>💬 Chats</span>
          <div className="aichat-sidebar-actions">
            <button className="aichat-new-btn" onClick={startNewChat} title="New Chat">+</button>
            <button className="aichat-toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)} title="Toggle sidebar">
              {sidebarOpen ? '◀' : '▶'}
            </button>
          </div>
        </div>
        {sidebarOpen && (
          <div className="aichat-history">
            {chats.length === 0 ? (
              <div className="aichat-empty">
                <p>No conversations yet</p>
                <span>Start chatting to save history</span>
              </div>
            ) : (
              chats.map(chat => (
                <div
                  key={chat.id}
                  className={`aichat-history-item ${currentChat === chat.id ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentChat(chat.id);
                    setMessages(chat.messages);
                  }}
                >
                  <span className="aichat-history-icon">💬</span>
                  <span className="aichat-history-text">{chat.title}</span>
                </div>
              ))
            )}
          </div>
        )}
        {sidebarOpen && !user && (
          <div className="aichat-signin-prompt">
            🔒 Sign in to save chat history
          </div>
        )}
      </div>

      {/* Main Chat */}
      <div className="aichat-main">
        <div className="aichat-topbar">
          <div className="aichat-topbar-left">
            {!sidebarOpen && (
              <button className="aichat-toggle-btn" onClick={() => setSidebarOpen(true)}>▶</button>
            )}
            <h2>AMAT AI Chat</h2>
            <span className="aichat-status">
              <span className="aichat-status-dot"></span>
              Online
            </span>
          </div>
          <div className="aichat-model-switcher">
            <button
              className={aiModel === 'llama' ? 'active' : ''}
              onClick={() => setAiModel('llama')}
            >⚡ Qwen 7B</button>
            <button
              className={aiModel === 'mixtral' ? 'active' : ''}
              onClick={() => setAiModel('mixtral')}
            >🧠 Zephyr 7B</button>
          </div>
        </div>

        <div className="aichat-messages">
          {messages.length === 0 && (
            <div className="aichat-welcome">
              <div className="aichat-welcome-icon">🤖</div>
              <h2>How can I help you today?</h2>
              <p>I'm AMAT AI — your intelligent assistant for account management, finance, and business strategy.</p>
              <div className="aichat-suggestions">
                <button onClick={() => setInput('Analyze my account portfolio risk')}>
                  <span className="suggestion-icon">📊</span>
                  <span>Analyze portfolio risk</span>
                </button>
                <button onClick={() => setInput('Generate a QBR report for Q2 2026')}>
                  <span className="suggestion-icon">📋</span>
                  <span>Generate QBR report</span>
                </button>
                <button onClick={() => setInput('Optimize my client onboarding process')}>
                  <span className="suggestion-icon">⚡</span>
                  <span>Optimize onboarding</span>
                </button>
                <button onClick={() => setInput('What KPIs should I track for account health?')}>
                  <span className="suggestion-icon">🎯</span>
                  <span>Track account KPIs</span>
                </button>
              </div>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`aichat-msg ${msg.role}`}>
              <div className="aichat-msg-avatar">
                {msg.role === 'user'
                  ? (user?.photoURL ? <img src={user.photoURL} alt="u" /> : '👤')
                  : '🤖'}
              </div>
              <div className="aichat-msg-bubble">
                <div className="aichat-msg-header">
                  <span className="aichat-msg-name">{msg.role === 'user' ? (user?.displayName || 'You') : 'AMAT AI'}</span>
                </div>
                <pre className="aichat-msg-text">{msg.content}</pre>
              </div>
            </div>
          ))}
          {loading && (
            <div className="aichat-msg assistant">
              <div className="aichat-msg-avatar">🤖</div>
              <div className="aichat-msg-bubble">
                <div className="aichat-typing">
                  <span></span><span></span><span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="aichat-input-area">
          <div className="aichat-input-wrapper">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Message AMAT AI..."
              rows={1}
            />
            <div className="aichat-input-actions">
              <button
                className={`aichat-voice-btn ${listening ? 'listening' : ''}`}
                onClick={toggleVoice}
                title={listening ? 'Stop listening' : 'Voice input'}
              >
                {listening ? '⏹' : '🎤'}
              </button>
              <button className="aichat-send-btn" onClick={sendMessage} disabled={loading || !input.trim()}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="19" x2="12" y2="5"></line>
                  <polyline points="5 12 12 5 19 12"></polyline>
                </svg>
              </button>
            </div>
          </div>
          <p className="aichat-disclaimer">AMAT AI powered by Hugging Face Inference API. Responses may not always be accurate.</p>
        </div>
      </div>
    </div>
  );
}

export default AIChat;
