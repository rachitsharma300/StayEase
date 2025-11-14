package com.stayease.backend.repository;

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
        "spring.jpa.hibernate.ddl-auto=create-drop",  // ✅ This creates tables
        "spring.jpa.defer-datasource-initialization=true",
        "spring.jpa.show-sql=true",
        "spring.jpa.properties.hibernate.format_sql=true"
})
class HotelRepositoryTest {

    @Autowired
    private HotelRepository hotelRepository;

    @Test
    void testSearchByLocation() {
        // Create and save hotel with minimal required fields
        Hotel hotel = new Hotel();
        hotel.setName("Test Hotel");
        hotel.setAddress("123 Test Street");
        hotel.setCity("Mumbai");
        hotel.setState("Maharashtra");
        hotel.setDescription("Test description");
        hotel.setRating(4.5);

        Hotel savedHotel = hotelRepository.save(hotel);

        List<Hotel> result = hotelRepository.searchByLocation("mumbai");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getCity()).isEqualTo("Mumbai");
    }

    @Test
    void testFindByAddressOrCity() {
        Hotel hotel = new Hotel();
        hotel.setName("Delhi Hotel");
        hotel.setAddress("Delhi Road");
        hotel.setCity("Delhi");
        hotel.setState("Delhi");
        hotel.setDescription("Hotel in Delhi");
        hotel.setRating(4.0);

        hotelRepository.save(hotel);

        List<Hotel> result = hotelRepository.findByAddressContainingIgnoreCaseOrCityContainingIgnoreCase("delhi", "delhi");

        assertThat(result).hasSize(1);
    }
}