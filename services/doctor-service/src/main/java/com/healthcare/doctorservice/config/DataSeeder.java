package com.healthcare.doctorservice.config;

import com.healthcare.doctorservice.model.Appointment;
import com.healthcare.doctorservice.model.AppointmentStatus;
import com.healthcare.doctorservice.model.Doctor;
import com.healthcare.doctorservice.repository.AppointmentRepository;
import com.healthcare.doctorservice.repository.DoctorRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataSeeder {

    @SuppressWarnings("null")
    @Bean
    CommandLineRunner seedDoctors(DoctorRepository doctorRepository, AppointmentRepository appointmentRepository) {
        return args -> {
            // Seed Doctors if empty
            if (doctorRepository.count() == 0) {
                List<Doctor> doctors = List.of(
                        createDoctor("Dr. Amal Perera", "Cardiology", "doctor@medicare.lk", "+94 77 123 4567", "National Heart Centre", 2500.0, false, "Mon-Fri 8 AM - 4 PM"),
                        createDoctor("Dr. Nimali Silva", "Neurology", "nimali@medicare.lk", "+94 77 234 5678", "Colombo Central Hospital", 3000.0, true, "Tue-Sat 9 AM - 5 PM"),
                        createDoctor("Dr. Ruwan Jayawardena", "Orthopedics", "ruwan@medicare.lk", "+94 77 345 6789", "Lanka Orthopedic Clinic", 2000.0, true, "Mon-Fri 10 AM - 6 PM"),
                        createDoctor("Dr. Sachini Gunawardena", "Pediatrics", "sachini@medicare.lk", "+94 77 456 7890", "Little Steps Hospital", 1800.0, true, "Mon-Sat 8 AM - 2 PM")
                );
                doctorRepository.saveAll(doctors);
            }

            // Seed Sample Appointments (Clear first for alignment)
            appointmentRepository.deleteAll();
            List<Doctor> allDoctors = doctorRepository.findAll();
            if (!allDoctors.isEmpty()) {
                Appointment appt1 = new Appointment();
                appt1.setDoctorId(allDoctors.get(0).getId()); 
                appt1.setPatientId(101L);
                appt1.setDate(java.time.LocalDate.now().plusDays(1));
                appt1.setStatus(AppointmentStatus.PENDING);
                appt1.setConsultationType("PHYSICAL");
                appt1.setReason("Severe joint pain in the left knee.");

                Appointment appt2 = new Appointment();
                appt2.setDoctorId(allDoctors.get(0).getId()); 
                appt2.setPatientId(102L);
                appt2.setDate(java.time.LocalDate.now().plusDays(2));
                appt2.setStatus(AppointmentStatus.PENDING);
                appt2.setConsultationType("ONLINE");
                appt2.setReason("Follow-up on cardiovascular medication.");

                appointmentRepository.saveAll(List.of(appt1, appt2));
            }
        };
    }

    private Doctor createDoctor(
            String name,
            String specialization,
            String email,
            String phone,
            String hospital,
            Double consultationFee,
            Boolean verified,
            String availability
    ) {
        Doctor doctor = new Doctor();
        doctor.setName(name);
        doctor.setSpecialization(specialization);
        doctor.setEmail(email);
        doctor.setPhone(phone);
        doctor.setHospital(hospital);
        doctor.setConsultationFee(consultationFee);
        doctor.setVerified(verified);
        doctor.setAvailability(availability);
        return doctor;
    }
}
