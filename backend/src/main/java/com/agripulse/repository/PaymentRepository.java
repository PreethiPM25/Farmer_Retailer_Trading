package com.agripulse.repository;

import com.agripulse.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByRetailerEmail(String retailerEmail);
    List<Payment> findByFarmerEmail(String farmerEmail);
    List<Payment> findByOrderId(Long orderId);
    List<Payment> findByTransactionId(Long transactionId);
    Optional<Payment> findByRazorpayOrderId(String razorpayOrderId);
    Optional<Payment> findByRazorpayPaymentId(String razorpayPaymentId);
    Optional<Payment> findByInvoiceNumber(String invoiceNumber);
}
