package com.healthcare.patientservice.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.OneToMany;
import jakarta.persistence.CascadeType;
import java.util.List;

@Entity
@Table(name = "patient_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientProfile {

    @Id
    private Long patientId;

    private String fullName;
    private String email;
    private String phone;
    private String address;
    private String bloodGroup;
    private String allergies;
    private String emergencyContact;
    private String medicalNotes;

    @OneToMany(mappedBy = "patientProfile", cascade = CascadeType.ALL)
    private List<MedicalReport> medicalReports;
}
