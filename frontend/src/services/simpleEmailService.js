// Simple email service that opens default email client
export const sendSimpleEmail = async (requestedEmail, userName, tempPassword) => {
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

    // Create mailto link and open default email client
    const mailtoLink = `mailto:${actualEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;

    // Store email record
    const sentEmails = JSON.parse(localStorage.getItem('sentEmails') || '[]');
    sentEmails.push({
      to: actualEmail,
      subject,
      body,
      tempPassword,
      sentAt: new Date().toISOString(),
      status: 'sent'
    });
    localStorage.setItem('sentEmails', JSON.stringify(sentEmails));

    console.log(`📧 EMAIL SENT TO: ${actualEmail}`);
    console.log(`Temporary Password: ${tempPassword}`);

    return { success: true, message: 'Email sent successfully', actualEmail };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: error.message };
  }
};