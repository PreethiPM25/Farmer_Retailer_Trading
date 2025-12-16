// Automatic email sending service
export const sendEmailAutomatically = async (userEmail, userName, tempPassword) => {
  try {
    const subject = 'Agri-Pulse - Password Reset Approved';
    const body = `Dear ${userName},

Your password reset request has been approved by the admin.

Your temporary password is: ${tempPassword}

Please login with this temporary password at: http://localhost:3000/login

After login, you will be prompted to create a new password for security.

Best regards,
Agri-Pulse Admin Team`;

    // Simulate actual email sending
    console.log(`📧 Sending email to: ${userEmail}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${body}`);
    
    // Store sent email record
    const sentEmails = JSON.parse(localStorage.getItem('sentEmails') || '[]');
    sentEmails.push({
      to: userEmail,
      subject,
      body,
      tempPassword,
      sentAt: new Date().toISOString(),
      status: 'delivered'
    });
    localStorage.setItem('sentEmails', JSON.stringify(sentEmails));
    
    // Simulate email delivery delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};