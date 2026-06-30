package com.dropforge.order.service;

import com.dropforge.order.dto.CheckoutRequest;
import com.dropforge.order.dto.CheckoutResponse;
import com.dropforge.order.model.Order;
import com.dropforge.order.model.PaymentMethod;
import com.dropforge.order.repository.OrderRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    @Value("${stripe.api.key}")
    private String stripeApiKey;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @PostConstruct
    public void init() {
        // Initialize Stripe with the secret key when the service starts
        initStripe(stripeApiKey);
    }

    private static void initStripe(String apiKey) {
        Stripe.apiKey = apiKey;
    }

    public CheckoutResponse processCheckout(CheckoutRequest request) throws StripeException {
        Order order = new Order();
        order.setUserId(request.getUserId());
        order.setUserEmail(request.getUserEmail());
        order.setShippingAddress(request.getShippingAddress());
        order.setCity(request.getCity());
        order.setPostalCode(request.getPostalCode());
        order.setPaymentMethod(request.getPaymentMethod());
        order.setTotalAmount(request.getTotalAmount());

        if (request.getPaymentMethod() == PaymentMethod.COD) {
            order.setPaymentStatus("COD_PENDING");
            order.setOrderStatus("PROCESSING");
            orderRepository.save(order);
            
            return new CheckoutResponse(order.getId(), "SUCCESS", null);
        } 
        
        if (request.getPaymentMethod() == PaymentMethod.STRIPE) {
            order.setPaymentStatus("PAYMENT_PENDING");
            order.setOrderStatus("PENDING");

            // Stripe requires amounts in the smallest currency unit (cents)
            long amountInCents = request.getTotalAmount().multiply(new BigDecimal(100)).longValue();

            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(amountInCents)
                    .setCurrency("usd")
                    .build();

            PaymentIntent intent = PaymentIntent.create(params);
            order.setStripePaymentIntentId(intent.getId());
            orderRepository.save(order);

            // Return the client_secret so the React frontend can securely complete the payment
            return new CheckoutResponse(order.getId(), "REQUIRES_PAYMENT", intent.getClientSecret());
        }

        throw new IllegalArgumentException("Invalid payment method");
    }
}