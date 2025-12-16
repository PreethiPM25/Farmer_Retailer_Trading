import React from 'react';

const EmailNotification = ({ emailData, onClose }) => {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Email content copied to clipboard!');
    });
  };

  const openEmailClient = () => {
    const { to, subject, body } = emailData;
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(gmailUrl, '_blank');
  };

  if (!emailData) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '30px',
        maxWidth: '600px',
        width: '90%',
        maxHeight: '80vh',
        overflow: 'auto',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          borderBottom: '2px solid #10b981',
          paddingBottom: '15px'
        }}>
          <h2 style={{ margin: 0, color: '#10b981', fontSize: '24px' }}>
            📧 Email Sent Successfully!
          </h2>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#666'
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <div style={{
            background: '#f0fdf4',
            border: '2px solid #10b981',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#10b981' }}>Email Details:</h3>
            <p style={{ margin: '5px 0', fontSize: '14px' }}>
              <strong>To:</strong> {emailData.to}
            </p>
            <p style={{ margin: '5px 0', fontSize: '14px' }}>
              <strong>Subject:</strong> {emailData.subject}
            </p>
            <p style={{ margin: '5px 0', fontSize: '14px' }}>
              <strong>Temporary Password:</strong> 
              <span style={{
                background: '#fef3c7',
                color: '#92400e',
                padding: '4px 8px',
                borderRadius: '6px',
                marginLeft: '8px',
                fontWeight: 'bold'
              }}>
                {emailData.tempPassword}
              </span>
            </p>
          </div>

          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '15px',
            marginBottom: '20px'
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#374151' }}>Email Content:</h4>
            <pre style={{
              whiteSpace: 'pre-wrap',
              fontSize: '13px',
              color: '#4b5563',
              margin: 0,
              fontFamily: 'inherit'
            }}>
              {emailData.body}
            </pre>
          </div>
        </div>

        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={openEmailClient}
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
📧 Open Gmail Compose
          </button>
          
          <button
            onClick={() => copyToClipboard(emailData.body)}
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            📋 Copy Email Content
          </button>
          
          <button
            onClick={onClose}
            style={{
              background: 'linear-gradient(135deg, #6b7280, #4b5563)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            Close
          </button>
        </div>

        <div style={{
          marginTop: '20px',
          padding: '15px',
          background: '#fef3c7',
          borderRadius: '8px',
          border: '1px solid #f59e0b'
        }}>
          <p style={{
            margin: 0,
            fontSize: '13px',
            color: '#92400e',
            textAlign: 'center'
          }}>
            ⚠️ <strong>Note:</strong> This is a simulated email system. In production, emails would be sent automatically via SMTP server.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailNotification;