package com.stayease.backend.repository;

import com.stayease.backend.model.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HotelRepository extends JpaRepository<Hotel, Long> {
    List<Hotel> findByAddressContainingIgnoreCase(String location);
}
