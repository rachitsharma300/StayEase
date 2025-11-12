package com.stayease.backend.controller;

import com.stayease.backend.model.Hotel;
import com.stayease.backend.service.HotelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/hotels")
public class HotelController {

    @Autowired private HotelService hotelService;

    @PostMapping("/admin")
    public ResponseEntity<?> createHotel(@RequestBody Hotel hotel) {
        return ResponseEntity.ok(hotelService.create(hotel));
    }

    @PutMapping("/admin/{id}")
    public ResponseEntity<?> updateHotel(@PathVariable Long id, @RequestBody Hotel hotel) {
        return ResponseEntity.ok(hotelService.update(id, hotel));
    }

    @DeleteMapping("/admin/{id}")
    public ResponseEntity<?> deleteHotel(@PathVariable Long id) {
        hotelService.delete(id);
        return ResponseEntity.ok(Map.of("deleted", true));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Hotel> getHotel(@PathVariable Long id) {
        return ResponseEntity.ok(hotelService.getById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Hotel>> search(@RequestParam String location) {
        return ResponseEntity.ok(hotelService.searchByLocation(location));
    }
}
