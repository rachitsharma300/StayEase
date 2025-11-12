package com.stayease.backend.repository;

import com.stayease.backend.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserId(Long userId);

    // find bookings that collide with a date range for a room
    List<Booking> findByRoomIdAndStatusNotAndCheckOutAfterAndCheckInBefore(
            Long roomId, com.stayease.backend.model.BookingStatus notStatus, LocalDate date, LocalDate date2);

    List<Booking> findByRoomIdAndCheckInLessThanEqualAndCheckOutGreaterThanEqual(Long roomId, LocalDate end, LocalDate start);
}
