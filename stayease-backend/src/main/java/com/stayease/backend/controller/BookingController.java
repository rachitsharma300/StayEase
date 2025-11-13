package com.stayease.backend.controller;

import com.stayease.backend.dto.BookingRequest;
import com.stayease.backend.model.Booking;
import com.stayease.backend.model.User;
import com.stayease.backend.repository.UserRepository;
import com.stayease.backend.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private UserRepository userRepository;

    // ✅ Helper method to get current user ID
    private Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
        return user.getId();
    }

    // ✅ CREATE booking - FIXED
    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest request) {
        System.out.println("✅ POST /api/bookings - Creating booking");
        try {
            Long userId = getCurrentUserId();
            System.out.println("📦 Booking request: " + request);
            System.out.println("👤 User ID: " + userId);

            Booking booking = bookingService.createBooking(userId, request);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Booking created successfully");
            response.put("booking", booking);

            System.out.println("✅ Booking created: " + booking.getId());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("❌ Booking creation failed: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    // ✅ GET my bookings - FIXED
    @GetMapping("/my")
    public ResponseEntity<?> getMyBookings() {
        System.out.println("✅ GET /api/bookings/my");
        try {
            Long userId = getCurrentUserId();
            List<Booking> bookings = bookingService.getBookingsByUser(userId);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "bookings", bookings,
                    "count", bookings.size()
            ));
        } catch (Exception e) {
            System.err.println("❌ Failed to fetch bookings: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    // ✅ CANCEL booking - FIXED
    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id) {
        System.out.println("✅ PUT /api/bookings/" + id + "/cancel");
        try {
            Long userId = getCurrentUserId();
            Booking cancelled = bookingService.cancelBooking(userId, id);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Booking cancelled successfully",
                    "booking", cancelled
            ));
        } catch (Exception e) {
            System.err.println("❌ Booking cancellation failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    // ✅ GET booking by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getBookingById(@PathVariable Long id) {
        try {
            Booking booking = bookingService.getBookingById(id)
                    .orElseThrow(() -> new RuntimeException("Booking not found"));

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "booking", booking
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }
}