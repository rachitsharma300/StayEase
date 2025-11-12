package com.stayease.backend.service;

import com.stayease.backend.model.Hotel;

import java.util.List;

public interface HotelService {
    Hotel create(Hotel hotel);
    Hotel update(Long id, Hotel hotel);
    void delete(Long id);
    Hotel getById(Long id);
    List<Hotel> searchByLocation(String location);
}
