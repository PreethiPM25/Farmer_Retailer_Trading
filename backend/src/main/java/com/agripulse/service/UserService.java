package com.agripulse.service;

import com.agripulse.dto.*;
import com.agripulse.model.User;
import com.agripulse.repository.UserRepository;
import com.agripulse.security.JwtUtil;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private EmailService emailService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @PostConstruct
    public void initAdmin() {
        if (userRepository.findByEmail("pmpreethi25@gmail.com").isEmpty()) {
            User admin = new User();
            admin.setEmail("pmpreethi25@gmail.com");
            admin.setPassword(passwordEncoder.encode("Admin@123"));
            admin.setFullName("Admin User");
            admin.setRole(User.UserRole.ADMIN);
            admin.setStatus(User.UserStatus.ACTIVE);
            admin.setPasswordReset(true);
            userRepository.save(admin);
        }
        
        if (userRepository.findByEmail("preeths.252005@gmail.com").isEmpty()) {
            User farmer = new User();
            farmer.setEmail("preeths.252005@gmail.com");
            farmer.setPassword(passwordEncoder.encode("Murali@123"));
            farmer.setFullName("Farmer User");
            farmer.setPhone("9876543210");
            farmer.setAddress("Farm Road, Agriculture Zone");
            farmer.setRole(User.UserRole.FARMER);
            farmer.setStatus(User.UserStatus.ACTIVE);
            farmer.setPasswordReset(true);
            userRepository.save(farmer);
        }
        
        if (userRepository.findByEmail("paviii.061984@gmail.com").isEmpty()) {
            User retailer = new User();
            retailer.setEmail("paviii.061984@gmail.com");
            retailer.setPassword(passwordEncoder.encode("Pavi@123"));
            retailer.setFullName("Retailer User");
            retailer.setPhone("9876543211");
            retailer.setAddress("Market Street, Commercial Zone");
            retailer.setRole(User.UserRole.RETAILER);
            retailer.setStatus(User.UserStatus.ACTIVE);
            retailer.setPasswordReset(true);
            userRepository.save(retailer);
        }
    }
    
    public Map<String, Object> register(RegistrationRequest request) {
        try {
            System.out.println("=== NEW REGISTRATION ===");
            System.out.println("Email: " + request.getEmail());
            System.out.println("Role: " + request.getRole());
            
            // Check if email already exists
            Optional<User> existingUser = userRepository.findByEmail(request.getEmail());
            if (existingUser.isPresent()) {
                System.err.println("✗ Email already exists: " + request.getEmail());
                throw new RuntimeException("Email already registered. Please use a different email or login.");
            }
            
            User user = new User();
            user.setEmail(request.getEmail());
            user.setFullName(request.getFullName());
            user.setPhone(request.getPhone());
            user.setAddress(request.getAddress());
            user.setDocumentPath(request.getDocumentPath() != null ? request.getDocumentPath() : "");
            user.setRole(User.UserRole.valueOf(request.getRole().toUpperCase()));
            user.setStatus(User.UserStatus.PENDING);
            user.setPassword(passwordEncoder.encode("temp123"));
            user.setPasswordReset(false);
            
            User savedUser = userRepository.save(user);
            System.out.println("✓ User registered with ID: " + savedUser.getId());
            System.out.println("✓ Status: " + savedUser.getStatus());
            System.out.println("✓ Pending approval count: " + userRepository.findByStatus(User.UserStatus.PENDING).size());
            
            return Map.of(
                "message", "Registration successful! Admin will review your request.",
                "success", true,
                "userId", savedUser.getId()
            );
        } catch (Exception e) {
            System.err.println("✗ Registration failed: " + e.getMessage());
            e.printStackTrace();
            return Map.of(
                "message", "Registration failed: " + e.getMessage(),
                "success", false
            );
        }
    }
    
    public Map<String, Object> login(LoginRequest request) {
        try {
            System.out.println("=== LOGIN ATTEMPT ===");
            System.out.println("Email: " + request.getEmail());
            
            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found with this email"));
            
            System.out.println("User found: " + user.getFullName());
            System.out.println("User role: " + user.getRole());
            System.out.println("User status: " + user.getStatus());
            System.out.println("Password reset: " + user.isPasswordReset());
            
            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                System.err.println("✗ Password mismatch for user: " + request.getEmail());
                throw new RuntimeException("Invalid password");
            }
            
            if (user.getStatus() == User.UserStatus.PENDING) {
                throw new RuntimeException("Account pending admin approval");
            }
            
            if (user.getStatus() == User.UserStatus.REJECTED) {
                throw new RuntimeException("Account has been rejected");
            }
            
            user.setLastLogin(LocalDateTime.now());
            userRepository.save(user);
            
            String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
            
            System.out.println("✓ Login successful for: " + user.getEmail());
            
            return Map.of(
                "token", token,
                "role", user.getRole().name(),
                "email", user.getEmail(),
                "fullName", user.getFullName(),
                "passwordReset", user.isPasswordReset(),
                "status", user.getStatus().name()
            );
        } catch (Exception e) {
            System.err.println("✗ Login failed: " + e.getMessage());
            throw e;
        }
    }
    
    public List<User> getPendingUsers() {
        return userRepository.findByStatus(User.UserStatus.PENDING);
    }
    
    public Map<String, Object> approveUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        String tempPassword = generateTempPassword();
        user.setPassword(passwordEncoder.encode(tempPassword));
        user.setStatus(User.UserStatus.APPROVED);
        user.setApprovalDate(LocalDateTime.now());
        userRepository.save(user);
        
        System.out.println("=== USER APPROVAL ===");
        System.out.println("User ID: " + userId);
        System.out.println("Email: " + user.getEmail());
        System.out.println("Temp Password: " + tempPassword);
        System.out.println("Status: " + user.getStatus());
        
        try {
            emailService.sendCredentials(user.getEmail(), user.getEmail(), tempPassword);
            System.out.println("✓ Email sent successfully to: " + user.getEmail());
            return Map.of(
                "message", "User approved! Email sent with temporary password: " + tempPassword,
                "success", true,
                "tempPassword", tempPassword,
                "email", user.getEmail()
            );
        } catch (Exception e) {
            System.err.println("✗ Email sending failed: " + e.getMessage());
            e.printStackTrace();
            return Map.of(
                "message", "User approved but email failed. Temp password: " + tempPassword,
                "success", true,
                "tempPassword", tempPassword,
                "email", user.getEmail(),
                "emailError", e.getMessage()
            );
        }
    }
    
    public Map<String, Object> forgotPassword(String email) {
        try {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            String resetToken = generateTempPassword();
            user.setPasswordResetToken(resetToken);
            user.setPasswordResetRequestDate(LocalDateTime.now());
            user.setPasswordResetStatus(User.PasswordResetStatus.REQUESTED);
            userRepository.save(user);
            
            return Map.of("message", "Password reset request sent to admin. Please wait for approval.", "success", true);
        } catch (Exception e) {
            return Map.of("message", "Failed to request password reset", "success", false);
        }
    }
    
    public Map<String, Object> resetPassword(PasswordResetRequest request) {
        try {
            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
            user.setPasswordReset(true);
            user.setStatus(User.UserStatus.ACTIVE);
            userRepository.save(user);
            
            return Map.of("message", "Password reset successfully!", "success", true);
        } catch (Exception e) {
            e.printStackTrace();
            return Map.of("message", "Password reset failed", "success", false);
        }
    }
    
    public List<Map<String, Object>> getPasswordResetRequests() {
        List<User> users = userRepository.findByPasswordResetStatus(User.PasswordResetStatus.REQUESTED);
        return users.stream().map(user -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", user.getId());
            map.put("email", user.getEmail());
            map.put("fullName", user.getFullName());
            map.put("role", user.getRole().name());
            map.put("requestDate", user.getPasswordResetRequestDate().toString());
            map.put("resetToken", user.getPasswordResetToken());
            return map;
        }).collect(Collectors.toList());
    }
    
    public Map<String, Object> approvePasswordReset(Long userId) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            String tempPassword = generateTempPassword();
            user.setPassword(passwordEncoder.encode(tempPassword));
            user.setPasswordReset(false);
            user.setPasswordResetStatus(User.PasswordResetStatus.APPROVED_BY_ADMIN);
            user.setStatus(User.UserStatus.APPROVED);
            userRepository.save(user);
            
            System.out.println("=== PASSWORD RESET APPROVAL ===");
            System.out.println("User ID: " + userId);
            System.out.println("Email: " + user.getEmail());
            System.out.println("Temp Password: " + tempPassword);
            
            try {
                emailService.sendPasswordResetApproval(user.getEmail(), user.getFullName(), tempPassword);
                System.out.println("✓ Password reset email sent to: " + user.getEmail());
            } catch (Exception e) {
                System.err.println("✗ Email sending failed: " + e.getMessage());
                e.printStackTrace();
            }
            
            return Map.of(
                "message", "Password reset approved! Temporary password sent via email.",
                "success", true,
                "tempPassword", tempPassword,
                "email", user.getEmail()
            );
        } catch (Exception e) {
            System.err.println("✗ Password reset approval failed: " + e.getMessage());
            e.printStackTrace();
            return Map.of("message", "Failed to approve: " + e.getMessage(), "success", false);
        }
    }
    
    public Map<String, Object> rejectPasswordReset(Long userId) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            user.setPasswordResetStatus(User.PasswordResetStatus.NONE);
            user.setPasswordResetToken(null);
            user.setPasswordResetRequestDate(null);
            userRepository.save(user);
            
            try {
                emailService.sendPasswordResetRejection(user.getEmail(), user.getFullName());
            } catch (Exception e) {
                System.err.println("Email sending failed: " + e.getMessage());
            }
            
            return Map.of("message", "Password reset rejected. User notified via email.", "success", true);
        } catch (Exception e) {
            return Map.of("message", "Failed to reject", "success", false);
        }
    }
    
    public DashboardStats getAdminDashboardStats() {
        long total = userRepository.countNonAdminUsers();
        long active = userRepository.countActiveUsers();
        long inactive = userRepository.countInactiveUsers();
        long notReset = userRepository.countUsersNotResetPassword();
        long today = userRepository.countTodayRegistrations(LocalDateTime.now().toLocalDate().atStartOfDay());
        
        List<DashboardStats.WeeklyData> weeklyData = getWeeklyGrowth();
        Map<String, Long> categories = getUserCategories();
        
        return new DashboardStats(total, active, inactive, notReset, today, weeklyData, categories);
    }
    
    public Map<String, Object> getUserDashboard(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return Map.of(
            "fullName", user.getFullName(),
            "email", user.getEmail(),
            "role", user.getRole().name(),
            "status", user.getStatus().name(),
            "lastLogin", user.getLastLogin() != null ? user.getLastLogin().toString() : "N/A",
            "registrationDate", user.getRegistrationDate().toString(),
            "passwordReset", user.isPasswordReset()
        );
    }
    
    private List<DashboardStats.WeeklyData> getWeeklyGrowth() {
        List<DashboardStats.WeeklyData> data = new ArrayList<>();
        String[] days = {"Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"};
        for (int i = 0; i < 7; i++) {
            LocalDateTime start = LocalDateTime.now().minusDays(6 - i).toLocalDate().atStartOfDay();
            long count = userRepository.countTodayRegistrations(start);
            data.add(new DashboardStats.WeeklyData(days[i], count));
        }
        return data;
    }
    
    private Map<String, Long> getUserCategories() {
        Map<String, Long> categories = new HashMap<>();
        categories.put("FARMER", (long) userRepository.findByRole(User.UserRole.FARMER).size());
        categories.put("RETAILER", (long) userRepository.findByRole(User.UserRole.RETAILER).size());
        return categories;
    }
    
    private String generateTempPassword() {
        return "Temp" + UUID.randomUUID().toString().substring(0, 8);
    }
}
