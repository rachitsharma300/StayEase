package com.stayease.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.List;

@Data
public class HotelRequest {
    @NotBlank(message = "Hotel name is required")
    private String name;

    @NotBlank(message = "Address is required")
    private String address;

    private String city;
    private String state;
    private String pincode;

    private String description;
    private Double rating;

    private List<String> amenities;
    private List<String> images;

    private String contactEmail;
    private String contactPhone;
    private String website;
}