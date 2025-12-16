package com.agripulse.controller;

import com.agripulse.model.Product;
import com.agripulse.model.User;
import com.agripulse.repository.ProductRepository;
import com.agripulse.repository.UserRepository;
import com.agripulse.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private EmailService emailService;
    
    @PostMapping
    public ResponseEntity<?> addProduct(@RequestBody Product product) {
        try {
            System.out.println("=== ADDING PRODUCT ===");
            System.out.println("Product data received: " + product.getName());
            System.out.println("Farmer email: " + product.getFarmerEmail());
            System.out.println("Quantity: " + product.getQuantity());
            System.out.println("Price: " + product.getPrice());
            System.out.println("Location: " + product.getLocation());
            
            // Validate required fields
            if (product.getName() == null || product.getName().trim().isEmpty()) {
                System.err.println("ERROR: Product name is required");
                return ResponseEntity.badRequest().body(Map.of("error", "Product name is required"));
            }
            if (product.getFarmerEmail() == null || product.getFarmerEmail().trim().isEmpty()) {
                System.err.println("ERROR: Farmer email is required");
                return ResponseEntity.badRequest().body(Map.of("error", "Farmer email is required"));
            }
            if (product.getQuantity() == null || product.getQuantity() <= 0) {
                System.err.println("ERROR: Valid quantity is required");
                return ResponseEntity.badRequest().body(Map.of("error", "Valid quantity is required"));
            }
            if (product.getPrice() == null || product.getPrice() <= 0) {
                System.err.println("ERROR: Valid price is required");
                return ResponseEntity.badRequest().body(Map.of("error", "Valid price is required"));
            }
            
            // Find farmer and set additional details
            User farmer = userRepository.findByEmail(product.getFarmerEmail()).orElse(null);
            if (farmer != null) {
                product.setFarmerName(farmer.getFullName());
                // Only set location if not provided
                if (product.getLocation() == null || product.getLocation().trim().isEmpty()) {
                    product.setLocation(farmer.getAddress());
                }
            } else {
                System.err.println("WARNING: Farmer not found for email: " + product.getFarmerEmail());
            }
            
            // Set default values for optional fields
            if (product.getAvailability() == null) {
                product.setAvailability("Available");
            }
            if (product.getUnit() == null) {
                product.setUnit("kg");
            }
            if (product.getDeliveryDays() == null) {
                product.setDeliveryDays(7); // Default 7 days
            }
            
            // Set bid end date based on timeframe (default 30 days)
            if (product.getBidTimeframeDays() == null) {
                product.setBidTimeframeDays(30);
            }
            product.setBidEndDate(LocalDateTime.now().plusDays(product.getBidTimeframeDays()));
            
            // Set creation date
            product.setCreatedDate(LocalDateTime.now());
            
            System.out.println("Saving product to database...");
            Product savedProduct = productRepository.save(product);
            System.out.println("✅ Product saved successfully with ID: " + savedProduct.getId());
            System.out.println("✅ Product details: " + savedProduct.getName() + ", Qty: " + savedProduct.getQuantity() + ", Price: " + savedProduct.getPrice());
            
            // Send email notifications to all retailers in background
            new Thread(() -> {
                try {
                    System.out.println("📧 Sending email notifications to retailers...");
                    emailService.notifyRetailersNewProduct(savedProduct);
                    System.out.println("✅ Email notifications completed successfully");
                } catch (Exception e) {
                    System.err.println("❌ Email notification failed: " + e.getMessage());
                    e.printStackTrace();
                }
            }).start();
            
            return ResponseEntity.ok(savedProduct);
        } catch (Exception e) {
            System.err.println("❌ CRITICAL ERROR adding product: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to add product: " + e.getMessage()));
        }
    }
    
    @GetMapping("/farmer/{email}")
    public ResponseEntity<?> getFarmerProducts(@PathVariable String email) {
        try {
            System.out.println("🔍 Fetching products for farmer: " + email);
            List<Product> products = productRepository.findByFarmerEmail(email);
            System.out.println("✅ Found " + products.size() + " products for farmer: " + email);
            for (Product p : products) {
                System.out.println("  - " + p.getName() + " (ID: " + p.getId() + ", Email: " + p.getFarmerEmail() + ")");
            }
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            System.err.println("❌ Error fetching farmer products: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Error fetching products: " + e.getMessage()));
        }
    }
    
    @GetMapping
    public ResponseEntity<?> getAllProducts() {
        try {
            System.out.println("🔍 Fetching all products");
            List<Product> products = productRepository.findAll();
            System.out.println("✅ Found " + products.size() + " total products");
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            System.err.println("❌ Error fetching all products: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Error fetching products"));
        }
    }
    
    @GetMapping("/search")
    public ResponseEntity<?> searchProducts(
        @RequestParam(required = false) String category,
        @RequestParam(required = false) Double minPrice,
        @RequestParam(required = false) Double maxPrice,
        @RequestParam(required = false) String location
    ) {
        List<Product> products = productRepository.findAll();
        if (category != null) products = productRepository.findByCategory(category);
        if (minPrice != null && maxPrice != null) products = productRepository.findByPriceBetween(minPrice, maxPrice);
        if (location != null) products = productRepository.findByLocation(location);
        return ResponseEntity.ok(products);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        Product existing = productRepository.findById(id).orElse(null);
        if (existing == null) return ResponseEntity.badRequest().body(Map.of("message", "Product not found"));
        product.setId(id);
        return ResponseEntity.ok(productRepository.save(product));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        productRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Product deleted"));
    }
}
