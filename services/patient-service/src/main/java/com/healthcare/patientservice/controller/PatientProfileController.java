package com.healthcare.patientservice.controller;

import com.healthcare.patientservice.dto.MedicalReportDTO;
import com.healthcare.patientservice.dto.PatientProfileDTO;
import com.healthcare.patientservice.service.PatientProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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
    public ResponseEntity<PatientProfileDTO> getProfile(@PathVariable Long patientId) {
        return ResponseEntity.ok(patientProfileService.getProfile(patientId));
    }

    @PutMapping("/{patientId}/profile")
    public ResponseEntity<PatientProfileDTO> updateProfile(
            @PathVariable Long patientId, 
            @Valid @RequestBody PatientProfileDTO request) {
        return ResponseEntity.ok(patientProfileService.updateProfile(patientId, request));
    }

    @GetMapping("/{patientId}/reports")
    public ResponseEntity<List<MedicalReportDTO>> getReports(@PathVariable Long patientId) {
        return ResponseEntity.ok(patientProfileService.getReports(patientId));
    }

    @PostMapping("/{patientId}/reports")
    public ResponseEntity<MedicalReportDTO> addReport(
            @PathVariable Long patientId, 
            @Valid @RequestBody MedicalReportDTO report) {
        return ResponseEntity.status(HttpStatus.CREATED).body(patientProfileService.addReport(patientId, report));
    }
}
