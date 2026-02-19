package com.agripulse.controller;

import com.agripulse.model.Order;
import com.agripulse.model.Transaction;
import com.agripulse.repository.OrderRepository;
import com.agripulse.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "*")
public class TransactionController {
    @Autowired
    private TransactionService transactionService;
    
    @Autowired
    private OrderRepository orderRepository;
    
    @PostMapping("/create")
    public ResponseEntity<?> createTransaction(@RequestBody Map<String, Long> request) {
        try {
            System.out.println("=== CREATE TRANSACTION REQUEST ===");
            Long orderId = request.get("orderId");
            
            System.out.println("Order ID: " + orderId);
            
            var optionalOrder = orderRepository.findById(orderId);
            if (optionalOrder.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Order not found"));
            }
            
            Order order = optionalOrder.get();
            Transaction transaction = transactionService.createTransaction(order);
            
            return ResponseEntity.ok(Map.of(
                "message", "Transaction created successfully",
                "transaction", transaction,
                "transactionId", transaction.getId()
            ));
        } catch (Exception e) {
            System.err.println("❌ Error creating transaction: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to create transaction: " + e.getMessage()));
        }
    }
    
    @PostMapping("/{transactionId}/process")
    public ResponseEntity<?> processTransaction(@PathVariable Long transactionId, @RequestBody Map<String, String> request) {
        try {
            System.out.println("=== PROCESS TRANSACTION REQUEST ===");
            System.out.println("Transaction ID: " + transactionId);
            
            String paymentMethod = request.get("paymentMethod");
            String paymentTransactionId = request.get("paymentTransactionId");
            
            Transaction transaction = transactionService.processPayment(transactionId, paymentMethod, paymentTransactionId);
            
            return ResponseEntity.ok(Map.of(
                "message", "Transaction processed successfully",
                "transaction", transaction
            ));
        } catch (Exception e) {
            System.err.println("❌ Error processing transaction: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to process transaction: " + e.getMessage()));
        }
    }
    
    @GetMapping("/farmer/{email}")
    public ResponseEntity<?> getFarmerTransactions(@PathVariable String email) {
        try {
            System.out.println("🔍 Fetching transactions for farmer: " + email);
            List<Transaction> transactions = transactionService.getFarmerTransactions(email);
            System.out.println("✅ Found " + transactions.size() + " transactions");
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            System.err.println("❌ Error fetching farmer transactions: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to fetch transactions"));
        }
    }
    
    @GetMapping("/retailer/{email}")
    public ResponseEntity<?> getRetailerTransactions(@PathVariable String email) {
        try {
            System.out.println("🔍 Fetching transactions for retailer: " + email);
            List<Transaction> transactions = transactionService.getRetailerTransactions(email);
            System.out.println("✅ Found " + transactions.size() + " transactions");
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            System.err.println("❌ Error fetching retailer transactions: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to fetch transactions"));
        }
    }
    
    @GetMapping("/order/{orderId}")
    public ResponseEntity<?> getOrderTransactions(@PathVariable Long orderId) {
        try {
            System.out.println("🔍 Fetching transactions for order: " + orderId);
            List<Transaction> transactions = transactionService.getOrderTransactions(orderId);
            System.out.println("✅ Found " + transactions.size() + " transactions");
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            System.err.println("❌ Error fetching order transactions: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to fetch transactions"));
        }
    }
    
    @GetMapping("/{transactionId}")
    public ResponseEntity<?> getTransaction(@PathVariable Long transactionId) {
        try {
            System.out.println("🔍 Fetching transaction: " + transactionId);
            var transaction = transactionService.getTransaction(transactionId);
            if (transaction.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Transaction not found"));
            }
            return ResponseEntity.ok(transaction.get());
        } catch (Exception e) {
            System.err.println("❌ Error fetching transaction: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to fetch transaction"));
        }
    }
}
