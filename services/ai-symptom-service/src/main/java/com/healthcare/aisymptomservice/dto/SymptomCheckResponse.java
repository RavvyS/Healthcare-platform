package com.healthcare.aisymptomservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class SymptomCheckResponse {
    private String summary;
    private String recommendedSpecialty;
    private String urgency;
    private List<String> suggestedNextSteps;
}
