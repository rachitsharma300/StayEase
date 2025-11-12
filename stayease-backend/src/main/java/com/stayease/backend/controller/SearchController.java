package com.stayease.backend.controller;

import com.stayease.backend.model.Room;
import com.stayease.backend.service.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/search")
@CrossOrigin(origins = "http://localhost:5173")
public class SearchController {

    @Autowired private SearchService searchService;

    @GetMapping("/rooms")
    public List<Room> availableRooms(@RequestParam Long hotelId,
                                     @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
                                     @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut) {
        return searchService.findAvailableRooms(hotelId, checkIn, checkOut);
    }
}
