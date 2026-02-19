package com.agripulse.service;

import com.agripulse.model.Bid;
import com.agripulse.model.Product;
import com.agripulse.repository.BidRepository;
import com.agripulse.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class BidService {
    @Autowired
    private BidRepository bidRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private EmailService emailService;
    
    // Place a new bid
    public Bid placeBid(Bid bid) {
        try {
            System.out.println("=== PLACING NEW BID ===");
            System.out.println("Product ID: " + bid.getProductId());
            System.out.println("Retailer: " + bid.getRetailerName() + " (" + bid.getRetailerEmail() + ")");
            System.out.println("Bid Amount: ₹" + bid.getBidAmount());
            
            bid.setStatus("ACTIVE");
            bid.setBidDate(LocalDateTime.now());
            
            // Set expiry to 7 days from now
            if (bid.getExpiryDate() == null) {
                bid.setExpiryDate(LocalDateTime.now().plusDays(7));
            }
            
            Bid savedBid = bidRepository.save(bid);
            System.out.println("✅ Bid placed successfully with ID: " + savedBid.getId());
            
            // Send immediate email to farmer
            try {
                emailService.sendBidNotification("preeths.252005@gmail.com", savedBid);
                System.out.println("✅ Email sent to farmer: preeths.252005@gmail.com");
            } catch (Exception emailError) {
                System.err.println("⚠️ Email sending failed but bid was saved: " + emailError.getMessage());
                // Don't throw error - bid is still saved successfully
            }
            
            return savedBid;
        } catch (Exception e) {
            System.err.println("❌ Error in placeBid: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to place bid: " + e.getMessage());
        }
    }
    
    // Get highest bid for a product
    public Optional<Bid> getHighestBidForProduct(Long productId) {
        List<Bid> bids = bidRepository.findByProductIdOrderByBidAmountDesc(productId);
        if (bids.isEmpty()) {
            return Optional.empty();
        }
        return Optional.of(bids.get(0));
    }
    
    // Accept a bid and send OTP to retailer
    public String acceptBid(Long bidId) {
        System.out.println("=== ACCEPTING BID ===");
        System.out.println("Bid ID: " + bidId);
        
        Optional<Bid> optionalBid = bidRepository.findById(bidId);
        if (optionalBid.isEmpty()) {
            throw new RuntimeException("Bid not found");
        }
        
        Bid bid = optionalBid.get();
        bid.setStatus("ACCEPTED");
        bidRepository.save(bid);
        
        // Generate OTP
        String otp = generateOTP();
        System.out.println("✅ Bid accepted. Generated OTP: " + otp);
        
        // Send OTP to retailer
        try {
            emailService.sendOTPToRetailer(bid.getRetailerEmail(), bid, otp);
            System.out.println("✅ OTP sent to retailer: " + bid.getRetailerEmail());
        } catch (Exception e) {
            System.err.println("Warning: Could not send OTP email: " + e.getMessage());
        }
        
        return otp;
    }
    
    // Reject a bid
    public void rejectBid(Long bidId) {
        Optional<Bid> optionalBid = bidRepository.findById(bidId);
        if (optionalBid.isPresent()) {
            Bid bid = optionalBid.get();
            bid.setStatus("REJECTED");
            bidRepository.save(bid);
            System.out.println("✅ Bid " + bidId + " rejected");
        }
    }
    
    // Get all bids for a product
    public List<Bid> getProductBids(Long productId) {
        return bidRepository.findByProductIdOrderByBidAmountDesc(productId);
    }
    
    // Get all bids by a farmer
    public List<Bid> getFarmerBids(String farmerEmail) {
        return bidRepository.findByFarmerEmailOrderByBidDateDesc(farmerEmail);
    }
    
    // Get all bids by a retailer
    public List<Bid> getRetailerBids(String retailerEmail) {
        return bidRepository.findByRetailerEmailOrderByBidDateDesc(retailerEmail);
    }
    
    // Generate random 6-digit OTP
    private String generateOTP() {
        return String.format("%06d", (int)(Math.random() * 1000000));
    }
}
