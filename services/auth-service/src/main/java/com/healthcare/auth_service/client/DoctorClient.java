package com.healthcare.auth_service.client;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class DoctorClient {

    private final RestTemplate restTemplate;
    private static final String DOCTOR_SERVICE_URL = "http://doctor-service:8082/doctors";

    public DoctorClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public void verifyDoctor(Long doctorId, boolean verified) {
        try {
            String url = DOCTOR_SERVICE_URL + "/" + doctorId + "/verify";
            HttpEntity<Boolean> request = new HttpEntity<>(verified);
            restTemplate.exchange(url, HttpMethod.PATCH, request, Object.class);
            System.out.println("Successfully updated doctor verification in doctor-service for ID: " + doctorId);
        } catch (Exception e) {
            System.err.println("Failed to update doctor verification in doctor-service: " + e.getMessage());
        }
    }
}
