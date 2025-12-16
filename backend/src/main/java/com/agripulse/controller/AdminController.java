package com.agripulse.controller;

import com.agripulse.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {
    @Autowired
    private UserService userService;
    
    @GetMapping("/pending-users")
    public ResponseEntity<?> getPendingUsers() {
        return ResponseEntity.ok(userService.getPendingUsers());
    }
    
    @PostMapping("/approve/{userId}")
    public ResponseEntity<?> approveUser(@PathVariable Long userId) {
        try {
            return ResponseEntity.ok(userService.approveUser(userId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage(), "success", false));
        }
    }
    
    @GetMapping("/dashboard-stats")
    public ResponseEntity<?> getDashboardStats() {
        return ResponseEntity.ok(userService.getAdminDashboardStats());
    }
    
    @GetMapping("/password-reset-requests")
    public ResponseEntity<?> getPasswordResetRequests() {
        return ResponseEntity.ok(userService.getPasswordResetRequests());
    }
    
    @PostMapping("/approve-password-reset/{userId}")
    public ResponseEntity<?> approvePasswordReset(@PathVariable Long userId) {
        try {
            return ResponseEntity.ok(userService.approvePasswordReset(userId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage(), "success", false));
        }
    }
    
    @PostMapping("/reject-password-reset/{userId}")
    public ResponseEntity<?> rejectPasswordReset(@PathVariable Long userId) {
        try {
            return ResponseEntity.ok(userService.rejectPasswordReset(userId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage(), "success", false));
        }
    }
}
