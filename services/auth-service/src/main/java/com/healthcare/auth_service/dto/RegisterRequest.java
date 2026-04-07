package com.healthcare.auth_service.dto;



import com.healthcare.auth_service.entity.Role;
import lombok.Data;

@Data
public class RegisterRequest {

    private String fullName;
    private String email;
    private String password;
    private Role role;
}
