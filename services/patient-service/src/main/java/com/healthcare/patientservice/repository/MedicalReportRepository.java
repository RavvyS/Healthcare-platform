package com.healthcare.patientservice.repository;

import com.healthcare.patientservice.model.MedicalReport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MedicalReportRepository extends JpaRepository<MedicalReport, Long> {
    List<MedicalReport> findByPatientIdOrderByUploadedAtDesc(Long patientId);
}
