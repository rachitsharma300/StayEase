package com.stayease.backend.repository;

import com.stayease.backend.model.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface HotelRepository extends JpaRepository<Hotel, Long> {
    List<Hotel> findByAddressContainingIgnoreCaseOrCityContainingIgnoreCase(String address, String city);

    @Query("SELECT h FROM Hotel h WHERE LOWER(h.address) LIKE LOWER(CONCAT('%', :location, '%')) OR LOWER(h.city) LIKE LOWER(CONCAT('%', :location, '%'))")
    List<Hotel> searchByLocation(@Param("location") String location);
}