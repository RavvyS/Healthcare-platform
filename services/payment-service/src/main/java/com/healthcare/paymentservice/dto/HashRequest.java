package com.healthcare.paymentservice.dto;

import lombok.Data;

@Data
public class HashRequest {
    private String orderId;
    private Double amount;
    private String currency;
}
