package com.healthcare.doctorservice.config;

import com.healthcare.doctorservice.model.Doctor;
import com.healthcare.doctorservice.repository.DoctorRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedDoctors(DoctorRepository doctorRepository) {
        return args -> {
            if (doctorRepository.count() > 0) {
                return;
            }

            List<Doctor> doctors = List.of(
                    createDoctor("Dr. Amal Perera", "Cardiology", "doctor@medicare.lk", "National Heart Centre", 2500.0, false, "Mon-Fri 8 AM - 4 PM"),
                    createDoctor("Dr. Nimali Silva", "Neurology", "nimali@medicare.lk", "Colombo Central Hospital", 3000.0, true, "Tue-Sat 9 AM - 5 PM"),
                    createDoctor("Dr. Ruwan Jayawardena", "Orthopedics", "ruwan@medicare.lk", "Lanka Orthopedic Clinic", 2000.0, true, "Mon-Fri 10 AM - 6 PM"),
                    createDoctor("Dr. Sachini Gunawardena", "Pediatrics", "sachini@medicare.lk", "Little Steps Hospital", 1800.0, true, "Mon-Sat 8 AM - 2 PM"),
                    createDoctor("Dr. Chamara Fernando", "Dermatology", "chamara@medicare.lk", "SkinCare Medical Centre", 2200.0, false, "Wed-Sun 11 AM - 6 PM"),
                    createDoctor("Dr. Priya Wijesekara", "General Physician", "priya@medicare.lk", "MediCare Primary Care", 1500.0, true, "Daily 7 AM - 3 PM")
            );

            doctorRepository.saveAll(doctors);
        };
    }

    private Doctor createDoctor(
            String name,
            String specialization,
            String email,
            String hospital,
            Double consultationFee,
            Boolean verified,
            String availability
    ) {
        Doctor doctor = new Doctor();
        doctor.setName(name);
        doctor.setSpecialization(specialization);
        doctor.setEmail(email);
        doctor.setHospital(hospital);
        doctor.setConsultationFee(consultationFee);
        doctor.setVerified(verified);
        doctor.setAvailability(availability);
        return doctor;
    }
}
