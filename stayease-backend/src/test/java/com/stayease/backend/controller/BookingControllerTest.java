package com.stayease.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.stayease.backend.dto.BookingRequest;
import com.stayease.backend.model.Booking;
import com.stayease.backend.model.User;
import com.stayease.backend.service.BookingService;
import com.stayease.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDate;
import java.util.*;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
public class BookingControllerTest {

    @Mock
    private BookingService bookingService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private Authentication authentication;

    @Mock
    private SecurityContext securityContext;

    @InjectMocks
    private BookingController bookingController;

    private MockMvc mockMvc;
    private ObjectMapper mapper;

    @BeforeEach
    void setup() {
        // ✅ FIXED: Configure ObjectMapper with JavaTimeModule
        mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());

        mockMvc = MockMvcBuilders.standaloneSetup(bookingController).build();

        // Mock SecurityContext
        SecurityContextHolder.setContext(securityContext);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("john");
    }

    // Helper method for mocking logged-in user
    private void mockUser() {
        User user = new User();
        user.setId(1L);
        user.setUsername("john");

        when(userRepository.findByUsername("john")).thenReturn(Optional.of(user));
    }

    // ✅ TEST: Create booking success
    @Test
    void testCreateBookingSuccess() throws Exception {
        mockUser();

        BookingRequest request = new BookingRequest();
        request.setHotelId(1L);
        request.setRoomId(10L);
        request.setCheckIn(LocalDate.parse("2024-12-12"));
        request.setCheckOut(LocalDate.parse("2024-12-15"));
        request.setGuests(2);
        request.setGuestName("Test Guest");
        request.setGuestEmail("test@example.com");
        request.setGuestPhone("1234567890");

        Booking booking = new Booking();
        booking.setId(100L);

        when(bookingService.createBooking(eq(1L), any(BookingRequest.class))).thenReturn(booking);

        mockMvc.perform(post("/api/bookings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.booking.id").value(100));
    }

    // Other test methods remain same...
    @Test
    void testGetMyBookingsSuccess() throws Exception {
        mockUser();

        Booking b = new Booking();
        b.setId(200L);

        when(bookingService.getBookingsByUser(1L))
                .thenReturn(List.of(b));

        mockMvc.perform(get("/api/bookings/my"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.count").value(1))
                .andExpect(jsonPath("$.bookings[0].id").value(200));
    }

    @Test
    void testCancelBookingSuccess() throws Exception {
        mockUser();

        Booking cancelled = new Booking();
        cancelled.setId(300L);

        when(bookingService.cancelBooking(1L, 300L)).thenReturn(cancelled);

        mockMvc.perform(put("/api/bookings/300/cancel"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.booking.id").value(300));
    }

    @Test
    void testCreateBookingFailure() throws Exception {
        mockUser();

        BookingRequest request = new BookingRequest();
        request.setHotelId(1L);
        request.setRoomId(10L);
        request.setCheckIn(LocalDate.parse("2024-12-12"));
        request.setCheckOut(LocalDate.parse("2024-12-15"));

        when(bookingService.createBooking(eq(1L), any()))
                .thenThrow(new RuntimeException("Room unavailable"));

        mockMvc.perform(post("/api/bookings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Room unavailable"));
    }
}