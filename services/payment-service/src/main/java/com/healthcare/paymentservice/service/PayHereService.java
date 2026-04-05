package com.healthcare.paymentservice.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.util.Locale;

@Service
public class PayHereService {

    @Value("${payhere.merchant.id}")
    private String merchantId;

    @Value("${payhere.merchant.secret}")
    private String merchantSecret;

    public String generateHash(String orderId, Double amount, String currency) {
        if (orderId == null || amount == null || currency == null || merchantId == null || merchantSecret == null) {
            throw new RuntimeException("Missing data for PayHere hash generation (ID/Secret/Amount/OrderID)");
        }
        try {
            DecimalFormat df = new DecimalFormat("0.00", new DecimalFormatSymbols(Locale.US));
            String amountFormatted = df.format(amount);
            
            MessageDigest md = MessageDigest.getInstance("MD5");
            
            // Hash merchant secret
            md.update(merchantSecret.getBytes());
            byte[] digest = md.digest();
            String hashedSecret = String.format("%032X", new BigInteger(1, digest)).toUpperCase();

            // Hash the combined string securely
            String data = merchantId + orderId + amountFormatted + currency + hashedSecret;
            md.reset();
            md.update(data.getBytes());
            byte[] finalDigest = md.digest();
            return String.format("%032X", new BigInteger(1, finalDigest)).toUpperCase();

        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error generating PayHere hash", e);
        }
    }
}
