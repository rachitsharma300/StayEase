package com.stayease.backend.controller;

import com.stayease.backend.model.Booking;
import com.stayease.backend.model.Hotel;
import com.stayease.backend.model.User;
import com.stayease.backend.repository.BookingRepository;
import com.stayease.backend.repository.HotelRepository;
import com.stayease.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private BookingRepository bookingRepository;

    // ✅ Admin Dashboard Statistics
    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        System.out.println("✅ GET /api/admin/dashboard/stats");

        try {
            long totalUsers = userRepository.count();
            long totalHotels = hotelRepository.count();
            long totalBookings = bookingRepository.count();

            // Calculate total revenue
            double totalRevenue = 0.0;
            List<Booking> allBookings = bookingRepository.findAll();
            for (Booking booking : allBookings) {
                if (booking != null && booking.getTotalAmount() != null) {
                    totalRevenue += booking.getTotalAmount();
                }
            }

            // Calculate recent bookings
            long recentBookings = 0;
            LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);

            for (Booking booking : allBookings) {
                if (booking != null && booking.getCreatedAt() != null) {
                    if (booking.getCreatedAt().isAfter(sevenDaysAgo)) {
                        recentBookings++;
                    }
                }
            }

            Map<String, Object> stats = new HashMap<>();
            stats.put("totalUsers", totalUsers);
            stats.put("totalHotels", totalHotels);
            stats.put("totalBookings", totalBookings);
            stats.put("totalRevenue", totalRevenue);
            stats.put("recentBookings", recentBookings);
            stats.put("success", true);

            return ResponseEntity.ok(stats);

        } catch (Exception e) {
            System.err.println("❌ Dashboard stats error: " + e.getMessage());
            e.printStackTrace();

            Map<String, Object> defaultStats = new HashMap<>();
            defaultStats.put("totalUsers", userRepository.count());
            defaultStats.put("totalHotels", hotelRepository.count());
            defaultStats.put("totalBookings", bookingRepository.count());
            defaultStats.put("totalRevenue", 0);
            defaultStats.put("recentBookings", 0);
            defaultStats.put("success", true);

            return ResponseEntity.ok(defaultStats);
        }
    }

    // ✅ Get All Users
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        System.out.println("✅ GET /api/admin/users");
        try {
            List<User> users = userRepository.findAll();
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "users", users,
                    "count", users.size()
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    // ✅ Get All Bookings
    @GetMapping("/bookings")
    public ResponseEntity<?> getAllBookings() {
        System.out.println("✅ GET /api/admin/bookings");
        try {
            List<Booking> bookings = bookingRepository.findAll();

            List<Booking> validBookings = bookings.stream()
                    .filter(booking -> booking != null)
                    .toList();

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "bookings", validBookings,
                    "count", validBookings.size()
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    // ✅ Get Recent Bookings
    @GetMapping("/bookings/recent")
    public ResponseEntity<?> getRecentBookings() {
        System.out.println("✅ GET /api/admin/bookings/recent");
        try {
            List<Booking> allBookings = bookingRepository.findAll();
            LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);

            List<Booking> recentBookings = allBookings.stream()
                    .filter(booking -> booking != null && booking.getCreatedAt() != null)
                    .filter(booking -> booking.getCreatedAt().isAfter(sevenDaysAgo))
                    .limit(10)
                    .toList();

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "bookings", recentBookings,
                    "count", recentBookings.size()
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    // ✅ MANUAL BOOKING CONFIRMATION ENDPOINT
    @PutMapping("/bookings/{bookingId}/confirm")
    public ResponseEntity<?> confirmBooking(@PathVariable Long bookingId) {
        System.out.println("✅ PUT /api/admin/bookings/" + bookingId + "/confirm");
        try {
            Booking booking = bookingRepository.findById(bookingId)
                    .orElseThrow(() -> new RuntimeException("Booking not found"));

            // ✅ MANUALLY SET STATUS TO CONFIRMED
            booking.setStatus(com.stayease.backend.model.BookingStatus.CONFIRMED);
            booking.setUpdatedAt(LocalDateTime.now());

            Booking savedBooking = bookingRepository.save(booking);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Booking confirmed successfully",
                    "booking", savedBooking
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    // ✅ CANCEL BOOKING ENDPOINT
    @PutMapping("/bookings/{bookingId}/cancel")
    public ResponseEntity<?> cancelBooking(@PathVariable Long bookingId) {
        System.out.println("✅ PUT /api/admin/bookings/" + bookingId + "/cancel");
        try {
            Booking booking = bookingRepository.findById(bookingId)
                    .orElseThrow(() -> new RuntimeException("Booking not found"));

            booking.setStatus(com.stayease.backend.model.BookingStatus.CANCELLED);
            booking.setUpdatedAt(LocalDateTime.now());

            Booking savedBooking = bookingRepository.save(booking);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Booking cancelled successfully",
                    "booking", savedBooking
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    // ✅ Delete User
    @DeleteMapping("/users/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        System.out.println("✅ DELETE /api/admin/users/" + userId);
        try {
            if (!userRepository.existsById(userId)) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "User not found"));
            }

            userRepository.deleteById(userId);
            return ResponseEntity.ok(Map.of("success", true, "message", "User deleted successfully"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    // ✅ Update Booking Status
    @PutMapping("/bookings/{bookingId}/status")
    public ResponseEntity<?> updateBookingStatus(@PathVariable Long bookingId, @RequestBody Map<String, String> request) {
        System.out.println("✅ PUT /api/admin/bookings/" + bookingId + "/status");
        try {
            Booking booking = bookingRepository.findById(bookingId)
                    .orElseThrow(() -> new RuntimeException("Booking not found"));

            String newStatus = request.get("status");

            // Handle different status values
            if ("CONFIRMED".equalsIgnoreCase(newStatus)) {
                booking.setStatus(com.stayease.backend.model.BookingStatus.CONFIRMED);
            } else if ("CANCELLED".equalsIgnoreCase(newStatus)) {
                booking.setStatus(com.stayease.backend.model.BookingStatus.CANCELLED);
            } else if ("PENDING".equalsIgnoreCase(newStatus)) {
                booking.setStatus(com.stayease.backend.model.BookingStatus.PENDING);
            } else if ("COMPLETED".equalsIgnoreCase(newStatus)) {
                booking.setStatus(com.stayease.backend.model.BookingStatus.COMPLETED);
            }

            booking.setUpdatedAt(LocalDateTime.now());
            bookingRepository.save(booking);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Booking status updated successfully",
                    "booking", booking
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    // ✅ Health Check Endpoint
    @GetMapping("/health")
    public ResponseEntity<?> healthCheck() {
        System.out.println("✅ GET /api/admin/health");
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Admin API is working",
                "timestamp", LocalDateTime.now().toString()
        ));
    }
}