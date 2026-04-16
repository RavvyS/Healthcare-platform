package com.healthcare.patientservice.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MedicalReportDTO {

    private Long reportId;
    
    private Long patientId;

    @NotBlank(message = "Report name is required")
    private String reportName;

    @NotBlank(message = "Report type is required")
    private String reportType;

    private String notes;

    @NotBlank(message = "Document URL is required")
    private String documentUrl;

    private LocalDateTime uploadedAt;
}
