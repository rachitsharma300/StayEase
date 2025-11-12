package com.stayease.backend.service.impl;

import com.stayease.backend.model.Payment;
import com.stayease.backend.model.PaymentStatus;
import com.stayease.backend.model.Booking;
import com.stayease.backend.model.BookingStatus;
import com.stayease.backend.repository.PaymentRepository;
import com.stayease.backend.repository.BookingRepository;
import com.stayease.backend.service.PaymentService;

import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Order;
import org.json.JSONObject;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private BookingRepository bookingRepository;

    // Read Razorpay credentials from application.properties
    @Value("${razorpay.key_id}")
    private String RAZORPAY_KEY;

    @Value("${razorpay.key_secret}")
    private String RAZORPAY_SECRET;

    /**
     * Create Razorpay order before payment
     */
    @Override
    public JSONObject createRazorPayOrder(Long bookingId) throws RazorpayException {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));

        RazorpayClient client = new RazorpayClient(RAZORPAY_KEY, RAZORPAY_SECRET);

        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", (long) (booking.getTotalAmount() * 100)); // paise
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", "order_rcpt_" + bookingId);
        orderRequest.put("payment_capture", 1);

        Order order = client.orders.create(orderRequest);

        JSONObject response = new JSONObject();
        response.put("orderId", order.get("id").toString());
        response.put("amount", Long.valueOf(order.get("amount").toString()));
        response.put("currency", order.get("currency").toString());

        return response;
    }

    /**
     * Called when Razorpay confirms payment success
     */
    @Override
    public Payment markAsPaid(Long bookingId, String razorpayPaymentId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));

        Payment payment = Payment.builder()
                .bookingId(bookingId)
                .amount(booking.getTotalAmount())
                .paymentProviderId(razorpayPaymentId)
                .status(PaymentStatus.SUCCESS)
                .build();

        paymentRepository.save(payment);

        booking.setStatus(BookingStatus.CONFIRMED);
        bookingRepository.save(booking);

        return payment;
    }

    /**
     * Optional: fallback simulate payment
     */
    @Override
    public Payment payForBooking(Long bookingId, Double amount) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));

        Payment payment = Payment.builder()
                .bookingId(bookingId)
                .amount(amount)
                .paymentProviderId(UUID.randomUUID().toString())
                .status(PaymentStatus.SUCCESS)
                .build();

        paymentRepository.save(payment);

        if (payment.getStatus() == PaymentStatus.SUCCESS) {
            booking.setStatus(BookingStatus.CONFIRMED);
            bookingRepository.save(booking);
        }

        return payment;
    }
}
