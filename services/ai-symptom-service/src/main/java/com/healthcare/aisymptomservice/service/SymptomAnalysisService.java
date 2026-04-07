package com.healthcare.aisymptomservice.service;

import com.healthcare.aisymptomservice.dto.SymptomCheckRequest;
import com.healthcare.aisymptomservice.dto.SymptomCheckResponse;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
public class SymptomAnalysisService {

    public SymptomCheckResponse analyze(SymptomCheckRequest request) {
        String symptoms = request.getSymptoms() == null ? "" : request.getSymptoms().toLowerCase(Locale.ROOT);
        int severity = request.getSeverity() == null ? 1 : request.getSeverity();

        String specialty = "General Physician";
        String urgency = severity >= 4 ? "High" : "Moderate";
        String summary = "Your symptoms suggest a general medical review would be helpful.";
        List<String> nextSteps = new ArrayList<>();

        if (symptoms.contains("chest") || symptoms.contains("palpitation") || symptoms.contains("heart")) {
            specialty = "Cardiology";
            summary = "The symptom pattern includes possible cardiovascular indicators.";
        } else if (symptoms.contains("skin") || symptoms.contains("rash") || symptoms.contains("itch")) {
            specialty = "Dermatology";
            summary = "The symptoms appear related to a skin or allergy concern.";
        } else if (symptoms.contains("joint") || symptoms.contains("knee") || symptoms.contains("back pain")) {
            specialty = "Orthopedics";
            summary = "The symptoms point toward a musculoskeletal issue.";
        } else if (symptoms.contains("headache") || symptoms.contains("seizure") || symptoms.contains("migraine")) {
            specialty = "Neurology";
            summary = "The symptoms suggest a neurological assessment may be useful.";
        } else if (symptoms.contains("child") || symptoms.contains("baby") || symptoms.contains("fever in child")) {
            specialty = "Pediatrics";
            summary = "The consultation appears best suited to a child-health specialist.";
        }

        if (severity >= 5 || symptoms.contains("shortness of breath") || symptoms.contains("fainting")) {
            urgency = "Emergency";
            nextSteps.add("Seek urgent in-person medical attention or emergency care immediately.");
        } else if (severity >= 3) {
            nextSteps.add("Book a doctor consultation within 24 hours.");
        } else {
            nextSteps.add("Schedule a routine consultation and monitor symptom progression.");
        }

        nextSteps.add("Prepare any recent medical reports before the appointment.");
        nextSteps.add("Use this result only as a preliminary guide, not a diagnosis.");

        return new SymptomCheckResponse(summary, specialty, urgency, nextSteps);
    }
}
