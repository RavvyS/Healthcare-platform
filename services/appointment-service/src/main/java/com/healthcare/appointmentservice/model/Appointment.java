package com.healthcare.appointmentservice.model;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long patientId; // Reference to Patient user
    private Long doctorId;  // Reference to Doctor

    private LocalDateTime appointmentDate;
    private String slotTime; // e.g., "10:00 AM - 10:30 AM"
    
    private String consultationType; // "ONLINE" or "PHYSICAL"
    private Double fee;
    private String orderId;

    @Enumerated(EnumType.STRING)
    private AppointmentStatus status;

    private String reason;
    private String diagnosis; // Optional, updated by doctor
    private String prescriptionId; // Reference to digital prescription

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
