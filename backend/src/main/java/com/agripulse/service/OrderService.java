package com.agripulse.service;

import com.agripulse.model.Bid;
import com.agripulse.model.Order;
import com.agripulse.model.Product;
import com.agripulse.repository.BidRepository;
import com.agripulse.repository.OrderRepository;
import com.agripulse.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private BidRepository bidRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private EmailService emailService;
    
    // Create a new order from accepted bid
    public Order createOrder(Long bidId, Long productId) {
        System.out.println("=== CREATING ORDER ===");
        System.out.println("Bid ID: " + bidId + ", Product ID: " + productId);
        
        Optional<Bid> optionalBid = bidRepository.findById(bidId);
        Optional<Product> optionalProduct = productRepository.findById(productId);
        
        if (optionalBid.isEmpty() || optionalProduct.isEmpty()) {
            throw new RuntimeException("Bid or Product not found");
        }
        
        Bid bid = optionalBid.get();
        Product product = optionalProduct.get();
        
        Order order = new Order();
        order.setProductId(productId);
        order.setProductName(product.getName());
        order.setQuantity(Double.valueOf(bid.getQuantity()));
        order.setPrice(product.getBasePrice());
        order.setTotalAmount(bid.getBidAmount());
        order.setFarmerEmail(product.getFarmerEmail());
        order.setFarmerName(product.getFarmerName());
        order.setRetailerEmail(bid.getRetailerEmail());
        order.setRetailerName(bid.getRetailerName());
        order.setStatus("PENDING_OTP");
        order.setOrderDate(LocalDateTime.now());
        
        Order savedOrder = orderRepository.save(order);
        System.out.println("✅ Order created with ID: " + savedOrder.getId());
        
        return savedOrder;
    }
    
    // Confirm order with OTP verification
    public Order confirmOrder(Long orderId, String otp) {
        System.out.println("=== CONFIRMING ORDER ===");
        System.out.println("Order ID: " + orderId + ", OTP: " + otp);
        
        Optional<Order> optionalOrder = orderRepository.findById(orderId);
        if (optionalOrder.isEmpty()) {
            throw new RuntimeException("Order not found");
        }
        
        Order order = optionalOrder.get();
        
        // Verify OTP (in real scenario, compare with stored OTP)
        if (otp == null || otp.length() != 6) {
            throw new RuntimeException("Invalid OTP");
        }
        
        order.setStatus("CONFIRMED");
        order.setModifiedDate(LocalDateTime.now());
        Order savedOrder = orderRepository.save(order);
        
        System.out.println("✅ Order confirmed with ID: " + savedOrder.getId());
        
        // Send confirmation email to retailer
        try {
            emailService.sendOrderConfirmationEmail(
                order.getRetailerEmail(),
                order.getRetailerName(),
                order.getProductName(),
                order.getTotalAmount(),
                "CONFIRMED"
            );
        } catch (Exception e) {
            System.err.println("Warning: Could not send confirmation email: " + e.getMessage());
        }
        
        return savedOrder;
    }
    
    // Mark order as paid
    public Order markOrderAsPaid(Long orderId, String paymentMethod, String transactionId) {
        System.out.println("=== MARKING ORDER AS PAID ===");
        System.out.println("Order ID: " + orderId + ", Payment Method: " + paymentMethod);
        
        Optional<Order> optionalOrder = orderRepository.findById(orderId);
        if (optionalOrder.isEmpty()) {
            throw new RuntimeException("Order not found");
        }
        
        Order order = optionalOrder.get();
        order.setStatus("PAID");
        order.setPaymentMethod(paymentMethod);
        order.setTransactionId(transactionId);
        order.setPaymentDate(LocalDateTime.now());
        order.setModifiedDate(LocalDateTime.now());
        
        Order savedOrder = orderRepository.save(order);
        System.out.println("✅ Order marked as PAID with ID: " + savedOrder.getId());
        
        return savedOrder;
    }
    
    // Complete order
    public Order completeOrder(Long orderId) {
        Optional<Order> optionalOrder = orderRepository.findById(orderId);
        if (optionalOrder.isEmpty()) {
            throw new RuntimeException("Order not found");
        }
        
        Order order = optionalOrder.get();
        order.setStatus("COMPLETED");
        order.setModifiedDate(LocalDateTime.now());
        
        Order savedOrder = orderRepository.save(order);
        System.out.println("✅ Order completed with ID: " + savedOrder.getId());
        
        return savedOrder;
    }
    
    // Get orders by farmer
    public List<Order> getFarmerOrders(String farmerEmail) {
        return orderRepository.findByFarmerEmail(farmerEmail);
    }
    
    // Get orders by retailer
    public List<Order> getRetailerOrders(String retailerEmail) {
        return orderRepository.findByRetailerEmail(retailerEmail);
    }
    
    // Get single order
    public Optional<Order> getOrder(Long orderId) {
        return orderRepository.findById(orderId);
    }
}
