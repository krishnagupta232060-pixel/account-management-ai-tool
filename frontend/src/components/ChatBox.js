import React, { useState, useEffect, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { db } from '../firebase';
import { collection, addDoc, query, where, orderBy, getDocs } from 'firebase/firestore';
import axios from 'axios';

const API = 'https://account-management-ai-tool.onrender.com';

function ChatBox({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [aiModel, setAiModel] = useState('claude');
  const messagesEndRef = useRef(null);

  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) setInput(transcript);
  }, [transcript]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (user && isOpen) loadChatHistory();
  }, [user, isOpen]);

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
      const res = await axios.post(`${API}/api/ai/analyze`, {
        data: input
      });
      const aiMsg = { role: 'assistant', content: res.data.analysis };
      setMessages(prev => [...prev, aiMsg]);

      if (user) {
        await addDoc(collection(db, 'chats'), {
          userId: user.uid,
          messages: [...messages, userMsg, aiMsg],
          createdAt: new Date(),
          title: input.slice(0, 30) + '...'
        });
        loadChatHistory();
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error getting response. Please try again.' }]);
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
    <>
      <button className={`chat-fab ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '✕' : 'A'}
      </button>

      {isOpen && (
        <div className="chat-panel">
          <div className="chat-sidebar">
            <div className="chat-sidebar-header">
              <span>AMAT AI</span>
              <button className="new-chat-btn" onClick={startNewChat}>+ New</button>
            </div>
            <div className="chat-history">
              {chats.length === 0 ? (
                <p className="no-chats">No chat history yet</p>
              ) : (
                chats.map(chat => (
                  <div
                    key={chat.id}
                    className={`chat-history-item ${currentChat === chat.id ? 'active' : ''}`}
                    onClick={() => {
                      setCurrentChat(chat.id);
                      setMessages(chat.messages);
                    }}
                  >
                    {chat.title}
                  </div>
                ))
              )}
            </div>
            {!user && (
              <div className="chat-signin-prompt">
                Sign in to save chat history
              </div>
            )}
          </div>

          <div className="chat-main">
            <div className="chat-header">
              <span className="chat-title">AMAT AI Assistant</span>
              <div className="model-switcher">
                <button
                  className={aiModel === 'claude' ? 'active' : ''}
                  onClick={() => setAiModel('claude')}
                >Claude</button>
                <button
                  className={aiModel === 'gemini' ? 'active' : ''}
                  onClick={() => setAiModel('gemini')}
                >Gemini</button>
              </div>
            </div>

            <div className="chat-messages">
              {messages.length === 0 && (
                <div className="chat-welcome">
                  <h3>How can I help you today?</h3>
                  <p>Ask me anything about account management, finance, or business strategy.</p>
                  <div className="chat-suggestions">
                    <button onClick={() => setInput('Analyze my account portfolio risk')}>Analyze portfolio risk</button>
                    <button onClick={() => setInput('Generate a QBR for Q1 2026')}>Generate QBR</button>
                    <button onClick={() => setInput('Optimize my sales process')}>Optimize sales process</button>
                  </div>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`chat-message ${msg.role}`}>
                  <div className="message-avatar">
                    {msg.role === 'user' ? (user?.photoURL ? <img src={user.photoURL} alt="u" /> : 'U') : 'A'}
                  </div>
                  <div className="message-content">
                    <pre>{msg.content}</pre>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="chat-message assistant">
                  <div className="message-avatar">A</div>
                  <div className="message-content typing">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-area">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Message AMAT AI..."
                rows={1}
              />
              <button
                className={`voice-btn ${listening ? 'listening' : ''}`}
                onClick={toggleVoice}
              >
                {listening ? '⏹' : '🎤'}
              </button>
              <button className="send-btn" onClick={sendMessage} disabled={loading}>
                ↑
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatBox;
