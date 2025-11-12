package com.stayease.backend.controller;

import com.stayease.backend.dto.BookingRequest;
import com.stayease.backend.model.Booking;
import com.stayease.backend.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired private BookingService bookingService;

    // Create booking; user id derived from authenticated principal's username
    @PostMapping
    public ResponseEntity<?> createBooking(@AuthenticationPrincipal UserDetails userDetails,
                                           @RequestBody BookingRequest req) {
        // note: userId resolved via repository in service; we can fetch user by username if needed
        // For convenience, take username, map to id using repository:
        // But BookingService.createBooking needs userId; find user id:
        // We'll extract userId by looking up user via username (simple approach)
        // injecting UserRepository would be alternative, but to keep controller light:
        com.stayease.backend.repository.UserRepository ur = org.springframework.web.context.support.WebApplicationContextUtils
                .getRequiredWebApplicationContext(((org.springframework.web.context.request.ServletRequestAttributes) org.springframework.web.context.request.RequestContextHolder.currentRequestAttributes()).getRequest().getServletContext())
                .getBean(com.stayease.backend.repository.UserRepository.class);

        var user = ur.findByUsername(userDetails.getUsername()).orElseThrow();
        Booking booking = bookingService.createBooking(user.getId(), req);
        return ResponseEntity.ok(booking);
    }

    @GetMapping("/me")
    public ResponseEntity<?> myBookings(@AuthenticationPrincipal UserDetails userDetails) {
        com.stayease.backend.repository.UserRepository ur = org.springframework.web.context.support.WebApplicationContextUtils
                .getRequiredWebApplicationContext(((org.springframework.web.context.request.ServletRequestAttributes) org.springframework.web.context.request.RequestContextHolder.currentRequestAttributes()).getRequest().getServletContext())
                .getBean(com.stayease.backend.repository.UserRepository.class);
        var user = ur.findByUsername(userDetails.getUsername()).orElseThrow();
        List<Booking> bookings = bookingService.getBookingsByUser(user.getId());
        return ResponseEntity.ok(bookings);
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<?> cancelBooking(@AuthenticationPrincipal UserDetails userDetails, @PathVariable Long id) {
        com.stayease.backend.repository.UserRepository ur = org.springframework.web.context.support.WebApplicationContextUtils
                .getRequiredWebApplicationContext(((org.springframework.web.context.request.ServletRequestAttributes) org.springframework.web.context.request.RequestContextHolder.currentRequestAttributes()).getRequest().getServletContext())
                .getBean(com.stayease.backend.repository.UserRepository.class);
        var user = ur.findByUsername(userDetails.getUsername()).orElseThrow();
        Booking b = bookingService.cancelBooking(user.getId(), id);
        return ResponseEntity.ok(b);
    }
}
