package com.healthcare.notificationservice.service;

import com.healthcare.notificationservice.dto.NotificationRequest;
import com.healthcare.notificationservice.model.NotificationRecord;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class NotificationLogService {

    private final AtomicLong idGenerator = new AtomicLong(1);
    private final CopyOnWriteArrayList<NotificationRecord> records = new CopyOnWriteArrayList<>();

    public NotificationRecord send(NotificationRequest request) {
        NotificationRecord record = new NotificationRecord(
                idGenerator.getAndIncrement(),
                request.getChannel(),
                request.getRecipientRole(),
                request.getRecipientId(),
                request.getSubject(),
                request.getMessage(),
                LocalDateTime.now()
        );
        records.add(0, record);
        return record;
    }

    public List<NotificationRecord> getAll() {
        return records;
    }
}
