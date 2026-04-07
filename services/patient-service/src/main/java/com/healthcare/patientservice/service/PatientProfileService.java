package com.healthcare.patientservice.service;

import com.healthcare.patientservice.model.MedicalReport;
import com.healthcare.patientservice.model.PatientProfile;
import com.healthcare.patientservice.repository.MedicalReportRepository;
import com.healthcare.patientservice.repository.PatientProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PatientProfileService {

    private final PatientProfileRepository patientProfileRepository;
    private final MedicalReportRepository medicalReportRepository;

    public PatientProfile getProfile(Long patientId) {
        return patientProfileRepository.findById(patientId)
                .orElseGet(() -> patientProfileRepository.save(PatientProfile.builder()
                        .id(patientId)
                        .fullName("John Doe")
                        .email("patient@medicare.lk")
                        .phone("+94 77 123 4567")
                        .address("Colombo, Sri Lanka")
                        .bloodGroup("A+")
                        .allergies("No known drug allergies")
                        .emergencyContact("Jane Doe - +94 71 222 3344")
                        .medicalNotes("History of seasonal asthma.")
                        .build()));
    }

    public PatientProfile updateProfile(Long patientId, PatientProfile request) {
        PatientProfile existing = getProfile(patientId);
        existing.setFullName(request.getFullName());
        existing.setEmail(request.getEmail());
        existing.setPhone(request.getPhone());
        existing.setAddress(request.getAddress());
        existing.setBloodGroup(request.getBloodGroup());
        existing.setAllergies(request.getAllergies());
        existing.setEmergencyContact(request.getEmergencyContact());
        existing.setMedicalNotes(request.getMedicalNotes());
        return patientProfileRepository.save(existing);
    }

    public List<MedicalReport> getReports(Long patientId) {
        getProfile(patientId);
        return medicalReportRepository.findByPatientIdOrderByUploadedAtDesc(patientId);
    }

    public MedicalReport addReport(Long patientId, MedicalReport report) {
        getProfile(patientId);
        report.setId(null);
        report.setPatientId(patientId);
        return medicalReportRepository.save(report);
    }
}
