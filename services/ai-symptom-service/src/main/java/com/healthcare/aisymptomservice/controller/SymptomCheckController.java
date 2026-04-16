package com.healthcare.aisymptomservice.controller;

import com.healthcare.aisymptomservice.dto.SymptomCheckRequest;
import com.healthcare.aisymptomservice.dto.SymptomCheckResponse;
import com.healthcare.aisymptomservice.service.SymptomAnalysisService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/symptom-checker")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SymptomCheckController {

    private final SymptomAnalysisService symptomAnalysisService;

    @PostMapping("/analyze")
    public ResponseEntity<SymptomCheckResponse> analyze(@RequestBody SymptomCheckRequest request) {
        return ResponseEntity.ok(symptomAnalysisService.analyze(request));
    }
}
