package com.healthcare.auth_service.dto;

import com.healthcare.auth_service.entity.AccountStatus;
import com.healthcare.auth_service.entity.Role;

public class UserSummaryResponse {
    private Long id;
    private String fullName;
    private String email;
    private Role role;
    private AccountStatus accountStatus;

    public UserSummaryResponse() {}

    public UserSummaryResponse(Long id, String fullName, String email, Role role, AccountStatus accountStatus) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.accountStatus = accountStatus;
    }

    public Long getId() { return id; }
    public String getFullName() { return fullName; }
    public String getEmail() { return email; }
    public Role getRole() { return role; }
    public AccountStatus getAccountStatus() { return accountStatus; }

    public void setId(Long id) { this.id = id; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public void setEmail(String email) { this.email = email; }
    public void setRole(Role role) { this.role = role; }
    public void setAccountStatus(AccountStatus accountStatus) { this.accountStatus = accountStatus; }
}
