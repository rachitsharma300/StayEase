package com.stayease.backend.service;

import com.stayease.backend.model.Room;

import java.time.LocalDate;
import java.util.List;

public interface SearchService {
    List<Room> findAvailableRooms(Long hotelId, LocalDate checkIn, LocalDate checkOut);
}
