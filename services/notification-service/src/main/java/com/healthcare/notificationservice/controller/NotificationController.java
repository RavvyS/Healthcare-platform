package com.healthcare.notificationservice.controller;

import com.healthcare.notificationservice.dto.NotificationRequest;
import com.healthcare.notificationservice.model.NotificationRecord;
import com.healthcare.notificationservice.service.NotificationLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificationLogService notificationLogService;

    @PostMapping("/send")
    public ResponseEntity<NotificationRecord> send(@RequestBody NotificationRequest request) {
        return ResponseEntity.ok(notificationLogService.send(request));
    }

    @GetMapping
    public ResponseEntity<List<NotificationRecord>> getAll() {
        return ResponseEntity.ok(notificationLogService.getAll());
    }
}
