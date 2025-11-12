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

import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class BookingServiceImpl implements BookingService {

    @Autowired private BookingRepository bookingRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private HotelRepository hotelRepository;
    @Autowired private RoomRepository roomRepository;

    @Override
    public Booking createBooking(Long userId, BookingRequest req) {
        var user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));
        var hotel = hotelRepository.findById(req.getHotelId()).orElseThrow(() -> new IllegalArgumentException("Hotel not found"));
        var room = roomRepository.findById(req.getRoomId()).orElseThrow(() -> new IllegalArgumentException("Room not found"));

        // check date validity
        if (req.getCheckIn() == null || req.getCheckOut() == null || !req.getCheckIn().isBefore(req.getCheckOut())) {
            throw new IllegalArgumentException("Invalid dates");
        }

        // conflict check: if any CONFIRMED booking overlaps return error
        List<Booking> conflicts = bookingRepository.findByRoomIdAndCheckInLessThanEqualAndCheckOutGreaterThanEqual(
                room.getId(), req.getCheckOut().minusDays(1), req.getCheckIn().plusDays(1));
        boolean hasConflict = conflicts.stream().anyMatch(b -> b.getStatus() == BookingStatus.CONFIRMED);
        if (hasConflict) {
            throw new IllegalStateException("Room already booked for the selected dates");
        }

        long nights = ChronoUnit.DAYS.between(req.getCheckIn(), req.getCheckOut());
        double total = nights * room.getPricePerNight();

        Booking booking = Booking.builder()
                .user(user)
                .hotel(hotel)
                .room(room)
                .checkIn(req.getCheckIn())
                .checkOut(req.getCheckOut())
                .status(BookingStatus.PENDING) // pending until payment
                .totalAmount(total)
                .build();

        return bookingRepository.save(booking);
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
        return bookingRepository.save(booking);
    }
}
