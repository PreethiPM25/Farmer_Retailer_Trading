package com.agripulse.repository;

import com.agripulse.model.Bid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BidRepository extends JpaRepository<Bid, Long> {
    List<Bid> findByProductIdOrderByBidAmountDesc(Long productId);
    List<Bid> findByFarmerEmailOrderByBidDateDesc(String farmerEmail);
    List<Bid> findByRetailerEmailOrderByBidDateDesc(String retailerEmail);
    
    @Query("SELECT b FROM Bid b WHERE b.productId = :productId AND DATE(b.bidDate) = DATE(:date) ORDER BY b.bidAmount DESC")
    List<Bid> findDailyHighestBids(@Param("productId") Long productId, @Param("date") LocalDateTime date);
    
    @Query("SELECT b FROM Bid b WHERE b.productId = :productId AND b.bidAmount = (SELECT MAX(b2.bidAmount) FROM Bid b2 WHERE b2.productId = :productId AND DATE(b2.bidDate) = DATE(:date))")
    List<Bid> findHighestBidForDay(@Param("productId") Long productId, @Param("date") LocalDateTime date);
}