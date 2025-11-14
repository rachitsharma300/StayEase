package com.stayease.backend.service;

import com.stayease.backend.model.*;
import com.stayease.backend.repository.BookingRepository;
import com.stayease.backend.repository.PaymentRepository;
import com.stayease.backend.service.impl.PaymentServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class PaymentServiceImplTest {

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private BookingRepository bookingRepository;

    @InjectMocks
    private PaymentServiceImpl paymentService;

    private Booking testBooking;
    private Payment testPayment;

    @BeforeEach
    void init() {
        MockitoAnnotations.openMocks(this);

        testBooking = new Booking();
        testBooking.setId(1L);
        testBooking.setTotalAmount(100.0);
        testBooking.setStatus(BookingStatus.PENDING);

        testPayment = new Payment();
        testPayment.setId(1L);
        testPayment.setBooking(testBooking);
        testPayment.setAmount(100.0);
        testPayment.setStatus(PaymentStatus.COMPLETED);
        testPayment.setRazorpayOrderId("order_123");
    }

    @Test
    void testCreatePayment() {
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(testBooking));
        when(paymentRepository.save(any(Payment.class))).thenReturn(testPayment);

        Payment created = paymentService.createPayment(1L, "order_123");

        assertNotNull(created);
        assertEquals("order_123", created.getRazorpayOrderId());
        assertEquals(100.0, created.getAmount());
        verify(paymentRepository, times(1)).save(any(Payment.class));
    }

    @Test
    void testMockPaymentSuccess() {
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(testBooking));
        when(bookingRepository.save(any(Booking.class))).thenReturn(testBooking);
        when(paymentRepository.save(any(Payment.class))).thenReturn(testPayment);

        Payment result = paymentService.mockPaymentSuccess(1L);

        assertNotNull(result);
        assertEquals(PaymentStatus.COMPLETED, result.getStatus());
        verify(bookingRepository, times(1)).save(any(Booking.class));
        verify(paymentRepository, times(1)).save(any(Payment.class));
    }

    @Test
    void testVerifyPayment() {
        Payment pendingPayment = new Payment();
        pendingPayment.setId(1L);
        pendingPayment.setStatus(PaymentStatus.PENDING);
        pendingPayment.setRazorpayOrderId("order_123");
        pendingPayment.setBooking(testBooking);

        when(paymentRepository.findByRazorpayOrderId("order_123"))
                .thenReturn(Optional.of(pendingPayment));
        when(bookingRepository.save(any(Booking.class))).thenReturn(testBooking);
        when(paymentRepository.save(any(Payment.class))).thenReturn(testPayment);

        Payment result = paymentService.verifyPayment("pay_123", "order_123", "sig_123");

        assertNotNull(result);
        assertEquals(PaymentStatus.COMPLETED, result.getStatus());
        assertEquals("pay_123", result.getRazorpayPaymentId());
    }

    @Test
    void testGetPaymentByBookingId() {
        when(paymentRepository.findByBookingId(1L)).thenReturn(Optional.of(testPayment));

        Payment result = paymentService.getPaymentByBookingId(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals(testBooking, result.getBooking());
    }

    @Test
    void testGetPaymentByBookingId_NotFound() {
        when(paymentRepository.findByBookingId(1L)).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, () -> {
            paymentService.getPaymentByBookingId(1L);
        });

        assertTrue(exception.getMessage().contains("Payment not found for booking: 1"));
    }
}