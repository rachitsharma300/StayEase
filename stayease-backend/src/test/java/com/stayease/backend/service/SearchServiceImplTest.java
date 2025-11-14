package com.stayease.backend.service;

import com.stayease.backend.model.*;
import com.stayease.backend.repository.BookingRepository;
import com.stayease.backend.repository.RoomRepository;
import com.stayease.backend.service.impl.SearchServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class SearchServiceImplTest {

    @Mock
    private RoomRepository roomRepository;

    @Mock
    private BookingRepository bookingRepository;

    @InjectMocks
    private SearchServiceImpl searchService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testFindAvailableRooms_NoOverlap() {
        Long hotelId = 1L;

        Room room = new Room();
        room.setId(10L);

        // Mock rooms for hotel
        when(roomRepository.findByHotelId(hotelId)).thenReturn(List.of(room));

        // Mock no overlapping bookings
        when(bookingRepository.findByRoomIdAndCheckInLessThanEqualAndCheckOutGreaterThanEqual(
                eq(10L),
                any(LocalDate.class),
                any(LocalDate.class)
        )).thenReturn(List.of());

        List<Room> result = searchService.findAvailableRooms(
                hotelId,
                LocalDate.now(),
                LocalDate.now().plusDays(2)
        );

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getId()).isEqualTo(10L);
    }

    @Test
    void testFindAvailableRooms_WithOverlapConfirmed() {
        Long hotelId = 1L;

        Room room = new Room();
        room.setId(10L);

        Booking booking = new Booking();
        booking.setRoom(room);
        booking.setStatus(BookingStatus.CONFIRMED);

        when(roomRepository.findByHotelId(hotelId)).thenReturn(List.of(room));

        when(bookingRepository.findByRoomIdAndCheckInLessThanEqualAndCheckOutGreaterThanEqual(
                eq(10L),
                any(LocalDate.class),
                any(LocalDate.class)
        )).thenReturn(List.of(booking));

        List<Room> result = searchService.findAvailableRooms(
                hotelId,
                LocalDate.now(),
                LocalDate.now().plusDays(2)
        );

        assertThat(result).isEmpty();
    }
}
