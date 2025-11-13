package com.stayease.backend.controller;

import com.stayease.backend.dto.HotelResponseDTO;
import com.stayease.backend.dto.RoomResponseDTO;
import com.stayease.backend.model.Hotel;
import com.stayease.backend.model.Room;
import com.stayease.backend.service.HotelService;
import com.stayease.backend.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/hotels")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class HotelController {

    @Autowired
    private HotelService hotelService;

    @Autowired
    private RoomRepository roomRepository;

    // ✅ GET all hotels (with DTO to avoid circular reference)
    @GetMapping
    public ResponseEntity<List<HotelResponseDTO>> getAllHotels() {
        System.out.println("✅ GET /api/hotels - Fetching all hotels");
        List<Hotel> hotels = hotelService.getAll();

        List<HotelResponseDTO> hotelDTOs = hotels.stream()
                .map(this::convertToHotelDTO)
                .collect(Collectors.toList());

        System.out.println("✅ Hotels converted to DTOs: " + hotelDTOs.size());
        return ResponseEntity.ok(hotelDTOs);
    }

    // ✅ GET hotel by ID
    @GetMapping("/{id}")
    public ResponseEntity<HotelResponseDTO> getHotelById(@PathVariable Long id) {
        System.out.println("✅ GET /api/hotels/" + id);
        Hotel hotel = hotelService.getById(id);
        return ResponseEntity.ok(convertToHotelDTO(hotel));
    }

    // ✅ SEARCH hotels by location
    @GetMapping("/search")
    public ResponseEntity<List<HotelResponseDTO>> searchHotels(@RequestParam(required = false) String location) {
        System.out.println("✅ GET /api/hotels/search?location=" + location);
        List<Hotel> hotels;

        if (location != null && !location.trim().isEmpty()) {
            hotels = hotelService.searchByLocation(location);
        } else {
            hotels = hotelService.getAll();
        }

        List<HotelResponseDTO> hotelDTOs = hotels.stream()
                .map(this::convertToHotelDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(hotelDTOs);
    }

    // ✅ GET rooms for a hotel
    @GetMapping("/{id}/rooms")
    public ResponseEntity<List<RoomResponseDTO>> getHotelRooms(@PathVariable Long id) {
        System.out.println("✅ GET /api/hotels/" + id + "/rooms");
        List<Room> rooms = roomRepository.findByHotelId(id);

        List<RoomResponseDTO> roomDTOs = rooms.stream()
                .map(this::convertToRoomDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(roomDTOs);
    }

    // Helper method to convert Hotel to HotelResponseDTO
    private HotelResponseDTO convertToHotelDTO(Hotel hotel) {
        if (hotel == null) return null;

        HotelResponseDTO dto = new HotelResponseDTO();
        dto.setId(hotel.getId());
        dto.setName(hotel.getName());
        dto.setAddress(hotel.getAddress());
        dto.setCity(hotel.getCity());
        dto.setState(hotel.getState());
        dto.setPincode(hotel.getPincode());
        dto.setDescription(hotel.getDescription());
        dto.setRating(hotel.getRating());
        dto.setTotalReviews(hotel.getTotalReviews());
        dto.setAmenities(hotel.getAmenities());
        dto.setImages(hotel.getImages());
        dto.setContactEmail(hotel.getContactEmail());
        dto.setContactPhone(hotel.getContactPhone());
        dto.setWebsite(hotel.getWebsite());

        // Convert rooms to DTOs
        if (hotel.getRooms() != null) {
            List<RoomResponseDTO> roomDTOs = hotel.getRooms().stream()
                    .map(this::convertToRoomDTO)
                    .collect(Collectors.toList());
            dto.setRooms(roomDTOs);
        }

        return dto;
    }

    // Helper method to convert Room to RoomResponseDTO
    private RoomResponseDTO convertToRoomDTO(Room room) {
        if (room == null) return null;

        RoomResponseDTO dto = new RoomResponseDTO();
        dto.setId(room.getId());
        dto.setRoomNumber(room.getRoomNumber());
        dto.setType(room.getType());
        dto.setPricePerNight(room.getPricePerNight());
        dto.setCapacity(room.getCapacity());
        dto.setSize(room.getSize());
        dto.setAvailable(room.getAvailable());
        dto.setFeatures(room.getFeatures());
        dto.setImages(room.getImages());
        dto.setHotelId(room.getHotel() != null ? room.getHotel().getId() : null);

        return dto;
    }

    // Other methods remain same...
    @PostMapping
    public ResponseEntity<Hotel> createHotel(@RequestBody Hotel hotel) {
        System.out.println("✅ POST /api/hotels - Creating new hotel");
        Hotel created = hotelService.create(hotel);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Hotel> updateHotel(@PathVariable Long id, @RequestBody Hotel hotel) {
        System.out.println("✅ PUT /api/hotels/" + id);
        Hotel updated = hotelService.update(id, hotel);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteHotel(@PathVariable Long id) {
        System.out.println("✅ DELETE /api/hotels/" + id);
        hotelService.delete(id);
        return ResponseEntity.ok("Hotel deleted successfully");
    }
}