package com.healthcare.appointmentservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AppointmentInitResponse {
    private String orderId;
    private Double amount;
    private String currency;
    private Long appointmentId;
}
