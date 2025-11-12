package com.stayease.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="rooms")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Room {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String roomNumber;
    private String type; // e.g., "SINGLE", "DOUBLE", "DELUXE"
    private Double pricePerNight;
    private Boolean available = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hotel_id")
    private Hotel hotel;
}
