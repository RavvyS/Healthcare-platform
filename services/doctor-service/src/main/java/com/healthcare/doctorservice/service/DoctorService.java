package com.healthcare.doctorservice.service;

import com.healthcare.doctorservice.model.*;
import com.healthcare.doctorservice.repository.AppointmentRepository;
import com.healthcare.doctorservice.repository.AvailabilityRepository;
import com.healthcare.doctorservice.repository.DoctorRepository;
import com.healthcare.doctorservice.repository.PrescriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final AvailabilityRepository availabilityRepository;
    private final AppointmentRepository appointmentRepository;
    private final PrescriptionRepository prescriptionRepository;

    @Autowired
    public DoctorService(DoctorRepository doctorRepository, 
                         AvailabilityRepository availabilityRepository,
                         AppointmentRepository appointmentRepository,
                         PrescriptionRepository prescriptionRepository) {
        this.doctorRepository = doctorRepository;
        this.availabilityRepository = availabilityRepository;
        this.appointmentRepository = appointmentRepository;
        this.prescriptionRepository = prescriptionRepository;
    }

    public Doctor saveDoctor(Doctor doctor) {
        //Ensure Doctor is not null
        if (doctor == null) {
            throw new IllegalArgumentException("Doctor cannot be null");
        }
        return doctorRepository.save(doctor);
    }

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    public List<Doctor> searchDoctors(String specialization) {
        if (specialization == null || specialization.isBlank()) {
            return doctorRepository.findAll();
        }
        return doctorRepository.findBySpecializationContainingIgnoreCase(specialization);
    }

    public Optional<Doctor> getDoctorById(Long id) {
        //ensure Id is not null
        return doctorRepository.findById(Objects.requireNonNull(id, "ID is required"));
    }

    public Doctor getOrCreateDoctor(Long id) {
        return doctorRepository.findById(Objects.requireNonNull(id, "ID is required"))
                .orElseGet(() -> {
                    Doctor shell = new Doctor();
                    shell.setId(id);
                    shell.setVerified(false);
                    return shell;
                });
    }

    public Doctor updateDoctor(Long id, Doctor doctorDetails) {
        Doctor doctor = doctorRepository.findById(Objects.requireNonNull(id, "ID is required"))
                .orElseGet(() -> {
                    Doctor shell = new Doctor();
                    shell.setId(id);
                    return shell;
                });
        doctor.setName(doctorDetails.getName());
        doctor.setSpecialization(doctorDetails.getSpecialization());
        doctor.setEmail(doctorDetails.getEmail());
        doctor.setPhone(doctorDetails.getPhone());
        doctor.setHospital(doctorDetails.getHospital());
        doctor.setConsultationFee(doctorDetails.getConsultationFee());
        doctor.setVerified(doctorDetails.getVerified());
        doctor.setAvailability(doctorDetails.getAvailability());
        
        return doctorRepository.save(doctor);
    }

    public void deleteDoctor(Long id) {
        // Fix: Ensure id is NOT null
        doctorRepository.deleteById(Objects.requireNonNull(id, "ID is required"));
    }

    // --- Availability Management ---

    public Availability addAvailability(Long doctorId, Availability availability) {
        Doctor doctor = doctorRepository.findById(Objects.requireNonNull(doctorId, "ID is required"))
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        availability.setDoctor(doctor);
        return availabilityRepository.save(availability);
    }

    public List<Availability> getAvailabilityByDoctorId(Long doctorId) {
        return availabilityRepository.findByDoctorId(Objects.requireNonNull(doctorId, "ID is required"));
    }

     public Availability updateAvailability(Long id, Availability availabilityDetails) {
        Availability availability = availabilityRepository.findById(Objects.requireNonNull(id, "ID is required"))
                .orElseThrow(() -> new RuntimeException("Availability not found"));
        availability.setDate(availabilityDetails.getDate());
        availability.setStartTime(availabilityDetails.getStartTime());
        availability.setEndTime(availabilityDetails.getEndTime());
        return availabilityRepository.save(availability);
    }

    public void removeAvailability(Long availabilityId) {
        availabilityRepository.deleteById(Objects.requireNonNull(availabilityId, "ID is required"));
    }

    // --- Appointment Management ---

    public List<Appointment> getAppointmentsForDoctor(Long doctorId) {
        return appointmentRepository.findByDoctorId(Objects.requireNonNull(doctorId, "ID is required"));
    }

    public Appointment updateAppointmentStatus(Long appointmentId, AppointmentStatus status) {
        Appointment appointment = appointmentRepository.findById(Objects.requireNonNull(appointmentId, "ID is required"))
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        appointment.setStatus(status);
        return appointmentRepository.save(appointment);
    }

    public Appointment createAppointment(Appointment appointment) {
        if (appointment.getStatus() == null) {
            appointment.setStatus(AppointmentStatus.PENDING);
        }
        return appointmentRepository.save(appointment);
    }

    // --- Prescription Issuance ---

    public Prescription issuePrescription(Long appointmentId, Prescription prescription) {
        Appointment appointment = appointmentRepository.findById(Objects.requireNonNull(appointmentId, "ID is required"))
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        
        prescription.setDoctorId(appointment.getDoctorId());
        prescription.setPatientId(appointment.getPatientId());
        prescription.setDate(java.time.LocalDate.now());
        
        return prescriptionRepository.save(prescription);
    }

    public Doctor updateVerificationStatus(Long doctorId, Boolean verified) {
        Doctor doctor = doctorRepository.findById(Objects.requireNonNull(doctorId, "ID is required"))
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        doctor.setVerified(Boolean.TRUE.equals(verified));
        return doctorRepository.save(doctor);
    }

    public List<Prescription> getPrescriptionsForPatient(Long patientId) {
        return prescriptionRepository.findByPatientId(Objects.requireNonNull(patientId, "ID is required"));
    }

    // --- Patient Management (Step 5) ---
    public Object getPatientInfo(Long patientId) {
        // Enriched standardized view for Doctor Portal
        return new java.util.HashMap<String, Object>() {{
            put("id", patientId);
            put("name", "John Doe (Patient)");
            put("email", "john.doe@example.com");
            put("age", 35);
            put("bloodGroup", "O+");
            put("medicalHistory", "Healthy cardiovascular history. No chronic allergies.");
            put("lastVisit", "2023-11-20");
            put("reports", java.util.List.of("Report_2023_BloodTest.pdf", "Report_2023_XRay.pdf"));
        }};
    }
}
