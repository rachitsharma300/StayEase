package com.stayease.backend.repository;

import com.stayease.backend.model.Room;
import com.stayease.backend.model.Hotel;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.TestPropertySource;

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
class RoomRepositoryTest {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private HotelRepository hotelRepository;

    @Test
    void testFindByHotelId() {
        Hotel hotel = new Hotel();
        hotel.setName("Test Hotel");
        hotel.setAddress("Test Address");
        hotel.setCity("Test City");
        hotel.setState("Test State");
        hotel.setDescription("Test Description");
        hotel.setRating(4.5);
        Hotel savedHotel = hotelRepository.save(hotel);

        Room room = new Room();
        room.setRoomNumber("101");
        room.setType("Deluxe");
        room.setPricePerNight(100.0);
        room.setCapacity(2);
        room.setAvailable(true);
        room.setHotel(savedHotel);
        roomRepository.save(room);

        List<Room> rooms = roomRepository.findByHotelId(savedHotel.getId());
        assertThat(rooms).hasSize(1);
        assertThat(rooms.get(0).getRoomNumber()).isEqualTo("101");
    }
}