package com.healthcare.telemedicineservice.controller;

import com.healthcare.telemedicineservice.dto.SessionRequest;
import com.healthcare.telemedicineservice.dto.SessionResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

@RestController
@RequestMapping("/api/telemedicine")
@CrossOrigin(origins = "*")
public class SessionController {

    @Value("${jitsi.room.secret}")
    private String secret;

    @PostMapping("/create-session")
    public ResponseEntity<SessionResponse> createSession(@RequestBody SessionRequest request) {
        if (request.getAppointmentId() == null) {
            throw new IllegalArgumentException("Appointment ID is mandatory");
        }

        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            String data = request.getAppointmentId() + "-" + secret;
            byte[] digest = md.digest(data.getBytes());
            String hash = String.format("%064x", new BigInteger(1, digest)).substring(0, 16);

            String url = "https://meet.jit.si/RavvyCare-Telemed-" + hash;

            return ResponseEntity.ok(SessionResponse.builder().jitsiUrl(url).build());
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Secure hashing failed", e);
        }
    }
}
