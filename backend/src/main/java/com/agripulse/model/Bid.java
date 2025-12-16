package com.agripulse.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "bids")
public class Bid {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long productId;
    private String productName;
    private String retailerEmail;
    private String retailerName;
    private String farmerEmail;
    private Double bidAmount;
    private Integer quantity;
    private String status; // ACTIVE, ACCEPTED, REJECTED, EXPIRED
    
    @Column(name = "bid_date")
    private LocalDateTime bidDate = LocalDateTime.now();
    
    @Column(name = "expiry_date")
    private LocalDateTime expiryDate;
    
    public Bid() {}
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    
    public String getRetailerEmail() { return retailerEmail; }
    public void setRetailerEmail(String retailerEmail) { this.retailerEmail = retailerEmail; }
    
    public String getRetailerName() { return retailerName; }
    public void setRetailerName(String retailerName) { this.retailerName = retailerName; }
    
    public String getFarmerEmail() { return farmerEmail; }
    public void setFarmerEmail(String farmerEmail) { this.farmerEmail = farmerEmail; }
    
    public Double getBidAmount() { return bidAmount; }
    public void setBidAmount(Double bidAmount) { this.bidAmount = bidAmount; }
    
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public LocalDateTime getBidDate() { return bidDate; }
    public void setBidDate(LocalDateTime bidDate) { this.bidDate = bidDate; }
    
    public LocalDateTime getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDateTime expiryDate) { this.expiryDate = expiryDate; }
}