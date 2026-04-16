package com.healthcare.aisymptomservice.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.healthcare.aisymptomservice.dto.SymptomCheckRequest;
import com.healthcare.aisymptomservice.dto.SymptomCheckResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class SymptomAnalysisService {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public SymptomCheckResponse analyze(SymptomCheckRequest request) {
        String symptoms = request.getSymptoms() == null ? "" : request.getSymptoms();
        int severity = request.getSeverity() == null ? 1 : request.getSeverity();
        int age = request.getAge() == null ? 30 : request.getAge();

        try {
            String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + geminiApiKey;
            
            String prompt = String.format(
                "You are an expert medical AI assistant. Analyze these symptoms: '%s'. " +
                "Patient age is %d, self-reported severity is %d/5. " +
                "Respond strictly with valid JSON exactly matching this structure, with no markdown formatting or extra text. " +
                "{ \"summary\": \"2 sentence clinical summary of what this could be. Add a disclaimer that this is not medical advice.\", " +
                "\"specialty\": \"The most relevant medical specialty (e.g. Cardiology, Dermatology).\", " +
                "\"urgency\": \"Low / Moderate / High / Emergency\", " +
                "\"nextSteps\": [\"Step 1\", \"Step 2\", \"Step 3\"] }",
                symptoms.replace("\"", "\\\"").replace("\n", " "), age, severity
            );

            Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                    Map.of(
                        "parts", List.of(
                            Map.of("text", prompt)
                        )
                    )
                )
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            String responseObj = restTemplate.postForObject(url, entity, String.class);
            JsonNode rootNode = objectMapper.readTree(responseObj);
            String aiText = rootNode.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();
            
            // Clean up possible markdown code blocks returned by LLMs
            aiText = aiText.replaceAll("```json", "").replaceAll("```", "").trim();
            
            JsonNode resultNode = objectMapper.readTree(aiText);
            
            String summary = resultNode.path("summary").asText();
            String specialty = resultNode.path("specialty").asText();
            String urgency = resultNode.path("urgency").asText();
            List<String> nextSteps = new ArrayList<>();
            resultNode.path("nextSteps").forEach(node -> nextSteps.add(node.asText()));
            
            return new SymptomCheckResponse(summary, specialty, urgency, nextSteps);

        } catch (Exception e) {
            e.printStackTrace();
            return new SymptomCheckResponse(
                "Error analyzing symptoms via AI: " + e.getMessage(), 
                "General Physician", 
                "Moderate", 
                List.of("Please consult a doctor directly.", "AI service temporarily unavailable.", "Check your internet or API key.")
            );
        }
    }
}
