package com.stayease.backend.service.impl;

import com.stayease.backend.model.Booking;
import com.stayease.backend.model.BookingStatus;
import com.stayease.backend.model.Room;
import com.stayease.backend.repository.BookingRepository;
import com.stayease.backend.repository.RoomRepository;
import com.stayease.backend.service.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class SearchServiceImpl implements SearchService {

    @Autowired private RoomRepository roomRepository;
    @Autowired private BookingRepository bookingRepository;

    @Override
    public List<Room> findAvailableRooms(Long hotelId, LocalDate checkIn, LocalDate checkOut) {
        // get all rooms for hotel
        var rooms = roomRepository.findByHotelId(hotelId);
        List<Room> available = new ArrayList<>();
        for (Room r : rooms) {
            // find bookings that overlap
            List<Booking> overlapping = bookingRepository.findByRoomIdAndCheckInLessThanEqualAndCheckOutGreaterThanEqual(
                    r.getId(), checkOut.minusDays(1), checkIn.plusDays(1));
            // above query is defensive; simpler approach: check by iterating bookings in java
            boolean conflict = bookingRepository.findByRoomIdAndCheckInLessThanEqualAndCheckOutGreaterThanEqual(
                            r.getId(), checkOut.minusDays(1), checkIn.plusDays(1)).stream()
                    .anyMatch(b -> b.getStatus() == BookingStatus.CONFIRMED);
            if (!conflict) {
                available.add(r);
            }
        }
        return available;
    }
}
