package com.healthcare.auth_service.controller;

import com.healthcare.auth_service.dto.*;
import com.healthcare.auth_service.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService service;

    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterRequest request) {
        return service.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        return service.login(request);
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserSummaryResponse>> getUsers() {
        return ResponseEntity.ok(service.getAllUsers());
    }

    @GetMapping("/users/stats")
    public ResponseEntity<UserStatsResponse> getStats() {
        return ResponseEntity.ok(service.getUserStats());
    }

    @PatchMapping("/users/{id}/status")
    public ResponseEntity<UserSummaryResponse> updateStatus(
            @PathVariable Long id,
            @RequestBody UpdateUserStatusRequest request
    ) {
        return ResponseEntity.ok(service.updateUserStatus(id, request));
    }
}
