package com.agripulse.repository;

import com.agripulse.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findByStatus(User.UserStatus status);
    List<User> findByRole(User.UserRole role);
    List<User> findByPasswordResetStatus(User.PasswordResetStatus status);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.role != 'ADMIN'")
    long countNonAdminUsers();
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.status = 'ACTIVE'")
    long countActiveUsers();
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.status = 'INACTIVE'")
    long countInactiveUsers();
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.passwordReset = false AND u.status = 'APPROVED'")
    long countUsersNotResetPassword();
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.registrationDate >= :startDate")
    long countTodayRegistrations(LocalDateTime startDate);
    
    @Query("SELECT u FROM User u WHERE u.registrationDate >= :startDate ORDER BY u.registrationDate DESC")
    List<User> findRecentRegistrations(LocalDateTime startDate);
}
