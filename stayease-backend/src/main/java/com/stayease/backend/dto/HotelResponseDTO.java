package com.stayease.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class HotelResponseDTO {
    private Long id;
    private String name;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private String description;
    private Double rating;
    private Integer totalReviews;
    private List<String> amenities;
    private List<String> images;
    private String contactEmail;
    private String contactPhone;
    private String website;
    private List<RoomResponseDTO> rooms;
}