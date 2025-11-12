package com.stayease.backend.controller;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.stayease.backend.model.Payment;
import com.stayease.backend.service.PaymentService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Value("${razorpay.key_id}")
    private String razorpayKey;

    @Value("${razorpay.key_secret}")
    private String razorpaySecret;

    @PostMapping("/create-order")
    public String createOrder(@RequestParam Long bookingId, @RequestParam Double amount) throws Exception {

        RazorpayClient razorpayClient = new RazorpayClient(razorpayKey, razorpaySecret);

        JSONObject options = new JSONObject();
        options.put("amount", (int)(amount * 100)); // convert to paise
        options.put("currency", "INR");
        options.put("receipt", "receipt_" + bookingId);

        Order order = razorpayClient.orders.create(options);
        return order.toString();
    }

    @PostMapping("/verify-payment")
    public Payment verifyPayment(@RequestParam Long bookingId, @RequestParam String paymentId) {
        return paymentService.markAsPaid(bookingId, paymentId);
    }
}
