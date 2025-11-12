package com.stayease.backend.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String password;
    private String fullName;
    private String role; // "USER" or "ADMIN"
}
