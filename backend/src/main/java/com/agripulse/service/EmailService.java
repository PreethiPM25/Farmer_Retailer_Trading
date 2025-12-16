package com.agripulse.service;

import com.agripulse.model.Bid;
import com.agripulse.model.Product;
import com.agripulse.model.User;
import com.agripulse.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;
    
    @Autowired
    private UserRepository userRepository;
    
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
    
    public void sendPasswordResetRequest(String toEmail, String fullName, String resetToken) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Agri-Pulse - Password Reset Request");
        message.setText((
                """
                Dear %s,
                
                You have requested to reset your password.
                
                Your Password Reset Token: %s
                
                This request is pending admin approval. Once approved, you will receive further instructions.
                
                Best Regards,
                Agri-Pulse Team""").formatted(
                fullName, resetToken
        ));
        mailSender.send(message);
    }
    
    public void sendPasswordResetApproval(String toEmail, String fullName, String tempPassword) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Agri-Pulse - Password Reset Approved");
        message.setText((
                """
                Dear %s,
                
                Your password reset request has been approved by the admin!
                
                Temporary Password: %s
                
                Please login with this temporary password and reset your password immediately.
                
                Login at: http://localhost:3000/login
                
                Best Regards,
                Agri-Pulse Team""").formatted(
                fullName, tempPassword
        ));
        mailSender.send(message);
    }
    
    public void sendPasswordResetRejection(String toEmail, String fullName) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Agri-Pulse - Password Reset Request Rejected");
        message.setText((
                """
                Dear %s,
                
                Your password reset request has been rejected by the admin.
                
                If you believe this is an error, please contact admin support.
                
                Best Regards,
                Agri-Pulse Team""").formatted(
                fullName
        ));
        mailSender.send(message);
    }
    
    public void notifyRetailersNewProduct(Product product) {
        try {
            List<User> retailers = userRepository.findByRole(User.UserRole.RETAILER);
            System.out.println("Found " + retailers.size() + " retailers in database");
            for (User retailer : retailers) {
                if (User.UserStatus.ACTIVE.equals(retailer.getStatus()) || User.UserStatus.APPROVED.equals(retailer.getStatus())) {
                    System.out.println("Sending email to retailer: " + retailer.getEmail());
                    SimpleMailMessage message = new SimpleMailMessage();
                    message.setTo(retailer.getEmail());
                    message.setSubject("New Product Available - " + product.getName());
                    message.setText(String.format(
                        "Dear %s,\n\n" +
                        "A new product is now available for bidding:\n\n" +
                        "Product: %s\n" +
                        "Category: %s\n" +
                        "Farmer: %s\n" +
                        "Location: %s\n" +
                        "Quantity: %.2f %s\n" +
                        "Base Price: ₹%.2f\n" +
                        "Delivery Time: %d days\n" +
                        "Bidding Deadline: %d days from now\n\n" +
                        "Login to place your bid!\n\n" +
                        "Best Regards,\nAgri-Pulse Team",
                        retailer.getFullName(), product.getName(), product.getCategory(),
                        product.getFarmerName(), product.getLocation(), product.getQuantity(),
                        product.getUnit(), product.getPrice(), product.getDeliveryDays(),
                        product.getBidTimeframeDays()
                    ));
                    mailSender.send(message);
                }
            }
        } catch (Exception e) {
            System.err.println("Failed to send product notifications: " + e.getMessage());
        }
    }
    
    public void sendBidNotification(String farmerEmail, Bid bid) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(farmerEmail);
            message.setSubject("New Bid Received - " + bid.getProductName());
            message.setText(String.format(
                "Dear Farmer,\n\n" +
                "You have received a new bid:\n\n" +
                "Product: %s\n" +
                "Retailer: %s\n" +
                "Bid Amount: ₹%.2f\n" +
                "Quantity: %d\n\n" +
                "Login to view and manage your bids.\n\n" +
                "Best Regards,\nAgri-Pulse Team",
                bid.getProductName(), bid.getRetailerName(),
                bid.getBidAmount(), bid.getQuantity()
            ));
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send bid notification: " + e.getMessage());
        }
    }
    
    public void sendBidAcceptanceNotification(String retailerEmail, Bid bid) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(retailerEmail);
            message.setSubject("Bid Accepted - " + bid.getProductName());
            message.setText(String.format(
                "Dear %s,\n\n" +
                "Congratulations! Your bid has been accepted:\n\n" +
                "Product: %s\n" +
                "Accepted Bid: ₹%.2f\n" +
                "Quantity: %d\n\n" +
                "Please proceed with the order confirmation.\n\n" +
                "Best Regards,\nAgri-Pulse Team",
                bid.getRetailerName(), bid.getProductName(),
                bid.getBidAmount(), bid.getQuantity()
            ));
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send bid acceptance notification: " + e.getMessage());
        }
    }
    
    public void sendOrderModificationNotification(String farmerEmail, String productName, String retailerName, String modification) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(farmerEmail);
            message.setSubject("Order Modified - " + productName);
            message.setText(String.format(
                "Dear Farmer,\n\n" +
                "An order has been modified by %s:\n\n" +
                "Product: %s\n" +
                "Modification: %s\n\n" +
                "Please review the updated order details.\n\n" +
                "Best Regards,\nAgri-Pulse Team",
                retailerName, productName, modification
            ));
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send order modification notification: " + e.getMessage());
        }
    }
}
