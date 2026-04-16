package com.healthcare.auth_service.dto;

import com.healthcare.auth_service.entity.AccountStatus;

public class UpdateUserStatusRequest {
    private AccountStatus accountStatus;

    public UpdateUserStatusRequest() {}

    public AccountStatus getAccountStatus() { return accountStatus; }
    public void setAccountStatus(AccountStatus accountStatus) { this.accountStatus = accountStatus; }
}
