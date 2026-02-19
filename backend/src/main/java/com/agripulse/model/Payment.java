package com.agripulse.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "transaction_id")
    private Long transactionId;
    
    @Column(name = "order_id")
    private Long orderId;
    
    @Column(name = "product_id")
    private Long productId;
    
    @Column(name = "retailer_email")
    private String retailerEmail;
    
    @Column(name = "retailer_name")
    private String retailerName;
    
    @Column(name = "farmer_email")
    private String farmerEmail;
    
    @Column(name = "farmer_name")
    private String farmerName;
    
    @Column(name = "product_name")
    private String productName;
    
    private Double quantity;
    private Double unitPrice;
    private Double totalAmount;
    
    @Column(name = "payment_method")
    private String paymentMethod; // RAZORPAY, UPI, CREDIT_CARD, DEBIT_CARD
    
    @Column(name = "razorpay_order_id")
    private String razorpayOrderId;
    
    @Column(name = "razorpay_payment_id")
    private String razorpayPaymentId;
    
    @Column(name = "razorpay_signature")
    private String razorpaySignature;
    
    @Column(name = "upi_id")
    private String upiId;
    
    @Column(name = "payment_status")
    private String paymentStatus; // PENDING, COMPLETED, FAILED, CANCELLED
    
    @Column(name = "payment_date")
    private LocalDateTime paymentDate;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    private String invoiceNumber;
    
    @Column(columnDefinition = "LONGTEXT")
    private String invoiceData; // JSON invoice data
    
    public Payment() {
    }
    
    public Payment(Long transactionId, Long orderId, Long productId, String retailerEmail,
                   String retailerName, String farmerEmail, String farmerName, String productName,
                   Double quantity, Double unitPrice, Double totalAmount) {
        this.transactionId = transactionId;
        this.orderId = orderId;
        this.productId = productId;
        this.retailerEmail = retailerEmail;
        this.retailerName = retailerName;
        this.farmerEmail = farmerEmail;
        this.farmerName = farmerName;
        this.productName = productName;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.totalAmount = totalAmount;
        this.paymentStatus = "PENDING";
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getTransactionId() {
        return transactionId;
    }
    
    public void setTransactionId(Long transactionId) {
        this.transactionId = transactionId;
    }
    
    public Long getOrderId() {
        return orderId;
    }
    
    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }
    
    public Long getProductId() {
        return productId;
    }
    
    public void setProductId(Long productId) {
        this.productId = productId;
    }
    
    public String getRetailerEmail() {
        return retailerEmail;
    }
    
    public void setRetailerEmail(String retailerEmail) {
        this.retailerEmail = retailerEmail;
    }
    
    public String getRetailerName() {
        return retailerName;
    }
    
    public void setRetailerName(String retailerName) {
        this.retailerName = retailerName;
    }
    
    public String getFarmerEmail() {
        return farmerEmail;
    }
    
    public void setFarmerEmail(String farmerEmail) {
        this.farmerEmail = farmerEmail;
    }
    
    public String getFarmerName() {
        return farmerName;
    }
    
    public void setFarmerName(String farmerName) {
        this.farmerName = farmerName;
    }
    
    public String getProductName() {
        return productName;
    }
    
    public void setProductName(String productName) {
        this.productName = productName;
    }
    
    public Double getQuantity() {
        return quantity;
    }
    
    public void setQuantity(Double quantity) {
        this.quantity = quantity;
    }
    
    public Double getUnitPrice() {
        return unitPrice;
    }
    
    public void setUnitPrice(Double unitPrice) {
        this.unitPrice = unitPrice;
    }
    
    public Double getTotalAmount() {
        return totalAmount;
    }
    
    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }
    
    public String getPaymentMethod() {
        return paymentMethod;
    }
    
    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
    
    public String getRazorpayOrderId() {
        return razorpayOrderId;
    }
    
    public void setRazorpayOrderId(String razorpayOrderId) {
        this.razorpayOrderId = razorpayOrderId;
    }
    
    public String getRazorpayPaymentId() {
        return razorpayPaymentId;
    }
    
    public void setRazorpayPaymentId(String razorpayPaymentId) {
        this.razorpayPaymentId = razorpayPaymentId;
    }
    
    public String getRazorpaySignature() {
        return razorpaySignature;
    }
    
    public void setRazorpaySignature(String razorpaySignature) {
        this.razorpaySignature = razorpaySignature;
    }
    
    public String getUpiId() {
        return upiId;
    }
    
    public void setUpiId(String upiId) {
        this.upiId = upiId;
    }
    
    public String getPaymentStatus() {
        return paymentStatus;
    }
    
    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }
    
    public LocalDateTime getPaymentDate() {
        return paymentDate;
    }
    
    public void setPaymentDate(LocalDateTime paymentDate) {
        this.paymentDate = paymentDate;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public String getInvoiceNumber() {
        return invoiceNumber;
    }
    
    public void setInvoiceNumber(String invoiceNumber) {
        this.invoiceNumber = invoiceNumber;
    }
    
    public String getInvoiceData() {
        return invoiceData;
    }
    
    public void setInvoiceData(String invoiceData) {
        this.invoiceData = invoiceData;
    }
}
