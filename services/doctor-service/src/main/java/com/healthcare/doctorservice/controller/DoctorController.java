package com.healthcare.doctorservice.controller;

import com.healthcare.doctorservice.model.*;
import com.healthcare.doctorservice.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Doctor Controller aligned with Assignment Example APIs.
 */
@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping
public class DoctorController {

    private final DoctorService doctorService;

    @Autowired
    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    // --- 1. Doctor Profile Management ---
    @PostMapping("/doctors")
    public ResponseEntity<Doctor> registerDoctor(@RequestBody Doctor doctor) {
        return ResponseEntity.ok(doctorService.saveDoctor(doctor));
    }

    @GetMapping("/doctors/{id}")
    public ResponseEntity<Doctor> viewDoctorProfile(@PathVariable Long id) {
        return ResponseEntity.ok(doctorService.getOrCreateDoctor(id));
    }

    @PutMapping("/doctors/{id}")
    public ResponseEntity<Doctor> updateDoctorProfile(@PathVariable Long id, @RequestBody Doctor doctor) {
        return ResponseEntity.ok(doctorService.updateDoctor(id, doctor));
    }

    @GetMapping("/doctors")
    public ResponseEntity<List<Doctor>> listAllDoctors() {
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }

    @PatchMapping("/doctors/{id}/verify")
    public ResponseEntity<Doctor> verifyDoctor(@PathVariable Long id, @RequestBody Boolean verified) {
        return ResponseEntity.ok(doctorService.updateVerificationStatus(id, verified));
    }

    // --- 2. Availability Management ---
    @PostMapping("/doctors/{id}/availability")
    public ResponseEntity<Availability> addAvailability(@PathVariable Long id, @RequestBody Availability availability) {
        return ResponseEntity.ok(doctorService.addAvailability(id, availability));
    }

    @GetMapping("/doctors/{id}/availability")
    public ResponseEntity<List<Availability>> viewAvailability(@PathVariable Long id) {
        return ResponseEntity.ok(doctorService.getAvailabilityByDoctorId(id));
    }

    @PutMapping("/availability/{availabilityId}")
    public ResponseEntity<Availability> updateAvailability(@PathVariable Long availabilityId, @RequestBody Availability availability) {
        return ResponseEntity.ok(doctorService.updateAvailability(availabilityId, availability));
    }

    // --- 3. Appointment Handling ---
    @GetMapping("/doctors/{id}/appointments")
    public ResponseEntity<List<Appointment>> viewAppointments(@PathVariable Long id) {
        return ResponseEntity.ok(doctorService.getAppointmentsForDoctor(id));
    }

    @PutMapping("/appointments/{appointmentId}/status")
    public ResponseEntity<Appointment> handleAppointment(@PathVariable Long appointmentId, 
                                                       @RequestParam AppointmentStatus status) {
        return ResponseEntity.ok(doctorService.updateAppointmentStatus(appointmentId, status));
    }

    // --- Prescription Issuance ---
    @PostMapping("/prescriptions")
    public ResponseEntity<Prescription> createPrescription(@RequestParam Long appointmentId, 
                                                          @RequestBody Prescription prescription) {
        return ResponseEntity.ok(doctorService.issuePrescription(appointmentId, prescription));
    }

    @GetMapping("/prescriptions/{patientId}")
    public ResponseEntity<List<Prescription>> viewPrescriptions(@PathVariable Long patientId) {
        return ResponseEntity.ok(doctorService.getPrescriptionsForPatient(patientId));
    }

    // --- 5. View Patient Info ---
    @GetMapping("/patients/{id}")
    public ResponseEntity<Object> viewPatientInfo(@PathVariable Long id) {
        return ResponseEntity.ok(doctorService.getPatientInfo(id));
    }
}
