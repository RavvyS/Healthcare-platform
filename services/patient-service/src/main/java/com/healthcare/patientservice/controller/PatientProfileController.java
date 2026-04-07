package com.healthcare.patientservice.controller;

import com.healthcare.patientservice.model.MedicalReport;
import com.healthcare.patientservice.model.PatientProfile;
import com.healthcare.patientservice.service.PatientProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PatientProfileController {

    private final PatientProfileService patientProfileService;

    @GetMapping("/{patientId}/profile")
    public ResponseEntity<PatientProfile> getProfile(@PathVariable Long patientId) {
        return ResponseEntity.ok(patientProfileService.getProfile(patientId));
    }

    @PutMapping("/{patientId}/profile")
    public ResponseEntity<PatientProfile> updateProfile(@PathVariable Long patientId, @RequestBody PatientProfile request) {
        return ResponseEntity.ok(patientProfileService.updateProfile(patientId, request));
    }

    @GetMapping("/{patientId}/reports")
    public ResponseEntity<List<MedicalReport>> getReports(@PathVariable Long patientId) {
        return ResponseEntity.ok(patientProfileService.getReports(patientId));
    }

    @PostMapping("/{patientId}/reports")
    public ResponseEntity<MedicalReport> addReport(@PathVariable Long patientId, @RequestBody MedicalReport report) {
        return ResponseEntity.ok(patientProfileService.addReport(patientId, report));
    }
}
