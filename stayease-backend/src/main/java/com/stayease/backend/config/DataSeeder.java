package com.stayease.backend.config;

import com.stayease.backend.model.*;
import com.stayease.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired private UserRepository userRepository;
    @Autowired private HotelRepository hotelRepository;
    @Autowired private RoomRepository roomRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {

        // Seed Admin User
        if (userRepository.findByEmail("admin@stayease.com").isEmpty()) {
            User admin = new User();
            admin.setFullName("Admin User");
            admin.setEmail("admin@stayease.com");
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ADMIN);
            userRepository.save(admin);
            System.out.println("✅ Admin user created: admin@stayease.com | admin123");
        }

        // Seed Normal User
        if (userRepository.findByEmail("user@stayease.com").isEmpty()) {
            User user = new User();
            user.setFullName("Test User");
            user.setEmail("user@stayease.com");
            user.setUsername("user");
            user.setPassword(passwordEncoder.encode("user123"));
            user.setRole(Role.USER);
            userRepository.save(user);
            System.out.println("✅ Normal user created: user@stayease.com | user123");
        }

        // Seed Hotels if not exists
        if (hotelRepository.count() > 0) {
            System.out.println("⚠️ Hotels already exist → skipping hotel seed data.");
            return;
        }

        Hotel h1 = new Hotel(null, "Grand Palace Hotel", "Patna", "Luxury hotel in the city center", 4.5, null);
        Hotel h2 = new Hotel(null, "Sunset View Resort", "Goa", "Beach side resort with ocean view", 4.8, null);
        hotelRepository.saveAll(Arrays.asList(h1, h2));

        Room r1 = new Room(null, "Deluxe AC Room", "AC", 2500.00, true, h1);
        Room r2 = new Room(null, "Suite Room", "Suite", 5000.00, true, h1);
        Room r3 = new Room(null, "Standard Room", "Standard", 1500.00, true, h2);
        Room r4 = new Room(null, "Luxury Sea View Room", "Luxury", 6000.00, true, h2);

        roomRepository.saveAll(Arrays.asList(r1, r2, r3, r4));

        System.out.println("✅ Hotels and rooms seeded successfully!");
    }
}
