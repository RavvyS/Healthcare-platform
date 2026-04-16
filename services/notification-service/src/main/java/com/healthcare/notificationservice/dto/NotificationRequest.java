package com.healthcare.notificationservice.dto;

import lombok.Data;

@Data
public class NotificationRequest {
    private String channel;
    private String recipientRole;
    private Long recipientId;
    private String recipientEmail;
    private String subject;
    private String message;
}
