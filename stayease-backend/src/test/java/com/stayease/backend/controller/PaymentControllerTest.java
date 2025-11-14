package com.stayease.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.razorpay.RazorpayException;
import com.stayease.backend.model.Payment;
import com.stayease.backend.model.PaymentStatus;
import com.stayease.backend.service.PaymentService;
import org.json.JSONObject;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Map;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

public class PaymentControllerTest {

    private MockMvc mockMvc;

    @Mock
    private PaymentService paymentService;

    @InjectMocks
    private PaymentController paymentController;

    private ObjectMapper mapper = new ObjectMapper();

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(paymentController).build();
    }

    // ✅ FIXED: Create Razorpay Order with proper matchers
    @Test
    void testCreateOrder() throws Exception {
        JSONObject razorpayOrder = new JSONObject();
        razorpayOrder.put("id", "order_123");
        razorpayOrder.put("amount", 50000);
        razorpayOrder.put("currency", "INR");
        razorpayOrder.put("receipt", "receipt_1111");

        Payment payment = new Payment();
        payment.setId(1L);
        payment.setRazorpayOrderId("order_123");

        // ✅ FIXED: Use proper argument matchers
        when(paymentService.createRazorpayOrder(eq(500.0), eq("INR"), anyString()))
                .thenReturn(razorpayOrder);
        when(paymentService.createPayment(eq(1L), eq("order_123")))
                .thenReturn(payment);

        mockMvc.perform(post("/api/payments/create-order")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(Map.of(
                                "amount", 500.0,
                                "bookingId", 1
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.orderId").value("order_123"))
                .andExpect(jsonPath("$.payment.id").value(1));

        verify(paymentService, times(1)).createRazorpayOrder(eq(500.0), eq("INR"), anyString());
    }

    // Other test methods remain the same as previous fix...
    @Test
    void testVerifyPayment() throws Exception {
        Payment payment = new Payment();
        payment.setId(10L);
        payment.setStatus(PaymentStatus.COMPLETED);

        when(paymentService.verifyPayment(anyString(), anyString(), anyString())).thenReturn(payment);

        mockMvc.perform(post("/api/payments/verify")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(Map.of(
                                "razorpay_payment_id", "pay_abc",
                                "razorpay_order_id", "order_123",
                                "razorpay_signature", "sign_xyz"
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.payment.id").value(10))
                .andExpect(jsonPath("$.message").value("Payment verified successfully"));
    }

    @Test
    void testGetPaymentByBooking() throws Exception {
        Payment payment = new Payment();
        payment.setId(100L);
        payment.setStatus(PaymentStatus.COMPLETED);

        when(paymentService.getPaymentByBookingId(1L)).thenReturn(payment);

        mockMvc.perform(get("/api/payments/booking/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.payment.id").value(100));

        verify(paymentService).getPaymentByBookingId(1L);
    }

    @Test
    void testMockPayment() throws Exception {
        Payment payment = new Payment();
        payment.setId(20L);
        payment.setStatus(PaymentStatus.COMPLETED);

        when(paymentService.mockPaymentSuccess(2L)).thenReturn(payment);

        mockMvc.perform(post("/api/payments/mock-payment/2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.payment.id").value(20))
                .andExpect(jsonPath("$.message").value("Mock payment processed successfully"));
    }

    @Test
    void testGetPaymentStatus() throws Exception {
        Payment payment = new Payment();
        payment.setId(1L);
        payment.setStatus(PaymentStatus.COMPLETED);

        when(paymentService.getPaymentByBookingId(1L)).thenReturn(payment);

        mockMvc.perform(get("/api/payments/status/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.status").value("COMPLETED"))
                .andExpect(jsonPath("$.payment.id").value(1));
    }
}