package com.agripulse.service;

import com.agripulse.model.Order;
import com.agripulse.model.Payment;
import com.agripulse.repository.PaymentRepository;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PaymentService {
    @Autowired
    private PaymentRepository paymentRepository;
    
    @Autowired
    private EmailService emailService;
    
    @Value("${razorpay.key.id:rzp_test_your_key}")
    private String razorpayKeyId;
    
    @Value("${razorpay.key.secret:your_secret_key}")
    private String razorpayKeySecret;
    
    private RazorpayClient razorpayClient;
    
    public PaymentService() {
    }
    
    // Create Razorpay order
    public Payment createRazorpayOrder(Long orderId, Order order, String paymentMethod) {
        System.out.println("=== CREATE RAZORPAY ORDER ===");
        System.out.println("Order ID: " + orderId);
        System.out.println("Amount: " + order.getTotalAmount());
        
        try {
            // Initialize Razorpay client
            this.razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
            
            // Create payment object
            Payment payment = new Payment(
                null,
                order.getId(),
                order.getProductId(),
                order.getRetailerEmail(),
                order.getRetailerName(),
                order.getFarmerEmail(),
                order.getFarmerName(),
                order.getProductName(),
                order.getQuantity(),
                order.getPrice(),
                order.getTotalAmount()
            );
            
            payment.setPaymentMethod(paymentMethod);
            
            // Create Razorpay order
            JSONObject razorpayOrder = new JSONObject();
            razorpayOrder.put("amount", (long)(order.getTotalAmount() * 100)); // Amount in paise
            razorpayOrder.put("currency", "INR");
            razorpayOrder.put("receipt", "receipt_" + UUID.randomUUID().toString().substring(0, 8));
            
            JSONObject notes = new JSONObject();
            notes.put("retailer_email", order.getRetailerEmail());
            notes.put("farmer_email", order.getFarmerEmail());
            notes.put("product_name", order.getProductName());
            razorpayOrder.put("notes", notes);
            
            com.razorpay.Order createdOrder = razorpayClient.orders.create(razorpayOrder);
            String razorpayOrderId = createdOrder.get("id").toString();
            
            payment.setRazorpayOrderId(razorpayOrderId);
            payment.setPaymentStatus("PENDING");
            
            Payment savedPayment = paymentRepository.save(payment);
            System.out.println("✅ Razorpay order created: " + razorpayOrderId);
            
            return savedPayment;
        } catch (RazorpayException e) {
            System.err.println("❌ Razorpay Error: " + e.getMessage());
            throw new RuntimeException("Failed to create Razorpay order: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("❌ Error creating Razorpay order: " + e.getMessage());
            throw new RuntimeException("Failed to create Razorpay order: " + e.getMessage());
        }
    }
    
    // Verify payment signature
    public boolean verifyPaymentSignature(String razorpayOrderId, String razorpayPaymentId, String razorpaySignature) {
        System.out.println("=== VERIFY PAYMENT SIGNATURE ===");
        System.out.println("Order ID: " + razorpayOrderId);
        System.out.println("Payment ID: " + razorpayPaymentId);
        
        try {
            String body = razorpayOrderId + "|" + razorpayPaymentId;
            
            // For demo purposes, we'll accept valid signatures
            // In production, implement proper HMAC verification
            return true;
        } catch (Exception e) {
            System.err.println("❌ Error verifying signature: " + e.getMessage());
            return false;
        }
    }
    
    // Complete payment
    public Payment completePayment(Long paymentId, String razorpayPaymentId, String razorpaySignature, String upiId) {
        System.out.println("=== COMPLETE PAYMENT ===");
        System.out.println("Payment ID: " + paymentId);
        System.out.println("Razorpay Payment ID: " + razorpayPaymentId);
        
        Optional<Payment> optionalPayment = paymentRepository.findById(paymentId);
        if (optionalPayment.isEmpty()) {
            throw new RuntimeException("Payment not found");
        }
        
        Payment payment = optionalPayment.get();
        
        // Verify signature
        if (!verifyPaymentSignature(payment.getRazorpayOrderId(), razorpayPaymentId, razorpaySignature)) {
            payment.setPaymentStatus("FAILED");
            paymentRepository.save(payment);
            throw new RuntimeException("Payment signature verification failed");
        }
        
        payment.setRazorpayPaymentId(razorpayPaymentId);
        payment.setRazorpaySignature(razorpaySignature);
        payment.setUpiId(upiId);
        payment.setPaymentStatus("COMPLETED");
        payment.setPaymentDate(LocalDateTime.now());
        
        // Generate invoice
        String invoiceNumber = generateInvoiceNumber();
        payment.setInvoiceNumber(invoiceNumber);
        payment.setInvoiceData(generateInvoiceData(payment));
        
        Payment savedPayment = paymentRepository.save(payment);
        System.out.println("✅ Payment completed for Payment ID: " + savedPayment.getId());
        
        // Send notifications
        sendPaymentNotifications(savedPayment);
        
        return savedPayment;
    }
    
    // Initiate UPI payment
    public Payment initiateUPIPayment(Long orderId, Order order, String upiId) {
        System.out.println("=== INITIATE UPI PAYMENT ===");
        System.out.println("Order ID: " + orderId);
        System.out.println("UPI ID: " + upiId);
        
        Payment payment = new Payment(
            null,
            order.getId(),
            order.getProductId(),
            order.getRetailerEmail(),
            order.getRetailerName(),
            order.getFarmerEmail(),
            order.getFarmerName(),
            order.getProductName(),
            order.getQuantity(),
            order.getPrice(),
            order.getTotalAmount()
        );
        
        payment.setPaymentMethod("UPI");
        payment.setUpiId(upiId);
        payment.setPaymentStatus("PENDING");
        
        Payment savedPayment = paymentRepository.save(payment);
        System.out.println("✅ UPI payment initiated with ID: " + savedPayment.getId());
        
        return savedPayment;
    }
    
    // Complete UPI payment
    public Payment completeUPIPayment(Long paymentId, String transactionRef) {
        System.out.println("=== COMPLETE UPI PAYMENT ===");
        System.out.println("Payment ID: " + paymentId);
        System.out.println("Transaction Ref: " + transactionRef);
        
        Optional<Payment> optionalPayment = paymentRepository.findById(paymentId);
        if (optionalPayment.isEmpty()) {
            throw new RuntimeException("Payment not found");
        }
        
        Payment payment = optionalPayment.get();
        payment.setRazorpayPaymentId(transactionRef);
        payment.setPaymentStatus("COMPLETED");
        payment.setPaymentDate(LocalDateTime.now());
        
        // Generate invoice
        String invoiceNumber = generateInvoiceNumber();
        payment.setInvoiceNumber(invoiceNumber);
        payment.setInvoiceData(generateInvoiceData(payment));
        
        Payment savedPayment = paymentRepository.save(payment);
        System.out.println("✅ UPI payment completed for Payment ID: " + savedPayment.getId());
        
        // Send notifications
        sendPaymentNotifications(savedPayment);
        
        return savedPayment;
    }
    
    // Send payment notifications
    private void sendPaymentNotifications(Payment payment) {
        try {
            // Send to retailer
            emailService.sendPaymentCompletionEmail(
                payment.getRetailerEmail(),
                payment.getRetailerName(),
                payment.getProductName(),
                payment.getTotalAmount(),
                payment.getInvoiceNumber(),
                "RETAILER"
            );
            
            // Send to farmer
            emailService.sendPaymentCompletionEmail(
                payment.getFarmerEmail(),
                payment.getFarmerName(),
                payment.getProductName(),
                payment.getTotalAmount(),
                payment.getInvoiceNumber(),
                "FARMER"
            );
            
            System.out.println("✅ Payment notifications sent");
        } catch (Exception e) {
            System.err.println("⚠️ Warning: Could not send payment notifications: " + e.getMessage());
        }
    }
    
    // Generate invoice number
    private String generateInvoiceNumber() {
        return "INV-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase();
    }
    
    // Generate invoice data
    private String generateInvoiceData(Payment payment) {
        try {
            JsonObject invoiceJson = new JsonObject();
            invoiceJson.addProperty("invoiceNumber", payment.getInvoiceNumber());
            invoiceJson.addProperty("invoiceDate", LocalDateTime.now().toString());
            invoiceJson.addProperty("retailerEmail", payment.getRetailerEmail());
            invoiceJson.addProperty("retailerName", payment.getRetailerName());
            invoiceJson.addProperty("farmerEmail", payment.getFarmerEmail());
            invoiceJson.addProperty("farmerName", payment.getFarmerName());
            invoiceJson.addProperty("productName", payment.getProductName());
            invoiceJson.addProperty("quantity", payment.getQuantity());
            invoiceJson.addProperty("unitPrice", payment.getUnitPrice());
            invoiceJson.addProperty("totalAmount", payment.getTotalAmount());
            invoiceJson.addProperty("paymentMethod", payment.getPaymentMethod());
            invoiceJson.addProperty("transactionId", payment.getRazorpayPaymentId());
            invoiceJson.addProperty("upiId", payment.getUpiId());
            invoiceJson.addProperty("paymentDate", payment.getPaymentDate().toString());
            
            return invoiceJson.toString();
        } catch (Exception e) {
            System.err.println("⚠️ Warning: Could not generate invoice data: " + e.getMessage());
            return "{}";
        }
    }
    
    // Get payment by ID
    public Optional<Payment> getPaymentById(Long paymentId) {
        return paymentRepository.findById(paymentId);
    }
    
    // Get retailer payments
    public List<Payment> getRetailerPayments(String retailerEmail) {
        return paymentRepository.findByRetailerEmail(retailerEmail);
    }
    
    // Get farmer payments
    public List<Payment> getFarmerPayments(String farmerEmail) {
        return paymentRepository.findByFarmerEmail(farmerEmail);
    }
    
    // Get order payments
    public List<Payment> getOrderPayments(Long orderId) {
        return paymentRepository.findByOrderId(orderId);
    }
    
    // Get invoice
    public Optional<Payment> getInvoice(String invoiceNumber) {
        return paymentRepository.findByInvoiceNumber(invoiceNumber);
    }
    
    // Save direct product payment
    public Payment savePayment(Payment payment) {
        System.out.println("💾 Saving direct product payment");
        
        // Set timestamps if not already set
        if (payment.getCreatedAt() == null) {
            payment.setCreatedAt(LocalDateTime.now());
        }
        payment.setUpdatedAt(LocalDateTime.now());
        
        // Generate invoice if not already set
        if (payment.getInvoiceNumber() == null) {
            String invoiceNumber = generateInvoiceNumber();
            payment.setInvoiceNumber(invoiceNumber);
            payment.setInvoiceData(generateInvoiceData(payment));
        }
        
        Payment savedPayment = paymentRepository.save(payment);
        System.out.println("✅ Payment saved with ID: " + savedPayment.getId());
        
        // Send notifications if payment is completed
        if ("COMPLETED".equals(payment.getPaymentStatus())) {
            sendPaymentNotifications(savedPayment);
        }
        
        return savedPayment;
    }
}
