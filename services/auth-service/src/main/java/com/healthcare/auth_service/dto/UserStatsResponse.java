package com.healthcare.auth_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserStatsResponse {
    private long totalUsers;
    private long patientCount;
    private long doctorCount;
    private long adminCount;
    private long activeCount;
    private long pendingVerificationCount;
    private long suspendedCount;
}
