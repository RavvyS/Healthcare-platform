package com.healthcare.appointmentservice.service;

import com.healthcare.appointmentservice.dto.AppointmentRequest;
import com.healthcare.appointmentservice.model.Appointment;
import com.healthcare.appointmentservice.model.AppointmentStatus;
import com.healthcare.appointmentservice.repository.AppointmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.UUID;
import com.healthcare.appointmentservice.dto.AppointmentInitResponse;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository repository;

    public AppointmentInitResponse initPayment(AppointmentRequest request) {
        LocalDateTime start = request.getAppointmentDate().toLocalDate().atStartOfDay();
        LocalDateTime end = request.getAppointmentDate().toLocalDate().atTime(23, 59, 59);
        
        boolean isBooked = repository.findByDoctorIdAndAppointmentDateBetween(request.getDoctorId(), start, end)
                .stream()
                .anyMatch(a -> a.getSlotTime().equals(request.getSlotTime()) && 
                          a.getStatus() != AppointmentStatus.CANCELLED && 
                          a.getStatus() != AppointmentStatus.REJECTED &&
                          a.getStatus() != AppointmentStatus.UNPAID);
                          
        if (isBooked) {
            throw new RuntimeException("This slot is already booked for the selected doctor.");
        }

        String orderId = UUID.randomUUID().toString();
        Double fee = request.getFee();
        if (fee == null || fee <= 0) {
            throw new RuntimeException("Invalid fee amount");
        }

        Appointment appointment = Appointment.builder()
                .patientId(request.getPatientId())
                .doctorId(request.getDoctorId())
                .appointmentDate(request.getAppointmentDate())
                .slotTime(request.getSlotTime())
                .reason(request.getReason())
                .consultationType(request.getConsultationType())
                .fee(fee)
                .orderId(orderId)
                .status(AppointmentStatus.UNPAID)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        if (appointment == null) {
            throw new RuntimeException("Appointment data is null");
        }

        Appointment saved = repository.save(appointment);
        if (saved == null || saved.getId() == null) {
            throw new RuntimeException("Failed to save appointment");
        }

        return AppointmentInitResponse.builder()
                .orderId(orderId)
                .amount(fee)
                .currency("LKR")
                .appointmentId(saved.getId())
                .build();
    }

    public void finalizePayment(Long appointmentId) {
        if (appointmentId == null) return;
        repository.findById(appointmentId).ifPresent(appointment -> {
            // Safe fallback if it was already confirmed by webhook
            if (appointment.getStatus() == AppointmentStatus.UNPAID) {
                appointment.setStatus(AppointmentStatus.PENDING);
                appointment.setUpdatedAt(LocalDateTime.now());
                repository.save(appointment);
            }
        });
    }

    public List<Appointment> getPatientAppointments(Long patientId) {
        return repository.findByPatientId(patientId);
    }

    public List<String> getBookedSlots(Long doctorId, LocalDate date) {
        LocalDateTime start = date.atStartOfDay();
        LocalDateTime end = date.atTime(23, 59, 59);
        return repository.findByDoctorIdAndAppointmentDateBetween(doctorId, start, end)
                .stream()
                .filter(a -> a.getStatus() != AppointmentStatus.CANCELLED && a.getStatus() != AppointmentStatus.REJECTED)
                .map(Appointment::getSlotTime)
                .collect(Collectors.toList());
    }

    public List<Appointment> getDoctorAppointments(Long doctorId) {
        return repository.findByDoctorId(doctorId);
    }

    public Optional<Appointment> updateStatus(Long id, AppointmentStatus status) {
        if (id == null) return Optional.empty();
        return repository.findById(id).map(appointment -> {
            appointment.setStatus(status);
            appointment.setUpdatedAt(LocalDateTime.now());
            return repository.save(appointment);
        });
    }

    public Optional<Appointment> getAppointment(Long id) {
        if (id == null) return Optional.empty();
        return repository.findById(id);
    }

    public void cancelAppointment(Long id) {
        if (id == null) return;
        repository.findById(id).ifPresent(appointment -> {
            appointment.setStatus(AppointmentStatus.CANCELLED);
            appointment.setUpdatedAt(LocalDateTime.now());
            repository.save(appointment);
        });
    }
}
