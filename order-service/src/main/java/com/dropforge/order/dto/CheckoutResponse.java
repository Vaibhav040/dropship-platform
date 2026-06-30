package com.dropforge.order.dto;

public class CheckoutResponse {
    private String orderId;
    private String status;
    private String clientSecret; // Used exclusively for Stripe payments

    public CheckoutResponse(String orderId, String status, String clientSecret) {
        this.orderId = orderId;
        this.status = status;
        this.clientSecret = clientSecret;
    }

    // Getters
    public String getOrderId() { return orderId; }
    public String getStatus() { return status; }
    public String getClientSecret() { return clientSecret; }
}