package com.stayease.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class RoomResponseDTO {
    private Long id;
    private String roomNumber;
    private String type;
    private Double pricePerNight;
    private Integer capacity;
    private Integer size;
    private Boolean available;
    private List<String> features;
    private List<String> images;
    private Long hotelId; // Only hotel ID instead of full object
}