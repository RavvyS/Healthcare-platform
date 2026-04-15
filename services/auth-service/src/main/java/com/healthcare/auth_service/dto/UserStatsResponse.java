package com.healthcare.auth_service.dto;

public class UserStatsResponse {
    private long totalUsers;
    private long patientCount;
    private long doctorCount;
    private long adminCount;
    private long activeCount;
    private long pendingVerificationCount;
    private long suspendedCount;

    public UserStatsResponse() {}

    public UserStatsResponse(long totalUsers, long patientCount, long doctorCount, long adminCount,
                              long activeCount, long pendingVerificationCount, long suspendedCount) {
        this.totalUsers = totalUsers;
        this.patientCount = patientCount;
        this.doctorCount = doctorCount;
        this.adminCount = adminCount;
        this.activeCount = activeCount;
        this.pendingVerificationCount = pendingVerificationCount;
        this.suspendedCount = suspendedCount;
    }

    public long getTotalUsers() { return totalUsers; }
    public long getPatientCount() { return patientCount; }
    public long getDoctorCount() { return doctorCount; }
    public long getAdminCount() { return adminCount; }
    public long getActiveCount() { return activeCount; }
    public long getPendingVerificationCount() { return pendingVerificationCount; }
    public long getSuspendedCount() { return suspendedCount; }

    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }
    public void setPatientCount(long patientCount) { this.patientCount = patientCount; }
    public void setDoctorCount(long doctorCount) { this.doctorCount = doctorCount; }
    public void setAdminCount(long adminCount) { this.adminCount = adminCount; }
    public void setActiveCount(long activeCount) { this.activeCount = activeCount; }
    public void setPendingVerificationCount(long pendingVerificationCount) { this.pendingVerificationCount = pendingVerificationCount; }
    public void setSuspendedCount(long suspendedCount) { this.suspendedCount = suspendedCount; }
}
