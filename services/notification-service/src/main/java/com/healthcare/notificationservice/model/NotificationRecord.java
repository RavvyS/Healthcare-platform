package com.healthcare.notificationservice.model;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class NotificationRecord {
    private Long id;
    private String channel;
    private String recipientRole;
    private Long recipientId;
    private String subject;
    private String message;
    private LocalDateTime createdAt;
}
