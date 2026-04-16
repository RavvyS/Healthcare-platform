package com.healthcare.auth_service.service;

import com.healthcare.auth_service.client.NotificationClient;
import com.healthcare.auth_service.dto.*;
import com.healthcare.auth_service.entity.AccountStatus;
import com.healthcare.auth_service.entity.Role;
import com.healthcare.auth_service.entity.User;
import com.healthcare.auth_service.repository.UserRepository;
import com.healthcare.auth_service.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository repository;
    private final PasswordEncoder encoder;
    private final JwtService jwtService;
    private final NotificationClient notificationClient;
    private final com.healthcare.auth_service.client.DoctorClient doctorClient;

    public AuthService(UserRepository repository, PasswordEncoder encoder, JwtService jwtService, 
                       NotificationClient notificationClient, com.healthcare.auth_service.client.DoctorClient doctorClient) {
        this.repository = repository;
        this.encoder = encoder;
        this.jwtService = jwtService;
        this.notificationClient = notificationClient;
        this.doctorClient = doctorClient;
    }

    public AuthResponse register(RegisterRequest request) {
        if (repository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already in use. Please use a different email or log in.");
        }
        
        boolean isAdmin = request.getRole() == Role.ADMIN;
        
        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(encoder.encode(request.getPassword()))
                .role(request.getRole())
                .accountStatus(isAdmin ? AccountStatus.ACTIVE : AccountStatus.PENDING_VERIFICATION)
                .build();

        repository.save(user);

        if (isAdmin) {
            // Send direct welcome email for Admin
            notificationClient.sendEmail(
                    user.getEmail(),
                    "Welcome to MediCare Admin Team",
                    "Hello " + user.getFullName() + ",\n\n" +
                    "Your administrator account has been created successfully. You can now log in and access the dashboard.\n\n" +
                    "Login here: http://localhost:5173\n\n" +
                    "Best regards,\nMediCare Team"
            );
        } else {
            // Send registration pending email for Patients and Doctors
            notificationClient.sendEmail(
                    user.getEmail(),
                    "Registration Received - MediCare",
                    "Hello " + user.getFullName() + ",\n\n" +
                    "Thank you for registering at MediCare. Your account is currently pending review.\n\n" +
                    "An administrator will verify your account shortly. You will receive another email once your account is approved and ready for login.\n\n" +
                    "Best regards,\nMediCare Team"
            );
        }

        String token = jwtService.generateToken(user.getEmail());
        return toAuthResponse(user, token);
    }

    public AuthResponse login(LoginRequest request) {
        User user = repository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!encoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        if (user.getAccountStatus() == AccountStatus.PENDING_VERIFICATION) {
            throw new RuntimeException("Your account is pending admin approval. You will receive an email once it is approved.");
        }

        if (user.getAccountStatus() == AccountStatus.SUSPENDED) {
            throw new RuntimeException("This account has been suspended. Please contact support.");
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

        long patientCount = users.stream().filter(u -> u.getRole() == Role.PATIENT).count();
        long doctorCount = users.stream().filter(u -> u.getRole() == Role.DOCTOR).count();
        long adminCount = users.stream().filter(u -> u.getRole() == Role.ADMIN).count();
        long activeCount = users.stream().filter(u -> u.getAccountStatus() == AccountStatus.ACTIVE).count();
        long pendingCount = users.stream().filter(u -> u.getAccountStatus() == AccountStatus.PENDING_VERIFICATION).count();
        long suspendedCount = users.stream().filter(u -> u.getAccountStatus() == AccountStatus.SUSPENDED).count();

        return new UserStatsResponse(users.size(), patientCount, doctorCount, adminCount, activeCount, pendingCount, suspendedCount);
    }

    public UserSummaryResponse updateUserStatus(Long userId, UpdateUserStatusRequest request) {
        User user = repository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        AccountStatus previousStatus = user.getAccountStatus();
        user.setAccountStatus(request.getAccountStatus());
        repository.save(user);

        // Send email when admin approves a pending account
        if (previousStatus == AccountStatus.PENDING_VERIFICATION && request.getAccountStatus() == AccountStatus.ACTIVE) {
            notificationClient.sendEmail(
                    user.getEmail(),
                    "Your MediCare Account Has Been Approved!",
                    "Hello " + user.getFullName() + ",\n\n" +
                    "Great news! Your MediCare account has been reviewed and approved by our team.\n\n" +
                    "You can now log in to your account and access all platform features.\n\n" +
                    "Login here: http://localhost:5173\n\n" +
                    "Best regards,\nMediCare Team"
            );

            // Sync verification to doctor-service if user is a Doctor
            if (user.getRole() == com.healthcare.auth_service.entity.Role.DOCTOR) {
                doctorClient.verifyDoctor(user.getId(), true);
            }
        }

        // Send email when account is suspended
        if (request.getAccountStatus() == AccountStatus.SUSPENDED) {
            notificationClient.sendEmail(
                    user.getEmail(),
                    "Your MediCare Account Has Been Suspended",
                    "Hello " + user.getFullName() + ",\n\n" +
                    "Your MediCare account has been suspended. If you believe this is a mistake, please contact our support team.\n\n" +
                    "Best regards,\nMediCare Team"
            );
        }

        return toUserSummary(user);
    }

    public void requestPasswordReset(String email) {
        User user = repository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User with this email does not exist"));

        String token = UUID.randomUUID().toString();
        user.setResetToken(token);
        user.setResetTokenExpiry(LocalDateTime.now().plusHours(1));
        repository.save(user);

        String resetLink = "http://localhost:5173/reset-password?token=" + token;
        notificationClient.sendEmail(
                user.getEmail(),
                "Password Reset Request",
                "Hello " + user.getFullName() + ",\n\n" +
                "You requested to reset your password. Click the link below to proceed:\n" +
                resetLink + "\n\n" +
                "This link will expire in 1 hour.\n\n" +
                "If you did not request this, please ignore this email."
        );
    }

    public void resetPassword(String token, String newPassword) {
        User user = repository.findAll().stream()
                .filter(u -> token.equals(u.getResetToken()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Invalid or expired reset token"));

        if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Reset token has expired");
        }

        user.setPassword(encoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        repository.save(user);
    }

    private AuthResponse toAuthResponse(User user, String token) {
        return new AuthResponse(token, user.getId(), user.getEmail(), user.getFullName(), user.getRole(), user.getAccountStatus());
    }

    private UserSummaryResponse toUserSummary(User user) {
        return new UserSummaryResponse(user.getId(), user.getFullName(), user.getEmail(), user.getRole(), user.getAccountStatus());
    }
}
