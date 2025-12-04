package com.agripulse.controller;

import com.agripulse.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
public class UserController {
    @Autowired
    private UserService userService;
    
    @GetMapping("/dashboard/{email}")
    public ResponseEntity<?> getUserDashboard(@PathVariable String email) {
        return ResponseEntity.ok(userService.getUserDashboard(email));
    }
}
