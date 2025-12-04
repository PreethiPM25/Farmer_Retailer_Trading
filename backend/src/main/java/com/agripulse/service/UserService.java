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
        if (userRepository.findByEmail("admin@agripulse.com").isEmpty()) {
            User admin = new User();
            admin.setEmail("admin@agripulse.com");
            admin.setPassword(passwordEncoder.encode("Admin@123"));
            admin.setFullName("System Admin");
            admin.setRole(User.UserRole.ADMIN);
            admin.setStatus(User.UserStatus.ACTIVE);
            admin.setPasswordReset(true);
            userRepository.save(admin);
        }
    }
    
    public Map<String, Object> register(RegistrationRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }
        
        User user = new User();
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        user.setDocumentPath(request.getDocumentPath());
        user.setRole(User.UserRole.valueOf(request.getRole().toUpperCase()));
        user.setStatus(User.UserStatus.PENDING);
        user.setPassword(passwordEncoder.encode("temp123"));
        
        userRepository.save(user);
        return Map.of("message", "Registration submitted successfully", "success", true);
    }
    
    public Map<String, Object> login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }
        
        if (user.getStatus() != User.UserStatus.ACTIVE && user.getStatus() != User.UserStatus.APPROVED) {
            throw new RuntimeException("Account not approved yet");
        }
        
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);
        
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        
        return Map.of(
            "token", token,
            "role", user.getRole().name(),
            "email", user.getEmail(),
            "fullName", user.getFullName(),
            "passwordReset", user.isPasswordReset()
        );
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
        
        try {
            emailService.sendCredentials(user.getEmail(), user.getEmail(), tempPassword);
        } catch (Exception e) {
            System.err.println("Email sending failed: " + e.getMessage());
        }
        
        return Map.of("message", "User approved successfully", "success", true);
    }
    
    public Map<String, Object> resetPassword(PasswordResetRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("Old password is incorrect");
        }
        
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setPasswordReset(true);
        user.setStatus(User.UserStatus.ACTIVE);
        userRepository.save(user);
        
        return Map.of("message", "Password reset successfully", "success", true);
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
