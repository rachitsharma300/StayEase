package com.stayease.backend.service.impl;

import com.stayease.backend.model.Hotel;
import com.stayease.backend.model.Room;
import com.stayease.backend.repository.HotelRepository;
import com.stayease.backend.repository.RoomRepository;
import com.stayease.backend.service.HotelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class HotelServiceImpl implements HotelService {

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Override
    public Hotel create(Hotel hotel) {
        return hotelRepository.save(hotel);
    }

    @Override
    public Hotel update(Long id, Hotel hotel) {
        Hotel existing = hotelRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Hotel not found with ID: " + id));

        existing.setName(hotel.getName());
        existing.setAddress(hotel.getAddress());
        existing.setCity(hotel.getCity());
        existing.setState(hotel.getState());
        existing.setPincode(hotel.getPincode());
        existing.setDescription(hotel.getDescription());
        existing.setRating(hotel.getRating());
        existing.setAmenities(hotel.getAmenities());
        existing.setImages(hotel.getImages());
        existing.setContactEmail(hotel.getContactEmail());
        existing.setContactPhone(hotel.getContactPhone());
        existing.setWebsite(hotel.getWebsite());

        return hotelRepository.save(existing);
    }

    @Override
    public void delete(Long id) {
        hotelRepository.deleteById(id);
    }

    @Override
    public Hotel getById(Long id) {
        return hotelRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Hotel not found with ID: " + id));
    }

    @Override
    public List<Hotel> getAll() {
        return hotelRepository.findAll();
    }

    @Override
    public List<Hotel> searchByLocation(String location) {
        return hotelRepository.findByAddressContainingIgnoreCaseOrCityContainingIgnoreCase(location, location);
    }

    @Override
    public List<Hotel> searchHotels(String location, Double minPrice, Double maxPrice, Double minRating) {
        List<Hotel> hotels = searchByLocation(location);

        return hotels.stream()
                .filter(hotel -> {
                    // Filter by rating
                    if (minRating != null && hotel.getRating() < minRating) {
                        return false;
                    }

                    // Filter by price
                    if (minPrice != null || maxPrice != null) {
                        List<Room> rooms = roomRepository.findByHotelId(hotel.getId());
                        double minRoomPrice = rooms.stream()
                                .mapToDouble(Room::getPricePerNight)
                                .min()
                                .orElse(Double.MAX_VALUE);

                        if (minPrice != null && minRoomPrice < minPrice) return false;
                        if (maxPrice != null && minRoomPrice > maxPrice) return false;
                    }

                    return true;
                })
                .collect(Collectors.toList());
    }
}