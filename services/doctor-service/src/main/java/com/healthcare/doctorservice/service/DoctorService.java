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

    public Doctor updateDoctor(Long id, Doctor doctorDetails) {
        Doctor doctor = doctorRepository.findById(Objects.requireNonNull(id, "ID is required"))
                .orElseThrow(() -> new RuntimeException("Doctor not found with id: " + id));
        
        doctor.setName(doctorDetails.getName());
        doctor.setSpecialization(doctorDetails.getSpecialization());
        doctor.setEmail(doctorDetails.getEmail());
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

    // --- Prescription Issuance ---

    public Prescription issuePrescription(Long appointmentId, Prescription prescription) {
        Appointment appointment = appointmentRepository.findById(Objects.requireNonNull(appointmentId, "ID is required"))
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        
        prescription.setAppointmentId(appointmentId);
        prescription.setDoctorId(appointment.getDoctorId());
        prescription.setPatientId(appointment.getPatientId());
        
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
}
