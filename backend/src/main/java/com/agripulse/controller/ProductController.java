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
    public ResponseEntity<?> addProduct(@RequestBody Map<String, Object> productData) {
        try {
            System.out.println("=== ADDING PRODUCT ===");
            System.out.println("Raw data: " + productData);
            
            Product product = new Product();
            product.setName((String) productData.get("name"));
            product.setCategory((String) productData.get("category"));
            product.setFarmerEmail((String) productData.get("farmerEmail"));
            product.setDeliveryArea((String) productData.get("deliveryArea"));
            product.setImagePath((String) productData.get("imagePath"));
            
            if (productData.get("quantity") != null) {
                product.setQuantity(Double.valueOf(productData.get("quantity").toString()));
            }
            if (productData.get("basePrice") != null) {
                product.setBasePrice(Double.valueOf(productData.get("basePrice").toString()));
            }
            if (productData.get("minBidPrice") != null && !productData.get("minBidPrice").toString().isEmpty()) {
                product.setMinBidPrice(Double.valueOf(productData.get("minBidPrice").toString()));
            }
            
            // Validate required fields
            if (product.getName() == null || product.getName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Product name is required"));
            }
            if (product.getFarmerEmail() == null || product.getFarmerEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Farmer email is required"));
            }
            if (product.getQuantity() == null || product.getQuantity() <= 0) {
                return ResponseEntity.badRequest().body(Map.of("error", "Valid quantity is required"));
            }
            if (product.getBasePrice() == null || product.getBasePrice() <= 0) {
                return ResponseEntity.badRequest().body(Map.of("error", "Valid base price is required"));
            }
            
            // Find farmer
            User farmer = userRepository.findByEmail(product.getFarmerEmail()).orElse(null);
            if (farmer != null) {
                product.setFarmerName(farmer.getFullName());
                if (product.getLocation() == null || product.getLocation().trim().isEmpty()) {
                    product.setLocation(farmer.getAddress());
                }
            }
            
            // Set defaults
            product.setAvailability("Available");
            product.setStatus("Active");
            product.setUnit("kg");
            product.setDeliveryDays(7);
            product.setHighestBid(0.0);
            product.setIsPaused(false);
            product.setBidTimeframeDays(30);
            product.setBidEndDate(LocalDateTime.now().plusDays(30));
            product.setCreatedDate(LocalDateTime.now());
            
            Product savedProduct = productRepository.save(product);
            System.out.println("✅ Product saved: " + savedProduct.getId());
            
            return ResponseEntity.ok(savedProduct);
        } catch (Exception e) {
            System.err.println("❌ ERROR: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
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
        if (minPrice != null && maxPrice != null) products = productRepository.findByBasePriceBetween(minPrice, maxPrice);
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
    
    @PutMapping("/{id}/pause")
    public ResponseEntity<?> pauseProduct(@PathVariable Long id) {
        Product product = productRepository.findById(id).orElse(null);
        if (product == null) return ResponseEntity.badRequest().body(Map.of("message", "Product not found"));
        product.setIsPaused(true);
        product.setStatus("Paused");
        return ResponseEntity.ok(productRepository.save(product));
    }
    
    @PutMapping("/{id}/resume")
    public ResponseEntity<?> resumeProduct(@PathVariable Long id) {
        Product product = productRepository.findById(id).orElse(null);
        if (product == null) return ResponseEntity.badRequest().body(Map.of("message", "Product not found"));
        product.setIsPaused(false);
        product.setStatus("Active");
        return ResponseEntity.ok(productRepository.save(product));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        productRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Product deleted"));
    }
}
