package com.stayease.backend.service.impl;

import com.stayease.backend.model.Hotel;
import com.stayease.backend.repository.HotelRepository;
import com.stayease.backend.service.HotelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HotelServiceImpl implements HotelService {

    @Autowired private HotelRepository hotelRepository;

    @Override
    public Hotel create(Hotel hotel) {
        return hotelRepository.save(hotel);
    }

    @Override
    public Hotel update(Long id, Hotel hotel) {
        var existing = hotelRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Hotel not found"));
        existing.setName(hotel.getName());
        existing.setAddress(hotel.getAddress());
        existing.setDescription(hotel.getDescription());
        existing.setRating(hotel.getRating());
        return hotelRepository.save(existing);
    }

    @Override
    public void delete(Long id) {
        hotelRepository.deleteById(id);
    }

    @Override
    public Hotel getById(Long id) {
        return hotelRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Hotel not found"));
    }

    @Override
    public List<Hotel> searchByLocation(String location) {
        return hotelRepository.findByAddressContainingIgnoreCase(location);
    }
}
