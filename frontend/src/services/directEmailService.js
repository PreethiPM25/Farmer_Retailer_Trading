// Direct email delivery service
export const sendDirectEmail = async (requestedEmail, userName, tempPassword) => {
  try {
    // Determine actual email based on user role
    const users = JSON.parse(localStorage.getItem('agripulse_users') || '[]');
    const user = users.find(u => u.email === requestedEmail);
    
    let actualEmail;
    if (user?.role === 'FARMER') {
      actualEmail = 'preeths.252005@gmail.com';
    } else if (user?.role === 'RETAILER') {
      actualEmail = 'paviii.061984@gmail.com';
    } else {
      actualEmail = requestedEmail;
    }

    // Email content
    const subject = 'Agri-Pulse - Password Reset Approved';
    const body = `Dear ${userName},

Your password reset request has been approved by the admin.

Your temporary password is: ${tempPassword}

Please login with this temporary password at: http://localhost:3000/login

After login, you will be prompted to create a new password for security.

Best regards,
Agri-Pulse Admin Team`;

    // Store email in user's inbox (simulation)
    const userInbox = JSON.parse(localStorage.getItem(`inbox_${actualEmail}`) || '[]');
    const emailData = {
      id: Date.now(),
      from: 'admin@agripulse.com',
      to: actualEmail,
      subject,
      body,
      tempPassword,
      receivedAt: new Date().toISOString(),
      read: false,
      type: 'password_reset'
    };
    userInbox.unshift(emailData);
    localStorage.setItem(`inbox_${actualEmail}`, JSON.stringify(userInbox));

    // Also store in sent emails
    const sentEmails = JSON.parse(localStorage.getItem('sentEmails') || '[]');
    sentEmails.push({
      ...emailData,
      sentAt: new Date().toISOString(),
      status: 'delivered'
    });
    localStorage.setItem('sentEmails', JSON.stringify(sentEmails));

    console.log(`📧 EMAIL DELIVERED TO: ${actualEmail}`);
    console.log(`Subject: ${subject}`);
    console.log(`Temporary Password: ${tempPassword}`);

    return { success: true, message: 'Email delivered to inbox', actualEmail };
  } catch (error) {
    console.error('Email delivery failed:', error);
    return { success: false, error: error.message };
  }
};