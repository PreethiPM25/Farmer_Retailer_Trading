package com.agripulse.repository;

import com.agripulse.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByFarmerEmail(String farmerEmail);
    List<Transaction> findByRetailerEmail(String retailerEmail);
    List<Transaction> findByOrderId(Long orderId);
    List<Transaction> findByProductId(Long productId);
    List<Transaction> findByTransactionStatus(String status);
}
