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

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository repository;

    public Appointment bookAppointment(AppointmentRequest request) {
        LocalDateTime start = request.getAppointmentDate().toLocalDate().atStartOfDay();
        LocalDateTime end = request.getAppointmentDate().toLocalDate().atTime(23, 59, 59);
        
        boolean isBooked = repository.findByDoctorIdAndAppointmentDateBetween(request.getDoctorId(), start, end)
                .stream()
                .anyMatch(a -> a.getSlotTime().equals(request.getSlotTime()) && 
                          a.getStatus() != AppointmentStatus.CANCELLED && 
                          a.getStatus() != AppointmentStatus.REJECTED);
                          
        if (isBooked) {
            throw new RuntimeException("This slot is already booked for the selected doctor.");
        }

        Appointment appointment = Appointment.builder()
                .patientId(request.getPatientId())
                .doctorId(request.getDoctorId())
                .appointmentDate(request.getAppointmentDate())
                .slotTime(request.getSlotTime())
                .reason(request.getReason())
                .status(AppointmentStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return repository.save(appointment);
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
        return repository.findById(id).map(appointment -> {
            appointment.setStatus(status);
            appointment.setUpdatedAt(LocalDateTime.now());
            return repository.save(appointment);
        });
    }

    public Optional<Appointment> getAppointment(Long id) {
        return repository.findById(id);
    }

    public void cancelAppointment(Long id) {
        repository.findById(id).ifPresent(appointment -> {
            appointment.setStatus(AppointmentStatus.CANCELLED);
            appointment.setUpdatedAt(LocalDateTime.now());
            repository.save(appointment);
        });
    }
}
