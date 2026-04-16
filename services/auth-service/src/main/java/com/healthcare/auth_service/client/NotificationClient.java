package com.healthcare.auth_service.client;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class NotificationClient {

    private final RestTemplate restTemplate;
    private static final String NOTIFICATION_SERVICE_URL = "http://notification-service:8088/api/notifications/send";

    public NotificationClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public void sendEmail(String recipientEmail, String subject, String message) {
        try {
            NotificationRequest request = new NotificationRequest("EMAIL", recipientEmail, subject, message);
            restTemplate.postForObject(NOTIFICATION_SERVICE_URL, request, Object.class);
        } catch (Exception e) {
            System.err.println("Failed to call notification service: " + e.getMessage());
        }
    }

    public static class NotificationRequest {
        private String channel;
        private String recipientEmail;
        private String subject;
        private String message;

        public NotificationRequest(String channel, String recipientEmail, String subject, String message) {
            this.channel = channel;
            this.recipientEmail = recipientEmail;
            this.subject = subject;
            this.message = message;
        }

        public String getChannel() { return channel; }
        public String getRecipientEmail() { return recipientEmail; }
        public String getSubject() { return subject; }
        public String getMessage() { return message; }
    }
}
