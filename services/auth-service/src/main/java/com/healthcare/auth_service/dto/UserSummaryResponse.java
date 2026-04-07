package com.healthcare.auth_service.dto;

import com.healthcare.auth_service.entity.AccountStatus;
import com.healthcare.auth_service.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserSummaryResponse {
    private Long id;
    private String fullName;
    private String email;
    private Role role;
    private AccountStatus accountStatus;
}
