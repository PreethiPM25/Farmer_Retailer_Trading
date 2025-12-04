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
        message.setText(String.format(
            "Dear User,\n\n" +
            "Your registration has been approved!\n\n" +
            "Login Credentials:\n" +
            "Username: %s\n" +
            "Temporary Password: %s\n\n" +
            "Please login and reset your password immediately.\n\n" +
            "Best Regards,\n" +
            "Agri-Pulse Team",
            username, tempPassword
        ));
        mailSender.send(message);
    }
}
