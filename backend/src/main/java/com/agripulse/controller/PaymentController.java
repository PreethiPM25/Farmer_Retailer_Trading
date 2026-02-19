package com.agripulse.controller;

import com.agripulse.model.Order;
import com.agripulse.model.Payment;
import com.agripulse.repository.OrderRepository;
import com.agripulse.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {
    
    @Autowired
    private PaymentService paymentService;
    
    @Autowired
    private OrderRepository orderRepository;
    
    @PostMapping("/razorpay/create-order")
    public ResponseEntity<?> createRazorpayOrder(@RequestBody Map<String, Long> request) {
        try {
            System.out.println("=== CREATE RAZORPAY ORDER REQUEST ===");
            Long orderId = request.get("orderId");
            
            Optional<Order> optionalOrder = orderRepository.findById(orderId);
            if (optionalOrder.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Order not found"));
            }
            
            Order order = optionalOrder.get();
            Payment payment = paymentService.createRazorpayOrder(orderId, order, "RAZORPAY");
            
            return ResponseEntity.ok(Map.of(
                "message", "Razorpay order created successfully",
                "paymentId", payment.getId(),
                "razorpayOrderId", payment.getRazorpayOrderId(),
                "amount", payment.getTotalAmount(),
                "currency", "INR",
                "retailerEmail", payment.getRetailerEmail(),
                "productName", payment.getProductName()
            ));
        } catch (Exception e) {
            System.err.println("❌ Error creating Razorpay order: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to create Razorpay order: " + e.getMessage()));
        }
    }
    
    @PostMapping("/{paymentId}/complete-razorpay")
    public ResponseEntity<?> completeRazorpayPayment(
            @PathVariable Long paymentId,
            @RequestBody Map<String, String> request) {
        try {
            System.out.println("=== COMPLETE RAZORPAY PAYMENT REQUEST ===");
            
            String razorpayPaymentId = request.get("razorpayPaymentId");
            String razorpaySignature = request.get("razorpaySignature");
            String upiId = request.get("upiId");
            
            System.out.println("Payment ID: " + paymentId);
            System.out.println("Razorpay Payment ID: " + razorpayPaymentId);
            
            Payment payment = paymentService.completePayment(paymentId, razorpayPaymentId, razorpaySignature, upiId);
            
            return ResponseEntity.ok(Map.of(
                "message", "Payment completed successfully",
                "paymentId", payment.getId(),
                "invoiceNumber", payment.getInvoiceNumber(),
                "paymentStatus", payment.getPaymentStatus(),
                "paymentDate", payment.getPaymentDate().toString(),
                "totalAmount", payment.getTotalAmount()
            ));
        } catch (Exception e) {
            System.err.println("❌ Error completing payment: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to complete payment: " + e.getMessage()));
        }
    }
    
    @PostMapping("/upi/initiate")
    public ResponseEntity<?> initiateUPIPayment(@RequestBody Map<String, Object> request) {
        try {
            System.out.println("=== INITIATE UPI PAYMENT REQUEST ===");
            Long orderId = ((Number) request.get("orderId")).longValue();
            String upiId = (String) request.get("upiId");
            
            Optional<Order> optionalOrder = orderRepository.findById(orderId);
            if (optionalOrder.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Order not found"));
            }
            
            Order order = optionalOrder.get();
            Payment payment = paymentService.initiateUPIPayment(orderId, order, upiId);
            
            return ResponseEntity.ok(Map.of(
                "message", "UPI payment initiated successfully",
                "paymentId", payment.getId(),
                "upiId", payment.getUpiId(),
                "amount", payment.getTotalAmount(),
                "status", payment.getPaymentStatus()
            ));
        } catch (Exception e) {
            System.err.println("❌ Error initiating UPI payment: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to initiate UPI payment: " + e.getMessage()));
        }
    }
    
    @PostMapping("/{paymentId}/complete-upi")
    public ResponseEntity<?> completeUPIPayment(
            @PathVariable Long paymentId,
            @RequestBody Map<String, String> request) {
        try {
            System.out.println("=== COMPLETE UPI PAYMENT REQUEST ===");
            
            String transactionRef = request.get("transactionRef");
            System.out.println("Payment ID: " + paymentId);
            System.out.println("Transaction Ref: " + transactionRef);
            
            Payment payment = paymentService.completeUPIPayment(paymentId, transactionRef);
            
            return ResponseEntity.ok(Map.of(
                "message", "UPI payment completed successfully",
                "paymentId", payment.getId(),
                "invoiceNumber", payment.getInvoiceNumber(),
                "paymentStatus", payment.getPaymentStatus(),
                "paymentDate", payment.getPaymentDate().toString(),
                "totalAmount", payment.getTotalAmount()
            ));
        } catch (Exception e) {
            System.err.println("❌ Error completing UPI payment: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to complete UPI payment: " + e.getMessage()));
        }
    }
    
    @GetMapping("/{paymentId}")
    public ResponseEntity<?> getPayment(@PathVariable Long paymentId) {
        try {
            Optional<Payment> payment = paymentService.getPaymentById(paymentId);
            if (payment.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Payment not found"));
            }
            return ResponseEntity.ok(payment.get());
        } catch (Exception e) {
            System.err.println("❌ Error fetching payment: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to fetch payment"));
        }
    }
    
    @GetMapping("/retailer/{email}")
    public ResponseEntity<?> getRetailerPayments(@PathVariable String email) {
        try {
            System.out.println("🔍 Fetching payments for retailer: " + email);
            List<Payment> payments = paymentService.getRetailerPayments(email);
            System.out.println("✅ Found " + payments.size() + " payments");
            return ResponseEntity.ok(payments);
        } catch (Exception e) {
            System.err.println("❌ Error fetching retailer payments: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to fetch payments"));
        }
    }
    
    @GetMapping("/farmer/{email}")
    public ResponseEntity<?> getFarmerPayments(@PathVariable String email) {
        try {
            System.out.println("🔍 Fetching payments for farmer: " + email);
            List<Payment> payments = paymentService.getFarmerPayments(email);
            System.out.println("✅ Found " + payments.size() + " payments");
            return ResponseEntity.ok(payments);
        } catch (Exception e) {
            System.err.println("❌ Error fetching farmer payments: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to fetch payments"));
        }
    }
    
    @GetMapping("/order/{orderId}")
    public ResponseEntity<?> getOrderPayments(@PathVariable Long orderId) {
        try {
            System.out.println("🔍 Fetching payments for order: " + orderId);
            List<Payment> payments = paymentService.getOrderPayments(orderId);
            System.out.println("✅ Found " + payments.size() + " payments");
            return ResponseEntity.ok(payments);
        } catch (Exception e) {
            System.err.println("❌ Error fetching order payments: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to fetch payments"));
        }
    }
    
    @GetMapping("/invoice/{invoiceNumber}")
    public ResponseEntity<?> getInvoice(@PathVariable String invoiceNumber) {
        try {
            System.out.println("🔍 Fetching invoice: " + invoiceNumber);
            Optional<Payment> payment = paymentService.getInvoice(invoiceNumber);
            if (payment.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invoice not found"));
            }
            return ResponseEntity.ok(payment.get());
        } catch (Exception e) {
            System.err.println("❌ Error fetching invoice: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to fetch invoice"));
        }
    }
    
    @PostMapping
    public ResponseEntity<?> savePayment(@RequestBody Payment payment) {
        try {
            System.out.println("💾 Saving direct product payment");
            Payment savedPayment = paymentService.savePayment(payment);
            System.out.println("✅ Payment saved with ID: " + savedPayment.getId());
            return ResponseEntity.ok(Map.of(
                "message", "Payment saved successfully",
                "paymentId", savedPayment.getId(),
                "invoiceNumber", savedPayment.getInvoiceNumber()
            ));
        } catch (Exception e) {
            System.err.println("❌ Error saving payment: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to save payment"));
        }
    }
}
