package com.healthcare.patientservice.repository;

import com.healthcare.patientservice.model.PatientProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PatientProfileRepository extends JpaRepository<PatientProfile, Long> {
}
