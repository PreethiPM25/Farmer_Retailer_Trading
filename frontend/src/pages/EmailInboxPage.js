import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function EmailInboxPage() {
  const navigate = useNavigate();
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);

  useEffect(() => {
    // Load sent emails from localStorage
    const sentEmails = JSON.parse(localStorage.getItem('sentEmails') || '[]');
    setEmails(sentEmails.reverse()); // Show latest first
  }, []);

  const handleEmailClick = (email) => {
    setSelectedEmail(email);
  };

  const copyTempPassword = (password) => {
    navigator.clipboard.writeText(password);
    alert('Temporary password copied to clipboard!');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>📧 Email Inbox (Simulation)</h2>
        <button 
          onClick={() => navigate('/login')}
          style={{
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Go to Login
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', height: '600px' }}>
        {/* Email List */}
        <div style={{
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          <div style={{
            background: '#f9fafb',
            padding: '15px',
            borderBottom: '1px solid #e5e7eb',
            fontWeight: 'bold'
          }}>
            Inbox ({emails.length})
          </div>
          <div style={{ height: '550px', overflowY: 'auto' }}>
            {emails.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                No emails received yet
              </div>
            ) : (
              emails.map((email, index) => (
                <div
                  key={index}
                  onClick={() => handleEmailClick(email)}
                  style={{
                    padding: '15px',
                    borderBottom: '1px solid #f3f4f6',
                    cursor: 'pointer',
                    background: selectedEmail === email ? '#eff6ff' : 'white',
                    ':hover': { background: '#f9fafb' }
                  }}
                >
                  <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '5px' }}>
                    {email.subject}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '5px' }}>
                    To: {email.to}
                  </div>
                  <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                    {new Date(email.sentAt).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Email Content */}
        <div style={{
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          {selectedEmail ? (
            <>
              <div style={{
                background: '#f9fafb',
                padding: '15px',
                borderBottom: '1px solid #e5e7eb'
              }}>
                <h3 style={{ margin: '0 0 10px 0' }}>{selectedEmail.subject}</h3>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>
                  <div>To: {selectedEmail.to}</div>
                  <div>Date: {new Date(selectedEmail.sentAt).toLocaleString()}</div>
                </div>
              </div>
              <div style={{ padding: '20px', height: '450px', overflowY: 'auto' }}>
                <pre style={{
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'inherit',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  margin: 0
                }}>
                  {selectedEmail.body}
                </pre>
                
                {selectedEmail.tempPassword && (
                  <div style={{
                    marginTop: '20px',
                    padding: '15px',
                    background: '#fef3c7',
                    border: '1px solid #f59e0b',
                    borderRadius: '8px'
                  }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                      🔑 Temporary Password:
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}>
                      <code style={{
                        background: 'white',
                        padding: '8px 12px',
                        borderRadius: '4px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        border: '1px solid #d1d5db'
                      }}>
                        {selectedEmail.tempPassword}
                      </code>
                      <button
                        onClick={() => copyTempPassword(selectedEmail.tempPassword)}
                        style={{
                          background: '#10b981',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        📋 Copy
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: '#6b7280'
            }}>
              Select an email to view content
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmailInboxPage;