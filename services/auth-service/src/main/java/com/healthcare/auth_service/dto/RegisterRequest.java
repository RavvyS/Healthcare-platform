package com.healthcare.auth_service.dto;

import com.healthcare.auth_service.entity.Role;

public class RegisterRequest {
    private String fullName;
    private String email;
    private String password;
    private Role role;

    public RegisterRequest() {}

    public String getFullName() { return fullName; }
    public String getEmail() { return email; }
    public String getPassword() { return password; }
    public Role getRole() { return role; }

    public void setFullName(String fullName) { this.fullName = fullName; }
    public void setEmail(String email) { this.email = email; }
    public void setPassword(String password) { this.password = password; }
    public void setRole(Role role) { this.role = role; }
}
