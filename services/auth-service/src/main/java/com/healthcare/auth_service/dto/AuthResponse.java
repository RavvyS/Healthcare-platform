package com.healthcare.auth_service.dto;


import com.healthcare.auth_service.entity.AccountStatus;
import com.healthcare.auth_service.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {

    private String token;
    private Long userId;
    private String email;
    private String fullName;
    private Role role;
    private AccountStatus accountStatus;
}
