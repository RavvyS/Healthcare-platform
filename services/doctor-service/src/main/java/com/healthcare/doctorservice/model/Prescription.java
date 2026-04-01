package com.healthcare.doctorservice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "prescriptions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Prescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long appointmentId;
    private Long doctorId;
    private Long patientId;
    
    private String medication;
    private String dosage;
    private String instructions;
    
    private LocalDateTime issuedDate;

    @PrePersist
    protected void onCreate() {
        issuedDate = LocalDateTime.now();
    }
}
