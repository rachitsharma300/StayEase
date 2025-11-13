package com.stayease.backend.service;

import com.razorpay.RazorpayException;
import com.stayease.backend.model.Payment;
import org.json.JSONObject;

import java.util.Map;

public interface PaymentService {
    JSONObject createRazorpayOrder(Double amount, String currency, String receipt) throws RazorpayException;
    Payment createPayment(Long bookingId, String razorpayOrderId);
    Payment verifyPayment(String razorpayPaymentId, String razorpayOrderId, String razorpaySignature);
    Payment getPaymentByBookingId(Long bookingId);
    Payment mockPaymentSuccess(Long bookingId); // For testing
}