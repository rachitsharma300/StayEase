package com.stayease.backend.service;

import com.stayease.backend.model.Payment;
import com.razorpay.RazorpayException;
import org.json.JSONObject;

public interface PaymentService {

    // Create Razorpay order → this is called before payment happens
    JSONObject createRazorPayOrder(Long bookingId) throws RazorpayException;

    // Called when Razorpay confirms payment success
    Payment markAsPaid(Long bookingId, String razorpayPaymentId);

    // (Optional fallback)
    Payment payForBooking(Long bookingId, Double amount);


}
