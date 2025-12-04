package com.agripulse.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;
    
    public void sendCredentials(String toEmail, String username, String tempPassword) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Agri-Pulse - Registration Approved");
        message.setText((
                """
                Dear User,
                
                Your registration has been approved!
                
                Login Credentials:
                Username: %s
                Temporary Password: %s
                
                Please login and reset your password immediately.
                
                Best Regards,
                Agri-Pulse Team""").formatted(
                username, tempPassword
        ));
        mailSender.send(message);
    }
}
