package com.stayease.backend.controller;

import com.stayease.backend.model.Booking;
import com.stayease.backend.model.Hotel;
import com.stayease.backend.model.Room;
import com.stayease.backend.model.User;
import com.stayease.backend.repository.BookingRepository;
import com.stayease.backend.repository.HotelRepository;
import com.stayease.backend.repository.RoomRepository;
import com.stayease.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

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

    @Autowired
    private RoomRepository roomRepository;

    // Admin Dashboard Statistics
    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        System.out.println("GET /api/admin/dashboard/stats");

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

            // Calculate pending and confirmed bookings
            long pendingBookings = 0;
            long confirmedBookings = 0;

            for (Booking booking : allBookings) {
                if (booking != null && booking.getStatus() != null) {
                    if (booking.getStatus().name().equals("PENDING")) {
                        pendingBookings++;
                    } else if (booking.getStatus().name().equals("CONFIRMED")) {
                        confirmedBookings++;
                    }
                }
            }

            Map<String, Object> stats = new HashMap<>();
            stats.put("totalUsers", totalUsers);
            stats.put("totalHotels", totalHotels);
            stats.put("totalBookings", totalBookings);
            stats.put("totalRevenue", totalRevenue);
            stats.put("pendingBookings", pendingBookings);
            stats.put("confirmedBookings", confirmedBookings);
            stats.put("success", true);

            return ResponseEntity.ok(stats);

        } catch (Exception e) {
            System.err.println("Dashboard stats error: " + e.getMessage());
            e.printStackTrace();

            Map<String, Object> defaultStats = new HashMap<>();
            defaultStats.put("totalUsers", userRepository.count());
            defaultStats.put("totalHotels", hotelRepository.count());
            defaultStats.put("totalBookings", bookingRepository.count());
            defaultStats.put("totalRevenue", 0);
            defaultStats.put("pendingBookings", 0);
            defaultStats.put("confirmedBookings", 0);
            defaultStats.put("success", true);

            return ResponseEntity.ok(defaultStats);
        }
    }

    // Get All Users
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        System.out.println("GET /api/admin/users");
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

    // Get All Hotels
    @GetMapping("/hotels")
    public ResponseEntity<?> getAllHotels() {
        System.out.println("GET /api/admin/hotels");
        try {
            List<Hotel> hotels = hotelRepository.findAll();

            List<Map<String, Object>> hotelList = new ArrayList<>();
            for (Hotel hotel : hotels) {
                Map<String, Object> hotelData = new HashMap<>();
                hotelData.put("id", hotel.getId());
                hotelData.put("name", hotel.getName());
                hotelData.put("description", hotel.getDescription());
                hotelData.put("address", hotel.getAddress());
                hotelData.put("city", hotel.getCity());
                hotelData.put("state", hotel.getState());
                hotelData.put("rating", hotel.getRating());
                hotelData.put("amenities", hotel.getAmenities());
                hotelData.put("images", hotel.getImages());
                hotelData.put("totalRooms", 10); // Default value
                hotelData.put("availableRooms", 10); // Default value
                hotelData.put("createdAt", hotel.getCreatedAt());
                hotelList.add(hotelData);
            }

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "hotels", hotelList,
                    "count", hotels.size()
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    // Add New Hotel
    @PostMapping("/hotels")
    public ResponseEntity<?> addHotel(@RequestBody Map<String, Object> hotelData) {
        System.out.println("POST /api/admin/hotels");
        try {
            Hotel hotel = new Hotel();
            hotel.setName((String) hotelData.get("name"));
            hotel.setDescription((String) hotelData.get("description"));
            hotel.setAddress((String) hotelData.get("address"));
            hotel.setCity((String) hotelData.get("city"));
            hotel.setState((String) hotelData.get("state"));
            hotel.setRating(((Number) hotelData.get("rating")).doubleValue());

            // Handle amenities
            if (hotelData.get("amenities") instanceof List) {
                List<String> amenities = (List<String>) hotelData.get("amenities");
                hotel.setAmenities(amenities);
            } else {
                hotel.setAmenities(new ArrayList<>());
            }

            // Handle images
            if (hotelData.get("images") instanceof List) {
                List<String> images = (List<String>) hotelData.get("images");
                hotel.setImages(images);
            } else {
                hotel.setImages(new ArrayList<>());
            }

            hotel.setCreatedAt(LocalDateTime.now());
            hotel.setUpdatedAt(LocalDateTime.now());

            Hotel savedHotel = hotelRepository.save(hotel);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Hotel added successfully",
                    "hotel", savedHotel
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Error adding hotel: " + e.getMessage()));
        }
    }

    // Delete Hotel
    @DeleteMapping("/hotels/{hotelId}")
    public ResponseEntity<?> deleteHotel(@PathVariable Long hotelId) {
        System.out.println("DELETE /api/admin/hotels/" + hotelId);
        try {
            if (!hotelRepository.existsById(hotelId)) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Hotel not found"));
            }

            hotelRepository.deleteById(hotelId);
            return ResponseEntity.ok(Map.of("success", true, "message", "Hotel deleted successfully"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    // ROOM MANAGEMENT ENDPOINTS

    // Get All Rooms for a Hotel
    @GetMapping("/hotels/{hotelId}/rooms")
    public ResponseEntity<?> getHotelRooms(@PathVariable Long hotelId) {
        System.out.println("GET /api/admin/hotels/" + hotelId + "/rooms");
        try {
            List<Room> rooms = roomRepository.findByHotelId(hotelId);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "rooms", rooms,
                    "count", rooms.size()
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    // Add Room to Hotel
    @PostMapping("/hotels/{hotelId}/rooms")
    public ResponseEntity<?> addRoom(@PathVariable Long hotelId, @RequestBody Room room) {
        System.out.println("POST /api/admin/hotels/" + hotelId + "/rooms");
        try {
            Hotel hotel = hotelRepository.findById(hotelId)
                    .orElseThrow(() -> new RuntimeException("Hotel not found"));

            room.setHotel(hotel);
            room.setAvailable(true);

            Room savedRoom = roomRepository.save(room);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Room added successfully",
                    "room", savedRoom
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    // Delete Room
    @DeleteMapping("/rooms/{roomId}")
    public ResponseEntity<?> deleteRoom(@PathVariable Long roomId) {
        System.out.println("DELETE /api/admin/rooms/" + roomId);
        try {
            if (!roomRepository.existsById(roomId)) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Room not found"));
            }

            roomRepository.deleteById(roomId);
            return ResponseEntity.ok(Map.of("success", true, "message", "Room deleted successfully"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    // Get Recent Activity
    @GetMapping("/recent-activity")
    public ResponseEntity<?> getRecentActivity() {
        System.out.println("GET /api/admin/recent-activity");
        try {
            List<Map<String, Object>> activities = new ArrayList<>();

            // Get recent bookings (last 10)
            List<Booking> allBookings = bookingRepository.findAll();
            List<Booking> recentBookings = allBookings.stream()
                    .filter(booking -> booking != null && booking.getCreatedAt() != null)
                    .sorted((b1, b2) -> b2.getCreatedAt().compareTo(b1.getCreatedAt()))
                    .limit(10)
                    .toList();

            for (Booking booking : recentBookings) {
                Map<String, Object> activity = new HashMap<>();
                activity.put("id", "booking_" + booking.getId());
                activity.put("type", "booking");
                activity.put("message", "New booking #" + booking.getId() + " created");
                activity.put("timestamp", booking.getCreatedAt());
                activity.put("user", booking.getUser() != null ? booking.getUser().getUsername() : "Unknown User");
                activity.put("icon", "📋");
                activities.add(activity);
            }

            // Get recent users - last 5
            List<User> allUsers = userRepository.findAll();
            List<User> recentUsers = allUsers.stream()
                    .filter(user -> user != null && user.getCreatedAt() != null)
                    .sorted((u1, u2) -> u2.getCreatedAt().compareTo(u1.getCreatedAt()))
                    .limit(5)
                    .toList();

            for (User user : recentUsers) {
                Map<String, Object> activity = new HashMap<>();
                activity.put("id", "user_" + user.getId());
                activity.put("type", "user");
                activity.put("message", "New user registered: " + user.getUsername());
                activity.put("timestamp", user.getCreatedAt() != null ? user.getCreatedAt() : LocalDateTime.now());
                activity.put("user", user.getUsername());
                activity.put("icon", "👤");
                activities.add(activity);
            }

            // Sort all activities by timestamp (newest first)
            activities.sort((a, b) -> {
                LocalDateTime timeA = (LocalDateTime) a.get("timestamp");
                LocalDateTime timeB = (LocalDateTime) b.get("timestamp");
                return timeB.compareTo(timeA);
            });

            // Return only latest 10 activities
            List<Map<String, Object>> recentActivities = activities.stream()
                    .limit(10)
                    .toList();

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "activity", recentActivities,
                    "count", recentActivities.size()
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Error fetching recent activity"));
        }
    }

    // Get All Bookings
    @GetMapping("/bookings")
    public ResponseEntity<?> getAllBookings() {
        System.out.println("GET /api/admin/bookings");
        try {
            List<Booking> bookings = bookingRepository.findAll();

            List<Map<String, Object>> bookingList = new ArrayList<>();
            for (Booking booking : bookings) {
                if (booking != null) {
                    Map<String, Object> bookingData = new HashMap<>();
                    bookingData.put("id", booking.getId());
                    bookingData.put("hotelName", booking.getHotel() != null ? booking.getHotel().getName() : "Unknown Hotel");
                    bookingData.put("userName", booking.getUser() != null ? booking.getUser().getUsername() : "Unknown User");
                    bookingData.put("checkIn", booking.getCheckIn());
                    bookingData.put("checkOut", booking.getCheckOut());
                    bookingData.put("totalAmount", booking.getTotalAmount());
                    bookingData.put("status", booking.getStatus() != null ? booking.getStatus().name() : "PENDING");
                    bookingData.put("createdAt", booking.getCreatedAt());
                    bookingList.add(bookingData);
                }
            }

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "bookings", bookingList,
                    "count", bookingList.size()
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    // Get Recent Bookings
    @GetMapping("/bookings/recent")
    public ResponseEntity<?> getRecentBookings() {
        System.out.println("GET /api/admin/bookings/recent");
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

    // MANUAL BOOKING CONFIRMATION ENDPOINT
    @PutMapping("/bookings/{bookingId}/confirm")
    public ResponseEntity<?> confirmBooking(@PathVariable Long bookingId) {
        System.out.println("PUT /api/admin/bookings/" + bookingId + "/confirm");
        try {
            Booking booking = bookingRepository.findById(bookingId)
                    .orElseThrow(() -> new RuntimeException("Booking not found"));

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

    //CANCEL BOOKING ENDPOINT
    @PutMapping("/bookings/{bookingId}/cancel")
    public ResponseEntity<?> cancelBooking(@PathVariable Long bookingId) {
        System.out.println(" PUT /api/admin/bookings/" + bookingId + "/cancel");
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

    // Delete User
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

    // Booking Status
    @PutMapping("/bookings/{bookingId}/status")
    public ResponseEntity<?> updateBookingStatus(@PathVariable Long bookingId, @RequestBody Map<String, String> request) {
        System.out.println("PUT /api/admin/bookings/" + bookingId + "/status");
        try {
            Booking booking = bookingRepository.findById(bookingId)
                    .orElseThrow(() -> new RuntimeException("Booking not found"));

            String newStatus = request.get("status");

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

    // Health Check Endpoint
    @GetMapping("/health")
    public ResponseEntity<?> healthCheck() {
        System.out.println("GET /api/admin/health");
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Admin API is working",
                "timestamp", LocalDateTime.now().toString()
        ));
    }
}