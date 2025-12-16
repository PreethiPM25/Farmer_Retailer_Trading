package com.agripulse.controller;

import com.agripulse.model.Bid;
import com.agripulse.repository.BidRepository;
import com.agripulse.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bids")
@CrossOrigin(origins = "http://localhost:3000")
public class BidController {

    @Autowired
    private BidRepository bidRepository;
    
    @Autowired
    private EmailService emailService;

    @PostMapping("/place")
    public ResponseEntity<?> placeBid(@RequestBody Bid bid) {
        try {
            bid.setStatus("ACTIVE");
            bid.setBidDate(LocalDateTime.now());
            Bid savedBid = bidRepository.save(bid);
            
            // Send notification to farmer
            emailService.sendBidNotification(bid.getFarmerEmail(), bid);
            
            return ResponseEntity.ok(Map.of("message", "Bid placed successfully", "bid", savedBid));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to place bid"));
        }
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Bid>> getProductBids(@PathVariable Long productId) {
        List<Bid> bids = bidRepository.findByProductIdOrderByBidAmountDesc(productId);
        return ResponseEntity.ok(bids);
    }

    @GetMapping("/farmer/{email}")
    public ResponseEntity<List<Bid>> getFarmerBids(@PathVariable String email) {
        List<Bid> bids = bidRepository.findByFarmerEmailOrderByBidDateDesc(email);
        return ResponseEntity.ok(bids);
    }

    @GetMapping("/retailer/{email}")
    public ResponseEntity<List<Bid>> getRetailerBids(@PathVariable String email) {
        List<Bid> bids = bidRepository.findByRetailerEmailOrderByBidDateDesc(email);
        return ResponseEntity.ok(bids);
    }

    @GetMapping("/daily-highest/{productId}")
    public ResponseEntity<List<Bid>> getDailyHighestBids(@PathVariable Long productId) {
        List<Bid> bids = bidRepository.findDailyHighestBids(productId, LocalDateTime.now());
        return ResponseEntity.ok(bids);
    }

    @PostMapping("/accept/{bidId}")
    public ResponseEntity<?> acceptBid(@PathVariable Long bidId) {
        try {
            Bid bid = bidRepository.findById(bidId).orElseThrow();
            bid.setStatus("ACCEPTED");
            bidRepository.save(bid);
            
            // Send notification to retailer
            emailService.sendBidAcceptanceNotification(bid.getRetailerEmail(), bid);
            
            return ResponseEntity.ok(Map.of("message", "Bid accepted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to accept bid"));
        }
    }
}