package com.agripulse.dto;

import com.agripulse.model.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegistrationRequest {
    @NotBlank
    @Email
    private String email;
    
    @NotBlank
    private String fullName;
    
    @NotBlank
    private String phone;
    
    @NotBlank
    private String address;
    
    @NotBlank
    private String role;
    
    private String documentPath;
}
