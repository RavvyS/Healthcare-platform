package com.healthcare.auth_service.dto;

public class ForgotPasswordRequest {
    private String email;

    public ForgotPasswordRequest() {}

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
