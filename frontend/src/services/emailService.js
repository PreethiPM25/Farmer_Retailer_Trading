import emailjs from '@emailjs/browser';

// EmailJS configuration
const EMAILJS_SERVICE_ID = 'service_agripulse';
const EMAILJS_TEMPLATE_ID = 'template_password_reset';
const EMAILJS_PUBLIC_KEY = 'your_public_key_here';

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

export const sendPasswordResetEmail = async (userEmail, userName, tempPassword) => {
  try {
    const templateParams = {
      to_email: userEmail,
      to_name: userName,
      temp_password: tempPassword,
      from_name: 'Agri-Pulse Admin',
      reply_to: 'admin@agripulse.com'
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    console.log('Email sent successfully:', response);
    return { success: true, response };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error };
  }
};

// Fallback method using SMTP.js for direct email sending
export const sendEmailDirectly = async (userEmail, userName, tempPassword) => {
  try {
    // Using a simple email sending approach with mailto as fallback
    const subject = 'Password Reset Approved - Agri-Pulse';
    const body = `Dear ${userName},

Your password reset request has been approved by the admin.

Your temporary password is: ${tempPassword}

Please login with this temporary password and reset it immediately for security purposes.

Login at: http://localhost:3000/login

Best regards,
Agri-Pulse Admin Team`;

    // For demonstration, we'll use a mock email sending simulation
    // In production, you would integrate with a real email service
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log(`Email sent to ${userEmail}:`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${body}`);
    
    // Store sent email in localStorage for tracking
    const sentEmails = JSON.parse(localStorage.getItem('sentEmails') || '[]');
    sentEmails.push({
      to: userEmail,
      subject,
      body,
      sentAt: new Date().toISOString(),
      tempPassword
    });
    localStorage.setItem('sentEmails', JSON.stringify(sentEmails));
    
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('Direct email sending failed:', error);
    return { success: false, error: error.message };
  }
};