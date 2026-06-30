package com.dropforge.order.controller;

import com.dropforge.order.dto.CheckoutRequest;
import com.dropforge.order.dto.CheckoutResponse;
import com.dropforge.order.service.OrderService;
import com.stripe.exception.StripeException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost", "http://localhost:80"})
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/checkout")
    public ResponseEntity<CheckoutResponse> checkout(@RequestBody CheckoutRequest request) {
        try {
            CheckoutResponse response = orderService.processCheckout(request);
            return ResponseEntity.ok(response);
        } catch (StripeException e) {
            // If Stripe's API fails, return a 500 error
            return ResponseEntity.internalServerError().build();
        }
    }
}