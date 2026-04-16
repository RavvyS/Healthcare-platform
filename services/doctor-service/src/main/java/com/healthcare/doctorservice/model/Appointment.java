package com.healthcare.doctorservice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

//import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long doctorId;
    private Long patientId;
    private java.time.LocalDate date;

    // --- Frontend Compatibility Methods ---
    public String getAppointmentDate() {
        return date != null ? date.toString() : "";
    }

    public String getSlotTime() {
        // Fallback or formatted time for the UI
        return "10:00 AM"; 
    }
    
    @Enumerated(EnumType.STRING)
    private AppointmentStatus status;

    private String consultationType; // "ONLINE" or "PHYSICAL"
    private String reason;
}
