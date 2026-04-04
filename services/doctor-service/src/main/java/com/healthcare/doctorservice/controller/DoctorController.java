package com.healthcare.doctorservice.controller;

import com.healthcare.doctorservice.model.*;
import com.healthcare.doctorservice.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    private final DoctorService doctorService;

    @Autowired
    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @PostMapping
    public ResponseEntity<Doctor> createDoctor(@RequestBody Doctor doctor) {
        return ResponseEntity.ok(doctorService.saveDoctor(doctor));
    }

    @GetMapping
    public ResponseEntity<List<Doctor>> getAllDoctors() {
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Doctor> getDoctorById(@PathVariable Long id) {
        return doctorService.getDoctorById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Doctor> updateDoctor(@PathVariable Long id, @RequestBody Doctor doctor) {
        return ResponseEntity.ok(doctorService.updateDoctor(id, doctor));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDoctor(@PathVariable Long id) {
        doctorService.deleteDoctor(id);
        return ResponseEntity.noContent().build();
    }

    // --- Availability Endpoints ---

    @PostMapping("/{id}/availability")
    public ResponseEntity<Availability> addAvailability(@PathVariable Long id, @RequestBody Availability availability) {
        return ResponseEntity.ok(doctorService.addAvailability(id, availability));
    }

    @GetMapping("/{id}/availability")
    public ResponseEntity<List<Availability>> getAvailability(@PathVariable Long id) {
        return ResponseEntity.ok(doctorService.getAvailabilityByDoctorId(id));
    }

    @DeleteMapping("/availability/{availabilityId}")
    public ResponseEntity<Void> removeAvailability(@PathVariable Long availabilityId) {
        doctorService.removeAvailability(availabilityId);
        return ResponseEntity.noContent().build();
    }

    // --- Appointment Endpoints ---

    @GetMapping("/{id}/appointments")
    public ResponseEntity<List<Appointment>> getAppointments(@PathVariable Long id) {
        return ResponseEntity.ok(doctorService.getAppointmentsForDoctor(id));
    }

    @PatchMapping("/appointments/{appointmentId}/status")
    public ResponseEntity<Appointment> updateStatus(@PathVariable Long appointmentId, 
                                                   @RequestParam AppointmentStatus status) {
        return ResponseEntity.ok(doctorService.updateAppointmentStatus(appointmentId, status));
    }

    // --- Prescription Endpoints ---

    @PostMapping("/appointments/{appointmentId}/prescribe")
    public ResponseEntity<Prescription> prescribe(@PathVariable Long appointmentId, 
                                                  @RequestBody Prescription prescription) {
        return ResponseEntity.ok(doctorService.issuePrescription(appointmentId, prescription));
    }
}
