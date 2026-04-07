
package com.healthcare.auth_service.service;

import com.healthcare.auth_service.dto.*;
import com.healthcare.auth_service.entity.AccountStatus;
import com.healthcare.auth_service.entity.Role;
import com.healthcare.auth_service.entity.User;
import com.healthcare.auth_service.repository.UserRepository;
import com.healthcare.auth_service.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository repository;
    private final PasswordEncoder encoder;
    private final JwtService jwtService;

    public AuthResponse register(RegisterRequest request) {

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(encoder.encode(request.getPassword()))
                .role(request.getRole())
                .accountStatus(request.getRole() == Role.DOCTOR ? AccountStatus.PENDING_VERIFICATION : AccountStatus.ACTIVE)
                .build();

        repository.save(user);

        String token = jwtService.generateToken(user.getEmail());

        return toAuthResponse(user, token);
    }

    public AuthResponse login(LoginRequest request) {

        User user = repository.findByEmail(request.getEmail())
                .orElseThrow();

        if (!encoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        if (user.getAccountStatus() == AccountStatus.SUSPENDED) {
            throw new RuntimeException("This account has been suspended");
        }

        String token = jwtService.generateToken(user.getEmail());

        return toAuthResponse(user, token);
    }

    public List<UserSummaryResponse> getAllUsers() {
        return repository.findAll().stream()
                .sorted(Comparator.comparing(User::getId).reversed())
                .map(this::toUserSummary)
                .toList();
    }

    public UserStatsResponse getUserStats() {
        List<User> users = repository.findAll();

        long patientCount = users.stream().filter(user -> user.getRole() == Role.PATIENT).count();
        long doctorCount = users.stream().filter(user -> user.getRole() == Role.DOCTOR).count();
        long adminCount = users.stream().filter(user -> user.getRole() == Role.ADMIN).count();
        long activeCount = users.stream().filter(user -> user.getAccountStatus() == AccountStatus.ACTIVE).count();
        long pendingCount = users.stream().filter(user -> user.getAccountStatus() == AccountStatus.PENDING_VERIFICATION).count();
        long suspendedCount = users.stream().filter(user -> user.getAccountStatus() == AccountStatus.SUSPENDED).count();

        return new UserStatsResponse(
                users.size(),
                patientCount,
                doctorCount,
                adminCount,
                activeCount,
                pendingCount,
                suspendedCount
        );
    }

    public UserSummaryResponse updateUserStatus(Long userId, UpdateUserStatusRequest request) {
        User user = repository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setAccountStatus(request.getAccountStatus());
        repository.save(user);

        return toUserSummary(user);
    }

    private AuthResponse toAuthResponse(User user, String token) {
        return new AuthResponse(
                token,
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getRole(),
                user.getAccountStatus()
        );
    }

    private UserSummaryResponse toUserSummary(User user) {
        return new UserSummaryResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                user.getAccountStatus()
        );
    }
}
