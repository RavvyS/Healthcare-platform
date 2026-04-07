package com.healthcare.auth_service.config;

import com.healthcare.auth_service.entity.AccountStatus;
import com.healthcare.auth_service.entity.Role;
import com.healthcare.auth_service.entity.User;
import com.healthcare.auth_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class DataSeeder {

    private final PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner seedUsers(UserRepository userRepository) {
        return args -> {
            if (userRepository.count() > 0) {
                return;
            }

            userRepository.save(User.builder()
                    .fullName("Nadeesha Admin")
                    .email("admin@medicare.lk")
                    .password(passwordEncoder.encode("Admin@123"))
                    .role(Role.ADMIN)
                    .accountStatus(AccountStatus.ACTIVE)
                    .build());

            userRepository.save(User.builder()
                    .fullName("John Doe")
                    .email("patient@medicare.lk")
                    .password(passwordEncoder.encode("Patient@123"))
                    .role(Role.PATIENT)
                    .accountStatus(AccountStatus.ACTIVE)
                    .build());

            userRepository.save(User.builder()
                    .fullName("Dr. Amal Perera")
                    .email("doctor@medicare.lk")
                    .password(passwordEncoder.encode("Doctor@123"))
                    .role(Role.DOCTOR)
                    .accountStatus(AccountStatus.PENDING_VERIFICATION)
                    .build());
        };
    }
}
