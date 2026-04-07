package com.healthcare.auth_service.dto;

import com.healthcare.auth_service.entity.AccountStatus;
import lombok.Data;

@Data
public class UpdateUserStatusRequest {
    private AccountStatus accountStatus;
}
