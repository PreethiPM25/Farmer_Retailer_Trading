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
    
    @Column(unique = true)
    private String email;
    
    private String password;
    private String fullName;
    private String phone;
    private String address;
    private String documentPath;
    
    @Enumerated(EnumType.STRING)
    private UserRole role;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserStatus status = UserStatus.PENDING;
    
    private boolean passwordReset = false;
    private LocalDateTime registrationDate = LocalDateTime.now();
    private LocalDateTime lastLogin;
    private LocalDateTime approvalDate;
    
    private String passwordResetToken;
    private LocalDateTime passwordResetRequestDate;
    
    @Enumerated(EnumType.STRING)
    private PasswordResetStatus passwordResetStatus = PasswordResetStatus.NONE;
    
    public enum UserRole {
        ADMIN, FARMER, RETAILER
    }
    
    public enum UserStatus {
        PENDING, APPROVED, REJECTED, ACTIVE, INACTIVE
    }
    
    public enum PasswordResetStatus {
        NONE, REQUESTED, APPROVED_BY_ADMIN, COMPLETED
    }
}
