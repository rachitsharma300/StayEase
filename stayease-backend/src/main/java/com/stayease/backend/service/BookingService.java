package com.stayease.backend.service;

import com.stayease.backend.dto.BookingRequest;
import com.stayease.backend.model.Booking;

import java.util.List;

public interface BookingService {
    Booking createBooking(Long userId, BookingRequest req);
    List<Booking> getBookingsByUser(Long userId);
    Booking cancelBooking(Long userId, Long bookingId);
}
