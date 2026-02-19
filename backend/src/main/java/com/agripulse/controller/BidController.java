package com.agripulse.controller;

import com.agripulse.model.Bid;
import com.agripulse.repository.BidRepository;
import com.agripulse.service.BidService;
import com.agripulse.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bids")
@CrossOrigin(origins = "*")
public class BidController {

    @Autowired
    private BidService bidService;
    
    @Autowired
    private BidRepository bidRepository;
    
    @Autowired
    private EmailService emailService;

    @PostMapping("/place")
    public ResponseEntity<?> placeBid(@RequestBody Bid bid) {
        try {
            System.out.println("=== NEW BID PLACEMENT REQUEST ===");
            System.out.println("Retailer: " + bid.getRetailerName());
            System.out.println("Product ID: " + bid.getProductId());
            System.out.println("Bid Amount: ₹" + bid.getBidAmount());
            
            Bid savedBid = bidService.placeBid(bid);
            return ResponseEntity.ok(Map.of(
                "message", "Bid placed successfully",
                "bid", savedBid,
                "bidId", savedBid.getId()
            ));
        } catch (Exception e) {
            System.err.println("❌ Error placing bid: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to place bid: " + e.getMessage()));
        }
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<?> getProductBids(@PathVariable Long productId) {
        try {
            System.out.println("🔍 Fetching bids for product: " + productId);
            List<Bid> bids = bidService.getProductBids(productId);
            System.out.println("✅ Found " + bids.size() + " bids");
            return ResponseEntity.ok(bids);
        } catch (Exception e) {
            System.err.println("❌ Error fetching product bids: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to fetch bids"));
        }
    }

    @GetMapping("/farmer/{email}")
    public ResponseEntity<?> getFarmerBids(@PathVariable String email) {
        try {
            System.out.println("🔍 Fetching bids for farmer: " + email);
            List<Bid> bids = bidService.getFarmerBids(email);
            System.out.println("✅ Found " + bids.size() + " bids");
            return ResponseEntity.ok(bids);
        } catch (Exception e) {
            System.err.println("❌ Error fetching farmer bids: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to fetch bids"));
        }
    }

    @GetMapping("/retailer/{email}")
    public ResponseEntity<?> getRetailerBids(@PathVariable String email) {
        try {
            System.out.println("🔍 Fetching bids for retailer: " + email);
            List<Bid> bids = bidService.getRetailerBids(email);
            System.out.println("✅ Found " + bids.size() + " bids");
            return ResponseEntity.ok(bids);
        } catch (Exception e) {
            System.err.println("❌ Error fetching retailer bids: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to fetch bids"));
        }
    }

    @GetMapping("/daily-highest/{productId}")
    public ResponseEntity<?> getDailyHighestBids(@PathVariable Long productId) {
        try {
            List<Bid> bids = bidRepository.findDailyHighestBids(productId, LocalDateTime.now());
            return ResponseEntity.ok(bids);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to fetch daily highest bids"));
        }
    }

    @PostMapping("/accept/{bidId}")
    public ResponseEntity<?> acceptBid(@PathVariable Long bidId) {
        try {
            System.out.println("=== ACCEPTING BID REQUEST ===");
            System.out.println("Bid ID: " + bidId);
            
            String otp = bidService.acceptBid(bidId);
            
            return ResponseEntity.ok(Map.of(
                "message", "Bid accepted successfully. OTP sent to retailer.",
                "otp", otp
            ));
        } catch (Exception e) {
            System.err.println("❌ Error accepting bid: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to accept bid: " + e.getMessage()));
        }
    }
    
    @PostMapping("/reject/{bidId}")
    public ResponseEntity<?> rejectBid(@PathVariable Long bidId) {
        try {
            System.out.println("=== REJECTING BID REQUEST ===");
            System.out.println("Bid ID: " + bidId);
            
            bidService.rejectBid(bidId);
            
            return ResponseEntity.ok(Map.of("message", "Bid rejected successfully"));
        } catch (Exception e) {
            System.err.println("❌ Error rejecting bid: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to reject bid"));
        }
    }
    
    @PostMapping("/confirm-order/{bidId}")
    public ResponseEntity<?> confirmOrderFromBid(@PathVariable Long bidId) {
        try {
            System.out.println("=== FARMER CONFIRMING ORDER FROM BID ===");
            System.out.println("Bid ID: " + bidId);
            
            var bidOpt = bidRepository.findById(bidId);
            if (bidOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Bid not found"));
            }
            
            Bid bid = bidOpt.get();
            bid.setStatus("CONFIRMED");
            bidRepository.save(bid);
            
            // Calculate delivery date (7 days from now)
            java.time.LocalDate deliveryDate = java.time.LocalDate.now().plusDays(7);
            String formattedDate = deliveryDate.format(java.time.format.DateTimeFormatter.ofPattern("dd MMM yyyy"));
            
            // Send confirmation email to retailer
            emailService.sendOrderConfirmationWithDelivery(
                bid.getRetailerEmail(),
                bid.getRetailerName(),
                bid.getProductName(),
                bid.getBidAmount(),
                bid.getQuantity().doubleValue(),
                formattedDate
            );
            
            return ResponseEntity.ok(Map.of(
                "message", "Order confirmed and email sent to retailer",
                "bid", bid,
                "deliveryDate", formattedDate
            ));
        } catch (Exception e) {
            System.err.println("❌ Error confirming order: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to confirm order: " + e.getMessage()));
        }
    }
    
    @GetMapping("/highest/{productId}")
    public ResponseEntity<?> getHighestBid(@PathVariable Long productId) {
        try {
            System.out.println("🔍 Fetching highest bid for product: " + productId);
            var highestBid = bidService.getHighestBidForProduct(productId);
            
            if (highestBid.isEmpty()) {
                return ResponseEntity.ok(Map.of("amount", 0.0, "retailerName", "N/A", "bidId", null));
            }
            
            Bid bid = highestBid.get();
            return ResponseEntity.ok(Map.of(
                "amount", bid.getBidAmount(),
                "retailerName", bid.getRetailerName(),
                "bidId", bid.getId(),
                "status", bid.getStatus()
            ));
        } catch (Exception e) {
            System.err.println("❌ Error fetching highest bid: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to get highest bid"));
        }
    }
}