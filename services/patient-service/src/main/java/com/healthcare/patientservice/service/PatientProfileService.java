package com.healthcare.patientservice.service;

import com.healthcare.patientservice.dto.MedicalReportDTO;
import com.healthcare.patientservice.dto.PatientProfileDTO;
import com.healthcare.patientservice.exception.ResourceNotFoundException;
import com.healthcare.patientservice.model.MedicalReport;
import com.healthcare.patientservice.model.PatientProfile;
import com.healthcare.patientservice.repository.MedicalReportRepository;
import com.healthcare.patientservice.repository.PatientProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PatientProfileService {

    private final PatientProfileRepository patientProfileRepository;
    private final MedicalReportRepository medicalReportRepository;

    public PatientProfileDTO getProfile(Long patientId) {
        PatientProfile profile = patientProfileRepository.findById(patientId)
                .orElse(PatientProfile.builder().patientId(patientId).build());
        return mapToDTO(profile);
    }

    public PatientProfileDTO updateProfile(Long patientId, PatientProfileDTO request) {
        PatientProfile existing = patientProfileRepository.findById(patientId)
                .orElse(PatientProfile.builder().patientId(patientId).build());

        existing.setFullName(request.getFullName());
        existing.setEmail(request.getEmail());
        existing.setPhone(request.getPhone());
        existing.setAddress(request.getAddress());
        existing.setBloodGroup(request.getBloodGroup());
        existing.setAllergies(request.getAllergies());
        existing.setEmergencyContact(request.getEmergencyContact());
        existing.setMedicalNotes(request.getMedicalNotes());

        PatientProfile saved = patientProfileRepository.save(existing);
        return mapToDTO(saved);
    }

    public List<MedicalReportDTO> getReports(Long patientId) {
        if (!patientProfileRepository.existsById(patientId)) {
            return java.util.Collections.emptyList();
        }

        List<MedicalReport> reports = medicalReportRepository
                .findByPatientProfile_PatientIdOrderByUploadedAtDesc(patientId);
        return reports.stream().map(this::mapToReportDTO).collect(Collectors.toList());
    }

    public MedicalReportDTO addReport(Long patientId, MedicalReportDTO reportDto) {
        PatientProfile profile = patientProfileRepository.findById(patientId)
                .orElseGet(() -> patientProfileRepository.save(PatientProfile.builder().patientId(patientId).build()));

        MedicalReport report = MedicalReport.builder()
                .patientProfile(profile)
                .reportName(reportDto.getReportName())
                .reportType(reportDto.getReportType())
                .notes(reportDto.getNotes())
                .documentUrl(reportDto.getDocumentUrl())
                .build();

        MedicalReport saved = medicalReportRepository.save(report);
        return mapToReportDTO(saved);
    }

    private PatientProfileDTO mapToDTO(PatientProfile profile) {
        return PatientProfileDTO.builder()
                .patientId(profile.getPatientId())
                .fullName(profile.getFullName())
                .email(profile.getEmail())
                .phone(profile.getPhone())
                .address(profile.getAddress())
                .bloodGroup(profile.getBloodGroup())
                .allergies(profile.getAllergies())
                .emergencyContact(profile.getEmergencyContact())
                .medicalNotes(profile.getMedicalNotes())
                .build();
    }

    private MedicalReportDTO mapToReportDTO(MedicalReport report) {
        return MedicalReportDTO.builder()
                .reportId(report.getReportId())
                .patientId(report.getPatientProfile().getPatientId())
                .reportName(report.getReportName())
                .reportType(report.getReportType())
                .notes(report.getNotes())
                .documentUrl(report.getDocumentUrl())
                .uploadedAt(report.getUploadedAt())
                .build();
    }
}
