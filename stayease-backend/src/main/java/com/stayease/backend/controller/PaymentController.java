package com.stayease.backend.controller;

import com.razorpay.RazorpayException;
import com.stayease.backend.model.Payment;
import com.stayease.backend.service.PaymentService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    // ✅ Create Razorpay Order
    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> request) {
        try {
            Double amount = Double.valueOf(request.get("amount").toString());
            Long bookingId = Long.valueOf(request.get("bookingId").toString());
            String receipt = "receipt_" + UUID.randomUUID().toString().substring(0, 8);

            System.out.println("✅ Creating Razorpay order for booking: " + bookingId + ", amount: " + amount);



            JSONObject order = paymentService.createRazorpayOrder(amount, "INR", receipt);

            // Create payment record in database
            Payment payment = paymentService.createPayment(bookingId, order.getString("id"));

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "orderId", order.getString("id"),
                    "amount", order.get("amount"),
                    "currency", order.get("currency"),
                    "receipt", order.get("receipt"),
                    "payment", payment
            ));
        } catch (RazorpayException e) {
            System.err.println("❌ Razorpay order creation failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Payment order creation failed: " + e.getMessage()
            ));
        } catch (Exception e) {
            System.err.println("❌ Order creation error: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    // ✅ Verify Payment
    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> request) {
        try {
            String razorpayPaymentId = request.get("razorpay_payment_id");
            String razorpayOrderId = request.get("razorpay_order_id");
            String razorpaySignature = request.get("razorpay_signature");

            System.out.println("✅ Verifying payment: " + razorpayPaymentId);

            Payment payment = paymentService.verifyPayment(razorpayPaymentId, razorpayOrderId, razorpaySignature);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "payment", payment,
                    "message", "Payment verified successfully"
            ));
        } catch (Exception e) {
            System.err.println("❌ Payment verification failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    // ✅ Get Payment by Booking ID
    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<?> getPaymentByBooking(@PathVariable Long bookingId) {
        try {
            Payment payment = paymentService.getPaymentByBookingId(bookingId);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "payment", payment
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    // ✅ Mock Payment for Testing (Without Razorpay)
    @PostMapping("/mock-payment/{bookingId}")
    public ResponseEntity<?> mockPayment(@PathVariable Long bookingId) {
        try {
            System.out.println("✅ Processing mock payment for booking: " + bookingId);

            Payment payment = paymentService.mockPaymentSuccess(bookingId);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "payment", payment,
                    "message", "Mock payment processed successfully"
            ));
        } catch (Exception e) {
            System.err.println("❌ Mock payment failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    // ✅ Check Payment Status
    @GetMapping("/status/{bookingId}")
    public ResponseEntity<?> getPaymentStatus(@PathVariable Long bookingId) {
        try {
            Payment payment = paymentService.getPaymentByBookingId(bookingId);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "status", payment.getStatus(),
                    "payment", payment
            ));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "status", "NOT_FOUND",
                    "message", "No payment found for this booking"
            ));
        }
    }
}