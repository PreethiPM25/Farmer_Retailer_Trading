package com.agripulse.controller;

import com.agripulse.model.Order;
import com.agripulse.repository.OrderRepository;
import com.agripulse.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {
    @Autowired
    private OrderService orderService;
    
    @Autowired
    private OrderRepository orderRepository;
    
    @PostMapping("/create")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> request) {
        try {
            System.out.println("=== CREATE ORDER REQUEST ===");
            Long bidId = Long.parseLong(request.get("bidId").toString());
            Long productId = Long.parseLong(request.get("productId").toString());
            
            System.out.println("Bid ID: " + bidId + ", Product ID: " + productId);
            
            Order order = orderService.createOrder(bidId, productId);
            return ResponseEntity.ok(Map.of(
                "message", "Order created successfully",
                "order", order,
                "orderId", order.getId()
            ));
        } catch (Exception e) {
            System.err.println("❌ Error creating order: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to create order: " + e.getMessage()));
        }
    }
    
    @PostMapping("/{orderId}/confirm")
    public ResponseEntity<?> confirmOrder(@PathVariable Long orderId, @RequestBody Map<String, String> request) {
        try {
            System.out.println("=== CONFIRM ORDER REQUEST ===");
            System.out.println("Order ID: " + orderId);
            
            String otp = request.get("otp");
            Order order = orderService.confirmOrder(orderId, otp);
            
            return ResponseEntity.ok(Map.of(
                "message", "Order confirmed successfully",
                "order", order
            ));
        } catch (Exception e) {
            System.err.println("❌ Error confirming order: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to confirm order: " + e.getMessage()));
        }
    }
    
    @PostMapping("/{orderId}/pay")
    public ResponseEntity<?> payOrder(@PathVariable Long orderId, @RequestBody Map<String, String> request) {
        try {
            System.out.println("=== PROCESS PAYMENT REQUEST ===");
            System.out.println("Order ID: " + orderId);
            
            String paymentMethod = request.get("paymentMethod");
            String transactionId = "TXN" + System.currentTimeMillis();
            
            Order order = orderService.markOrderAsPaid(orderId, paymentMethod, transactionId);
            
            return ResponseEntity.ok(Map.of(
                "message", "Payment processed successfully",
                "transactionId", transactionId,
                "order", order
            ));
        } catch (Exception e) {
            System.err.println("❌ Error processing payment: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to process payment: " + e.getMessage()));
        }
    }
    
    @PostMapping("/{orderId}/complete")
    public ResponseEntity<?> completeOrder(@PathVariable Long orderId) {
        try {
            System.out.println("=== COMPLETE ORDER REQUEST ===");
            System.out.println("Order ID: " + orderId);
            
            Order order = orderService.completeOrder(orderId);
            
            return ResponseEntity.ok(Map.of(
                "message", "Order completed successfully",
                "order", order
            ));
        } catch (Exception e) {
            System.err.println("❌ Error completing order: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to complete order"));
        }
    }
    
    @GetMapping("/farmer/{email}")
    public ResponseEntity<?> getFarmerOrders(@PathVariable String email) {
        try {
            System.out.println("🔍 Fetching orders for farmer: " + email);
            List<Order> orders = orderService.getFarmerOrders(email);
            System.out.println("✅ Found " + orders.size() + " orders");
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            System.err.println("❌ Error fetching farmer orders: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to fetch orders"));
        }
    }
    
    @GetMapping("/retailer/{email}")
    public ResponseEntity<?> getRetailerOrders(@PathVariable String email) {
        try {
            System.out.println("🔍 Fetching orders for retailer: " + email);
            List<Order> orders = orderService.getRetailerOrders(email);
            System.out.println("✅ Found " + orders.size() + " orders");
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            System.err.println("❌ Error fetching retailer orders: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to fetch orders"));
        }
    }
    
    @GetMapping("/{orderId}")
    public ResponseEntity<?> getOrder(@PathVariable Long orderId) {
        try {
            System.out.println("🔍 Fetching order: " + orderId);
            var order = orderService.getOrder(orderId);
            if (order.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Order not found"));
            }
            return ResponseEntity.ok(order.get());
        } catch (Exception e) {
            System.err.println("❌ Error fetching order: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to fetch order"));
        }
    }
}
