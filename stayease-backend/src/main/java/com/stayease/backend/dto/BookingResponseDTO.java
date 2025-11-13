package com.stayease.backend.dto;

import com.stayease.backend.model.BookingStatus;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class BookingResponseDTO {
    private Long id;
    private Long userId;
    private Long hotelId;
    private Long roomId;
    private LocalDate checkIn;
    private LocalDate checkOut;
    private Integer guests;
    private Double totalAmount;
    private BookingStatus status;
    private String guestName;
    private String guestEmail;
    private String guestPhone;
    private String specialRequests;
    private LocalDateTime createdAt;

    // Hotel details (flattened)
    private String hotelName;
    private String hotelAddress;
    private String roomType;
}