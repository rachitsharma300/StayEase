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

        // Hotel 1 - Patna
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

        // Hotel 2 - Goa
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

        // Hotel 3 - Patna
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

        // Hotel 4 - Chennai
        Hotel marinaBay = Hotel.builder()
                .name("Marina Bay Suites")
                .address("Marina Beach Road")
                .city("Chennai")
                .state("Tamil Nadu")
                .pincode("600001")
                .description("Premium hotel overlooking Marina Beach with luxurious rooms and excellent dining options.")
                .rating(4.6)
                .totalReviews(156)
                .amenities(Arrays.asList("Sea View", "Swimming Pool", "Spa", "Fitness Center", "Multi-cuisine Restaurant", "Business Center"))
                .images(Arrays.asList(
                        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500",
                        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500"
                ))
                .contactEmail("reservations@marinabay.com")
                .contactPhone("044-23456789")
                .website("www.marinabaychennai.com")
                .build();

        // Hotel 5 - Pune
        Hotel shaniwarGrand = Hotel.builder()
                .name("Shaniwar Grand")
                .address("FC Road")
                .city("Pune")
                .state("Maharashtra")
                .pincode("411005")
                .description("Modern hotel in the heart of Pune with excellent connectivity and business facilities.")
                .rating(4.4)
                .totalReviews(98)
                .amenities(Arrays.asList("Free WiFi", "Swimming Pool", "Gym", "Conference Rooms", "Restaurant", "Bar", "Parking"))
                .images(Arrays.asList(
                        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500",
                        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500"
                ))
                .contactEmail("info@shaniwargrand.com")
                .contactPhone("020-45678901")
                .website("www.shaniwargrand.com")
                .build();

        // Hotel 6 - Jaipur
        Hotel royalPalace = Hotel.builder()
                .name("Royal Palace Heritage")
                .address("MI Road")
                .city("Jaipur")
                .state("Rajasthan")
                .pincode("302001")
                .description("Heritage hotel showcasing Rajasthani architecture with modern comforts and royal treatment.")
                .rating(4.7)
                .totalReviews(134)
                .amenities(Arrays.asList("Heritage Style", "Swimming Pool", "Spa", "Cultural Shows", "Restaurant", "Bar", "Garden"))
                .images(Arrays.asList(
                        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500",
                        "https://images.unsplash.com/photo-1586375300773-8384e3e4916f?w=500"
                ))
                .contactEmail("royal@heritagepalace.com")
                .contactPhone("0141-3456789")
                .website("www.royalpalacejaipur.com")
                .build();

        // Hotel 7 - Kerala
        Hotel backwatersRetreat = Hotel.builder()
                .name("Backwaters Retreat")
                .address("Alleppey Backwaters")
                .city("Kerala")
                .state("Kerala")
                .pincode("688013")
                .description("Serene houseboat and resort experience in the beautiful backwaters of Alleppey.")
                .rating(4.9)
                .totalReviews(201)
                .amenities(Arrays.asList("Backwater View", "Houseboat Stay", "Ayurvedic Spa", "Restaurant", "Fishing", "Cultural Activities"))
                .images(Arrays.asList(
                        "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=500",
                        "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=500"
                ))
                .contactEmail("experience@backwatersretreat.com")
                .contactPhone("0477-2345678")
                .website("www.backwatersretreat.com")
                .build();

        // Hotel 8 - Delhi
        Hotel capitalGrand = Hotel.builder()
                .name("Capital Grand")
                .address("Connaught Place")
                .city("Delhi")
                .state("Delhi")
                .pincode("110001")
                .description("Luxury hotel in the heart of Delhi with premium amenities and easy access to major attractions.")
                .rating(4.5)
                .totalReviews(189)
                .amenities(Arrays.asList("Central Location", "Swimming Pool", "Spa", "Fitness Center", "Multiple Restaurants", "Bar", "Business Center"))
                .images(Arrays.asList(
                        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500",
                        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500"
                ))
                .contactEmail("reservations@capitalgrand.com")
                .contactPhone("011-45678901")
                .website("www.capitalgranddelhi.com")
                .build();

        // Hotel 9 - Bangalore
        Hotel gardenCityPlaza = Hotel.builder()
                .name("Garden City Plaza")
                .address("MG Road")
                .city("Bangalore")
                .state("Karnataka")
                .pincode("560001")
                .description("Contemporary hotel in Bangalore's business district with tech-friendly amenities.")
                .rating(4.6)
                .totalReviews(167)
                .amenities(Arrays.asList("High-speed WiFi", "Swimming Pool", "Gym", "Business Center", "Restaurant", "Bar", "Conference Facilities"))
                .images(Arrays.asList(
                        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500",
                        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500"
                ))
                .contactEmail("stay@gardencityplaza.com")
                .contactPhone("080-23456789")
                .website("www.gardencityplazabangalore.com")
                .build();

        List<Hotel> hotels = Arrays.asList(
                grandPalace, sunsetResort, mountainView, marinaBay,
                shaniwarGrand, royalPalace, backwatersRetreat, capitalGrand, gardenCityPlaza
        );
        hotelRepository.saveAll(hotels);

        // Rooms for Grand Palace (Patna)
        Room r1 = Room.builder().roomNumber("101").type("Deluxe").pricePerNight(3500.0).capacity(2).size(350).available(true)
                .features(Arrays.asList("AC", "TV", "Mini Bar", "Sea View")).hotel(grandPalace).build();
        Room r2 = Room.builder().roomNumber("102").type("Suite").pricePerNight(6000.0).capacity(3).size(550).available(true)
                .features(Arrays.asList("AC", "TV", "Mini Bar", "Living Room", "Balcony")).hotel(grandPalace).build();
        Room r3 = Room.builder().roomNumber("201").type("Standard").pricePerNight(2500.0).capacity(2).size(280).available(true)
                .features(Arrays.asList("AC", "TV", "City View")).hotel(grandPalace).build();

        // Rooms for Sunset Resort (Goa)
        Room r4 = Room.builder().roomNumber("101").type("Beach View").pricePerNight(4500.0).capacity(2).size(400).available(true)
                .features(Arrays.asList("AC", "TV", "Beach View", "Balcony")).hotel(sunsetResort).build();
        Room r5 = Room.builder().roomNumber("102").type("Luxury Suite").pricePerNight(8000.0).capacity(4).size(650).available(true)
                .features(Arrays.asList("AC", "TV", "Private Pool", "Kitchen", "Ocean View")).hotel(sunsetResort).build();

        // Rooms for Mountain Paradise (Patna)
        Room r6 = Room.builder().roomNumber("101").type("Mountain View").pricePerNight(3000.0).capacity(2).size(320).available(true)
                .features(Arrays.asList("AC", "TV", "Mountain View", "Fireplace")).hotel(mountainView).build();
        Room r7 = Room.builder().roomNumber("102").type("Family Room").pricePerNight(5000.0).capacity(4).size(480).available(true)
                .features(Arrays.asList("AC", "TV", "Mountain View", "Extra Bed")).hotel(mountainView).build();

        // Rooms for Marina Bay (Chennai)
        Room r8 = Room.builder().roomNumber("101").type("Sea View").pricePerNight(4000.0).capacity(2).size(380).available(true)
                .features(Arrays.asList("AC", "TV", "Sea View", "Balcony")).hotel(marinaBay).build();
        Room r9 = Room.builder().roomNumber("102").type("Executive Suite").pricePerNight(7500.0).capacity(3).size(520).available(true)
                .features(Arrays.asList("AC", "TV", "Living Area", "Work Desk", "Sea View")).hotel(marinaBay).build();

        // Rooms for Shaniwar Grand (Pune)
        Room r10 = Room.builder().roomNumber("101").type("Business Class").pricePerNight(3500.0).capacity(2).size(320).available(true)
                .features(Arrays.asList("AC", "TV", "Work Desk", "High-speed WiFi")).hotel(shaniwarGrand).build();
        Room r11 = Room.builder().roomNumber("102").type("Deluxe").pricePerNight(4500.0).capacity(3).size(420).available(true)
                .features(Arrays.asList("AC", "TV", "Sofa", "City View")).hotel(shaniwarGrand).build();

        // Rooms for Royal Palace (Jaipur)
        Room r12 = Room.builder().roomNumber("101").type("Heritage Room").pricePerNight(5000.0).capacity(2).size(400).available(true)
                .features(Arrays.asList("AC", "TV", "Traditional Decor", "Courtyard View")).hotel(royalPalace).build();
        Room r13 = Room.builder().roomNumber("102").type("Royal Suite").pricePerNight(9000.0).capacity(4).size(700).available(true)
                .features(Arrays.asList("AC", "TV", "Living Room", "Private Jacuzzi", "Palace View")).hotel(royalPalace).build();

        // Rooms for Backwaters Retreat (Kerala)
        Room r14 = Room.builder().roomNumber("101").type("Houseboat Deluxe").pricePerNight(6000.0).capacity(2).size(300).available(true)
                .features(Arrays.asList("AC", "TV", "Backwater View", "Private Deck")).hotel(backwatersRetreat).build();
        Room r15 = Room.builder().roomNumber("102").type("Luxury Villa").pricePerNight(10000.0).capacity(4).size(600).available(true)
                .features(Arrays.asList("AC", "TV", "Private Pool", "Garden", "Backwater Access")).hotel(backwatersRetreat).build();

        // Rooms for Capital Grand (Delhi)
        Room r16 = Room.builder().roomNumber("101").type("Executive Room").pricePerNight(4500.0).capacity(2).size(350).available(true)
                .features(Arrays.asList("AC", "TV", "Work Desk", "City View")).hotel(capitalGrand).build();
        Room r17 = Room.builder().roomNumber("102").type("Presidential Suite").pricePerNight(12000.0).capacity(4).size(800).available(true)
                .features(Arrays.asList("AC", "TV", "Living Room", "Dining Area", "Panoramic View")).hotel(capitalGrand).build();

        // Rooms for Garden City Plaza (Bangalore)
        Room r18 = Room.builder().roomNumber("101").type("Tech Room").pricePerNight(4000.0).capacity(2).size(340).available(true)
                .features(Arrays.asList("AC", "Smart TV", "High-speed WiFi", "Work Station")).hotel(gardenCityPlaza).build();
        Room r19 = Room.builder().roomNumber("102").type("Executive Suite").pricePerNight(8000.0).capacity(3).size(550).available(true)
                .features(Arrays.asList("AC", "TV", "Living Area", "Kitchenette", "Garden View")).hotel(gardenCityPlaza).build();

        List<Room> rooms = Arrays.asList(r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11, r12, r13, r14, r15, r16, r17, r18, r19);
        roomRepository.saveAll(rooms);

        System.out.println("✅ Hotels and rooms seeded successfully!");
        System.out.println("📊 Total Hotels: " + hotelRepository.count());
        System.out.println("📊 Total Rooms: " + roomRepository.count());
    }
}