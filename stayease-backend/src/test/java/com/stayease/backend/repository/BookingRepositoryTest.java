package com.stayease.backend.repository;

import com.stayease.backend.model.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.TestPropertySource;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@TestPropertySource(properties = {
        "spring.datasource.url=jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE",
        "spring.datasource.driver-class-name=org.h2.Driver",
        "spring.datasource.username=sa",
        "spring.datasource.password=",
        "spring.jpa.database-platform=org.hibernate.dialect.H2Dialect",
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "spring.jpa.defer-datasource-initialization=true"
})
class BookingRepositoryTest {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Test
    void testFindByUserId() {
        // Create User
        User user = new User();
        user.setUsername("testuser");
        user.setEmail("test@example.com");
        user.setPassword("password");
        user.setFullName("Test User");
        user.setRole(Role.USER);
        User savedUser = userRepository.save(user);

        // Create Hotel
        Hotel hotel = new Hotel();
        hotel.setName("Test Hotel");
        hotel.setAddress("Test Address");
        hotel.setCity("Test City");
        hotel.setState("Test State");
        hotel.setDescription("Test Description");
        hotel.setRating(4.5);
        Hotel savedHotel = hotelRepository.save(hotel);

        // Create Room
        Room room = new Room();
        room.setRoomNumber("101");
        room.setType("Deluxe");
        room.setPricePerNight(100.0);
        room.setCapacity(2);
        room.setAvailable(true);
        room.setHotel(savedHotel);
        Room savedRoom = roomRepository.save(room);

        // Create Booking
        Booking booking = new Booking();
        booking.setUser(savedUser);
        booking.setHotel(savedHotel);
        booking.setRoom(savedRoom);
        booking.setCheckIn(LocalDate.now().plusDays(1));
        booking.setCheckOut(LocalDate.now().plusDays(3));
        booking.setTotalAmount(200.0);
        booking.setStatus(BookingStatus.PENDING);
        bookingRepository.save(booking);

        // Test query
        List<Booking> results = bookingRepository.findByUserId(savedUser.getId());

        assertThat(results).hasSize(1);
        assertThat(results.get(0).getUser().getId()).isEqualTo(savedUser.getId());
    }

    @Test
    void testFindByStatus() {
        // Create minimal booking without relationships for simple test
        Booking booking = new Booking();
        booking.setCheckIn(LocalDate.now().plusDays(1));
        booking.setCheckOut(LocalDate.now().plusDays(3));
        booking.setTotalAmount(200.0);
        booking.setStatus(BookingStatus.CONFIRMED);
        bookingRepository.save(booking);

        List<Booking> results = bookingRepository.findByStatus(BookingStatus.CONFIRMED);

        assertThat(results).hasSize(1);
    }
}