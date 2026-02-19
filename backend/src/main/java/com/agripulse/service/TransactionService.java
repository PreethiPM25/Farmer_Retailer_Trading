package com.agripulse.service;

import com.agripulse.model.Order;
import com.agripulse.model.Transaction;
import com.agripulse.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TransactionService {
    @Autowired
    private TransactionRepository transactionRepository;
    
    @Autowired
    private EmailService emailService;
    
    // Create a new transaction from order
    public Transaction createTransaction(Order order) {
        System.out.println("=== CREATING TRANSACTION ===");
        System.out.println("Order ID: " + order.getId());
        
        Transaction transaction = new Transaction(
            order.getId(),
            order.getProductId(),
            order.getFarmerEmail(),
            order.getFarmerName(),
            order.getRetailerEmail(),
            order.getRetailerName(),
            order.getProductName(),
            order.getQuantity(),
            order.getPrice(),
            order.getTotalAmount(),
            order.getTotalAmount()
        );
        
        transaction.setTransactionStatus("PENDING");
        Transaction savedTransaction = transactionRepository.save(transaction);
        System.out.println("✅ Transaction created with ID: " + savedTransaction.getId());
        
        return savedTransaction;
    }
    
    // Process payment and update transaction
    public Transaction processPayment(Long transactionId, String paymentMethod, String paymentTransactionId) {
        System.out.println("=== PROCESSING PAYMENT ===");
        System.out.println("Transaction ID: " + transactionId + ", Method: " + paymentMethod);
        
        Optional<Transaction> optionalTransaction = transactionRepository.findById(transactionId);
        if (optionalTransaction.isEmpty()) {
            throw new RuntimeException("Transaction not found");
        }
        
        Transaction transaction = optionalTransaction.get();
        transaction.setPaymentMethod(paymentMethod);
        transaction.setTransactionId(paymentTransactionId);
        transaction.setTransactionStatus("COMPLETED");
        transaction.setCompletionDate(LocalDateTime.now());
        
        Transaction savedTransaction = transactionRepository.save(transaction);
        System.out.println("✅ Payment processed for Transaction ID: " + savedTransaction.getId());
        
        // Send payment confirmation emails
        try {
            emailService.sendPaymentConfirmationEmail(
                transaction.getRetailerEmail(),
                transaction.getRetailerName(),
                transaction.getProductName(),
                transaction.getTotalAmount(),
                paymentTransactionId
            );
            
            emailService.sendPaymentConfirmationEmail(
                transaction.getFarmerEmail(),
                transaction.getFarmerName(),
                transaction.getProductName(),
                transaction.getTotalAmount(),
                paymentTransactionId
            );
        } catch (Exception e) {
            System.err.println("Warning: Could not send payment confirmation emails: " + e.getMessage());
        }
        
        return savedTransaction;
    }
    
    // Get transaction by ID
    public Optional<Transaction> getTransaction(Long transactionId) {
        return transactionRepository.findById(transactionId);
    }
    
    // Get farmer transactions
    public List<Transaction> getFarmerTransactions(String farmerEmail) {
        return transactionRepository.findByFarmerEmail(farmerEmail);
    }
    
    // Get retailer transactions
    public List<Transaction> getRetailerTransactions(String retailerEmail) {
        return transactionRepository.findByRetailerEmail(retailerEmail);
    }
    
    // Get transactions by order
    public List<Transaction> getOrderTransactions(Long orderId) {
        return transactionRepository.findByOrderId(orderId);
    }
    
    // Get transactions by product
    public List<Transaction> getProductTransactions(Long productId) {
        return transactionRepository.findByProductId(productId);
    }
    
    // Cancel transaction
    public Transaction cancelTransaction(Long transactionId) {
        Optional<Transaction> optionalTransaction = transactionRepository.findById(transactionId);
        if (optionalTransaction.isEmpty()) {
            throw new RuntimeException("Transaction not found");
        }
        
        Transaction transaction = optionalTransaction.get();
        transaction.setTransactionStatus("FAILED");
        transaction.setCompletionDate(LocalDateTime.now());
        
        return transactionRepository.save(transaction);
    }
}
