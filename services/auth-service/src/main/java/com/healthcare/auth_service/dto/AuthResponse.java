package com.healthcare.auth_service.dto;

import com.healthcare.auth_service.entity.AccountStatus;
import com.healthcare.auth_service.entity.Role;

public class AuthResponse {
    private String token;
    private Long userId;
    private String email;
    private String fullName;
    private Role role;
    private AccountStatus accountStatus;

    public AuthResponse() {}

    public AuthResponse(String token, Long userId, String email, String fullName, Role role, AccountStatus accountStatus) {
        this.token = token;
        this.userId = userId;
        this.email = email;
        this.fullName = fullName;
        this.role = role;
        this.accountStatus = accountStatus;
    }

    public String getToken() { return token; }
    public Long getUserId() { return userId; }
    public String getEmail() { return email; }
    public String getFullName() { return fullName; }
    public Role getRole() { return role; }
    public AccountStatus getAccountStatus() { return accountStatus; }

    public void setToken(String token) { this.token = token; }
    public void setUserId(Long userId) { this.userId = userId; }
    public void setEmail(String email) { this.email = email; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public void setRole(Role role) { this.role = role; }
    public void setAccountStatus(AccountStatus accountStatus) { this.accountStatus = accountStatus; }
}
