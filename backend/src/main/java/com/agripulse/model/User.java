package com.agripulse.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    @Column(nullable = false)
    private String fullName;
    
    private String phone;
    private String address;
    private String documentPath;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserStatus status = UserStatus.PENDING;
    
    private boolean passwordReset = false;
    private LocalDateTime registrationDate = LocalDateTime.now();
    private LocalDateTime lastLogin;
    private LocalDateTime approvalDate;
    
    public enum UserRole {
        ADMIN, FARMER, RETAILER
    }
    
    public enum UserStatus {
        PENDING, APPROVED, REJECTED, ACTIVE, INACTIVE
    }
}
