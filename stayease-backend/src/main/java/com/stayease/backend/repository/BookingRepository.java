package com.stayease.backend.repository;

import com.stayease.backend.model.Booking;
import com.stayease.backend.model.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserId(Long userId);

    // find bookings that collide with a date range for a room
    List<Booking> findByRoomIdAndStatusNotAndCheckOutAfterAndCheckInBefore(
            Long roomId, com.stayease.backend.model.BookingStatus notStatus, LocalDate date, LocalDate date2);

    List<Booking> findByRoomIdAndCheckInLessThanEqualAndCheckOutGreaterThanEqual(Long roomId, LocalDate end, LocalDate start);

    // New methods for the added service methods
    List<Booking> findByHotelId(Long hotelId);
    List<Booking> findByStatus(BookingStatus status);

    List<Booking> findTop10ByOrderByCreatedAtDesc();


    @Query("SELECT b FROM Booking b ORDER BY b.createdAt DESC LIMIT :limit")
    List<Booking> findTopByOrderByCreatedAtDesc(int limit);

    // Additional useful methods
    List<Booking> findByGuestEmail(String email);
    List<Booking> findByCheckInBetween(LocalDate start, LocalDate end);
    List<Booking> findByCheckOutBetween(LocalDate start, LocalDate end);
    Long countByStatus(BookingStatus status);
}
