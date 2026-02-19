package com.agripulse.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "order_id")
    private Long orderId;
    
    @Column(name = "product_id")
    private Long productId;
    
    @Column(name = "farmer_email")
    private String farmerEmail;
    
    @Column(name = "farmer_name")
    private String farmerName;
    
    @Column(name = "retailer_email")
    private String retailerEmail;
    
    @Column(name = "retailer_name")
    private String retailerName;
    
    @Column(name = "product_name")
    private String productName;
    
    private Double quantity;
    private Double unitPrice;
    private Double totalAmount;
    
    @Column(name = "payment_method")
    private String paymentMethod; // CREDIT_CARD, DEBIT_CARD, UPI, BANK_TRANSFER, etc.
    
    @Column(name = "transaction_id")
    private String transactionId; // Payment gateway transaction ID
    
    @Column(name = "transaction_status")
    private String transactionStatus; // PENDING, COMPLETED, FAILED, REFUNDED
    
    @Column(name = "bid_amount")
    private Double bidAmount; // Final bid amount agreed upon
    
    @Column(name = "transaction_date")
    private LocalDateTime transactionDate;
    
    @Column(name = "completion_date")
    private LocalDateTime completionDate;
    
    private String notes;
    
    @PrePersist
    protected void onCreate() {
        if (transactionDate == null) {
            transactionDate = LocalDateTime.now();
        }
        if (transactionStatus == null) {
            transactionStatus = "PENDING";
        }
    }
    
    // Constructors
    public Transaction() {}
    
    public Transaction(Long orderId, Long productId, String farmerEmail, String farmerName,
                      String retailerEmail, String retailerName, String productName,
                      Double quantity, Double unitPrice, Double totalAmount, Double bidAmount) {
        this.orderId = orderId;
        this.productId = productId;
        this.farmerEmail = farmerEmail;
        this.farmerName = farmerName;
        this.retailerEmail = retailerEmail;
        this.retailerName = retailerName;
        this.productName = productName;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.totalAmount = totalAmount;
        this.bidAmount = bidAmount;
        this.transactionDate = LocalDateTime.now();
        this.transactionStatus = "PENDING";
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }
    
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    
    public String getFarmerEmail() { return farmerEmail; }
    public void setFarmerEmail(String farmerEmail) { this.farmerEmail = farmerEmail; }
    
    public String getFarmerName() { return farmerName; }
    public void setFarmerName(String farmerName) { this.farmerName = farmerName; }
    
    public String getRetailerEmail() { return retailerEmail; }
    public void setRetailerEmail(String retailerEmail) { this.retailerEmail = retailerEmail; }
    
    public String getRetailerName() { return retailerName; }
    public void setRetailerName(String retailerName) { this.retailerName = retailerName; }
    
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    
    public Double getQuantity() { return quantity; }
    public void setQuantity(Double quantity) { this.quantity = quantity; }
    
    public Double getUnitPrice() { return unitPrice; }
    public void setUnitPrice(Double unitPrice) { this.unitPrice = unitPrice; }
    
    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }
    
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    
    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }
    
    public String getTransactionStatus() { return transactionStatus; }
    public void setTransactionStatus(String transactionStatus) { this.transactionStatus = transactionStatus; }
    
    public Double getBidAmount() { return bidAmount; }
    public void setBidAmount(Double bidAmount) { this.bidAmount = bidAmount; }
    
    public LocalDateTime getTransactionDate() { return transactionDate; }
    public void setTransactionDate(LocalDateTime transactionDate) { this.transactionDate = transactionDate; }
    
    public LocalDateTime getCompletionDate() { return completionDate; }
    public void setCompletionDate(LocalDateTime completionDate) { this.completionDate = completionDate; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
