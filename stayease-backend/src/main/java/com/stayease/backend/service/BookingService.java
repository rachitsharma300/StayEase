package com.stayease.backend.service;

import com.stayease.backend.dto.BookingRequest;
import com.stayease.backend.model.Booking;
import com.stayease.backend.model.BookingStatus;

import java.util.List;
import java.util.Optional;


public interface BookingService {
    Booking createBooking(Long userId, BookingRequest req);
    List<Booking> getBookingsByUser(Long userId);
    Booking cancelBooking(Long userId, Long bookingId);
    Optional<Booking> getBookingById(Long bookingId);
    List<Booking> getAllBookings();


    // New methods

    Booking updateBookingStatus(Long bookingId, BookingStatus status);
    Booking confirmBooking(Long bookingId);
    List<Booking> getBookingsByHotel(Long hotelId);
    List<Booking> getBookingsByStatus(BookingStatus status);
    List<Booking> getRecentBookings(int limit);
}
