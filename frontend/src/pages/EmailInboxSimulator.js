import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function EmailInboxSimulator() {
  const navigate = useNavigate();
  const [selectedEmail, setSelectedEmail] = useState('preeths.252005@gmail.com');
  const [emails, setEmails] = useState([]);

  useEffect(() => {
    loadEmails();
  }, [selectedEmail]);

  const loadEmails = () => {
    const inbox = JSON.parse(localStorage.getItem(`inbox_${selectedEmail}`) || '[]');
    setEmails(inbox);
  };

  const markAsRead = (emailId) => {
    const inbox = JSON.parse(localStorage.getItem(`inbox_${selectedEmail}`) || '[]');
    const updatedInbox = inbox.map(email => 
      email.id === emailId ? { ...email, read: true } : email
    );
    localStorage.setItem(`inbox_${selectedEmail}`, JSON.stringify(updatedInbox));
    setEmails(updatedInbox);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>📧 Gmail Inbox Simulator</h2>
        <button onClick={() => navigate('/login')} style={{ padding: '10px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px' }}>
          Go to Login
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ marginRight: '10px' }}>Select Email:</label>
        <select 
          value={selectedEmail} 
          onChange={(e) => setSelectedEmail(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="preeths.252005@gmail.com">preeths.252005@gmail.com (Farmer)</option>
          <option value="paviii.061984@gmail.com">paviii.061984@gmail.com (Retailer)</option>
        </select>
      </div>

      <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
        <div style={{ background: '#f9fafb', padding: '15px', borderBottom: '1px solid #e5e7eb' }}>
          <h3 style={{ margin: 0 }}>Inbox ({emails.length})</h3>
        </div>
        
        {emails.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
            No emails in inbox
          </div>
        ) : (
          <div>
            {emails.map((email) => (
              <div
                key={email.id}
                onClick={() => markAsRead(email.id)}
                style={{
                  padding: '20px',
                  borderBottom: '1px solid #f3f4f6',
                  cursor: 'pointer',
                  background: email.read ? 'white' : '#eff6ff',
                  ':hover': { background: '#f9fafb' }
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: email.read ? 'normal' : 'bold', fontSize: '16px', marginBottom: '5px' }}>
                      {email.subject}
                    </div>
                    <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
                      From: {email.from}
                    </div>
                    <div style={{ fontSize: '14px', color: '#333', whiteSpace: 'pre-line' }}>
                      {email.body}
                    </div>
                    {email.tempPassword && (
                      <div style={{
                        marginTop: '15px',
                        padding: '10px',
                        background: '#fef3c7',
                        border: '1px solid #f59e0b',
                        borderRadius: '6px'
                      }}>
                        <strong>Temporary Password: {email.tempPassword}</strong>
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize: '12px', color: '#999' }}>
                    {new Date(email.receivedAt).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default EmailInboxSimulator;