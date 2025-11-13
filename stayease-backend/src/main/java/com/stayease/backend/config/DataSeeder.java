package com.stayease.backend.config;

import com.stayease.backend.model.*;
import com.stayease.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired private UserRepository userRepository;
    @Autowired private HotelRepository hotelRepository;
    @Autowired private RoomRepository roomRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        seedUsers();
        seedHotelsAndRooms();
    }

    private void seedUsers() {
        if (userRepository.findByEmail("admin@stayease.com").isEmpty()) {
            User admin = User.builder()
                    .fullName("Admin User")
                    .email("admin@stayease.com")
                    .username("admin")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .phone("9876543210")
                    .build();
            userRepository.save(admin);
            System.out.println("✅ Admin user created");
        }

        if (userRepository.findByUsername("user123").isEmpty()) {
            User user = User.builder()
                    .fullName("Demo User")
                    .email("user@stayease.com")
                    .username("user123")
                    .password(passwordEncoder.encode("pass123"))
                    .role(Role.USER)
                    .phone("9876543211")
                    .build();
            userRepository.save(user);
            System.out.println("✅ Demo user created");
        }
    }

    private void seedHotelsAndRooms() {
        if (hotelRepository.count() > 0) {
            System.out.println("✅ Hotels already exist");
            return;
        }

        // Hotel 1
        Hotel grandPalace = Hotel.builder()
                .name("Grand Palace Hotel")
                .address("MG Road")
                .city("Patna")
                .state("Bihar")
                .pincode("800001")
                .description("Luxury 5-star hotel in the heart of Patna with modern amenities and excellent service.")
                .rating(4.5)
                .totalReviews(120)
                .amenities(Arrays.asList("Free WiFi", "Swimming Pool", "Spa", "Fitness Center", "Restaurant", "Bar", "Conference Room"))
                .images(Arrays.asList(
                        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500",
                        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500"
                ))
                .contactEmail("info@grandpalace.com")
                .contactPhone("0612-2345678")
                .website("www.grandpalacepatna.com")
                .build();

        // Hotel 2
        Hotel sunsetResort = Hotel.builder()
                .name("Sunset View Resort")
                .address("Calangute Beach")
                .city("Goa")
                .state("Goa")
                .pincode("403516")
                .description("Beachfront resort with stunning ocean views, spa facilities, and water sports.")
                .rating(4.8)
                .totalReviews(89)
                .amenities(Arrays.asList("Beach Access", "Swimming Pool", "Spa", "Water Sports", "Restaurant", "Bar", "Free Parking"))
                .images(Arrays.asList(
                        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500",
                        "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=500"
                ))
                .contactEmail("bookings@sunsetresort.com")
                .contactPhone("0832-3456789")
                .website("www.sunsetviewgoa.com")
                .build();

        Hotel mountainView = Hotel.builder()
                .name("Mountain Paradise")
                .address("Hill Station Road")
                .city("Patna")
                .state("Bihar")
                .pincode("800002")
                .description("Peaceful retreat with stunning mountain views and eco-friendly accommodations.")
                .rating(4.3)
                .totalReviews(67)
                .amenities(Arrays.asList("Mountain View", "Garden", "Restaurant", "Free WiFi", "Parking", "Room Service"))
                .images(Arrays.asList(
                        "https://images.unsplash.com/photo-1586375300773-8384e3e4916f?w=500",
                        "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=500"
                ))
                .contactEmail("stay@mountainparadise.com")
                .contactPhone("0612-4567890")
                .website("www.mountainparadise.com")
                .build();

        List<Hotel> hotels = Arrays.asList(grandPalace, sunsetResort, mountainView);
        hotelRepository.saveAll(hotels);

        // Rooms for Grand Palace
        Room r1 = Room.builder().roomNumber("101").type("Deluxe").pricePerNight(3500.0).capacity(2).size(350).available(true)
                .features(Arrays.asList("AC", "TV", "Mini Bar", "Sea View")).hotel(grandPalace).build();
        Room r2 = Room.builder().roomNumber("102").type("Suite").pricePerNight(6000.0).capacity(3).size(550).available(true)
                .features(Arrays.asList("AC", "TV", "Mini Bar", "Living Room", "Balcony")).hotel(grandPalace).build();
        Room r3 = Room.builder().roomNumber("201").type("Standard").pricePerNight(2500.0).capacity(2).size(280).available(true)
                .features(Arrays.asList("AC", "TV", "City View")).hotel(grandPalace).build();

        // Rooms for Sunset Resort
        Room r4 = Room.builder().roomNumber("101").type("Beach View").pricePerNight(4500.0).capacity(2).size(400).available(true)
                .features(Arrays.asList("AC", "TV", "Beach View", "Balcony")).hotel(sunsetResort).build();
        Room r5 = Room.builder().roomNumber("102").type("Luxury Suite").pricePerNight(8000.0).capacity(4).size(650).available(true)
                .features(Arrays.asList("AC", "TV", "Private Pool", "Kitchen", "Ocean View")).hotel(sunsetResort).build();

        // Rooms for Mountain Paradise
        Room r6 = Room.builder().roomNumber("101").type("Mountain View").pricePerNight(3000.0).capacity(2).size(320).available(true)
                .features(Arrays.asList("AC", "TV", "Mountain View", "Fireplace")).hotel(mountainView).build();
        Room r7 = Room.builder().roomNumber("102").type("Family Room").pricePerNight(5000.0).capacity(4).size(480).available(true)
                .features(Arrays.asList("AC", "TV", "Mountain View", "Extra Bed")).hotel(mountainView).build();

        List<Room> rooms = Arrays.asList(r1, r2, r3, r4, r5, r6, r7);
        roomRepository.saveAll(rooms);

        System.out.println("✅ Hotels and rooms seeded successfully!");
        System.out.println("📊 Total Hotels: " + hotelRepository.count());
        System.out.println("📊 Total Rooms: " + roomRepository.count());
    }
}