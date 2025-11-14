package com.stayease.backend.service;


import com.stayease.backend.model.Hotel;
import com.stayease.backend.repository.HotelRepository;
import com.stayease.backend.service.impl.HotelServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class HotelServiceImplTest {

    @Mock
    private HotelRepository hotelRepository;

    @InjectMocks
    private HotelServiceImpl hotelService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    // ✅ Create
    @Test
    void testCreateHotel() {
        Hotel hotel = new Hotel();
        hotel.setName("Test Hotel");

        when(hotelRepository.save(hotel)).thenReturn(hotel);

        Hotel result = hotelService.create(hotel);

        assertEquals("Test Hotel", result.getName());
    }

    // ✅ Get all
    @Test
    void testGetAllHotels() {
        when(hotelRepository.findAll())
                .thenReturn(List.of(new Hotel(), new Hotel()));

        List<Hotel> hotels = hotelService.getAll();

        assertEquals(2, hotels.size());
    }

    // ✅ Get by ID
    @Test
    void testGetById() {
        Hotel hotel = new Hotel();
        hotel.setId(5L);

        when(hotelRepository.findById(5L)).thenReturn(Optional.of(hotel));

        Hotel found = hotelService.getById(5L);

        assertEquals(5L, found.getId());
    }
}
