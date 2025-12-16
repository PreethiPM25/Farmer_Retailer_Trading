package com.agripulse.controller;

import com.agripulse.model.Order;
import com.agripulse.model.Product;
import com.agripulse.repository.OrderRepository;
import com.agripulse.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @PostMapping
    public ResponseEntity<?> placeOrder(@RequestBody Order order) {
        order.setStatus("PENDING");
        order.setOrderDate(LocalDateTime.now());
        order.setTotalAmount(order.getQuantity() * order.getPrice());
        return ResponseEntity.ok(orderRepository.save(order));
    }
    
    @GetMapping("/farmer/{email}")
    public ResponseEntity<?> getFarmerOrders(@PathVariable String email) {
        return ResponseEntity.ok(orderRepository.findByFarmerEmail(email));
    }
    
    @GetMapping("/retailer/{email}")
    public ResponseEntity<?> getRetailerOrders(@PathVariable String email) {
        return ResponseEntity.ok(orderRepository.findByRetailerEmail(email));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateOrder(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        Order order = orderRepository.findById(id).orElse(null);
        if (order == null) return ResponseEntity.badRequest().body(Map.of("message", "Order not found"));
        
        if (updates.containsKey("quantity")) {
            order.setQuantity((Double) updates.get("quantity"));
            order.setTotalAmount(order.getQuantity() * order.getPrice());
        }
        if (updates.containsKey("status")) {
            order.setStatus((String) updates.get("status"));
        }
        order.setModifiedDate(LocalDateTime.now());
        return ResponseEntity.ok(orderRepository.save(order));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelOrder(@PathVariable Long id) {
        Order order = orderRepository.findById(id).orElse(null);
        if (order == null) return ResponseEntity.badRequest().body(Map.of("message", "Order not found"));
        order.setStatus("CANCELLED");
        order.setModifiedDate(LocalDateTime.now());
        orderRepository.save(order);
        return ResponseEntity.ok(Map.of("message", "Order cancelled"));
    }
}
