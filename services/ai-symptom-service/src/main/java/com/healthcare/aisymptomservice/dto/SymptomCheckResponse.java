package com.healthcare.aisymptomservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
public class SymptomCheckResponse {
    private String summary;
    private String recommendedSpecialty;
    private String urgency;
    private List<String> suggestedNextSteps;

    public SymptomCheckResponse() {}

    public SymptomCheckResponse(String summary, String recommendedSpecialty, String urgency, List<String> suggestedNextSteps) {
        this.summary = summary;
        this.recommendedSpecialty = recommendedSpecialty;
        this.urgency = urgency;
        this.suggestedNextSteps = suggestedNextSteps;
    }
}
