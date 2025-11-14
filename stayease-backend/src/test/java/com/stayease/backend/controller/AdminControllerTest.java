package com.stayease.backend.controller;

import com.stayease.backend.model.*;
import com.stayease.backend.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminControllerTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private HotelRepository hotelRepository;

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private RoomRepository roomRepository;

    @InjectMocks
    private AdminController adminController;

    private User testUser;
    private Hotel testHotel;
    private Room testRoom;
    private Booking testBooking;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .username("testuser")
                .email("test@example.com")
                .fullName("Test User")
                .role(Role.USER)
                .build();

        testHotel = Hotel.builder()
                .id(1L)
                .name("Test Hotel")
                .address("Test Address")
                .city("Test City")
                .rating(4.5)
                .amenities(Arrays.asList("WiFi", "Pool"))
                .images(Arrays.asList("image1.jpg"))
                .build();

        testRoom = Room.builder()
                .id(1L)
                .roomNumber("101")
                .type("Deluxe")
                .pricePerNight(100.0)
                .capacity(2)
                .available(true)
                .hotel(testHotel)
                .build();

        testBooking = Booking.builder()
                .id(1L)
                .user(testUser)
                .hotel(testHotel)
                .room(testRoom)
                .checkIn(java.time.LocalDate.now().plusDays(1))
                .checkOut(java.time.LocalDate.now().plusDays(3))
                .totalAmount(200.0)
                .status(BookingStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();
    }

    @Test
    void testGetDashboardStats_Success() {
        // Arrange
        when(userRepository.count()).thenReturn(10L);
        when(hotelRepository.count()).thenReturn(5L);
        when(bookingRepository.count()).thenReturn(20L);
        when(bookingRepository.findAll()).thenReturn(Arrays.asList(testBooking));

        // Act
        ResponseEntity<Map<String, Object>> response = adminController.getDashboardStats();

        // Assert
        assertNotNull(response);
        assertEquals(200, response.getStatusCodeValue());
        Map<String, Object> body = response.getBody();
        assertNotNull(body);
        assertEquals(10L, body.get("totalUsers"));
        assertEquals(5L, body.get("totalHotels"));
        assertEquals(20L, body.get("totalBookings"));
        assertTrue((Boolean) body.get("success"));
    }

    @Test
    void testGetAllUsers_Success() {
        // Arrange
        when(userRepository.findAll()).thenReturn(Arrays.asList(testUser));

        // Act
        ResponseEntity<?> response = adminController.getAllUsers();

        // Assert
        assertNotNull(response);
        assertEquals(200, response.getStatusCodeValue());
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertNotNull(body);
        assertTrue((Boolean) body.get("success"));
        List<User> users = (List<User>) body.get("users");
        assertEquals(1, users.size());
    }

    @Test
    void testAddHotel_Success() {
        // Arrange
        Map<String, Object> hotelData = new HashMap<>();
        hotelData.put("name", "New Hotel");
        hotelData.put("description", "Test Description");
        hotelData.put("address", "Test Address");
        hotelData.put("city", "Test City");
        hotelData.put("state", "Test State");
        hotelData.put("rating", 4.5);
        hotelData.put("amenities", Arrays.asList("WiFi", "Pool"));
        hotelData.put("images", Arrays.asList("img1.jpg"));

        when(hotelRepository.save(any(Hotel.class))).thenReturn(testHotel);

        // Act
        ResponseEntity<?> response = adminController.addHotel(hotelData);

        // Assert
        assertNotNull(response);
        assertEquals(200, response.getStatusCodeValue());
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertNotNull(body);
        assertTrue((Boolean) body.get("success"));
        assertEquals("Hotel added successfully", body.get("message"));
    }

    @Test
    void testDeleteHotel_Success() {
        // Arrange
        when(hotelRepository.existsById(1L)).thenReturn(true);

        // Act
        ResponseEntity<?> response = adminController.deleteHotel(1L);

        // Assert
        assertNotNull(response);
        assertEquals(200, response.getStatusCodeValue());
        verify(hotelRepository, times(1)).deleteById(1L);
    }

    @Test
    void testDeleteHotel_NotFound() {
        // Arrange
        when(hotelRepository.existsById(1L)).thenReturn(false);

        // Act
        ResponseEntity<?> response = adminController.deleteHotel(1L);

        // Assert
        assertNotNull(response);
        assertEquals(400, response.getStatusCodeValue());
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertNotNull(body);
        assertFalse((Boolean) body.get("success"));
    }

    @Test
    void testConfirmBooking_Success() {
        // Arrange
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(testBooking));
        when(bookingRepository.save(any(Booking.class))).thenReturn(testBooking);

        // Act
        ResponseEntity<?> response = adminController.confirmBooking(1L);

        // Assert
        assertNotNull(response);
        assertEquals(200, response.getStatusCodeValue());
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertNotNull(body);
        assertTrue((Boolean) body.get("success"));
        assertEquals("Booking confirmed successfully", body.get("message"));
    }

    @Test
    void testHealthCheck() {
        // Act
        ResponseEntity<?> response = adminController.healthCheck();

        // Assert
        assertNotNull(response);
        assertEquals(200, response.getStatusCodeValue());
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertNotNull(body);
        assertTrue((Boolean) body.get("success"));
    }
}