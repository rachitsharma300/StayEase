package com.stayease.backend.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class BookingRequest {
    private Long hotelId;
    private Long roomId;
    private LocalDate checkIn;
    private LocalDate checkOut;
    private Integer guests;
    private Double totalAmount;
    private String guestName;
    private String guestEmail;
    private String guestPhone;
    private String specialRequests;
}