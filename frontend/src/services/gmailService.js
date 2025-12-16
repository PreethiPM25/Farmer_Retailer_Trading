// Gmail API service for sending emails
export const sendGmailEmail = async (toEmail, userName, tempPassword) => {
  try {
    const subject = 'Agri-Pulse - Password Reset Approved';
    const body = `Dear ${userName},

Your password reset request has been approved by the admin.

Your temporary password is: ${tempPassword}

Please login with this temporary password at: http://localhost:3000/login

After login, you will be prompted to create a new password for security.

Best regards,
Agri-Pulse Admin Team`;

    // Create Gmail compose URL
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(toEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Open Gmail in new tab
    window.open(gmailUrl, '_blank');
    
    // Store email record
    const sentEmails = JSON.parse(localStorage.getItem('sentEmails') || '[]');
    sentEmails.push({
      to: toEmail,
      subject,
      body,
      tempPassword,
      sentAt: new Date().toISOString(),
      method: 'gmail'
    });
    localStorage.setItem('sentEmails', JSON.stringify(sentEmails));
    
    return { success: true, message: 'Gmail compose window opened' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};