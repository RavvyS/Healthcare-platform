package com.healthcare.paymentservice.controller;

import com.healthcare.paymentservice.dto.HashRequest;
import com.healthcare.paymentservice.dto.HashResponse;
import com.healthcare.paymentservice.service.PayHereService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PaymentController {

    private final PayHereService payHereService;

    @PostMapping("/hash")
    public ResponseEntity<HashResponse> generateHash(@RequestBody HashRequest request) {
        String hash = payHereService.generateHash(request.getOrderId(), request.getAmount(), request.getCurrency());
        return ResponseEntity.ok(HashResponse.builder().hash(hash).build());
    }
}
