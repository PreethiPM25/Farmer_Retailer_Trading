package com.agripulse.dto;

import lombok.Data;

@Data
public class RegistrationRequest {
    private String email;
    private String fullName;
    private String phone;
    private String address;
    private String role;
    private String documentPath;
}
