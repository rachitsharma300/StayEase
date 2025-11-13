package com.stayease.backend.service.impl;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.stayease.backend.model.*;
import com.stayease.backend.model.PaymentStatus;
import com.stayease.backend.repository.BookingRepository;
import com.stayease.backend.repository.PaymentRepository;
import com.stayease.backend.service.PaymentService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    private RazorpayClient getRazorpayClient() throws RazorpayException {
        return new RazorpayClient(razorpayKeyId, razorpayKeySecret);
    }

    @Override
    public JSONObject createRazorpayOrder(Double amount, String currency, String receipt) throws RazorpayException {
        try {
            RazorpayClient razorpay = getRazorpayClient();

            // Convert amount to paise
            int amountInPaise = (int) (amount * 100);

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amountInPaise);
            orderRequest.put("currency", currency);
            orderRequest.put("receipt", receipt);
            orderRequest.put("payment_capture", 1);

            Order order = razorpay.orders.create(orderRequest);
            return order.toJson();

        } catch (RazorpayException e) {
            System.err.println("❌ Razorpay order creation failed: " + e.getMessage());
            throw e;
        }
    }

    @Override
    public Payment createPayment(Long bookingId, String razorpayOrderId) {
        try {
            Optional<Booking> bookingOpt = bookingRepository.findById(bookingId);
            if (bookingOpt.isEmpty()) {
                throw new RuntimeException("Booking not found with id: " + bookingId);
            }

            Booking booking = bookingOpt.get();

            Payment payment = Payment.builder()
                    .booking(booking)
                    .amount(booking.getTotalAmount())
                    .paymentMethod("RAZORPAY")
                    .status(PaymentStatus.PENDING)
                    .razorpayOrderId(razorpayOrderId)
                    .transactionId("txn_" + UUID.randomUUID().toString().substring(0, 8))
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            return paymentRepository.save(payment);

        } catch (Exception e) {
            System.err.println("❌ Payment creation failed: " + e.getMessage());
            throw new RuntimeException("Failed to create payment: " + e.getMessage());
        }
    }

    @Override
    public Payment verifyPayment(String razorpayPaymentId, String razorpayOrderId, String razorpaySignature) {
        try {
            // In real scenario, verify signature with Razorpay
            // For now, we'll simulate successful verification

            Payment payment = paymentRepository.findByRazorpayOrderId(razorpayOrderId)
                    .orElseThrow(() -> new RuntimeException("Payment not found for order: " + razorpayOrderId));

            // Update payment status
            payment.setStatus(PaymentStatus.COMPLETED);
            payment.setRazorpayPaymentId(razorpayPaymentId);
            payment.setRazorpaySignature(razorpaySignature);
            payment.setUpdatedAt(LocalDateTime.now());

            // Update booking status
            Booking booking = payment.getBooking();
            booking.setStatus(BookingStatus.CONFIRMED);
            booking.setUpdatedAt(LocalDateTime.now());
            bookingRepository.save(booking);

            return paymentRepository.save(payment);

        } catch (Exception e) {
            System.err.println("❌ Payment verification failed: " + e.getMessage());
            throw new RuntimeException("Payment verification failed: " + e.getMessage());
        }
    }

    @Override
    public Payment getPaymentByBookingId(Long bookingId) {
        return paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new RuntimeException("Payment not found for booking: " + bookingId));
    }

    @Override
    public Payment mockPaymentSuccess(Long bookingId) {
        try {
            System.out.println("🔄 Processing mock payment for booking: " + bookingId);

            Optional<Booking> bookingOpt = bookingRepository.findById(bookingId);
            if (bookingOpt.isEmpty()) {
                throw new RuntimeException("Booking not found with id: " + bookingId);
            }

            Booking booking = bookingOpt.get();

            // Update booking status to CONFIRMED
            booking.setStatus(BookingStatus.CONFIRMED);
            booking.setUpdatedAt(LocalDateTime.now());
            Booking updatedBooking = bookingRepository.save(booking);

            System.out.println("✅ Booking status updated to CONFIRMED");

            // Create payment record
            Payment payment = Payment.builder()
                    .booking(updatedBooking)
                    .amount(booking.getTotalAmount())
                    .paymentMethod("MOCK")
                    .status(PaymentStatus.COMPLETED)
                    .transactionId("mock_txn_" + System.currentTimeMillis())
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            Payment savedPayment = paymentRepository.save(payment);

            System.out.println("✅ Mock payment completed for booking: " + bookingId);

            return savedPayment;

        } catch (Exception e) {
            System.err.println("❌ Mock payment failed: " + e.getMessage());
            throw new RuntimeException("Mock payment failed: " + e.getMessage());
        }
    }
}