package com.healthcare.auth_service.config;

import java.util.List;
import com.healthcare.auth_service.entity.AccountStatus;
import com.healthcare.auth_service.entity.Role;
import com.healthcare.auth_service.entity.User;
import com.healthcare.auth_service.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataSeeder {

    private final PasswordEncoder passwordEncoder;

    public DataSeeder(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    @Bean
    CommandLineRunner seedUsers(UserRepository userRepository) {
        return args -> {
            // 1. Clean up and ensure the specific admin account is always active
            List<User> list = userRepository.findAll().stream()
                    .filter(u -> "ravindusdc@gmail.com".equalsIgnoreCase(u.getEmail()))
                    .toList();

            User admin;
            if (list.isEmpty()) {
                admin = userRepository.save(User.builder()
                        .fullName("Ravindu Admin")
                        .email("ravindusdc@gmail.com")
                        .password(passwordEncoder.encode("Admin@1234"))
                        .role(Role.ADMIN)
                        .accountStatus(AccountStatus.ACTIVE)
                        .build());
            } else {
                // Take the first one and delete any others if they exist
                admin = list.get(0);
                if (list.size() > 1) {
                    for (int i = 1; i < list.size(); i++) {
                        userRepository.delete(list.get(i));
                    }
                }
                
                // Ensure it's active, an admin, and has the latest password
                admin.setAccountStatus(AccountStatus.ACTIVE);
                admin.setRole(Role.ADMIN);
                admin.setPassword(passwordEncoder.encode("Admin@1234"));
                userRepository.save(admin);
            }

            // 2. Regular seeding for other test data (only if empty or just containing admin)
            if (userRepository.count() <= 1) { 
                userRepository.save(User.builder()
                        .fullName("John Doe")
                        .email("patient@medicare.lk")
                        .password(passwordEncoder.encode("Patient@123"))
                        .role(Role.PATIENT)
                        .accountStatus(AccountStatus.PENDING_VERIFICATION)
                        .build());

                userRepository.save(User.builder()
                        .fullName("Dr. Amal Perera")
                        .email("doctor@medicare.lk")
                        .password(passwordEncoder.encode("Doctor@123"))
                        .role(Role.DOCTOR)
                        .accountStatus(AccountStatus.PENDING_VERIFICATION)
                        .build());
            }
        };
    }
}
