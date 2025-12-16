package com.agripulse.repository;

import com.agripulse.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByFarmerEmail(String farmerEmail);
    List<Order> findByRetailerEmail(String retailerEmail);
}
