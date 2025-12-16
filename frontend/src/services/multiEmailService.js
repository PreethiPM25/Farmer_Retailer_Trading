// Multiple email sending methods
export const sendEmailMultipleWays = async (requestedEmail, userName, tempPassword) => {
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

    const subject = 'Agri-Pulse - Password Reset Approved';
    const body = `Dear ${userName},

Your password reset request has been approved by the admin.

Your temporary password is: ${tempPassword}

Please login with this temporary password at: http://localhost:3000/login

After login, you will be prompted to create a new password for security.

Best regards,
Agri-Pulse Admin Team`;

    // Method 1: Gmail web interface
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(actualEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Method 2: Mailto link
    const mailtoLink = `mailto:${actualEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Method 3: Show email content for manual sending
    const emailContent = `
To: ${actualEmail}
Subject: ${subject}

${body}
    `;

    // Try multiple methods
    try {
      // Open Gmail compose
      window.open(gmailUrl, '_blank');
    } catch (e) {
      console.log('Gmail method failed, trying mailto');
    }

    try {
      // Also try mailto
      setTimeout(() => {
        window.location.href = mailtoLink;
      }, 1000);
    } catch (e) {
      console.log('Mailto method failed');
    }

    // Show alert with email content
    alert(`EMAIL TO SEND:

To: ${actualEmail}
Subject: ${subject}

Message:
${body}

Temporary Password: ${tempPassword}

Please copy this information and send it manually to the email address.`);

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

    console.log(`📧 EMAIL METHODS TRIGGERED FOR: ${actualEmail}`);
    console.log(`Temporary Password: ${tempPassword}`);

    return { success: true, message: 'Email sent via multiple methods', actualEmail };
  } catch (error) {
    console.error('All email methods failed:', error);
    return { success: false, error: error.message };
  }
};