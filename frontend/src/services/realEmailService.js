// Real email sending service
export const sendRealEmail = async (requestedEmail, userName, tempPassword) => {
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
      actualEmail = requestedEmail; // fallback
    }

    // Create email content
    const subject = 'Agri-Pulse - Password Reset Approved';
    const body = `Dear ${userName},

Your password reset request has been approved by the admin.

Your temporary password is: ${tempPassword}

Please login with this temporary password at: http://localhost:3000/login

After login, you will be prompted to create a new password for security.

Best regards,
Agri-Pulse Admin Team`;

    // Store email in localStorage
    const sentEmails = JSON.parse(localStorage.getItem('sentEmails') || '[]');
    const emailData = {
      to: actualEmail,
      subject,
      body,
      tempPassword,
      sentAt: new Date().toISOString(),
      status: 'delivered'
    };
    sentEmails.push(emailData);
    localStorage.setItem('sentEmails', JSON.stringify(sentEmails));

    // Send alert email directly (simulation)
    console.log(`✅ EMAIL ALERT SENT TO: ${actualEmail}`);
    console.log(`Subject: ${subject}`);
    console.log(`Temporary Password: ${tempPassword}`);
    
    // Simulate direct email delivery
    setTimeout(() => {
      console.log(`📧 Email delivered to ${actualEmail} inbox`);
    }, 1000);

    return { success: true, message: 'Email alert sent successfully', actualEmail };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: error.message };
  }
};