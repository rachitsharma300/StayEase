package com.stayease.backend.service.impl;

import com.stayease.backend.dto.BookingRequest;
import com.stayease.backend.model.*;
import com.stayease.backend.repository.BookingRepository;
import com.stayease.backend.repository.HotelRepository;
import com.stayease.backend.repository.RoomRepository;
import com.stayease.backend.repository.UserRepository;
import com.stayease.backend.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
public class BookingServiceImpl implements BookingService {

    @Autowired private BookingRepository bookingRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private HotelRepository hotelRepository;
    @Autowired private RoomRepository roomRepository;

    // ✅ EXISTING METHOD - FIXED
    @Override
    public Booking createBooking(Long userId, BookingRequest req) {
        System.out.println("📅 Creating booking for user: " + userId);

        var user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));
        var hotel = hotelRepository.findById(req.getHotelId()).orElseThrow(() -> new IllegalArgumentException("Hotel not found"));
        var room = roomRepository.findById(req.getRoomId()).orElseThrow(() -> new IllegalArgumentException("Room not found"));

        // check date validity
        if (req.getCheckIn() == null || req.getCheckOut() == null || !req.getCheckIn().isBefore(req.getCheckOut())) {
            throw new IllegalArgumentException("Invalid dates");
        }

        // conflict check
        List<Booking> conflicts = bookingRepository.findByRoomIdAndCheckInLessThanEqualAndCheckOutGreaterThanEqual(
                room.getId(), req.getCheckOut().minusDays(1), req.getCheckIn().plusDays(1));

        boolean hasConflict = conflicts.stream()
                .anyMatch(b -> b.getStatus() == BookingStatus.CONFIRMED);

        if (hasConflict) {
            throw new IllegalStateException("Room already booked for the selected dates");
        }

        // Calculate nights and total
        long nights = ChronoUnit.DAYS.between(req.getCheckIn(), req.getCheckOut());
        double total = nights * room.getPricePerNight();

        // ✅ FIX: Add guest information and set proper status
        Booking booking = Booking.builder()
                .user(user)
                .hotel(hotel)
                .room(room)
                .checkIn(req.getCheckIn())
                .checkOut(req.getCheckOut())
                .guests(req.getGuests())
                .status(BookingStatus.PENDING)
                .totalAmount(total)
                .guestName(req.getGuestName())
                .guestEmail(req.getGuestEmail())
                .guestPhone(req.getGuestPhone())
                .specialRequests(req.getSpecialRequests())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Booking savedBooking = bookingRepository.save(booking);
        System.out.println("✅ Booking created successfully: " + savedBooking.getId());
        return savedBooking;
    }

    @Override
    public List<Booking> getBookingsByUser(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    @Override
    public Booking cancelBooking(Long userId, Long bookingId) {
        var booking = bookingRepository.findById(bookingId).orElseThrow(() -> new IllegalArgumentException("Booking not found"));
        if (!booking.getUser().getId().equals(userId)) {
            throw new SecurityException("Not allowed");
        }
        booking.setStatus(BookingStatus.CANCELLED);
        booking.setUpdatedAt(LocalDateTime.now());
        return bookingRepository.save(booking);
    }

    // ✅ NEW METHOD: Get booking by ID
    @Override
    public Optional<Booking> getBookingById(Long bookingId) {
        return bookingRepository.findById(bookingId);
    }

    // ✅ NEW METHOD: Get all bookings
    @Override
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    // ✅ NEW METHOD: Update booking status (for admin)
    public Booking updateBookingStatus(Long bookingId, BookingStatus status) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));

        booking.setStatus(status);
        booking.setUpdatedAt(LocalDateTime.now());

        return bookingRepository.save(booking);
    }

    // ✅ NEW METHOD: Confirm booking (specific method for admin)
    public Booking confirmBooking(Long bookingId) {
        return updateBookingStatus(bookingId, BookingStatus.CONFIRMED);
    }

    // ✅ NEW METHOD: Get bookings by hotel
    public List<Booking> getBookingsByHotel(Long hotelId) {
        return bookingRepository.findByHotelId(hotelId);
    }

    // ✅ NEW METHOD: Get bookings by status
    public List<Booking> getBookingsByStatus(BookingStatus status) {
        return bookingRepository.findByStatus(status);
    }

    // ✅ NEW METHOD: Get recent bookings
    public List<Booking> getRecentBookings(int limit) {
        return bookingRepository.findTopByOrderByCreatedAtDesc(limit);
    }



}