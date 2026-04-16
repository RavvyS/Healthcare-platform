package com.healthcare.aisymptomservice.dto;

import lombok.Data;

@Data
public class SymptomCheckRequest {
    private String symptoms;
    private Integer age;
    private Integer severity;
}
