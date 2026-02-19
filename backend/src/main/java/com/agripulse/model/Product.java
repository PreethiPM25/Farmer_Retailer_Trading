package com.agripulse.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    private String category;
    
    @Column(nullable = false)
    private Double quantity;
    
    @Column(nullable = false)
    private String unit = "kg";
    
    @Column(nullable = false, name = "base_price")
    private Double basePrice;
    
    @Column(name = "min_bid_price")
    private Double minBidPrice;
    
    @Column(name = "highest_bid")
    private Double highestBid = 0.0;
    
    @Column(nullable = false)
    private String status = "Active";
    
    private String availability = "Available";
    
    private String location;
    
    @Column(nullable = false, name = "farmer_email")
    private String farmerEmail;
    
    private String farmerName;
    private String imagePath;
    
    @Column(name = "delivery_days")
    private Integer deliveryDays = 7;
    
    @Column(name = "bid_timeframe_days")
    private Integer bidTimeframeDays = 30;
    
    @Column(name = "created_date")
    private LocalDateTime createdDate;
    
    @Column(name = "bid_end_date")
    private LocalDateTime bidEndDate;
    
    @Column(name = "harvest_date")
    private LocalDateTime harvestDate;
    
    @Column(name = "delivery_area")
    private String deliveryArea;
    
    @Column(name = "is_paused")
    private Boolean isPaused = false;
    
    @PrePersist
    protected void onCreate() {
        if (createdDate == null) {
            createdDate = LocalDateTime.now();
        }
        if (unit == null) {
            unit = "kg";
        }
        if (availability == null) {
            availability = "Available";
        }
        if (status == null) {
            status = "Active";
        }
        if (deliveryDays == null) {
            deliveryDays = 7;
        }
        if (bidTimeframeDays == null) {
            bidTimeframeDays = 30;
        }
        if (bidEndDate == null && bidTimeframeDays != null) {
            bidEndDate = LocalDateTime.now().plusDays(bidTimeframeDays);
        }
        if (highestBid == null) {
            highestBid = 0.0;
        }
        if (isPaused == null) {
            isPaused = false;
        }
    }
    
    public Product() {}
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    
    public Double getQuantity() { return quantity; }
    public void setQuantity(Double quantity) { this.quantity = quantity; }
    
    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }
    
    public Double getBasePrice() { return basePrice; }
    public void setBasePrice(Double basePrice) { this.basePrice = basePrice; }
    
    public Double getMinBidPrice() { return minBidPrice; }
    public void setMinBidPrice(Double minBidPrice) { this.minBidPrice = minBidPrice; }
    
    public Double getHighestBid() { return highestBid; }
    public void setHighestBid(Double highestBid) { this.highestBid = highestBid; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getAvailability() { return availability; }
    public void setAvailability(String availability) { this.availability = availability; }
    
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    
    public String getFarmerEmail() { return farmerEmail; }
    public void setFarmerEmail(String farmerEmail) { this.farmerEmail = farmerEmail; }
    
    public String getFarmerName() { return farmerName; }
    public void setFarmerName(String farmerName) { this.farmerName = farmerName; }
    
    public LocalDateTime getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate; }
    
    public String getImagePath() { return imagePath; }
    public void setImagePath(String imagePath) { this.imagePath = imagePath; }
    
    public Integer getDeliveryDays() { return deliveryDays; }
    public void setDeliveryDays(Integer deliveryDays) { this.deliveryDays = deliveryDays; }
    
    public Integer getBidTimeframeDays() { return bidTimeframeDays; }
    public void setBidTimeframeDays(Integer bidTimeframeDays) { this.bidTimeframeDays = bidTimeframeDays; }
    
    public LocalDateTime getBidEndDate() { return bidEndDate; }
    public void setBidEndDate(LocalDateTime bidEndDate) { this.bidEndDate = bidEndDate; }
    
    public LocalDateTime getHarvestDate() { return harvestDate; }
    public void setHarvestDate(LocalDateTime harvestDate) { this.harvestDate = harvestDate; }
    
    public String getDeliveryArea() { return deliveryArea; }
    public void setDeliveryArea(String deliveryArea) { this.deliveryArea = deliveryArea; }
    
    public Boolean getIsPaused() { return isPaused; }
    public void setIsPaused(Boolean isPaused) { this.isPaused = isPaused; }
}
