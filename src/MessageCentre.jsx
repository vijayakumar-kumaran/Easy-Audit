import React, { useEffect, useState, useCallback } from 'react';
import { Mail, Send, Inbox, ArrowLeft, User, MessageSquareCode } from 'lucide-react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import './css/MessageCentre.css';

const MessageCentre = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('inbox'); // 'inbox', 'sent', 'compose', 'read'
  const [inbox, setInbox] = useState([]);
  const [sent, setSent] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [loading, setLoading] = useState(true);

  // Compose states
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sendLoading, setSendLoading] = useState(false);

  const fetchInbox = useCallback(async () => {
    try {
      const response = await axios.get('/api/messages/inbox');
      setInbox(response.data);
    } catch (err) {
      console.error('Error fetching inbox:', err);
    }
  }, []);

  const fetchSent = useCallback(async () => {
    try {
      const response = await axios.get('/api/messages/sent');
      setSent(response.data);
    } catch (err) {
      console.error('Error fetching sent:', err);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get('/api/users-list');
      // Filter out current user from the list
      const filtered = response.data.filter(u => u.username !== user?.username);
      setUsersList(filtered);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  }, [user]);

  const loadAllData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    await Promise.all([fetchInbox(), fetchSent(), fetchUsers()]);
    setLoading(false);
  }, [user, fetchInbox, fetchSent, fetchUsers]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const handleSelectMessage = async (msg, type) => {
    setSelectedMsg(msg);
    setActiveTab('read');

    if (type === 'inbox' && !msg.isRead) {
      try {
        await axios.put(`/api/messages/${msg._id}/read`);
        // Refresh local inbox counts
        fetchInbox();
      } catch (err) {
        console.error('Error marking read:', err);
      }
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!recipient || !subject || !body) {
      alert('Please fill out all fields.');
      return;
    }

    setSendLoading(true);
    try {
      await axios.post('/api/messages', {
        recipient,
        subject,
        body
      });
      alert('Message sent successfully!');
      setRecipient('');
      setSubject('');
      setBody('');
      await fetchSent();
      setActiveTab('sent');
    } catch (err) {
      console.error('Error sending message:', err);
      alert(err.response?.data?.error || 'Failed to send message.');
    } finally {
      setSendLoading(false);
    }
  };

  const formatDate = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="home-loading">
        <p>Loading Message Centre...</p>
      </div>
    );
  }

  const unreadCount = inbox.filter(m => !m.isRead).length;

  return (
    <div className="message-centre-container fade-in">
      <div className="message-header">
        <h1>Office Communication Hub</h1>
        <p>Connect with other officers, query compliance status, and document audit discussions.</p>
      </div>

      <div className="message-layout">
        {/* Sidebar Nav */}
        <aside className="message-sidebar-card glass-card">
          <button 
            className={`msg-tab-btn ${activeTab === 'inbox' ? 'active' : ''}`}
            onClick={() => { setActiveTab('inbox'); setSelectedMsg(null); }}
          >
            <Inbox size={16} />
            <span>Inbox</span>
            {unreadCount > 0 && (
              <span className="status-badge status-pending" style={{ marginLeft: 'auto', padding: '2px 6px', fontSize: '0.7rem' }}>
                {unreadCount}
              </span>
            )}
          </button>

          <button 
            className={`msg-tab-btn ${activeTab === 'sent' ? 'active' : ''}`}
            onClick={() => { setActiveTab('sent'); setSelectedMsg(null); }}
          >
            <Send size={16} />
            <span>Sent Messages</span>
          </button>

          <button 
            className={`msg-tab-btn ${activeTab === 'compose' ? 'active' : ''}`}
            onClick={() => { setActiveTab('compose'); setSelectedMsg(null); }}
          >
            <Mail size={16} />
            <span>Compose Mail</span>
          </button>
        </aside>

        {/* Content Panel */}
        <main className="message-content-panel glass-card">
          <div className="panel-body-custom">
            
            {/* INBOX TAB */}
            {activeTab === 'inbox' && (
              <div className="mail-list">
                <h3>Inbox</h3>
                {inbox.length === 0 ? (
                  <div className="no-records-card" style={{ padding: '2rem' }}>
                    <Inbox size={32} style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }} />
                    <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Your inbox is empty.</p>
                  </div>
                ) : (
                  inbox.map((msg) => (
                    <div 
                      key={msg._id} 
                      className={`mail-item ${!msg.isRead ? 'unread' : ''}`}
                      onClick={() => handleSelectMessage(msg, 'inbox')}
                    >
                      <div className="mail-item-header">
                        <span className="mail-sender-name">From: {msg.sender}</span>
                        <span className="mail-date">{formatDate(msg.createdAt)}</span>
                      </div>
                      <div className="mail-subject">{msg.subject}</div>
                      <div className="mail-preview">{msg.body}</div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* SENT TAB */}
            {activeTab === 'sent' && (
              <div className="mail-list">
                <h3>Sent Messages</h3>
                {sent.length === 0 ? (
                  <div className="no-records-card" style={{ padding: '2rem' }}>
                    <Send size={32} style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }} />
                    <p style={{ margin: 0, color: 'var(--text-secondary)' }}>You haven't sent any messages yet.</p>
                  </div>
                ) : (
                  sent.map((msg) => (
                    <div 
                      key={msg._id} 
                      className="mail-item"
                      onClick={() => handleSelectMessage(msg, 'sent')}
                    >
                      <div className="mail-item-header">
                        <span className="mail-sender-name">To: {msg.recipient}</span>
                        <span className="mail-date">{formatDate(msg.createdAt)}</span>
                      </div>
                      <div className="mail-subject">{msg.subject}</div>
                      <div className="mail-preview">{msg.body}</div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* READ VIEW */}
            {activeTab === 'read' && selectedMsg && (
              <div className="message-detail-view">
                <button 
                  className="back-button" 
                  onClick={() => setActiveTab(inbox.some(m => m._id === selectedMsg._id) ? 'inbox' : 'sent')}
                  style={{ alignSelf: 'start', marginBottom: '0.5rem' }}
                >
                  <ArrowLeft size={14} />
                  <span>Back to Folder</span>
                </button>

                <div className="detail-view-header">
                  <div>
                    <h2 className="detail-subject">{selectedMsg.subject}</h2>
                    <div className="detail-meta">
                      <span><strong>Sender:</strong> {selectedMsg.sender}</span>
                      <span><strong>Recipient:</strong> {selectedMsg.recipient}</span>
                    </div>
                  </div>
                  <span className="mail-date">{formatDate(selectedMsg.createdAt)}</span>
                </div>

                <div className="detail-body-card">
                  {selectedMsg.body}
                </div>
              </div>
            )}

            {/* COMPOSE TAB */}
            {activeTab === 'compose' && (
              <div className="compose-section">
                <h3 style={{ marginBottom: '1.25rem' }}>Compose In-App Mail</h3>
                <form onSubmit={handleSendMessage} className="compose-form">
                  <div className="form-group-custom">
                    <label>To (Select Colleague) *</label>
                    <div className="input-with-icon">
                      <User size={18} className="field-icon" />
                      <select 
                        value={recipient} 
                        onChange={(e) => setRecipient(e.target.value)} 
                        required 
                        className="form-control-custom"
                        style={{ paddingLeft: '2.75rem' }}
                      >
                        <option value="">Select Recipient</option>
                        {usersList.map((u) => (
                          <option key={u.username} value={u.username}>
                            {u.username} ({u.usertype === 'admin' ? 'Admin' : u.usertype === 'superuser' ? 'Supervisor' : 'Auditor'})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-group-custom">
                    <label>Subject *</label>
                    <input 
                      type="text" 
                      value={subject} 
                      onChange={(e) => setSubject(e.target.value)} 
                      placeholder="e.g. Query on ledger details / Scrutiny notice clarification" 
                      required 
                      className="form-control-custom"
                    />
                  </div>

                  <div className="form-group-custom">
                    <label>Message Body *</label>
                    <textarea 
                      value={body} 
                      onChange={(e) => setBody(e.target.value)} 
                      placeholder="Write your message here... Include client names, document references, or filing queries." 
                      required 
                      className="form-control-custom"
                      style={{ minHeight: '180px', resize: 'vertical' }}
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="compose-submit-btn" 
                    disabled={sendLoading}
                  >
                    <Send size={16} />
                    <span>{sendLoading ? 'Sending...' : 'Send Message'}</span>
                  </button>
                </form>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};

export default MessageCentre;
