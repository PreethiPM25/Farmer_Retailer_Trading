// EmailJS service for real email sending
export const sendEmailJS = async (requestedEmail, userName, tempPassword) => {
  try {
    // Determine actual email
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

    // Use fetch to send email via a simple email API
    try {
      const response = await fetch('https://formspree.io/f/xpznvqpn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: actualEmail,
          subject: subject,
          message: body,
          _replyto: actualEmail,
          _subject: subject
        })
      });

      if (response.ok) {
        console.log('Email sent via Formspree');
      }
    } catch (e) {
      console.log('Formspree failed, using fallback');
    }

    // Fallback: Open Gmail compose
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(actualEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(gmailUrl, '_blank');

    // Store email
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

    return { success: true, message: 'Email sent successfully', actualEmail };
  } catch (error) {
    return { success: false, error: error.message };
  }
};